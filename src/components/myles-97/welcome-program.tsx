import { WelcomePortrait } from "./welcome-portrait";

export type WelcomeProgramProps = {
  onSelectedWork: () => void;
  showsJulius?: boolean;
};

export function WelcomeProgram({ onSelectedWork, showsJulius }: WelcomeProgramProps) {
  return (
    <div className="myles97-welcome">
      <div className="myles97-welcome-mark" aria-hidden="true">
        <WelcomePortrait />
      </div>
      <div className="myles97-welcome-copy">
        <p className="myles97-eyebrow">Product designer</p>
        <h1>Myles Ashitey</h1>
        <p className="myles97-welcome-statement">
          Design, code, and everything in between.
        </p>
        <p className="myles97-welcome-context">
          {showsJulius ? "Previously TikTok and UMG. Recent work at Julius." : "Previously TikTok and UMG. Latest project: Fresh Greens."}
        </p>
        <button type="button" className="myles97-primary-button" onClick={onSelectedWork}>
          Browse projects
        </button>
      </div>
    </div>
  );
}
