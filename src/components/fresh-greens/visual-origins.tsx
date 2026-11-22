import { ExpandableImage } from "@/components/expandable-image";
import { CommandIcon } from "@/components/myles-97/command-icon";
import { COLOR_TOKENS } from "@/lib/fresh-greens/design-tokens";
import styles from "./visual-origins.module.css";

const colorUses: Record<string, string> = {
  freshgreen: "Start a route",
  wiltedgreen: "Onboarding background",
  navy: "Safety tools",
  orange: "Road hazards",
};

type Drawing = {
  file: string;
  screen: string;
  width: number;
  height: number;
  title: string;
  alt: string;
  expandedAlt: string;
};

const illustrations: Drawing[] = [
  {
    file: "at-the-wheel.svg", screen: "panel-1", width: 390, height: 475,
    title: "Drive like you know these roads",
    alt: "Two brown hands grip a steering wheel above a green hill.",
    expandedAlt: "Drive like you know these roads. The first onboarding screen places Continue over the steering wheel.",
  },
  {
    file: "for-us-by-us.svg", screen: "panel-2", width: 390, height: 565,
    title: "For us, by us",
    alt: "A driver sits on a hill beside a thought bubble about a street needing more light.",
    expandedAlt: "For us, by us. A seated driver says the street needs more lighting.",
  },
  {
    file: "your-viewpoint.svg", screen: "panel-3", width: 390, height: 475,
    title: "Your viewpoint is unique",
    alt: "A driver looks up at a crossed-out symbol in a thought bubble.",
    expandedAlt: "Your viewpoint is unique. The third onboarding screen introduces personal preferences for a drive.",
  },
];

const carStrip: Drawing = {
  file: "get-started-cars.png", screen: "get-started", width: 1446, height: 372,
  title: "The cars that run across Get Started and Log In.",
  alt: "Four cars, one green and three white, with a trail of smoke behind them.",
  expandedAlt: "Get Started. Cars cross the horizon above Continue with Apple and Log In.",
};

const locationCar: Drawing = {
  file: "permissions-car.svg", screen: "permissions", width: 116, height: 81,
  title: "The location pin marks the car on Permissions.",
  alt: "A blue location pin above a small green car.",
  expandedAlt: "Permissions. The location pin and car sit above the explanation of location and microphone access.",
};

function DrawingFigure({ drawing, frame }: { drawing: Drawing; frame: string }) {
  const directory = "/projects/fresh-greens/process/onboarding";
  return (
    <figure>
      <div className={`${styles.plate} ${frame}`}>
        <ExpandableImage
          src={`${directory}/${drawing.screen}-screen.webp`}
          previewSrc={`${directory}/${drawing.file}`}
          previewSize={{ width: drawing.width, height: drawing.height }}
          width={1290}
          height={2796}
          alt={drawing.alt}
          expandedAlt={drawing.expandedAlt}
          unoptimized
        />
        <span className={styles.openIcon}><CommandIcon name="enlarge" /></span>
      </div>
      <figcaption>{drawing.title}</figcaption>
    </figure>
  );
}

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
      <p className={styles.galleryHint}>Select a drawing to see its full iOS screen.</p>
      <ol className={styles.panels} aria-label="Onboarding artwork in app order">
        {illustrations.map((drawing) => (
          <li key={drawing.file}>
            <DrawingFigure drawing={drawing} frame={styles.panel} />
          </li>
        ))}
      </ol>
      <div className={styles.carArt}>
        <DrawingFigure drawing={carStrip} frame={styles.horizon} />
        <DrawingFigure drawing={locationCar} frame={styles.permissionCar} />
      </div>
    </section>
  );
}
