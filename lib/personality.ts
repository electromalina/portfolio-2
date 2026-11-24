/**
 * Where a sticker sits on the board. All values are percentages of the board:
 * x / y = the sticker's centre, w = its width (height follows the logo's aspect).
 */
export type StickerSpot = {
  x: number;
  y: number;
  w: number;
  /** rotation in degrees */
  r: number;
};

export type Brand = {
  id: string;
  name: string;
  blurb: string;
  src: string;
  /** logo width / height, from the SVG viewBox */
  aspect: number;
  /** hand-placed spot on the wide board (11:5, tablets and up) */
  desktop: StickerSpot;
  /** hand-placed spot on the portrait board (7:10, phones) */
  mobile: StickerSpot;
};

export const BRANDS: readonly Brand[] = [
  {
    id: "valve",
    name: "Valve",
    blurb: "Half-Life, Portal, Counter-Strike: games that showed me what great design and immersive experiences feel like.",
    src: "/valve.svg",
    aspect: 3.66,
    desktop: { x: 18, y: 20, w: 21, r: -6 },
    mobile: { x: 40, y: 10, w: 46, r: -6 },
  },
  {
    id: "vivaldi",
    name: "Vivaldi",
    blurb: "Browser that lets me have 47 tabs open without judgment.",
    src: "/vivaldi.svg",
    aspect: 1,
    desktop: { x: 40, y: 19, w: 9, r: 8 },
    mobile: { x: 81, y: 12, w: 20, r: 8 },
  },
  {
    id: "levis",
    name: "Levi's",
    blurb: "A pair of jeans that will outlive every trend.",
    src: "/levis.svg",
    aspect: 2.44,
    desktop: { x: 62, y: 20, w: 15, r: -4 },
    mobile: { x: 64, y: 30, w: 34, r: -4 },
  },
  {
    id: "logitech",
    name: "Logitech",
    blurb: "Plug it in, forget about it. Still works five years later.",
    src: "/logitech.svg",
    aspect: 1,
    desktop: { x: 84, y: 22, w: 8.5, r: 10 },
    mobile: { x: 20, y: 29, w: 18, r: 10 },
  },
  {
    id: "asics",
    name: "ASICS",
    blurb: "One of the most comfortable pairs of shoes I've ever had. Still sticking with them after all these years.",
    src: "/asics.svg",
    aspect: 3.08,
    desktop: { x: 22, y: 52, w: 19, r: 5 },
    mobile: { x: 31, y: 47, w: 38, r: 5 },
  },
  {
    id: "og",
    name: "Optimus Gang",
    blurb: "Local streetwear from Ukraine: pieces that always feel unique in my wardrobe.",
    src: "/og.svg",
    aspect: 2.1,
    desktop: { x: 74, y: 50, w: 12, r: -8 },
    mobile: { x: 77, y: 48, w: 28, r: -8 },
  },
  {
    id: "notion",
    name: "Notion",
    blurb: "A digital box for my thoughts, which later become something useful.",
    src: "/notion.svg",
    aspect: 0.96,
    desktop: { x: 91, y: 55, w: 8, r: 6 },
    mobile: { x: 21, y: 66, w: 18, r: 6 },
  },
  {
    id: "figma",
    name: "Figma",
    blurb: "Where my ideas take shape before they become code.",
    src: "/figma.svg",
    aspect: 0.67,
    desktop: { x: 58, y: 78, w: 6, r: -7 },
    mobile: { x: 50, y: 69, w: 13, r: -7 },
  },
  {
    id: "cursor",
    name: "Cursor",
    blurb: "This website, and 10+ other projects, were built in Cursor.",
    src: "/cursor.svg",
    aspect: 0.875,
    desktop: { x: 9, y: 79, w: 7.5, r: -9 },
    mobile: { x: 79, y: 67, w: 16, r: -9 },
  },
  {
    id: "spotify",
    name: "Spotify",
    blurb: "Home of the ten records above, and the soundtrack to every moment of my life.",
    src: "/spotify.svg",
    aspect: 1,
    desktop: { x: 33, y: 80, w: 9, r: 7 },
    mobile: { x: 27, y: 86, w: 19, r: 7 },
  },
  {
    id: "spalding",
    name: "Spalding",
    blurb: "The first ball I ever shot hoops with. After that, the brand stuck with the rest of my sports gear.",
    src: "/spalding.svg",
    aspect: 2.48,
    desktop: { x: 77, y: 82, w: 16, r: -3 },
    mobile: { x: 67, y: 87, w: 34, r: -3 },
  },
];

/** Copy for the section header. */
export const BRANDS_SECTION = {
  eyebrow: "sticker board",
  title: "my favorite brands",
  intro:
    "The brands I keep coming back to and can't stop recommending, all stuck on one board. Peel them off, move them around, make it yours.",
  hint: "Peel a sticker to read its backstory.",
} as const;
