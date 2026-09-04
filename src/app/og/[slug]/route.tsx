import { ImageResponse } from "next/og";

const socialCards = {
  home: {
    kicker: "MYLES 98",
    title: "Myles Ashitey",
    detail: "Product designer who works in code",
    accent: "#000080",
    panel: "#c0c0c0",
  },
  "fresh-greens": {
    kicker: "CASE STUDY 01",
    title: "Fresh Greens",
    detail: "Route planning for Black drivers",
    accent: "#075b2b",
    panel: "#d8f3b7",
  },
  understandingfafsa: {
    kicker: "CASE STUDY 02",
    title: "UnderstandingFAFSA",
    detail: "A modular email system a small team could run",
    accent: "#004aad",
    panel: "#ccecff",
  },
  navi: {
    kicker: "CASE STUDY 03",
    title: "Navi",
    detail: "Neighborhood travel beyond the usual list",
    accent: "#9f3f0d",
    panel: "#ffe0bd",
  },
  tiktok: {
    kicker: "CASE STUDY 04",
    title: "TikTok Dynamic Showcase Ads",
    detail: "Catalog templates built for motion at scale",
    accent: "#111111",
    panel: "#ffb9dd",
  },
} as const;

type SocialCardSlug = keyof typeof socialCards;

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const card = socialCards[slug as SocialCardSlug] ?? socialCards.home;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 54,
          background: "#008080",
          color: "#111",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            border: "6px solid #111",
            background: card.panel,
            boxShadow: "18px 18px 0 rgba(0,0,0,.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              height: 70,
              alignItems: "center",
              padding: "0 22px",
              background: card.accent,
              color: "white",
              fontSize: 25,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {card.kicker}
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              padding: "48px 62px",
            }}
          >
            <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.02 }}>
              {card.title}
            </div>
            <div style={{ marginTop: 28, fontSize: 32, lineHeight: 1.25 }}>
              {card.detail}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "14px 22px",
              borderTop: "3px solid #777",
              background: "#c0c0c0",
              fontSize: 21,
            }}
          >
            <span>mylesdesignsthings.com</span>
            <span>Work Stuff</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
