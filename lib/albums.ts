import type { StaticImageData } from "next/image";

// Static imports (not "/albums/x.jpg" strings): next/image then knows each
// cover's real size at build time, so there's no layout shift and it can
// generate a tiny blurred placeholder automatically.
import daftPunkCover from "@/public/albums/daftpank.jpg";
import fleshwaterCover from "@/public/albums/fleshwater.jpg";
import istochnikCover from "@/public/albums/istochnik.jpg";
import kinoCover from "@/public/albums/kino.jpg";
import limpBizkitCover from "@/public/albums/limpbizkit.jpg";
import metallicaCover from "@/public/albums/metallica.jpg";
import nurnbergCover from "@/public/albums/nurnberg.jpg";
import offspringCover from "@/public/albums/offspring.jpg";
import prodigyCover from "@/public/albums/prodigy.jpg";
import titleFightCover from "@/public/albums/titlefight.jpg";

export type Track = {
  title: string;
  /** English translation for non-English titles */
  translation?: string;
};

export type Album = {
  id: string;
  artist: string;
  /** artist name in its original script, if different */
  artistOriginal?: string;
  title: string;
  /** album title in its original script, if different */
  titleOriginal?: string;
  year: number;
  cover: StaticImageData;
  spotifyUrl: string;
  whyItStuck: string;
  tracks: readonly Track[];
};

/** Album link from its Spotify ID (Spotify → album → Share → Copy album link). */
const spotifyAlbum = (id: string) => `https://open.spotify.com/album/${id}`;

/** In the order they came into my life. The showcase counts them itself ("03 / 10"). */
export const ALBUMS: readonly Album[] = [
  {
    id: "fat-of-the-land",
    artist: "The Prodigy",
    title: "The Fat of the Land",
    year: 1997,
    cover: prodigyCover,
    spotifyUrl: spotifyAlbum("2qivROlvQ8BcUKTaCA7dL2"),
    whyItStuck:
      "The first album I ever heard, on my uncle’s cassette player. I’ve played it countless times since, and it’s still stuck in my head.",
    tracks: [
      { title: "Smack My Bitch Up" },
      { title: "Breathe" },
      { title: "Diesel Power" },
      { title: "Funky Shit" },
      { title: "Serial Thrilla" },
      { title: "Mindfields" },
      { title: "Narayan" },
      { title: "Firestarter" },
      { title: "Climbatize" },
      { title: "Fuel My Fire" },
    ],
  },
  {
    id: "gruppa-krovi",
    artist: "Kino",
    artistOriginal: "Кино",
    title: "Blood Type",
    titleOriginal: "Группа крови",
    year: 1988,
    cover: kinoCover,
    spotifyUrl: spotifyAlbum("6qwYHkXhHRgh2EKngXJJOk"),
    whyItStuck:
      "My father’s influence from the Soviet era: songs that told the truth through hard times and took on topics that still take my breath away.",
    tracks: [
      { title: "Группа крови", translation: "Blood Type" },
      { title: "Закрой за мной дверь, я ухожу", translation: "Close the Door Behind Me, I'm Leaving" },
      { title: "Война", translation: "War" },
      { title: "Спокойная ночь", translation: "Calm Night" },
      { title: "Мама, мы все тяжело больны", translation: "Mom, We're All Seriously Ill" },
      { title: "Бошетунмай", translation: "Boshetunmai" },
      { title: "Попробуй спеть вместе со мной", translation: "Try to Sing Along With Me" },
      { title: "Легенда", translation: "Legend" },
      { title: "Прохожий", translation: "Passer-by" },
      { title: "Песня без слов", translation: "Song Without Words" },
      { title: "Следи за собой", translation: "Watch Yourself" },
    ],
  },
  {
    id: "kill-em-all",
    artist: "Metallica",
    title: "Kill 'Em All",
    year: 1983,
    cover: metallicaCover,
    spotifyUrl: spotifyAlbum("7hKjNN2595RdaLSR2PB7sA"),
    whyItStuck:
      "Raw, fast energy that keeps me going on early mornings.",
    tracks: [
      { title: "Hit the Lights" },
      { title: "The Four Horsemen" },
      { title: "Motorbreath" },
      { title: "Jump in the Fire" },
      { title: "(Anesthesia) – Pulling Teeth" },
      { title: "Whiplash" },
      { title: "Phantom Lord" },
      { title: "No Remorse" },
      { title: "Seek & Destroy" },
      { title: "Metal Militia" },
    ],
  },
  {
    id: "smash",
    artist: "The Offspring",
    title: "Smash",
    year: 1994,
    cover: offspringCover,
    spotifyUrl: spotifyAlbum("7IDywTRaCI8qzS3X8tNU3x"),
    whyItStuck:
      "Youthful idealism about things that matter, with a loud, rebellious kick.",
    tracks: [
      { title: "Time to Relax" },
      { title: "Nitro (Youth Energy)" },
      { title: "Bad Habit" },
      { title: "Gotta Get Away" },
      { title: "Genocide" },
      { title: "Something to Believe In" },
      { title: "Come Out and Play" },
      { title: "Self Esteem" },
      { title: "It'll Be a Long Time" },
      { title: "Killboy Powerhead" },
      { title: "What Happened to You?" },
      { title: "So Alone" },
      { title: "Not the One" },
      { title: "Smash" },
    ],
  },
  {
    id: "chocolate-starfish",
    artist: "Limp Bizkit",
    title: "Chocolate Starfish and the Hot Dog Flavored Water",
    year: 2000,
    cover: limpBizkitCover,
    spotifyUrl: spotifyAlbum("5mi7FKaWE5CtcOjdyxScA7"),
    whyItStuck:
      "Critics loved to hate it and the title is absurd, but it was pure release: loud, messy and impossible not to move to.",
    tracks: [
      { title: "Intro" },
      { title: "Hot Dog" },
      { title: "My Generation" },
      { title: "Full Nelson" },
      { title: "My Way" },
      { title: "Rollin' (Air Raid Vehicle)" },
      { title: "Livin' It Up" },
      { title: "The One" },
      { title: "Getcha Groove On" },
      { title: "Take a Look Around" },
      { title: "It'll Be OK" },
      { title: "Boiler" },
      { title: "Hold On" },
      { title: "Rollin' (Urban Assault Vehicle)" },
      { title: "Outro" },
    ],
  },
  {
    id: "shed",
    artist: "Title Fight",
    title: "Shed",
    year: 2011,
    cover: titleFightCover,
    spotifyUrl: spotifyAlbum("6B3tIntlJIe0cdG1lIkE0l"),
    whyItStuck:
      "Fast and fun on the surface, darker underneath. It’s a small-town punk record that grows on me with every listen.",
    tracks: [
      { title: "Coxton Yard" },
      { title: "Shed" },
      { title: "Flood of '72" },
      { title: "Society" },
      { title: "You Can't Say Kingston Doesn't Love You" },
      { title: "Crescent-Shaped Depression" },
      { title: "Safe in Your Skin" },
      { title: "Where Am I?" },
      { title: "Your Screen Door" },
      { title: "27" },
      { title: "Stab" },
      { title: "GMT (Greenwich Mean Time)" },
    ],
  },
  {
    id: "random-access-memories",
    artist: "Daft Punk",
    title: "Random Access Memories",
    year: 2013,
    cover: daftPunkCover,
    spotifyUrl: spotifyAlbum("4m2880jivSbbyEGAKfITCa"),
    whyItStuck:
      "It made me pay attention to craft: every sound on it feels like perfection.",
    tracks: [
      { title: "Give Life Back to Music" },
      { title: "The Game of Love" },
      { title: "Giorgio by Moroder" },
      { title: "Within" },
      { title: "Instant Crush" },
      { title: "Lose Yourself to Dance" },
      { title: "Touch" },
      { title: "Get Lucky" },
      { title: "Beyond" },
      { title: "Motherboard" },
      { title: "Fragments of Time" },
      { title: "Doin' It Right" },
      { title: "Contact" },
    ],
  },
  {
    id: "istochnik",
    artist: "Istochnik",
    artistOriginal: "Источник",
    title: "That's Exactly What I Imagined When I Was a Child",
    titleOriginal: "Так я в детстве всё и представлял",
    year: 2018,
    cover: istochnikCover,
    spotifyUrl: spotifyAlbum("2u2vQgyByXWPNA1lLfnQ9D"),
    whyItStuck:
      "The end of high school: stepping into adulthood, knowing very little about what lay ahead.",
    tracks: [
      { title: "Так я в детстве всё и представлял", translation: "That's Exactly What I Imagined When I Was a Child" },
      { title: "Ответ", translation: "Answer" },
      { title: "Форева", translation: "Forever" },
      { title: "Пять", translation: "Five" },
      { title: "Картина", translation: "The Artwork" },
      { title: "Дом", translation: "Home" },
      { title: "Выбирать (ft. Петар Мартич)", translation: "Choose (ft. Petar Martić)" },
      { title: "Все равно", translation: "It Doesn't Matter" },
    ],
  },
  {
    id: "were-not-here-to-be-loved",
    artist: "Fleshwater",
    title: "We're Not Here to Be Loved",
    year: 2022,
    cover: fleshwaterCover,
    spotifyUrl: spotifyAlbum("0hm7PiBu72tRliLqLfiKy1"),
    whyItStuck:
      "Heavy and dreamy at once, with soft vocals floating over crushing guitars. It proved to me that gentle and brutal can live in the same song.",
    tracks: [
      { title: "Baldpate Driver" },
      { title: "Closet" },
      { title: "The Razor's Apple" },
      { title: "Woohoo" },
      { title: "Linda Claire" },
      { title: "Kiss the Ladder" },
      { title: "Enjoy" },
      { title: "Backstairs Breathing" },
      { title: "Foreign" },
    ],
  },
  {
    id: "skryvaj",
    artist: "Nürnberg",
    title: "Skryvaj",
    year: 2018,
    cover: nurnbergCover,
    spotifyUrl: spotifyAlbum("4v7LVUKXfXJwsomhfHaefk"),
    whyItStuck:
      "Cold, melancholic post-punk from Minsk, my father’s hometown. It’s become my way of knowing Belarusian.",
    // Belarusian titles in Latin transliteration, as on the band's Bandcamp
    tracks: [
      { title: "Usio roŭna", translation: "All the Same" },
      { title: "Biessensoŭnasć", translation: "Senselessness" },
      { title: "Spać", translation: "Sleep" },
      { title: "Staracca", translation: "Trying" },
      { title: "Niemahčyma", translation: "Impossible" },
      { title: "Rasplyvajecca", translation: "Blurring" },
      { title: "Žorstka", translation: "Harsh" },
      { title: "Valasy", translation: "Hair" },
    ],
  },
];

/** Copy for the section header. */
export const MUSIC_SECTION = {
  eyebrow: "music passion",
  title: "ten records that shaped me",
  intro:
    "Music is my background code. It runs while I sketch, keeps me in sync during late-night design sprints, and sets the tone for every idea I bring to life.",
} as const;
