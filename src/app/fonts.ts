import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";

// Editorial serif display, engineered text face, mono for figures and code
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-text",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figure",
  display: "swap",
});

export const ledgerFonts = `${instrumentSerif.variable} ${plexSans.variable} ${plexMono.variable}`;
