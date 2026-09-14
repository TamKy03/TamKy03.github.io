// Demo F&B hawker page content, shared by the Simple, Intermediate and Advanced versions.
// To reuse for another stall, change the values below — the page layouts read everything from here.
//
// Menu, prices, address and hours were taken from the stall's public GrabFood listing
// on 15 Sep 2026 and may have changed since.

import type { Version } from "@/components/VersionBar";
import type { DailyHours } from "@/lib/openingHours";

export { formatRM as formatPrice } from "@/lib/orderMessage";

export type Category = "tofu" | "durian" | "drinks";

export type MenuItem = {
  id: string;
  name: string;
  nameZh: string;
  description?: string;
  descriptionZh?: string;
  price: number;
  category: Category;
  tag?: string;
  tagZh?: string;
  // Character shown on the dish thumbnail in place of a photo
  glyph: string;
};

const address = "26, Jalan 5/91, Taman Shamelin Perkasa, 56100 Kuala Lumpur";

export const hawker = {
  name: "Stinky Taufu X Durian Cheese Snack Store",
  nameZh: "臭豆腐 X 榴梿芝士饼",
  branch: "Jalan 5/91",
  tagline: "Crispy on the outside, rich and creamy on the inside, with layers of indulgent flavour in every bite.",
  taglineZh: "外酥内软，浓郁香滑，每一口都层次丰富。",
  cuisines: ["Taiwanese", "Durian"],
  cuisinesZh: ["台湾小吃", "榴梿"],
  rating: 4.4,
  priceRange: "RM18 – RM30",
  // Usual daily hours (GrabFood showed 00:00–02:00 and 17:00–23:59 for the day checked).
  openingHours: [{ open: "17:00", close: "02:00" }] satisfies DailyHours[],
  hours: "5:00 pm – 2:00 am",
  timeZone: "Asia/Kuala_Lumpur",
  address,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,

  order: {
    // GrabFood share link: opens the Grab app on phones, or the GrabFood web menu on desktop.
    grabUrl: "https://r.grab.com/g/6-20260915_010527_a8f58c172f9e4ea5a5e15a240c4cf466_MEXMPS-1-C8BXGND2A6J2N2",
    whatsapp: {
      // Put the stall's WhatsApp number here, e.g. "011-2345 6789". Left empty, the button shows "Number not set yet".
      phone: "011-28001201",
      message: "Hi! I'd like to order from Stinky Taufu X Durian Cheese. ",
    },
  },

  menu: [
    {
      id: "golden-stinky-taufu",
      name: "Golden Stinky Taufu",
      nameZh: "黄金臭豆腐",
      description: "Crispy on the outside, soft and tender on the inside, delivering rich, unforgettable flavour in every bite.",
      descriptionZh: "外酥内嫩・臭香十足・越吃越香",
      price: 18,
      category: "tofu",
      tag: "Signature",
      tagZh: "招牌",
      glyph: "臭",
    },
    {
      id: "mala-stinky-taufu",
      name: "Mala Stinky Taufu",
      nameZh: "麻辣臭豆腐",
      description: "Fragrant and numbing, spicy without being harsh — more addictive with every bite.",
      descriptionZh: "香麻带劲・辣而不燥・越吃越过瘾",
      price: 18,
      category: "tofu",
      tag: "Spicy",
      tagZh: "麻辣",
      glyph: "辣",
    },
    {
      id: "blue-cheese-stinky-tofu",
      name: "French Blue Cheese Stinky Tofu",
      nameZh: "法式蓝纹芝士焗臭豆腐",
      description: "Malaysia's first vegetarian blue cheese stinky tofu.",
      descriptionZh: "马来西亚首创素食蓝纹芝士臭豆腐",
      price: 29.9,
      category: "tofu",
      tag: "Vegetarian",
      tagZh: "素食",
      glyph: "芝",
    },
    {
      id: "durian-cheese-pie",
      name: "Durian Cheese Pie",
      nameZh: "榴梿芝士饼",
      description: "Crispy on the outside, rich and creamy on the inside, with layers of indulgent flavour in every bite.",
      descriptionZh: "外酥内软，浓郁香滑，层层榴梿芝士香",
      price: 29.9,
      category: "durian",
      tag: "Durian",
      tagZh: "榴梿",
      glyph: "榴",
    },
    { id: "coca-cola", name: "Coca-Cola", nameZh: "可口可乐", price: 4.5, category: "drinks", glyph: "饮" },
    { id: "100-plus", name: "100 Plus", nameZh: "100 Plus", price: 4.5, category: "drinks", glyph: "饮" },
  ] satisfies MenuItem[] as MenuItem[],

  sourceNote: "Menu, prices and hours are from the GrabFood listing (15 Sep 2026) and may change — check GrabFood for the latest.",
  sourceNoteZh: "菜单、价格与营业时间取自 GrabFood（2026年9月15日），可能有所变动，请以 GrabFood 为准。",
};

export const dishes = hawker.menu.filter((item) => item.category !== "drinks");
export const drinks = hawker.menu.filter((item) => item.category === "drinks");

export const categories = [
  { key: "all", label: "All", labelZh: "全部" },
  { key: "tofu", label: "Stinky tofu", labelZh: "臭豆腐" },
  { key: "durian", label: "Durian", labelZh: "榴梿" },
  { key: "drinks", label: "Drinks", labelZh: "饮料" },
] as const;

export const hawkerVersions: Version[] = [
  { key: "advanced", href: "/demo/hawker/", label: "Advanced" },
  { key: "intermediate", href: "/demo/hawker/intermediate/", label: "Intermediate" },
  { key: "simple", href: "/demo/hawker/simple/", label: "Simple" },
  { key: "all", href: "/versions/#demos", label: "All demos" },
];
