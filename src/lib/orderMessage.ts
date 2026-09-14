// Builds the pre-filled WhatsApp message for a customer's order.

export type OrderLine = { name: string; nameZh?: string; price: number; qty: number };
export type FulfilmentMethod = "pickup" | "delivery";

export const formatRM = (amount: number) => `RM${amount.toFixed(2)}`;

// Work in sen to avoid floating-point totals like RM40.499999.
const toSen = (amount: number) => Math.round(amount * 100);
export const lineTotal = (line: OrderLine) => (toSen(line.price) * line.qty) / 100;
export const orderTotal = (lines: OrderLine[]) =>
  lines.reduce((sum, line) => sum + toSen(line.price) * line.qty, 0) / 100;
export const itemCount = (lines: OrderLine[]) => lines.reduce((sum, line) => sum + line.qty, 0);

export function buildOrderMessage({
  shopName,
  lines,
  method,
  note,
  labels,
}: {
  shopName: string;
  lines: OrderLine[];
  method: FulfilmentMethod;
  note?: string;
  // `intro` contains "{shop}", replaced by the shop name, e.g. "Hi! I'd like to order from {shop}:"
  labels: { intro: string; total: string; pickup: string; delivery: string; note: string };
}) {
  const items = lines.map((line) => {
    const altName = line.nameZh && line.nameZh !== line.name ? ` ${line.nameZh}` : "";
    return `• ${line.qty} × ${line.name}${altName} — ${formatRM(lineTotal(line))}`;
  });
  const trimmedNote = note?.trim();

  return [
    labels.intro.replace("{shop}", shopName),
    ...items,
    `${labels.total}: ${formatRM(orderTotal(lines))}`,
    method === "pickup" ? labels.pickup : labels.delivery,
    trimmedNote ? `${labels.note}: ${trimmedNote}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
