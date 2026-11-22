import Image from "next/image";
import styles from "./newsletter-audit-excerpts.module.css";

type Clip = {
  file: string;
  source: string;
  caption: string;
  ring: [number, number, number, number];
};

const comparisons: { title: string; clips: [Clip, Clip] }[] = [
  {
    title: "Introduce the story",
    clips: [
      { file: "academe-topic", source: "Academe Today", caption: "“Political Pressure” gives the headline a subject before you read it.", ring: [140, 111, 126, 24] },
      { file: "weekly-topic", source: "UnderstandingFAFSA weekly", caption: "“Smart Choices” introduces the college graduation story the same way.", ring: [177, 100, 150, 33] },
    ],
  },
  {
    title: "Mark the next section",
    clips: [
      { file: "hubspot-resource", source: "HubSpot Marketing Blog", caption: "A new color and the centered “Free Resource” label signal the start of a different block.", ring: [505, 237, 130, 30] },
      { file: "weekly-break", source: "UnderstandingFAFSA weekly", caption: "A dotted rule ends one story before “College Dollars” begins.", ring: [493, 222, 475, 32] },
    ],
  },
];

export function NewsletterAuditExcerpts() {
  return (
    <section className={styles.proofs} aria-label="Newsletter audit excerpts">
      {comparisons.map(({ title, clips }) => (
        <div key={title} className={styles.pair}>
          <h4>{title}</h4>
          <div className={styles.row}>
            {clips.map(({ file, source, caption, ring: [cx, cy, rx, ry] }) => (
              <figure key={file}>
                <div className={styles.clip}>
                  <Image src={`/projects/understandingfafsa/audit/${file}.webp`} alt="" width={1080} height={432} unoptimized />
                  <svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
                    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(-1 ${cx} ${cy})`} />
                  </svg>
                </div>
                <figcaption><strong>{source}</strong>{caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
