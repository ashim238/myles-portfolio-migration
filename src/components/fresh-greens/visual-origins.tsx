import { ExpandableImage } from "@/components/expandable-image";
import { COLOR_TOKENS } from "@/lib/fresh-greens/design-tokens";
import styles from "./visual-origins.module.css";

const colorUses: Record<string, string> = {
  freshgreen: "Start a route",
  wiltedgreen: "Onboarding background",
  navy: "Safety tools",
  orange: "Road hazards",
};

const illustrations = [
  { file: "at-the-wheel", title: "Drive like you know these roads", screen: "panel-1", alt: "Two brown hands grip a steering wheel above a green hill." },
  { file: "for-us-by-us", title: "For us, by us", screen: "panel-2", alt: "A driver sits on a hill beside a thought bubble about a street needing more light." },
  { file: "your-viewpoint", title: "Your viewpoint is unique", screen: "panel-3", alt: "A driver looks up at a crossed-out symbol in a thought bubble." },
] as const;

export function GreenBookPalette() {
  return (
    <div className={styles.palette}>
      <figure className={styles.cover}>
        <ExpandableImage src="/projects/fresh-greens/process/green-book-1940.webp"
          width={562} height={760} sizes="(max-width: 600px) 148px, 200px"
          alt="Green cover of the 1940 Negro Motorist Green-Book, with a printed list of services for travelers." />
        <figcaption>1940 edition. <a href="https://libguides.nypl.org/historicaltravels/travelguides">New York Public Library</a></figcaption>
      </figure>
      <div className={styles.paletteText}>
        <h3>From the book cover to the map</h3>
        <p>I wanted the app to feel warm and familiar when you opened it. I took the greens in the guide as a starting point. I used dark green behind the onboarding drawings and a brighter green for Go. Once you’re on the road, I kept orange for hazards and navy for the shield that opens the safety tools.</p>
        <ul className={styles.swatches} aria-label="Colors in the Fresh Greens app">
          {COLOR_TOKENS.filter((token) => token.name in colorUses).map((token) => (
            <li key={token.name}>
              <span className={styles.chip} style={{ backgroundColor: token.hex }} aria-hidden="true" />
              <span>{colorUses[token.name]}</span><code>{token.hex}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function OnboardingGallery() {
  return (
    <section className={styles.gallery} aria-labelledby="fg-onboarding-title">
      <h3 id="fg-onboarding-title" className="project-proof-target">Drawing the first three onboarding screens</h3>
      <p>I drew these in Illustrator. The first view puts you behind the wheel. On the second screen, a driver is thinking about a street that needs more light. That’s the kind of observation someone could contribute to the map.</p>
      <p className={styles.galleryHint}>Select a drawing to open its screen in the iOS prototype.</p>
      <ol className={styles.panels} aria-label="Onboarding artwork in app order">
        {illustrations.map((panel) => (
          <li key={panel.file}>
            <figure>
              <ExpandableImage src={`/projects/fresh-greens/process/onboarding/${panel.screen}-screen.webp`}
                previewSrc={`/projects/fresh-greens/process/onboarding/${panel.file}.svg`} alt={panel.alt}
                width={1290} height={2796} sizes="(max-width: 600px) 75vw, 280px" unoptimized />
              <figcaption>{panel.title}</figcaption>
            </figure>
          </li>
        ))}
      </ol>
      <div className={styles.carArt}>
        <figure>
          <div className={styles.horizon}>
            <ExpandableImage src="/projects/fresh-greens/process/onboarding/get-started-screen.webp"
              previewSrc="/projects/fresh-greens/process/onboarding/get-started-cars.png"
              width={1290} height={2796} unoptimized sizes="(max-width: 600px) 82vw, 520px"
              alt="Four cars, one green and three white, with a trail of smoke behind them." />
          </div>
          <figcaption>The cars that run across Get Started and Log In.</figcaption>
        </figure>
        <figure>
          <div className={styles.permissionCar}>
            <ExpandableImage src="/projects/fresh-greens/process/onboarding/permissions-screen.webp"
              previewSrc="/projects/fresh-greens/process/onboarding/permissions-car.svg"
              width={1290} height={2796} unoptimized alt="Small illustrated car from the location permissions screen." />
          </div>
          <figcaption>A smaller car sits beside the location pin on Permissions.</figcaption>
        </figure>
      </div>
    </section>
  );
}
