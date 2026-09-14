export type Track = {
  title: string;
  genre: string;
  year: string;
  platform: string;
  href: string;
  audio: string;
  seed: number;
};

export type Mixtape = {
  label: string;
  title: string;
  genre: string;
  year: string;
  duration: string;
  description: string;
  youtubeId: string;
};

export type Photo = {
  event: string;
  meta: string;
  slot: string;
  src: string;
  placeholder: string;
  /** 3:4 photos keep their full height in the collage instead of being cropped. */
  portrait?: boolean;
};

export const email = "sekratesauce@gmail.com";

export const social = {
  instagram: "https://www.instagram.com/sekrate_sauce/",
  youtube: "https://www.youtube.com/@sekratesauce",
  soundcloud: "https://soundcloud.com/sekratesauce",
};

export const music: Track[] = [
  {
    title: "Sekrate Drop Mix — Pop Dat × Purple Lamb × Merci",
    genre: "Transition",
    year: "May 2024",
    platform: "SoundCloud",
    href: "https://soundcloud.com/sekratesauce/dj-honeebee-drop-mix-pop-dat-x-purple-lamb-x-merci-mix",
    audio: "/assets/pop-dat-purple-lamb-merci-mix.mp3",
    seed: 1,
  },
  {
    title: "Spice — So Mi Like It (Sekrate Edit)",
    genre: "Dancehall",
    year: "Nov 2025",
    platform: "SoundCloud",
    href: "https://on.soundcloud.com/sOz2gkCxsYaGAifEiG",
    audio: "/assets/spice-so-mi-like-it.mp3",
    seed: 2,
  },
  {
    title: "50 Cent ft. Justin Timberlake — Ayo Technology (Sekrate Sauce Remix)",
    genre: "Remix",
    year: "Aug 2026",
    platform: "SoundCloud",
    href: "https://soundcloud.com/sekratesauce",
    audio: "/assets/ayo-technology-sekrate-sauce-remix.mp3",
    seed: 3,
  },
  {
    title: "Justin Timberlake — My Love Place (Sekrate Sauce Edit)",
    genre: "Edit",
    year: "Aug 2026",
    platform: "SoundCloud",
    href: "https://soundcloud.com/sekratesauce",
    audio: "/assets/my-love-place-sekrate-sauce-edit.mp3",
    seed: 4,
  },
];

export const mixtapes: Mixtape[] = [
  {
    label: "Mix 001",
    title: "Bollywood Amapiano Mix",
    genre: "Bollywood / Amapiano",
    year: "2024",
    duration: "12 min",
    description:
      "A 12-minute mix blending popular Hindi songs with energetic Amapiano rhythms.",
    youtubeId: "3NaU5ZPDvgk",
  },
  {
    label: "Mix 002",
    title: "Deep House Mix 2020",
    genre: "Dance / Deep House",
    year: "2020",
    duration: "47:48",
    description: "Top songs of Dance & Deep House 2020.",
    youtubeId: "PpB0uHVIRjE",
  },
];

export const live: Photo[] = [
  { event: "New York Fashion Week", meta: "Runway · Sony Hall", slot: "v4-p1", src: "/assets/photo-runway.jpg", placeholder: "[LIVE PHOTO]" },
  { event: "New York Fashion Week", meta: "The room", slot: "v4-p2", src: "/assets/photo-crowd.jpg", placeholder: "[LIVE PHOTO]" },
  { event: "New York Fashion Week", meta: "Before the show", slot: "v4-p3", src: "/assets/photo-blue-runway.jpg", placeholder: "[LIVE PHOTO]" },
  { event: "Backstage", meta: "NYFW", slot: "v4-p4", src: "/assets/photo-backstage.jpg", placeholder: "[LIVE PHOTO]" },
  { event: "Studio", meta: "On the decks", slot: "v4-p5", src: "/assets/photo-decks.jpg", placeholder: "[PHOTO]", portrait: true },
  { event: "Platform 9", meta: "Off duty", slot: "v4-p6", src: "/assets/photo-subway.jpg", placeholder: "[PHOTO]", portrait: true },
  { event: "Wedding", meta: "From the booth", slot: "v4-p7", src: "/assets/photo-wedding.jpg", placeholder: "[PHOTO]" },
];

export const services = [
  "Club Events",
  "Private Events",
  "Corporate Events",
  "Festivals",
  "Brand Events",
  "Parties",
  "Special Events",
];

export const menuItems: [label: string, href: string, sub: string][] = [
  ["Home", "#home", "Start"],
  ["About", "#about", "The artist"],
  ["Music", "#music", "Tracks & platforms"],
  ["Mixtapes", "#mixtapes", "Recorded sets"],
  ["Photos", "#photos", "On the floor"],
  ["Radio Mix", "#radio", "Coming soon"],
  ["DJ Services", "#services", "Bookings"],
];

export const genres = [
  "Tech House", "Dubstep", "Trap House", "Amapiano", "Jersey House", "UK Garage",
  "Hip Hop", "Rap", "Drill", "Drum & Bass", "Dancehall", "Roots Reggae",
  "Brazilian Funk", "Reggaeton", "Bachata", "Dembow", "Jungle", "Punjabi",
  "Open Format", "Sekrate Sauce",
];

export const eventTypes = [
  "Club event", "Private event", "Corporate event",
  "Festival", "Brand event", "Party", "Special event",
];
