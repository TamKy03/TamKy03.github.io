// Link builders for "order / contact" buttons on F&B pages.

// Converts a Malaysian phone number ("011-2800 1201", "+60 11-2800 1201") into the
// international digits WhatsApp expects ("601128001201"). Returns "" when no digits are given.
export function toWhatsAppDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("60")) return digits;
  if (digits.startsWith("0")) return `6${digits}`;
  return digits;
}

// https://wa.me/<digits>?text=<message> — opens a chat in the WhatsApp app (phone) or WhatsApp Web (desktop).
// Returns null when no number is configured, so callers can show a placeholder instead of a broken link.
export function whatsAppUrl(phone: string, message?: string) {
  const digits = toWhatsAppDigits(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
