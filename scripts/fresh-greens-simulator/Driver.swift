import XCTest
import UIKit

/// Scoped to the app installed on a dedicated local review device.
final class DriverUITests: XCTestCase {
    struct Request: Decodable {
        let id: UUID
        let operation: String
        let points: [CGFloat]?
        let text: String?
    }

    #if PORTFOLIO_VISITOR
    private let app = XCUIApplication(bundleIdentifier: "com.freshgreens.portfolio")
    #else
    private let app = XCUIApplication(bundleIdentifier: "com.freshgreens.navigation")
    #endif

    private func point(_ values: [CGFloat]) -> XCUICoordinate? {
        guard values.count == 2, (0...1).contains(values[0]),
              (0.052...0.975).contains(values[1]) else { return nil }
        return app.coordinate(withNormalizedOffset: CGVector(dx: values[0], dy: values[1]))
    }

    private func respond(_ request: Request) throws -> Data? {
        guard app.state == .runningForeground else { return nil }
        let coords = request.points ?? []
        switch request.operation {
        case "frame":
            let screen = app.screenshot().image
            let size = CGSize(width: 645, height: 645 * screen.size.height / screen.size.width)
            let format = UIGraphicsImageRendererFormat()
            format.scale = 1
            format.opaque = true
            let preview = UIGraphicsImageRenderer(size: size, format: format).image { _ in
                screen.draw(in: CGRect(origin: .zero, size: size))
            }
            return preview.jpegData(compressionQuality: 0.77)
        case "tap":
            guard let start = point(coords) else { return nil }
            start.tap()
        case "drag":
            guard coords.count == 4, let start = point(Array(coords.prefix(2))),
                  let end = point(Array(coords.suffix(2))) else { return nil }
            start.press(forDuration: 0.08, thenDragTo: end)
        case "text", "backspace", "return":
            guard app.keyboards.firstMatch.exists else { return nil }
            if request.operation == "backspace" { app.typeText(XCUIKeyboardKey.delete.rawValue) }
            else if request.operation == "return" { app.typeText("\n") }
            else if let text = request.text, text.count <= 120,
                    text.rangeOfCharacter(from: .controlCharacters) == nil { app.typeText(text) }
            else { return nil }
        default: return nil
        }
        return Data("ok".utf8)
    }

    func testPreview() throws {
        continueAfterFailure = true
        app.activate()
        let files = FileManager.default
        let cache = try XCTUnwrap(files.urls(for: .cachesDirectory, in: .userDomainMask).first)
        let inbox = cache.appendingPathComponent("FreshGreensPreview", isDirectory: true)
        try files.createDirectory(at: inbox, withIntermediateDirectories: true)
        let command = inbox.appendingPathComponent("request.json")
        try? files.removeItem(at: command)
        try Data().write(to: inbox.appendingPathComponent("ready"), options: .atomic)
        while true {
            guard let data = try? Data(contentsOf: command) else {
                Thread.sleep(forTimeInterval: 0.025)
                continue
            }
            try files.removeItem(at: command)
            guard let request = try? JSONDecoder().decode(Request.self, from: data) else { continue }
            let result = try respond(request) ?? Data()
            try result.write(to: inbox.appendingPathComponent(request.id.uuidString), options: .atomic)
        }
    }
}
