"""Build the Fresh Greens native visitor app from a prepared iOS Simulator checkout.

Run on macOS with the native project's dependencies, Pods and public Mapbox
client token installed. An empty output directory receives the .app and .zip.

Example:
    python3 scripts/fresh-greens-visitor/build.py ../fresh-greens /tmp/fg-visitor --revision 23ffdd0

On a dedicated simulator, set a sample origin before opening the app:
    xcrun simctl location <device-id> set 40.66925,-73.93105

Use a new simulator session per visitor when hosting. The native app keeps
recent searches and route preferences in device storage. No account is created.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import plistlib
import re
import shutil
import subprocess
import tempfile

HERE = Path(__file__).resolve().parent
BUNDLE_ID = "com.freshgreens.portfolio"
NATIVE_SCREENS = ("home", "search", "en-route", "fuel", "legal", "safety", "unfamiliar", "trip-summary")
DEVICE_FEATURES = ("report", "emergency", "pulled-over", "roadside", "share-location", "trusted-contact-setup")


def call(*args, **kwargs):
    subprocess.run(list(map(str, args)), check=True, **kwargs)


def public_config(repo):
    token = os.environ.get("EXPO_PUBLIC_MAPBOX_TOKEN", "")
    if not token and (repo / ".env.local").is_file():
        for line in (repo / ".env.local").read_text().splitlines():
            key, _, value = line.partition("=")
            if key.strip() == "EXPO_PUBLIC_MAPBOX_TOKEN":
                token = value.strip().strip("'").strip('"')
                break
    if not re.fullmatch(r"pk\.[A-Za-z0-9_.-]+", token):
        raise SystemExit("A public Mapbox client token is required for native place search.")
    # Do not import the app's Supabase settings, proxy endpoints or signing credentials.
    keep = ("PATH", "HOME", "TMPDIR", "USER", "LOGNAME", "LANG", "SHELL", "DEVELOPER_DIR")
    env = {key: os.environ[key] for key in keep if key in os.environ}
    env.update(EXPO_PUBLIC_MAPBOX_TOKEN=token, EXPO_NO_DOTENV="1", EXPO_NO_TELEMETRY="1",
               EXPO_OFFLINE="1", CI="1", EXPO_PUBLIC_HIDE_MODERATION_ROW="1",
               EXPO_PUBLIC_PROXY_BASE_URL="https://visitor.invalid")
    return env


def stage(repo, source, revision):
    with tempfile.TemporaryFile() as archive:
        call("git", "-C", repo, "archive", revision, stdout=archive)
        archive.seek(0)
        call("tar", "-xf", "-", "-C", source, stdin=archive)
    for name in ("package-lock.json", "app.json"):
        if (source / name).read_bytes() != (repo / name).read_bytes():
            raise SystemExit(f"Prepare native dependencies for this revision first. {name} differs.")
    if (repo / "ios/Podfile.lock").read_bytes() != (repo / "ios/Pods/Manifest.lock").read_bytes():
        raise SystemExit("Install the matching CocoaPods in the native checkout first.")
    for name in ("node_modules", "ios"):
        if not (repo / name).is_dir():
            raise SystemExit(f"Prepare {name} in the native checkout first.")
        call("ditto", repo / name, source / name)
    for dotenv in source.glob(".env*"):
        if dotenv.is_file():
            dotenv.unlink()
    # Xcode normally imports developer-local shell environment files. Use
    # only the chosen node executable in the visitor build instead.
    (source / "ios/.xcode.env").write_text('export NODE_BINARY="$(command -v node)"\n')
    (source / "ios/.xcode.env.local").unlink(missing_ok=True)
    routes = source / "app"
    routes.rename(source / "native-screens")
    routes.mkdir()
    (source / "visitor").mkdir()
    layout = (HERE / "layout.tsx.template").read_text()
    declarations = '\n              '.join(f'<Stack.Screen name="{name}" options={{{{ presentation: \'modal\' }}}} />' for name in DEVICE_FEATURES)
    (routes / "_layout.tsx").write_text(layout.replace("{/* VISITOR_LIMITED_ROUTES */}", declarations))
    shutil.copyfile(HERE / "visitor.tsx.template", source / "visitor/Visitor.tsx")
    for name in NATIVE_SCREENS:
        (routes / f"{name}.tsx").write_text(f"export {{ default }} from '../native-screens/{name}';\n")
    for name, component in (("index", "Welcome"), ("menu", "Menu"), *((name, "DeviceFeature") for name in DEVICE_FEATURES)):
        (routes / f"{name}.tsx").write_text(f"export {{ {component} as default }} from '../visitor/Visitor';\n")
    # Closing the policy sheet can return to either the consent or map screen.
    legal = source / "native-screens/legal.tsx"
    original = "onClose={() => router.replace('/home')}"
    if legal.read_text().count(original) != 1:
        raise SystemExit("Review legal-screen navigation for this native revision.")
    legal.write_text(legal.read_text().replace(original, "onClose={() => router.canGoBack() ? router.back() : router.replace('/')}"))
    config = source / "app.json"
    manifest = json.loads(config.read_text())
    manifest["expo"]["ios"]["bundleIdentifier"] = BUNDLE_ID
    manifest["expo"]["scheme"] = "freshgreensvisitor"
    config.write_text(json.dumps(manifest))
    info = source / "ios/freshgreens/Info.plist"
    settings = plistlib.loads(info.read_bytes())
    settings["CFBundleDisplayName"] = "Fresh Greens Visitor"
    settings["CFBundleURLTypes"] = [{"CFBundleURLSchemes": ["freshgreensvisitor"]}]
    info.write_bytes(plistlib.dumps(settings))
    # Change only the app target's identifier. Overriding the build setting
    # globally would also give every bundled framework the same identifier.
    pbx = source / "ios/freshgreens.xcodeproj/project.pbxproj"
    old_setting = "PRODUCT_BUNDLE_IDENTIFIER = com.freshgreens.navigation;"
    if old_setting not in pbx.read_text():
        raise SystemExit("Review the native target identifier for this revision.")
    pbx.write_text(pbx.read_text().replace(old_setting, f"PRODUCT_BUNDLE_IDENTIFIER = {BUNDLE_ID};"))


def verify_and_package(app, output, token):
    info = plistlib.loads((app / "Info.plist").read_bytes())
    bundle = (app / "main.jsbundle").read_bytes()
    if info["CFBundleIdentifier"] != BUNDLE_ID or info["CFBundleSupportedPlatforms"] != ["iPhoneSimulator"]:
        raise SystemExit("Unexpected native application identity or platform.")
    if not all(marker in bundle for marker in (token.encode(), b"Use simulator location and open map", b"The simulator could not open location services.")):
        raise SystemExit("The native visitor consent screen or search configuration is missing.")
    forbidden = re.compile(rb"https?://[a-z0-9-]+\.supabase\.co\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bsk\.[A-Za-z0-9_-]{20,}")
    for path in app.rglob("*"):
        if path.name.startswith(".env") or path.suffix in {".p8", ".p12", ".mobileprovision"} or path.name.endswith(".debug.dylib"):
            raise SystemExit("Unexpected private or development file in the release.")
        if path.is_file() and forbidden.search(path.read_bytes()):
            raise SystemExit("Unexpected service endpoint or private material in the release.")
    packaged = output / "FreshGreensVisitor.app"
    call("ditto", app, packaged)
    zipped = output / "FreshGreensVisitor.zip"
    call("ditto", "-c", "-k", "--norsrc", "--keepParent", packaged, zipped)
    call("unzip", "-tq", zipped, stdout=subprocess.DEVNULL)
    print(f"{zipped}\nSHA-256 {hashlib.sha256(zipped.read_bytes()).hexdigest()}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("native_checkout", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--revision", default="HEAD")
    args = parser.parse_args()
    repo, output = args.native_checkout.resolve(), args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    if any(output.iterdir()):
        raise SystemExit("Choose an empty output directory.")
    env = public_config(repo)
    revision = subprocess.check_output(["git", "-C", repo, "rev-parse", "--verify", f"{args.revision}^{{commit}}"], text=True).strip()
    print(f"Building native visitor from {revision}", flush=True)
    with tempfile.TemporaryDirectory(prefix="fresh-greens-visitor-") as scratch:
        work = Path(scratch)
        source = work / "source"
        source.mkdir()
        stage(repo, source, revision)
        # Xcode prints expanded settings, including its public token. Keep
        # the transient build log private and show only compiler errors.
        with tempfile.TemporaryFile(mode="w+") as log:
            result = subprocess.run([
                "xcodebuild", "-workspace", "ios/freshgreens.xcworkspace", "-scheme", "freshgreens",
                "-configuration", "Release", "-sdk", "iphonesimulator", "-destination", "generic/platform=iOS Simulator",
                "-derivedDataPath", str(work / "derived"), "-jobs", "5", "ARCHS=arm64",
                "ONLY_ACTIVE_ARCH=YES", "CODE_SIGNING_ALLOWED=NO", "COMPILER_INDEX_STORE_ENABLE=NO", "build",
            ], cwd=source, env=env, stdout=log, stderr=subprocess.STDOUT)
            if result.returncode:
                log.seek(0)
                for line in log:
                    if "error:" in line.lower():
                        print(line.replace(env["EXPO_PUBLIC_MAPBOX_TOKEN"], "[redacted]").rstrip()[:700])
                raise SystemExit("The visitor build failed.")
        verify_and_package(work / "derived/Build/Products/Release-iphonesimulator/freshgreens.app", output, env["EXPO_PUBLIC_MAPBOX_TOKEN"])


if __name__ == "__main__":
    main()
