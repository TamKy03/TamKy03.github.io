// Demo F&B hawker page content. To reuse for another stall, change the values below —
// the page layout reads everything from here.
//
// Menu, prices, address and hours were taken from the stall's public GrabFood listing
// on 15 Sep 2026 and may have changed since.

export type MenuItem = {
  name: string;
  nameZh?: string;
  description: string;
  price: number;
  tag?: string;
};

const address = "26, Jalan 5/91, Taman Shamelin Perkasa, 56100 Kuala Lumpur";

export const hawker = {
  name: "Stinky Taufu X Durian Cheese Snack Store",
  nameZh: "臭豆腐 X 榴梿芝士饼",
  branch: "Jalan 5/91",
  tagline: "Crispy on the outside, rich and creamy on the inside, with layers of indulgent flavour in every bite.",
  cuisines: ["Taiwanese", "Durian"],
  rating: 4.4,
  priceRange: "RM18 – RM30",
  hours: "5:00 pm – 2:00 am",
  address,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,

  order: {
    // GrabFood share link: opens the Grab app on phones, or the GrabFood web menu on desktop.
    grabUrl: "https://r.grab.com/g/6-20260915_010527_a8f58c172f9e4ea5a5e15a240c4cf466_MEXMPS-1-C8BXGND2A6J2N2",
    whatsapp: {
      // Put the stall's WhatsApp number here, e.g. "011-2345 6789". Left empty, the button shows "Number not set yet".
      phone: "",
      message: "Hi! I'd like to order from Stinky Taufu X Durian Cheese. ",
    },
  },

  menu: [
    {
      name: "Golden Stinky Taufu",
      nameZh: "黄金臭豆腐",
      description: "Crispy on the outside, soft and tender on the inside, delivering rich, unforgettable flavour in every bite.",
      price: 18,
      tag: "Signature",
    },
    {
      name: "Mala Stinky Taufu",
      nameZh: "麻辣臭豆腐",
      description: "Fragrant and numbing, spicy without being harsh — more addictive with every bite.",
      price: 18,
      tag: "Spicy",
    },
    {
      name: "French Blue Cheese Stinky Tofu",
      nameZh: "法式蓝纹芝士焗臭豆腐",
      description: "Malaysia's first vegetarian blue cheese stinky tofu.",
      price: 29.9,
      tag: "Vegetarian",
    },
    {
      name: "Durian Cheese Pie",
      nameZh: "榴梿芝士饼",
      description: "Crispy on the outside, rich and creamy on the inside, with layers of indulgent flavour in every bite.",
      price: 29.9,
      tag: "Durian",
    },
  ] satisfies MenuItem[],

  drinks: [
    { name: "Coca-Cola", price: 4.5 },
    { name: "100 Plus", price: 4.5 },
  ],

  sourceNote: "Menu, prices and hours are from the GrabFood listing (15 Sep 2026) and may change — check GrabFood for the latest.",
};

export const formatPrice = (price: number) => `RM${price.toFixed(2)}`;
