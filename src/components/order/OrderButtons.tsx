import { whatsAppUrl } from "@/lib/orderLinks";
import { cx } from "@/lib/utils";
import s from "./OrderButtons.module.css";

export type OrderLinks = {
  // A GrabFood share link (r.grab.com/...) opens the Grab app on phones and the web menu on desktop.
  grabUrl?: string;
  whatsapp?: { phone: string; message?: string };
};

function GrabIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={s.icon}>
      <path
        fill="currentColor"
        d="M7 7V6a5 5 0 0 1 10 0v1h2.2a1 1 0 0 1 1 .92l1 13A1 1 0 0 1 20.2 22H3.8a1 1 0 0 1-1-1.08l1-13A1 1 0 0 1 4.8 7H7Zm2 0h6V6a3 3 0 0 0-6 0v1Zm-1 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={s.icon}>
      <path
        fill="currentColor"
        d="M12.04 2a9.93 9.93 0 0 0-8.5 15.05L2 22l5.08-1.5A9.94 9.94 0 1 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.02.89.9-2.94-.2-.31a8.2 8.2 0 1 1 6.8 3.69Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.17 3.68c1.55.67 2.16.73 2.93.61.48-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z"
      />
    </svg>
  );
}

// Big, thumb-friendly buttons that send customers straight to GrabFood or a WhatsApp chat.
export function OrderButtons({
  grabUrl,
  whatsapp,
  layout = "row",
  className,
}: OrderLinks & { layout?: "row" | "stack"; className?: string }) {
  const waUrl = whatsapp ? whatsAppUrl(whatsapp.phone, whatsapp.message) : null;

  return (
    <div className={cx(s.buttons, layout === "stack" && s.stack, className)}>
      {grabUrl && (
        <a className={cx(s.button, s.grab)} href={grabUrl} target="_blank" rel="noopener noreferrer">
          <GrabIcon />
          <span>
            <strong>Order on GrabFood</strong>
            <small>Delivery or self pick-up</small>
          </span>
        </a>
      )}

      {whatsapp &&
        (waUrl ? (
          <a className={cx(s.button, s.whatsapp)} href={waUrl} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            <span>
              <strong>WhatsApp us</strong>
              <small>Ask, pre-order or book catering</small>
            </span>
          </a>
        ) : (
          <span className={cx(s.button, s.whatsapp, s.placeholder)} aria-disabled="true">
            <WhatsAppIcon />
            <span>
              <strong>WhatsApp us</strong>
              <small>Number not set yet</small>
            </span>
          </span>
        ))}
    </div>
  );
}

// Fixed bar at the bottom of the screen on phones, so ordering is always one tap away.
export function StickyOrderBar(props: OrderLinks) {
  const waUrl = props.whatsapp ? whatsAppUrl(props.whatsapp.phone, props.whatsapp.message) : null;

  return (
    <nav className={s.sticky} aria-label="Quick order">
      {props.grabUrl && (
        <a className={cx(s.stickyButton, s.grab)} href={props.grabUrl} target="_blank" rel="noopener noreferrer">
          <GrabIcon />
          GrabFood
        </a>
      )}
      {props.whatsapp && (
        <a
          className={cx(s.stickyButton, s.whatsapp, !waUrl && s.placeholder)}
          href={waUrl ?? undefined}
          target={waUrl ? "_blank" : undefined}
          rel={waUrl ? "noopener noreferrer" : undefined}
          aria-disabled={waUrl ? undefined : "true"}
        >
          <WhatsAppIcon />
          WhatsApp
        </a>
      )}
    </nav>
  );
}
