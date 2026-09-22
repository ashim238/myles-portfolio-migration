export type AlbumTrack = {
  id: string;
  title: string;
  durationMs: number;
};

export type NowPlayingTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId: string;
  imageUrl: string;
  spotifyUrl: string;
  embedUrl: string;
  albumTracks: readonly AlbumTrack[];
};

function spotifyTrackUrl(id: string) {
  return `https://open.spotify.com/track/${id}`;
}

function spotifyEmbedUrl(id: string) {
  return `https://open.spotify.com/embed/track/${id}`;
}

const cryingLaughingLovingLying = [
  ["3g80sy3EGHhaGQsllsYZ78", "Saved", 130_533],
  ["0u866oovya9R6wbJEQokB3", "Cannock Chase", 246_866],
  ["0uejzA0hc5qDzxVVVl7ozG", "Fool Me a Goodnight", 224_706],
  ["6fCBJMXN9vzOiw9ne3g0rr", "It Must Be Love", 236_986],
  ["6i1Of5qHGpZ7k82OGbhItZ", "Gimme Some More", 174_960],
  ["1j6roTXy2iBF8oDOB9LOg3", "Blue Lady", 305_626],
  ["6z77DWWqu83jQywZudhHEn", "Love Oh Love Oh Love", 267_106],
  ["5d6TVUxugL4cnJwnP9RifT", "Crying Laughing Loving Lying", 183_200],
  ["1sPU7jWmaX1Ru1VzZzJ5Mo", "Hotel Room Song", 174_400],
  ["0fE4UisdBxPIApgA7VAo2e", "My Song", 284_480],
  ["1FXGidxdSfnBk3Dgbmhvmo", "Till Forever", 75_346],
  ["3vxlyRDphRgUQW76pAEUTo", "Come On Michael", 177_546],
  ["4jLS0PDha9fcvatWgYeXO3", "You Make It Easy", 251_840],
  ["6cZhHsd2UrFpmX5S29o8Y7", "Good Old Days", 192_386],
  ["69393tktpmgVUSzvMDVjWI", "Pristine Verses", 183_066],
  ["5jPFyKJMWskriuZJlAo8zK", "You'll Let Me Know", 230_146],
  ["2YUP575C0dDOFkyJr8aEtC", "Oh Me Oh My Mr City Goodbye", 231_640],
  ["1VaQnUarW2rmO0qu8i4vgM", "For the Lovin'", 270_186],
] as const;

const ravage = [
  ["6m2mV5CVBAfP1zO2R5kiOy", "Trouble Maker", 155_500],
  ["0RPXUuLjVHolWYkaXCndXD", "DND", 166_000],
  ["6AaS5Qr4faAsS2fGzvRIO9", "Smooth Criminal", 195_500],
  ["3e7FAWKNVUGQJvyUQMZ5EB", "Don't Leave", 185_500],
  ["6THzboswz9kc4gfkmTTePN", "Red Potion", 174_033],
] as const;

const obviously = [
  ["5lE2EFXt4muvLFMGQg4hZN", "Hypotheticals", 230_178],
  ["2sA5szzJViCyKsqeXZFuzz", "Hush Money", 168_353],
  ["0juDkd1zAXxKwrUdnF1WPb", "Same Old News", 276_623],
  ["3LQASjzUVNkquf6sCxax7i", "Being a Woman", 169_856],
  ["1ID7FIrnDFtAoRebVRBhlO", "Making Do", 214_150],
  ["0j1ldNL5THYosPxuhYZ5NY", "Nobody's Stopping You Now", 227_812],
  ["4XHYJpbZL8ytyoZ5olW4nP", "Know That I Know", 242_809],
  ["5YrsZNKb28ejX20pYmZgQ3", "Lackluster Lover", 209_662],
  ["11uDkfcnZnSINxQfdLyYfm", "Anymore", 250_934],
  ["5b6TkuGbeaimxaJB9Vu2BD", "Feels Like the Last Time", 199_303],
  ["78ntnDHyR77wxv1DJycua4", "Sarah", 158_073],
  ["1x05ZRPr2FprwUP7MjWefh", "Hypotheticals - Edit", 190_647],
] as const;

const troupeauBleu = [
  ["6lzDycd60SJ7H8y6wuESGl", "La rue", 267_320],
  ["5Rt5pomA6CvKTuCllwRY74", "Automne - Colchiques", 159_746],
  ["5uM2TbV57PabdmqUTJa1pG", "L'enfant samba", 186_800],
  ["2DTHWr5NK1igQZxctpYTA9", "Troupeau bleu", 303_773],
  ["7qnSmz4abtOXKuYhaRYuPv", "Prélude à Go Round", 240_360],
  ["3CKsKWOasAzsjlhdWk9DGs", "Go Round", 83_426],
  ["49ECKlsOXqyNXydiNCS2Md", "Chanson d'un jour d'hiver", 323_946],
  ["0ztpWjYYFWQaw5DnPDIYkl", "Mary et Jeff", 165_653],
  ["2CsnpBAB8VQMTyPuws57ao", "Huit octobre 1971", 266_040],
  ["6RZYzVk2IG0PhhF3PMbLSQ", "Sabbat, pt. 1", 61_546],
  ["629ribrku1CI6lYRTXs9NF", "Sabbat, pt. 2", 200_653],
  ["0CycZ8pvvdqSyBxJLapOOI", "Sabbat, pt. 3", 31_280],
  ["5rFXbyxDXQ8m5Dh1VuNiGq", "Madbass", 173_013],
] as const;

function albumTracks(
  tracks: readonly (readonly [id: string, title: string, durationMs: number])[],
): readonly AlbumTrack[] {
  return tracks.map(([id, title, durationMs]) => ({ id, title, durationMs }));
}

function rotationTrack(
  track: Omit<NowPlayingTrack, "spotifyUrl" | "embedUrl">,
): NowPlayingTrack {
  return {
    ...track,
    spotifyUrl: spotifyTrackUrl(track.id),
    embedUrl: spotifyEmbedUrl(track.id),
  };
}

export const CURRENT_ROTATION = [
  rotationTrack({
    id: "0u866oovya9R6wbJEQokB3",
    title: "Cannock Chase",
    artist: "Labi Siffre",
    album: "Crying, Laughing, Loving, Lying",
    albumId: "1rCeglxnRN7dpcIRPnamGH",
    imageUrl:
      "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e027f540528ec2efdf46ef697ec",
    albumTracks: albumTracks(cryingLaughingLovingLying),
  }),
  rotationTrack({
    id: "6THzboswz9kc4gfkmTTePN",
    title: "Red Potion",
    artist: "Rema",
    album: "RAVAGE",
    albumId: "4FNo7grg0Z6cbOwgzNwyD9",
    imageUrl:
      "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0242ddfda3c299599d0e24ed58",
    albumTracks: albumTracks(ravage),
  }),
  rotationTrack({
    id: "5lE2EFXt4muvLFMGQg4hZN",
    title: "Hypotheticals",
    artist: "Lake Street Dive",
    album: "Obviously",
    albumId: "2Zi7uv234eNZJfLPGUIkSD",
    imageUrl:
      "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020c044e52637b2a8362e20659",
    albumTracks: albumTracks(obviously),
  }),
  rotationTrack({
    id: "2DTHWr5NK1igQZxctpYTA9",
    title: "Troupeau bleu",
    artist: "Cortex",
    album: "Troupeau bleu",
    albumId: "74DOWHisu2jlFvPid9YTGB",
    imageUrl:
      "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0247a51205061053303846cb79",
    albumTracks: albumTracks(troupeauBleu),
  }),
] as const satisfies readonly NowPlayingTrack[];

export const DEFAULT_ROTATION_TRACK_ID = CURRENT_ROTATION[0].id;

export function formatRotationMonth(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}
