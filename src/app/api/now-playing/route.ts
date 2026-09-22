import { getCurrentlyPlaying } from "@/lib/now-playing/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  const liveTrack = await getCurrentlyPlaying();

  return Response.json(
    { liveTrack },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
