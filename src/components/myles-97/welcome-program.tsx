import Image from "next/image";

export type WelcomeProgramProps = {
  onSelectedWork: () => void;
};

export function WelcomeProgram({ onSelectedWork }: WelcomeProgramProps) {
  return (
    <div className="myles97-welcome">
      <div className="myles97-welcome-mark" aria-hidden="true">
        <Image src="/logomark.svg" alt="" width={72} height={72} priority />
      </div>
      <div className="myles97-welcome-copy">
        <p className="myles97-eyebrow">Welcome to Myles 98</p>
        <h1>Myles Ashitey</h1>
        <p className="myles97-welcome-statement">Design, code, whatever you need.</p>
        <p className="myles97-welcome-context">
          Previously TikTok and UMG. Latest project: Fresh Greens.
        </p>
        <button type="button" className="myles97-primary-button" onClick={onSelectedWork}>
          Selected Work
        </button>
      </div>
    </div>
  );
}
