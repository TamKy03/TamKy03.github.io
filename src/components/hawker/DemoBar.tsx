import s from "./DemoBar.module.css";

// Shown on every hawker demo version so the page isn't mistaken for the stall's official site.
export function DemoBar() {
  return (
    <p className={s.bar}>
      Demo page — not the official website of this business. Built by <a href="/">Tam Kok Yan</a> to show one-tap
      GrabFood &amp; WhatsApp ordering.
    </p>
  );
}
