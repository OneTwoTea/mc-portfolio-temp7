/**
 * ═══════════════════════════════════════════════════════════
 *  TEMPLATES.JS — Bộ render: config → HTML
 *  Giao diện "Bento Board": cả trang là một bảng ô (tile) sáng màu.
 *  Lưới 2 cột (điện thoại) → 4 cột (máy tính bảng) → 12 cột (máy tính).
 * ═══════════════════════════════════════════════════════════
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Thư mục gốc của dự án (để kiểm tra file ảnh có thật hay không)
const ROOT = fileURLToPath(new URL("..", import.meta.url));

// ─── ICONS (SVG inline) ─────────────────────────────────
const ICONS = {
  wedding: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  corporate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></svg>`,
  event: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  ceremony: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  award: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  bilingual: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  zalo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M12.5 6C9.46 6 7 8.46 7 11.5v25C7 39.54 9.46 42 12.5 42h23c3.04 0 5.5-2.46 5.5-5.5v-25C41 8.46 38.54 6 35.5 6h-23zm2.14 11h18.72c.87 0 1.34 1.01.78 1.67L22.97 31.5h8.87c.74 0 1.16.83.71 1.39-.15.18-.37.29-.61.29H13.36c-.87 0-1.34-1.01-.78-1.67L23.75 18.7h-9.1a.82.82 0 0 1-.72-.43.81.81 0 0 1 .71-1.27z"/></svg>`,
  play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`,
  arrowDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  quote: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  mic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  grid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  flip: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  chat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
};

// ─── TIỆN ÍCH ──────────────────────────────────────────

/** Escape HTML để chống XSS */
export function esc(str) {
  if (typeof str !== "string") return String(str ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Kiểm tra giá trị có phải placeholder [IN_HOA] không */
export function isPlaceholder(val) {
  if (typeof val !== "string") return false;
  return /\[[A-Z0-9_]+\]/.test(val);
}

/** Trả SVG icon inline (trang trí → aria-hidden) */
export function icon(name, cls = "") {
  const svg = ICONS[name];
  if (!svg) return `<!-- icon "${name}" không tìm thấy -->`;
  const clsAttr = cls ? ` class="${esc(cls)}"` : "";
  return svg.replace("<svg ", `<svg${clsAttr} aria-hidden="true" focusable="false" `);
}

/**
 * Tạo thẻ ảnh: <picture> khi có ảnh mobile riêng, lazy-load, width/height, alt.
 * Ảnh lỗi sẽ tự ẩn (onerror) để lộ khung thay thế .ph ngay sau nó.
 */
export function media({ src, alt = "", cls = "", width, height, lazy = true, priority = false, mobileSrc, mobileWidth, mobileHeight }) {
  const loadAttr = priority ? ` fetchpriority="high"` : lazy ? ` loading="lazy"` : "";
  const imgCls = cls ? ` class="${esc(cls)}"` : "";
  const size = (w, h) => `${w ? ` width="${w}"` : ""}${h ? ` height="${h}"` : ""}`;
  const img = `<img src="${esc(src)}" alt="${esc(alt)}"${imgCls}${size(width, height)}${loadAttr} decoding="async" onerror="this.hidden=true">`;

  if (!mobileSrc) return img;
  return `<picture class="contents">
  <source media="(max-width: 767px)" srcset="${esc(mobileSrc)}"${size(mobileWidth, mobileHeight)}>
  ${img}
</picture>`;
}

/** File (đường dẫn dạng public/...) có thật trong dự án không. Link http(s) coi như có. */
function fileExists(src) {
  if (!src || typeof src !== "string") return false;
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return true;
  try {
    return existsSync(join(ROOT, src));
  } catch {
    return false;
  }
}

/**
 * Ô thay thế khi chưa có ảnh: nền xám sọc + icon + nhãn.
 * `missing` = đường dẫn ảnh chưa có → ô hiện luôn, và build vẫn liệt kê được file thiếu.
 */
function placeholder(label, cls = "", missing = "") {
  const on = missing ? " ph--on" : "";
  const data = missing ? ` data-missing="${esc(missing)}"` : "";
  return `<span class="ph ${cls}${on}"${data} aria-hidden="true">${icon("image", "ph__icon")}${label ? `<span class="ph__label">${esc(label)}</span>` : ""}</span>`;
}

/** Bản ảnh cho điện thoại cùng tên, thêm đuôi -m: service-01.webp → service-01-m.webp */
function mobileVariant(src) {
  return typeof src === "string" ? src.replace(/(\.[a-z0-9]+)$/i, "-m$1") : "";
}

/**
 * Ảnh + ô thay thế: chỉ chèn <img> khi file thật sự tồn tại (tránh lỗi 404).
 * Không khai báo mobileSrc mà có sẵn file "-m" bên cạnh → điện thoại tự dùng bản nhẹ đó.
 */
function pic(opts, label = "", phCls = "") {
  if (opts.mobileSrc === undefined && fileExists(mobileVariant(opts.src))) {
    opts = { ...opts, mobileSrc: mobileVariant(opts.src) };
  }
  const hasMain = fileExists(opts.src);
  const hasMobile = fileExists(opts.mobileSrc);
  if (!hasMain && !hasMobile) {
    return placeholder(label, phCls, [opts.src, opts.mobileSrc].filter(Boolean).join(" "));
  }
  const src = hasMain ? opts.src : opts.mobileSrc;
  const mobileSrc = hasMain && hasMobile && opts.mobileSrc !== opts.src ? opts.mobileSrc : "";
  return media({ ...opts, src, mobileSrc }) + placeholder(label, phCls);
}

/** Thuộc tính href (+ target/rel nếu là link ngoài) */
function linkAttrs(href) {
  const external = /^https?:\/\//.test(href);
  return `href="${esc(href)}"${external ? ` target="_blank" rel="noopener noreferrer"` : ""}`;
}

/** Xuống dòng \n trong config → <br> */
function lines(text) {
  return esc(text || "").replace(/\n/g, "<br>");
}

/** Số mục hiện sẵn trên điện thoại (mobileVisible), mặc định `fallback` */
function visibleCount(n, fallback) {
  const v = Number(n);
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : fallback;
}

// ─── HELPERS ────────────────────────────────────────────

/** Tạo các link tel/zalo/mailto/mạng xã hội — nếu còn placeholder thì trỏ về #contact */
export function createHelpers(config) {
  const c = config.contact || {};

  function safeLink(value, prefix = "") {
    if (!value || isPlaceholder(value)) return "#contact";
    if (prefix === "tel:") return `tel:${value.replace(/[^\d+]/g, "")}`;
    if (prefix === "mailto:") return `mailto:${value}`;
    if (prefix === "zalo:") return /^https?:\/\//.test(value) ? value : `https://zalo.me/${value.replace(/[^\d]/g, "")}`;
    return value;
  }

  const hasPhone = c.phone && !isPlaceholder(c.phone);
  const hasEmail = c.email && !isPlaceholder(c.email);

  return {
    phoneLink: safeLink(c.phone, "tel:"),
    phoneDisplay: hasPhone ? c.phone : "Đang cập nhật",
    zaloLink: safeLink(c.zalo, "zalo:"),
    emailLink: safeLink(c.email, "mailto:"),
    emailDisplay: hasEmail ? c.email : "Đang cập nhật",
    emailRaw: hasEmail ? c.email : "",
    facebookLink: safeLink(c.facebook),
    youtubeLink: safeLink(c.youtube),
    ctaLink: safeLink(config.header?.ctaButton?.href || c.zalo, "zalo:"),
    heroCtaLink: safeLink(config.hero?.ctaPrimary?.href || c.zalo, "zalo:"),
    floatingLink: safeLink(config.floatingButton?.href || c.zalo, "zalo:"),
    // Link trong thanh tab: "#..." giữ nguyên, link Zalo/http xử lý placeholder
    tabLink: (href) => (!href || href.startsWith("#") ? href || "#contact" : safeLink(href, "zalo:")),
  };
}

// ─── RENDERERS ──────────────────────────────────────────

export function createRenderers(config) {
  const h = createHelpers(config);
  const ui = {
    showMore: "Xem thêm",
    showLess: "Thu gọn",
    skipLink: "Bỏ qua đến nội dung chính",
    menuLabel: "Mục lục",
    closeLabel: "Đóng",
    flipHint: "Chạm vào ô để xem chi tiết",
    flipBack: "Lật lại",
    videoMissing: "Video đang được cập nhật — liên hệ để xem trọn bộ showreel.",
    ...(config.ui || {}),
  };

  /** Video chưa có link → nút dẫn về #contact thay vì mở trình phát rỗng */
  const videoAttr = (url) => (url && !isPlaceholder(url) ? `data-video="${esc(url)}"` : `data-video-missing`);

  /** Nhãn nhỏ phía trên tiêu đề mỗi khu vực */
  const kicker = (text, cls = "") => `<p class="kicker ${cls}">${esc(text)}</p>`;

  /** Mục thứ i có bị thu gọn trên điện thoại không → thuộc tính data-extra + id */
  const extra = (i, visible, id) => (i >= visible ? ` data-extra id="${id}"` : "");

  /** Nút "Xem thêm (N)" — chỉ hiện khi có JS và màn hình < 1024px */
  function moreButton(ids, cls = "") {
    if (!ids.length) return "";
    const more = `${ui.showMore} (${ids.length})`;
    return `<button type="button" class="more ${cls}" data-more aria-expanded="false" aria-controls="${ids.join(" ")}" data-label-more="${esc(more)}" data-label-less="${esc(ui.showLess)}">
            <span data-more-label>${esc(more)}</span>${icon("arrowDown", "more__icon")}
          </button>`;
  }

  /** Danh sách id của các mục bị thu gọn */
  const extraIds = (count, visible, prefix) =>
    Array.from({ length: Math.max(0, count - visible) }, (_, k) => `${prefix}-${visible + k + 1}`);

  return {
    // ─── SEO HEAD ─────────────────────────────────────
    seoHead() {
      const seo = config.seo || {};
      const siteUrl = seo.url && !isPlaceholder(seo.url) ? seo.url.replace(/\/?$/, "/") : "";
      // og:image cần URL tuyệt đối — chỉ ghép được khi đã có seo.url
      const ogImage = siteUrl ? siteUrl + (seo.ogImage || "") : seo.ogImage || "";
      return `<title>${esc(seo.title || "MC Portfolio")}</title>
    <meta name="description" content="${esc(seo.description || "")}">
    <meta name="keywords" content="${esc(seo.keywords || "")}">
    ${siteUrl ? `<link rel="canonical" href="${esc(siteUrl)}">\n    <meta property="og:url" content="${esc(siteUrl)}">` : ""}
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${esc(seo.locale || "vi_VN")}">
    <meta property="og:site_name" content="${esc(config.brand?.name || "")}">
    <meta property="og:title" content="${esc(seo.title || "")}">
    <meta property="og:description" content="${esc(seo.description || "")}">
    <meta property="og:image" content="${esc(ogImage)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(seo.ogImageAlt || "")}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(seo.title || "")}">
    <meta name="twitter:description" content="${esc(seo.description || "")}">
    <meta name="twitter:image" content="${esc(ogImage)}">
    <meta name="theme-color" content="${esc(seo.themeColor || "#E5E6E1")}">
    <link rel="icon" type="image/svg+xml" href="public/icons/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="public/icons/favicon-32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="public/icons/apple-touch-icon.png">`;
    },

    // ─── LINK BỎ QUA ─────────────────────────────────
    skipLink() {
      return `<a href="#main" class="skip">${esc(ui.skipLink)}</a>`;
    },

    // ─── CTA Ô ĐẦU TRANG (thuộc tính href đã xử lý placeholder) ─
    ctaAttrs() {
      return linkAttrs(h.ctaLink);
    },

    // ─── NÚT MỤC LỤC (ô đầu trang) ────────────────────
    menuButton() {
      return `<button type="button" id="menu-toggle" class="menu-btn" aria-expanded="false" aria-controls="menu-sheet" aria-haspopup="dialog">
          ${icon("grid", "menu-btn__icon")}<span class="menu-btn__label">${esc(ui.menuLabel)}</span>
        </button>`;
    },

    // ─── BẢNG MỤC LỤC (trượt lên từ đáy) ─────────────
    menuSheet() {
      const items = config.header?.menuItems || [];
      const tiles = items
        .map(
          (item, i) => `<li><a href="${esc(item.href)}" class="sheet__link">
              <span class="sheet__num">${String(i + 1).padStart(2, "0")}</span>
              <span class="sheet__label">${esc(item.label)}</span>
            </a></li>`
        )
        .join("\n            ");
      const cta = config.header?.ctaButton;
      return `<div id="menu-sheet" class="sheet" role="dialog" aria-modal="true" aria-labelledby="menu-sheet-title" hidden>
    <div class="sheet__backdrop" data-sheet-close></div>
    <div class="sheet__panel">
      <div class="sheet__bar">
        <p id="menu-sheet-title" class="kicker">${esc(ui.menuLabel)}</p>
        <button type="button" class="icon-btn" data-sheet-close aria-label="${esc(ui.closeLabel)}">${icon("close", "w-6 h-6")}</button>
      </div>
      <nav aria-label="${esc(ui.menuLabel)}">
        <ul class="sheet__grid">
            ${tiles}
        </ul>
      </nav>
      ${cta?.label ? `<a ${linkAttrs(h.ctaLink)} class="sheet__cta">${icon("zalo", "w-6 h-6")}<span>${esc(cta.label)}</span>${icon("arrowUpRight", "w-5 h-5 ml-auto")}</a>` : ""}
    </div>
  </div>`;
    },

    // ─── HERO: BẢNG Ô ĐẦU TRANG ──────────────────────
    heroSection() {
      const hero = config.hero || {};
      const brand = config.brand || {};
      const img = hero.image || {};
      const pos = hero.imagePosition || {};
      const reel = config.videos?.featured || {};
      const stats = config.about?.stats || [];
      const avail = (hero.availability || "").trim();

      // Không có ô lịch trống → ô ảnh chỉ cao 1 hàng, ô tên cao 2 hàng (máy tính) để không hở ô
      const photoRows = avail ? "row-span-2" : "";
      const nameRows = avail ? "" : "lg:row-span-2";

      const statTiles = stats
        .slice(0, 4)
        .map((s, i) => {
          const tone = ["", "", "tile--ink", "tile--lime"][i] || "";
          const longNum = isPlaceholder(s.number) || String(s.number).length > 6;
          return `<div class="tile stat ${tone} pop pop--solid lg:col-span-3" style="--i:${6 + i}">
          <p class="stat__num${longNum ? " stat__num--long" : ""}">${esc(s.number)}</p>
          <p class="stat__label">${esc(s.label)}</p>
        </div>`;
        })
        .join("\n        ");

      return `<section id="hero" class="sec sec--hero" aria-labelledby="hero-title">
      <div class="board">
        <figure class="tile tile--media hero-photo ${photoRows} md:col-span-2 lg:col-span-4 lg:row-span-3 lg:col-start-1 lg:row-start-1 pop pop--solid" style="--i:0;--pos-m:${esc(pos.mobile || "50% 25%")};--pos-d:${esc(pos.desktop || "50% 30%")}">
          ${pic(
            {
              src: img.desktop || hero.backgroundDesktop || "",
              mobileSrc: img.mobile || hero.backgroundMobile || "",
              alt: hero.backgroundAlt || "",
              cls: "tile__img",
              width: 900,
              height: 1200,
              mobileWidth: 600,
              mobileHeight: 750,
              lazy: false,
              priority: true,
            },
            "Ảnh MC"
          )}
        </figure>

        <div class="tile tile--ink hero-name md:col-span-2 lg:col-span-3 lg:col-start-10 lg:row-start-1 ${nameRows} pop pop--solid" style="--i:1">
          ${kicker(brand.tagline || "MC sự kiện", "kicker--lime")}
          <p class="hero-name__name">${esc(brand.name || "")}</p>
        </div>

        ${avail ? `<div class="tile hero-avail md:col-span-2 lg:col-span-3 lg:col-start-10 lg:row-start-2 pop pop--solid" style="--i:2">
          <span class="live-dot" aria-hidden="true"></span>
          <p class="hero-avail__text">${esc(avail)}</p>
        </div>` : ""}

        <div class="tile hero-head col-span-2 md:col-span-4 lg:col-span-5 lg:col-start-5 lg:row-start-1 lg:row-span-2 pop pop--solid" style="--i:3">
          <h1 id="hero-title" class="hero-head__title">${lines(hero.heading)}</h1>
          ${hero.subheading ? `<p class="lead">${esc(hero.subheading)}</p>` : ""}
        </div>

        <a ${linkAttrs(h.heroCtaLink)} class="tile tile--lime tile--press hero-cta md:col-span-2 lg:col-span-3 lg:col-start-10 lg:row-start-3 pop pop--solid" style="--i:4">
          <span class="badge badge--ink">${icon("zalo", "w-6 h-6")}</span>
          <span class="hero-cta__label">${esc(hero.ctaPrimary?.label || "Đặt lịch")}</span>
          ${icon("arrowUpRight", "hero-cta__arrow")}
        </a>

        <button type="button" ${videoAttr(reel.videoUrl)} class="tile tile--ink tile--media tile--press hero-reel md:col-span-2 lg:col-span-5 lg:col-start-5 lg:row-start-3 pop pop--solid" style="--i:5">
          ${pic({ src: reel.thumbnail || "", alt: "", cls: "tile__img", width: 1280, height: 720, lazy: false }, "", "ph--ink")}
          <span class="hero-reel__shade" aria-hidden="true"></span>
          <span class="badge badge--lime hero-reel__play" aria-hidden="true">${icon("play", "w-5 h-5 ml-0.5")}</span>
          <span class="hero-reel__text">
            <span class="hero-reel__label">${esc(hero.ctaSecondary?.label || "Xem showreel")}</span>
            ${reel.title ? `<span class="sr-only">: ${esc(reel.title)}</span>` : ""}
            ${reel.duration ? `<span class="chip chip--dark">${esc(reel.duration)}</span>` : ""}
          </span>
        </button>

        ${statTiles}
      </div>
    </section>`;
    },

    // ─── CẢM NHẬN (ngay sau hero) ─────────────────────
    testimonialsSection() {
      const test = config.testimonials || {};
      const items = test.items || [];
      if (!items.length) return "";
      const visible = visibleCount(test.mobileVisible, 2);
      const ratings = items.map((t) => Math.max(0, Math.min(5, Number(t.rating) || 5)));
      const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
      const stars = (n, cls) => Array.from({ length: Math.round(n) }, () => icon("star", cls)).join("");

      const tiles = items
        .map((t, i) => {
          const initial = (t.name || "?").trim().split(/\s+/).pop().charAt(0);
          const tone = i % 3 === 2 ? "tile--ink" : "";
          // Chưa có avatar → chỉ hiện chữ cái đầu (data-missing để build vẫn báo thiếu file)
          const hasAvatar = fileExists(t.avatar);
          const missingAvatar = !hasAvatar && t.avatar ? ` data-missing="${esc(t.avatar)}"` : "";
          return `<figure class="tile quote ${tone} col-span-2 lg:col-span-4 pop" style="--i:${(i % 4) + 1}"${extra(i, visible, `testimonials-x-${i + 1}`)}>
          <p class="quote__stars" role="img" aria-label="${ratings[i]} trên 5 sao">${stars(ratings[i], "w-4 h-4")}</p>
          <blockquote class="quote__text"><p>“${esc(t.content || "")}”</p></blockquote>
          <figcaption class="quote__who">
            <span class="avatar"${missingAvatar}>
              <span class="avatar__initial" aria-hidden="true">${esc(initial)}</span>
              ${hasAvatar ? media({ src: t.avatar, alt: "", cls: "avatar__img", width: 100, height: 100 }) : ""}
            </span>
            <span class="min-w-0">
              <span class="quote__name">${esc(t.name || "")}</span>
              <span class="quote__role">${esc(t.role || "")}</span>
            </span>
          </figcaption>
        </figure>`;
        })
        .join("\n        ");

      return `<section id="testimonials" class="sec" aria-labelledby="testimonials-title">
      <div class="board" data-collapse>
        <div class="tile tile--ink sec-head col-span-2 md:col-span-4 lg:col-span-4 lg:row-span-2 pop" style="--i:0">
          ${kicker(test.sectionLabel || "Cảm Nhận", "kicker--lime")}
          <h2 id="testimonials-title" class="h-sec">${lines(test.heading)}</h2>
          ${test.subheading ? `<p class="lead lead--ink">${esc(test.subheading)}</p>` : ""}
          <div class="score">
            <p class="score__num">${avg}</p>
            <div>
              <p class="score__stars" role="img" aria-label="Điểm trung bình ${avg} trên 5">${stars(Number(avg), "w-5 h-5")}</p>
              <p class="score__count">${items.length} đánh giá</p>
            </div>
          </div>
        </div>
        ${tiles}
        ${moreButton(extraIds(items.length, visible, "testimonials-x"), "col-span-2 md:col-span-4")}
      </div>
    </section>`;
    },

    // ─── DỊCH VỤ (ô lật) ─────────────────────────────
    servicesSection() {
      const svc = config.services || {};
      const items = svc.items || [];
      if (!items.length) return "";
      const visible = visibleCount(svc.mobileVisible, 4);
      const ask = svc.askMore || {};

      const tiles = items
        .map((item, i) => {
          const id = `svc-${i + 1}`;
          return `<article class="flip lg:col-span-4 pop" style="--i:${(i % 4) + 1}" data-flip${i >= visible ? ` data-extra id="services-x-${i + 1}"` : ""}>
          <div class="flip__inner">
            <div class="flip__face flip__front">
              ${pic({ src: item.image || "", alt: item.imageAlt || "", cls: "tile__img", width: 640, height: 640 }, "", "ph--soft")}
              <span class="flip__shade" aria-hidden="true"></span>
              <span class="badge badge--paper flip__icon" aria-hidden="true">${icon(item.icon || "event", "w-5 h-5")}</span>
              <h3 class="flip__title">${esc(item.title)}</h3>
              <button type="button" class="flip__toggle" data-flip-open aria-expanded="false" aria-controls="${id}-back">
                <span class="sr-only">Xem chi tiết: ${esc(item.title)}</span>
                <span class="flip__hint" aria-hidden="true">${icon("flip", "w-4 h-4")}</span>
              </button>
            </div>
            <div class="flip__face flip__back" id="${id}-back" tabindex="-1">
              <p class="flip__back-title">${icon(item.icon || "event", "w-5 h-5")}<span>${esc(item.title)}</span></p>
              <p class="flip__desc">${esc(item.description)}</p>
              <a href="#contact" class="pill pill--lime flip__ask" data-service="${esc(item.title)}">${esc(svc.askLabel || "Hỏi lịch dịch vụ này")}${icon("arrowUpRight", "w-4 h-4")}</a>
              <button type="button" class="icon-btn icon-btn--ink flip__back-btn" data-flip-close aria-label="${esc(`${ui.flipBack}: ${item.title}`)}">${icon("flip", "w-5 h-5")}</button>
            </div>
          </div>
        </article>`;
        })
        .join("\n        ");

      const askTile = ask.title
        ? `<a href="#contact" class="tile tile--ink tile--press ask col-span-2 md:col-span-2 lg:col-span-4 pop" style="--i:3">
          <span class="ask__title">${esc(ask.title)}</span>
          ${ask.text ? `<span class="ask__text">${esc(ask.text)}</span>` : ""}
          <span class="pill pill--lime ask__btn">${esc(ask.label || "Gửi yêu cầu")}${icon("arrowUpRight", "w-4 h-4")}</span>
        </a>`
        : "";

      return `<section id="services" class="sec" aria-labelledby="services-title">
      <div class="board" data-collapse>
        <div class="tile tile--lime sec-head col-span-2 md:col-span-4 lg:col-span-4 lg:row-span-2 pop" style="--i:0">
          ${kicker(svc.sectionLabel || "Dịch Vụ")}
          <h2 id="services-title" class="h-sec">${lines(svc.heading)}</h2>
          ${svc.subheading ? `<p class="lead lead--lime">${esc(svc.subheading)}</p>` : ""}
          <span class="sec-head__big" aria-hidden="true">${String(items.length).padStart(2, "0")}</span>
          <p class="hint">${icon("flip", "w-4 h-4")}<span>${esc(ui.flipHint)}</span></p>
        </div>
        ${tiles}
        ${askTile}
        ${moreButton(extraIds(items.length, visible, "services-x"), "col-span-2 md:col-span-4")}
      </div>
    </section>`;
    },

    // ─── GALLERY (lưới ô nhiều kích thước) ───────────
    gallerySection() {
      const gal = config.gallery || {};
      const items = gal.items || [];
      if (!items.length) return "";
      const visible = visibleCount(gal.mobileVisible, 4);
      // Chu kỳ 8 ô lấp kín lưới 2 cột (điện thoại) và 4 cột (máy tính) không để hở
      const SHAPES = ["wide", "sq", "tall", "sq", "tall", "sq", "sq", "wide"];

      // Chỉ hiện nút lọc của những loại có ảnh
      const used = new Set(items.map((it) => it.category));
      const cats = (gal.categories || []).filter((cat, i) => i === 0 || used.has(cat));
      const chips =
        cats.length > 2
          ? `<div class="chips" role="group" aria-label="Lọc ảnh theo loại">
            ${cats
              .map(
                (cat, i) =>
                  `<button type="button" class="chip-btn" data-filter="${i === 0 ? "*" : esc(cat)}" aria-pressed="${i === 0}">${esc(cat)}</button>`
              )
              .join("\n            ")}
          </div>`
          : "";

      const tiles = items
        .map((item, i) => {
          const shape = SHAPES[i % SHAPES.length];
          return `<div class="gal__item gal__item--${shape} pop" style="--i:${(i % 4) + 1}" data-category="${esc(item.category || "")}"${extra(i, visible, `gallery-x-${i + 1}`)}>
          <button type="button" class="tile tile--media tile--press gal__btn" data-lightbox="${esc(item.src || "")}" data-alt="${esc(item.alt || "")}" aria-label="Phóng to ảnh: ${esc(item.alt || "")}">
            ${pic({ src: item.src || "", alt: item.alt || "", cls: "tile__img", width: 1200, height: 900 }, item.category || "Ảnh", "ph--soft")}
            ${item.category ? `<span class="chip chip--paper gal__cat" aria-hidden="true">${esc(item.category)}</span>` : ""}
          </button>
        </div>`;
        })
        .join("\n        ");

      // Nút "Xem thêm" nằm ngoài lưới ảnh (lưới có hàng cao cố định theo bề rộng cột)
      return `<section id="gallery" class="sec sec--gallery" aria-labelledby="gallery-title">
      <div class="gal-wrap" data-collapse>
        <div class="board gal">
          <div class="tile sec-head sec-head--row gal__head pop" style="--i:0">
            <div>
              ${kicker(gal.sectionLabel || "Hình Ảnh")}
              <h2 id="gallery-title" class="h-sec">${lines(gal.heading)}</h2>
              ${gal.subheading ? `<p class="lead">${esc(gal.subheading)}</p>` : ""}
            </div>
            ${chips}
          </div>
          ${tiles}
        </div>
        ${moreButton(extraIds(items.length, visible, "gallery-x"), "gal__more")}
      </div>
    </section>`;
    },

    // ─── VIDEO ────────────────────────────────────────
    videosSection() {
      const vid = config.videos || {};
      const items = vid.items || [];
      const featured = vid.featured || {};
      if (!items.length && !featured.title) return "";
      const visible = visibleCount(vid.mobileVisible, 4);

      const tiles = items
        .map(
          (v, i) => `<div class="tile vid lg:col-span-4 pop" style="--i:${(i % 4) + 1}"${extra(i, visible, `videos-x-${i + 1}`)}>
          <button type="button" ${videoAttr(v.videoUrl)} class="vid__thumb tile--press">
            <span class="sr-only">Phát video: ${esc(v.title)}</span>
            ${pic({ src: v.thumbnail || "", alt: "", cls: "tile__img", width: 640, height: 360 }, "", "ph--soft")}
            <span class="badge badge--lime vid__play" aria-hidden="true">${icon("play", "w-4 h-4 ml-0.5")}</span>
            ${v.duration ? `<span class="chip chip--dark vid__time">${esc(v.duration)}</span>` : ""}
          </button>
          <h3 class="vid__title">${esc(v.title)}</h3>
        </div>`
        )
        .join("\n        ");

      return `<section id="videos" class="sec" aria-labelledby="videos-title">
      <div class="board" data-collapse>
        <div class="tile tile--ink sec-head col-span-2 md:col-span-4 lg:col-span-4 lg:row-span-2 pop" style="--i:0">
          ${kicker(vid.sectionLabel || "Video", "kicker--lime")}
          <h2 id="videos-title" class="h-sec">${lines(vid.heading)}</h2>
          ${vid.subheading ? `<p class="lead lead--ink">${esc(vid.subheading)}</p>` : ""}
          ${featured.title ? `<button type="button" ${videoAttr(featured.videoUrl)} class="pill pill--lime sec-head__btn">
            ${icon("play", "w-4 h-4")}<span><span class="sr-only">Phát video: </span>${esc(featured.title)}</span>${featured.duration ? `<span class="pill__meta">${esc(featured.duration)}</span>` : ""}
          </button>` : ""}
        </div>
        ${tiles}
        ${moreButton(extraIds(items.length, visible, "videos-x"), "col-span-2 md:col-span-4")}
      </div>
    </section>`;
    },

    // ─── GIỚI THIỆU ──────────────────────────────────
    aboutSection() {
      const about = config.about || {};
      const paragraphs = (about.story || "")
        .split(/\n\s*\n/)
        .filter((p) => p.trim())
        .map((p) => `<p>${lines(p.trim())}</p>`)
        .join("\n            ");
      // Có summary → story nằm sau nút mở; không có → hiện thẳng story
      const hasSummary = Boolean((about.summary || "").trim());

      return `<section id="about" class="sec" aria-labelledby="about-title">
      <div class="board">
        <figure class="tile tile--media about-photo md:col-span-2 lg:col-span-4 lg:row-span-2 pop" style="--i:0">
          ${pic(
            {
              src: about.portrait || "",
              mobileSrc: about.portraitMobile || "",
              alt: about.portraitAlt || "Ảnh chân dung",
              cls: "tile__img",
              width: 600,
              height: 800,
              mobileWidth: 400,
              mobileHeight: 500,
            },
            "Ảnh chân dung"
          )}
        </figure>
        <div class="tile tile--ink about-head md:col-span-2 lg:col-span-8 pop" style="--i:1">
          ${kicker(about.sectionLabel || "Về Tôi", "kicker--lime")}
          <h2 id="about-title" class="h-sec">${lines(about.heading)}</h2>
        </div>
        <div class="tile about-story col-span-2 md:col-span-4 lg:col-span-8 pop" style="--i:2">
          ${hasSummary ? `<p class="about-story__summary">${esc(about.summary)}</p>` : ""}
          ${paragraphs ? `<div id="about-story" class="prose${hasSummary ? " prose--more" : ""}"${hasSummary ? " data-story" : ""}>
            ${paragraphs}
          </div>` : ""}
          ${hasSummary && paragraphs ? `<button type="button" class="pill pill--ink story-btn" data-story-toggle aria-expanded="false" aria-controls="about-story" data-label-more="${esc(about.storyToggleLabel || "Đọc câu chuyện của tôi")}" data-label-less="${esc(ui.showLess)}">
            <span data-more-label>${esc(about.storyToggleLabel || "Đọc câu chuyện của tôi")}</span>${icon("arrowDown", "more__icon")}
          </button>` : ""}
        </div>
      </div>
    </section>`;
    },

    // ─── ĐỐI TÁC (một ô lớn chứa lưới logo tĩnh) ─────
    partnersSection() {
      const par = config.partners || {};
      const items = par.items || [];
      if (!items.length) return "";

      const logos = items
        .map(
          (p) => `<li class="logo-cell">
              ${pic({ src: p.logo || "", alt: p.name || "Đối tác", cls: "logo-cell__img", width: 200, height: 80 }, p.name || "Đối tác", "ph--name")}
            </li>`
        )
        .join("\n            ");

      return `<section id="partners" class="sec" aria-labelledby="partners-title">
      <div class="board">
        <div class="tile partners col-span-2 md:col-span-4 lg:col-span-12 pop" style="--i:0">
          <div class="partners__head">
            ${kicker(par.sectionLabel || "Đối Tác")}
            <h2 id="partners-title" class="h-sec h-sec--sm">${esc(par.heading || "Tin Tưởng Bởi")}</h2>
          </div>
          <ul class="partners__grid">
            ${logos}
          </ul>
        </div>
      </div>
    </section>`;
    },

    // ─── HỎI ĐÁP (khung chat) ────────────────────────
    faqSection() {
      const faq = config.faq || {};
      const items = faq.items || [];
      if (!items.length) return "";
      const visible = visibleCount(faq.mobileVisible, 3);
      const initial = (config.brand?.name || "MC").replace(/\[|\]/g, "").trim().charAt(0) || "M";

      const pairs = items
        .map(
          (q, i) => `<div class="chat__pair"${extra(i, visible, `faq-x-${i + 1}`)}>
              <dt class="bubble bubble--q"><span class="sr-only">Hỏi: </span>${esc(q.question)}</dt>
              <dd class="bubble bubble--a"><span class="sr-only">Trả lời: </span>${esc(q.answer)}</dd>
            </div>`
        )
        .join("\n            ");

      return `<section id="faq" class="sec" aria-labelledby="faq-title">
      <div class="board">
        <div class="tile tile--lime sec-head col-span-2 md:col-span-4 lg:col-span-4 pop" style="--i:0">
          ${kicker(faq.sectionLabel || "Hỏi Đáp")}
          <h2 id="faq-title" class="h-sec">${lines(faq.heading || "Câu Hỏi Thường Gặp")}</h2>
          <span class="sec-head__big" aria-hidden="true">?</span>
          <p class="chat-who"><span class="chat-who__avatar" aria-hidden="true">${esc(initial)}</span><span>${esc(config.brand?.name || "")}</span></p>
        </div>
        <div class="tile chat col-span-2 md:col-span-4 lg:col-span-8 pop" style="--i:1" data-collapse data-chat>
          <dl class="chat__list">
            ${pairs}
          </dl>
          ${moreButton(extraIds(items.length, visible, "faq-x"), "more--inline")}
          ${faq.subheading ? `<div class="bubble bubble--a chat__end">
            <p>${esc(faq.subheading)}</p>
            <a ${linkAttrs(h.zaloLink)} class="pill pill--ink">${icon("zalo", "w-5 h-5")}<span>Nhắn Zalo</span></a>
          </div>` : ""}
        </div>
      </div>
    </section>`;
    },

    // ─── LIÊN HỆ ──────────────────────────────────────
    contactSection() {
      const c = config.contact || {};
      const form = c.form || {};

      const channel = (href, iconName, label, value, cls = "", tone = "") => `<a ${linkAttrs(href)} class="tile tile--press channel ${tone} ${cls} pop">
          <span class="badge ${tone === "tile--lime" ? "badge--ink" : "badge--soft"}">${icon(iconName, "w-5 h-5")}</span>
          <span class="channel__label">${esc(label)}</span>
          <span class="channel__value">${esc(value)}</span>
        </a>`;

      const hasAddress = c.address && !isPlaceholder(c.address);
      const types = form.eventTypes || [];
      const radios = types
        .map(
          (t, i) => `<label class="radio-chip">
                <input type="radio" name="eventType" value="${esc(t)}"${i === 0 ? " checked" : ""}>
                <span>${esc(t)}</span>
              </label>`
        )
        .join("\n              ");

      return `<section id="contact" class="sec" aria-labelledby="contact-title">
      <div class="board">
        <div class="tile tile--ink sec-head col-span-2 md:col-span-4 lg:col-span-4 pop" style="--i:0">
          ${kicker(c.sectionLabel || "Liên Hệ", "kicker--lime")}
          <h2 id="contact-title" class="h-sec">${lines(c.heading)}</h2>
          ${c.subheading ? `<p class="lead lead--ink">${esc(c.subheading)}</p>` : ""}
        </div>
        ${channel(h.phoneLink, "phone", "Gọi ngay", h.phoneDisplay, "md:col-span-2 lg:col-span-2", "tile--lime")}
        ${channel(h.zaloLink, "zalo", "Zalo", "Chat Zalo", "md:col-span-2 lg:col-span-2")}
        ${channel(h.emailLink, "email", "Email", h.emailDisplay, "col-span-2 md:col-span-4 lg:col-span-4")}
        ${channel(h.facebookLink, "facebook", "Facebook", "Theo dõi Fanpage", "md:col-span-2 lg:col-span-2")}
        ${channel(h.youtubeLink, "youtube", "YouTube", "Xem kênh", "md:col-span-2 lg:col-span-2")}
        <div class="tile tile--soft info col-span-2 md:col-span-4 lg:col-span-4 pop">
          <p class="info__row">${icon("clock", "w-5 h-5 shrink-0")}<span><span class="info__label">Giờ làm việc</span>${esc(c.workingHours || "")}</span></p>
          ${hasAddress ? `<p class="info__row">${icon("location", "w-5 h-5 shrink-0")}<span><span class="info__label">Khu vực</span>${esc(c.address)}</span></p>` : ""}
        </div>

        <!-- Form yêu cầu báo giá (gửi qua email, không cần máy chủ) -->
        <form id="contact-form" data-email="${esc(h.emailRaw)}" class="tile form col-span-2 md:col-span-4 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:row-span-5 pop" style="--i:1" novalidate>
          <h3 class="form__title">${esc(form.heading || "Gửi Yêu Cầu Báo Giá")}</h3>
          ${form.note ? `<p class="lead">${esc(form.note)}</p>` : ""}
          <div class="form__grid">
            <div class="field">
              <label for="cf-name" class="field__label">Họ và tên *</label>
              <input id="cf-name" name="name" type="text" autocomplete="name" required class="field__input" placeholder="Nguyễn Văn A">
            </div>
            <div class="field">
              <label for="cf-phone" class="field__label">Số điện thoại *</label>
              <input id="cf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+ .]{9,15}" class="field__input" placeholder="0901 234 567">
            </div>
            ${types.length ? `<fieldset class="field field--full">
              <legend class="field__label">Loại sự kiện</legend>
              <div class="radio-chips">
              ${radios}
              </div>
            </fieldset>` : ""}
            <div class="field">
              <label for="cf-date" class="field__label">Ngày dự kiến</label>
              <input id="cf-date" name="date" type="date" class="field__input">
            </div>
            <div class="field field--full">
              <label for="cf-message" class="field__label">Nội dung</label>
              <textarea id="cf-message" name="message" rows="4" class="field__input" placeholder="Địa điểm, số lượng khách, mong muốn của bạn..."></textarea>
            </div>
          </div>
          <button type="submit" class="btn-ink">
            ${icon("send", "w-5 h-5")}<span>${esc(form.submitLabel || "Gửi Yêu Cầu")}</span>
          </button>
          <p data-form-status role="status" class="form__status"></p>
        </form>
      </div>
    </section>`;
    },

    // ─── FOOTER (hàng ô cuối trang) ──────────────────
    footerSection() {
      const f = config.footer || {};
      const social = [
        [h.facebookLink, "facebook", "Facebook"],
        [h.youtubeLink, "youtube", "YouTube"],
        [h.zaloLink, "zalo", "Zalo"],
        [h.emailLink, "email", "Email"],
      ]
        .map(([href, ic, label]) => `<a ${linkAttrs(href)} class="icon-btn icon-btn--soft" aria-label="${label}">${icon(ic, "w-5 h-5")}</a>`)
        .join("\n          ");

      return `<footer class="foot">
    <div class="board">
      <div class="tile tile--ink foot__brand col-span-2 md:col-span-2 lg:col-span-6">
        <p class="foot__name">${esc(config.brand?.name || "")}</p>
        <p class="foot__meta">${esc(f.madeWith || "")}</p>
        <p class="foot__meta">${esc(f.copyright || "")}</p>
      </div>
      <div class="tile foot__social ${f.backToTop ? "md:col-span-1 lg:col-span-3" : "col-span-2 md:col-span-2 lg:col-span-6"}">
        <p class="kicker">Kết nối</p>
        <div class="foot__icons">
          ${social}
        </div>
      </div>
      ${f.backToTop ? `<button type="button" class="tile tile--lime tile--press foot__top md:col-span-1 lg:col-span-3" data-top>
        <span class="badge badge--ink">${icon("arrowUp", "w-5 h-5")}</span>
        <span>Lên đầu trang</span>
      </button>` : ""}
    </div>
  </footer>`;
    },

    // ─── THANH TAB ĐÁY ────────────────────────────────
    tabBar() {
      const tb = config.tabBar || {};
      if (tb.enabled === false) return "";
      // Config cũ chưa có tabBar → lấy tạm từ menu
      const items = (tb.items || [
        { label: "Dịch vụ", href: "#services", icon: "mic" },
        { label: "Ảnh", href: "#gallery", icon: "image" },
        { label: "Video", href: "#videos", icon: "play" },
        { label: "Hồ sơ", href: "#about", icon: "user" },
      ]).slice(0, 4);
      const cta = tb.cta || { label: config.header?.ctaButton?.label || "Đặt lịch", href: "#contact" };

      const tabs = items
        .map(
          (t) => `<li><a ${linkAttrs(h.tabLink(t.href))} class="tab" data-tab>${icon(ICONS[t.icon] ? t.icon : "grid", "tab__icon")}<span class="tab__label">${esc(t.label)}</span></a></li>`
        )
        .join("\n      ");

      return `<nav id="tabbar" class="tabbar" aria-label="Điều hướng nhanh">
    <span class="tabbar__glow" aria-hidden="true"></span>
    <ul class="tabbar__list">
      ${tabs}
      <li><a ${linkAttrs(h.tabLink(cta.href))} class="tab tab--cta" data-tab>${icon("calendar", "tab__icon")}<span class="tab__label">${esc(cta.label || "Đặt lịch")}</span></a></li>
    </ul>
  </nav>`;
    },

    // ─── NÚT ZALO NỔI (máy tính bảng/máy tính) ────────
    floatingButton() {
      const fb = config.floatingButton || {};
      if (fb.enabled === false) return "";
      return `<a ${linkAttrs(h.floatingLink)} class="fab" aria-label="${esc(fb.label || "Chat Zalo")}">
    ${icon("zalo", "w-7 h-7")}
  </a>`;
    },

    // ─── TRÌNH PHÁT VIDEO + XEM ẢNH + THÔNG BÁO ──────
    overlays() {
      return `<div id="video-modal" class="overlay" role="dialog" aria-modal="true" aria-label="Trình phát video" hidden>
    <div class="overlay__box overlay__box--video">
      <button type="button" data-close class="icon-btn icon-btn--paper overlay__close" aria-label="${esc(ui.closeLabel)} video">${icon("close", "w-6 h-6")}</button>
      <div data-player class="overlay__player"></div>
    </div>
  </div>

  <div id="lightbox" class="overlay" role="dialog" aria-modal="true" aria-label="Xem ảnh" hidden>
    <button type="button" data-close class="icon-btn icon-btn--paper overlay__close overlay__close--fixed" aria-label="${esc(ui.closeLabel)}">${icon("close", "w-6 h-6")}</button>
    <figure class="overlay__figure">
      <img alt="" class="overlay__img" decoding="async">
      <figcaption class="overlay__caption"><span data-caption></span><span data-count class="chip chip--paper"></span></figcaption>
    </figure>
    <div class="overlay__nav">
      <button type="button" data-prev class="icon-btn icon-btn--paper" aria-label="Ảnh trước">${icon("arrowLeft", "w-6 h-6")}</button>
      <button type="button" data-next class="icon-btn icon-btn--paper" aria-label="Ảnh sau">${icon("arrowRight", "w-6 h-6")}</button>
    </div>
  </div>

  <p id="toast" class="toast" role="status" aria-live="polite" data-video-missing-text="${esc(ui.videoMissing)}"></p>`;
    },
  };
}

// ─── RENDER PAGE ────────────────────────────────────────

/**
 * Ghép template + config → HTML hoàn chỉnh
 * @param {string} template — Nội dung index.html (file khung)
 * @param {object} config — SITE_CONFIG
 * @returns {{ html: string, missing: string[] }}
 */
export function renderPage(template, config) {
  const renderers = createRenderers(config);
  const missing = [];

  // Xóa comment hướng dẫn ở đầu file
  let html = template.replace(/<!--\s*ĐÂY LÀ FILE KHUNG[\s\S]*?-->\s*\n?/, "");

  // 1) Thay thế renderer blocks: {{{ @tenRenderer }}}
  html = html.replace(/\{\{\{\s*@(\w+)\s*\}\}\}/g, (match, name) => {
    if (typeof renderers[name] === "function") {
      return renderers[name]();
    }
    missing.push(`@${name}`);
    return "";
  });

  // 2) Thay thế giá trị: {{ duong.dan }}
  html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
    const val = path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), config);
    if (val === undefined || val === null || typeof val === "object") {
      missing.push(path);
      return "";
    }
    return esc(String(val));
  });

  return { html, missing };
}
