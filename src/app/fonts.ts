import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif, JetBrains_Mono, Poppins } from "next/font/google";

// Used by the Standard, Lite, Compare and the Simple/Intermediate hawker pages
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
  display: "swap",
});

// "Ledger" redesign: editorial serif display, engineered text face, mono for figures
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

// Applied on the root element of redesigned pages
export const ledgerFonts = `${instrumentSerif.variable} ${plexSans.variable} ${plexMono.variable}`;
