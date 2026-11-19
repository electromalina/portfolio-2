export type Brand = {
  id: string;
  name: string;
  blurb: string;
  src: string;
};

export const BRANDS: readonly Brand[] = [
  { id: "valve", name: "Valve", blurb: "Steam is just home for me.", src: "/valve.svg" },
  { id: "vivaldi", name: "Vivaldi", blurb: "Browser that lets me have 47 tabs open without judgment.", src: "/vivaldi.svg" },
  { id: "levis", name: "Levi's", blurb: "A pair of jeans that will outlive every trend. Always.", src: "/levis.svg" },
  { id: "logitech", name: "Logitech", blurb: "Plug it in, forget about it. Still works five years later.", src: "/logitech.svg" },
  { id: "asics", name: "ASICS", blurb: "Shoes my feet and outfit both agree on.", src: "/asics.svg" },
  { id: "og", name: "Optimus Gang", blurb: "Local, raw, homemade, no hype.", src: "/og.svg" },
  { id: "notion", name: "Notion", blurb: "Where all my thoughts go to become something useful.", src: "/notion.svg" },
  { id: "figma", name: "Figma", blurb: "Design with my team, in real time, no excuses.", src: "/figma.svg" },
  { id: "cursor", name: "Cursor", blurb: "This (and at least 10+ others) website were built in cursor.", src: "/cursor.svg" },
  { id: "spotify", name: "Spotify", blurb: "Every mood, every moment.", src: "/spotify.svg" },
  { id: "spalding", name: "Spalding", blurb: "If you've ever touched a basketball, you've touched a Spalding.", src: "/spalding.svg" },
];
