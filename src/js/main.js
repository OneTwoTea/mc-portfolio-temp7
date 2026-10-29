/**
 * ═══════════════════════════════════════════════════════════
 *  MAIN.JS — JavaScript phía trình duyệt (giao diện "Bento Board")
 *  Ô bật lên khi cuộn, thanh tab đáy, bảng mục lục, ô lật dịch vụ,
 *  thu gọn "Xem thêm", lọc + xem ảnh, trình phát video, khung chat, form
 * ═══════════════════════════════════════════════════════════
 */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smooth = prefersReduced ? "auto" : "smooth";
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  // ─── KHÓA CUỘN TRANG (mục lục, xem ảnh, video) ─────────
  let lockCount = 0;
  function lockScroll() {
    if (lockCount++ === 0) document.documentElement.style.overflow = "hidden";
  }
  function unlockScroll() {
    if (lockCount > 0 && --lockCount === 0) document.documentElement.style.overflow = "";
  }

  /** Giữ phím Tab chạy vòng trong hộp thoại đang mở */
  function trapTab(container, e) {
    if (e.key !== "Tab") return;
    const items = Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => el.getClientRects().length);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /** Mở / đóng lớp phủ (có hiệu ứng mờ dần, sau đó gắn lại [hidden]) */
  function showLayer(el) {
    clearTimeout(el._hideTimer);
    el.hidden = false;
    void el.offsetWidth; // ép trình duyệt vẽ trạng thái đầu trước khi thêm class
    el.classList.add("is-open");
  }
  function hideLayer(el, delay = 320) {
    el.classList.remove("is-open");
    el._hideTimer = setTimeout(() => (el.hidden = true), prefersReduced ? 0 : delay);
  }

  // ─── THÔNG BÁO NHỎ ─────────────────────────────────────
  function toast(message) {
    const el = document.getElementById("toast");
    if (!el || !message) return;
    el.textContent = message;
    el.classList.add("is-on");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("is-on"), 3800);
  }

  // ─── Ô "BẬT" LÊN KHI CUỘN TỚI ──────────────────────────
  function initPop() {
    const els = document.querySelectorAll(".pop");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  // ─── THU GỌN / "XEM THÊM (N)" ──────────────────────────
  function initCollapse() {
    document.querySelectorAll("[data-more]").forEach((btn) => {
      const box = btn.closest("[data-collapse]");
      const label = btn.querySelector("[data-more-label]");
      if (!box) return;

      btn.addEventListener("click", () => {
        const open = !box.classList.contains("is-open");
        box.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
        if (label) label.textContent = open ? btn.dataset.labelLess : btn.dataset.labelMore;
        box.dispatchEvent(new CustomEvent("collapse:toggle", { detail: { open } }));
        // Thu gọn lại → giữ nút trong tầm nhìn để không bị "mất chỗ"
        if (!open) btn.scrollIntoView({ block: "nearest", behavior: smooth });
      });
    });
  }

  // ─── CÂU CHUYỆN ĐẦY ĐỦ (GIỚI THIỆU) ────────────────────
  function initStory() {
    const btn = document.querySelector("[data-story-toggle]");
    const story = document.querySelector("[data-story]");
    if (!btn || !story) return;
    const label = btn.querySelector("[data-more-label]");
    btn.addEventListener("click", () => {
      const open = !story.classList.contains("is-open");
      story.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? btn.dataset.labelLess : btn.dataset.labelMore;
    });
  }

  // ─── Ô LẬT DỊCH VỤ ─────────────────────────────────────
  function initFlip() {
    const cards = Array.from(document.querySelectorAll("[data-flip]"));
    if (!cards.length) return;

    function setFlipped(card, flipped, moveFocus) {
      const front = card.querySelector(".flip__front");
      const back = card.querySelector(".flip__back");
      const openBtn = card.querySelector("[data-flip-open]");
      card.classList.toggle("is-flipped", flipped);
      openBtn?.setAttribute("aria-expanded", String(flipped));
      // Mặt đang úp không được bấm/đọc tới
      if (front) front.inert = flipped;
      if (back) back.inert = !flipped;
      if (moveFocus) (flipped ? back : openBtn)?.focus({ preventScroll: true });
    }

    cards.forEach((card) => {
      setFlipped(card, false, false);
      card.querySelector("[data-flip-open]")?.addEventListener("click", () => {
        // Chỉ lật một ô mỗi lần
        cards.forEach((c) => c !== card && c.classList.contains("is-flipped") && setFlipped(c, false, false));
        setFlipped(card, true, true);
      });
      card.querySelector("[data-flip-close]")?.addEventListener("click", () => setFlipped(card, false, true));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && card.classList.contains("is-flipped")) setFlipped(card, false, true);
      });
    });
  }

  // ─── LỌC ẢNH ───────────────────────────────────────────
  function initGalleryFilter() {
    const board = document.querySelector(".gal");
    if (!board) return;
    const box = board.closest("[data-collapse]") || board;
    const btns = board.querySelectorAll("[data-filter]");
    const items = board.querySelectorAll("[data-category]");

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        btns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        items.forEach((item) => {
          const show = filter === "*" || item.dataset.category === filter;
          item.hidden = !show;
          if (show) item.classList.add("is-in");
        });
        // Đang lọc → hiện đủ ảnh của loại đó, ẩn nút "Xem thêm"
        box.classList.toggle("is-filtered", filter !== "*");
      });
    });
  }

  // ─── XEM ẢNH LỚN (vuốt trái/phải) ──────────────────────
  function initLightbox() {
    const overlay = document.getElementById("lightbox");
    if (!overlay) return;

    const img = overlay.querySelector("img");
    const caption = overlay.querySelector("[data-caption]");
    const count = overlay.querySelector("[data-count]");
    const closeBtn = overlay.querySelector("[data-close]");
    const allItems = Array.from(document.querySelectorAll("[data-lightbox]"));
    let visible = [];
    let current = 0;
    let opener = null;
    let touchX = 0;

    function show(index) {
      if (!visible.length) return;
      current = (index + visible.length) % visible.length;
      const item = visible[current];
      img.classList.remove("is-broken");
      img.src = item.dataset.lightbox;
      img.alt = item.dataset.alt || "";
      caption.textContent = item.dataset.alt || "";
      if (count) count.textContent = `${current + 1} / ${visible.length}`;
    }

    function open(item) {
      // Chỉ duyệt các ảnh đang hiện theo bộ lọc
      visible = allItems.filter((el) => !el.closest("[data-category]")?.hidden);
      opener = item;
      show(Math.max(0, visible.indexOf(item)));
      showLayer(overlay);
      lockScroll();
      closeBtn?.focus();
    }

    function close() {
      if (overlay.hidden) return;
      hideLayer(overlay);
      unlockScroll();
      opener?.focus({ preventScroll: true });
    }

    allItems.forEach((item) => item.addEventListener("click", () => open(item)));
    closeBtn?.addEventListener("click", close);
    overlay.querySelector("[data-prev]")?.addEventListener("click", () => show(current - 1));
    overlay.querySelector("[data-next]")?.addEventListener("click", () => show(current + 1));
    img.addEventListener("error", () => img.classList.add("is-broken"));

    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
      else trapTab(overlay, e);
    });

    // Bấm ra vùng tối để đóng
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("overlay__figure")) close();
    });

    overlay.addEventListener("touchstart", (e) => (touchX = e.changedTouches[0].clientX), { passive: true });
    overlay.addEventListener(
      "touchend",
      (e) => {
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) show(current + (diff > 0 ? 1 : -1));
      },
      { passive: true }
    );
  }

  // ─── TRÌNH PHÁT VIDEO (chỉ tải khi bấm) ────────────────
  function toEmbed(url) {
    try {
      const u = new URL(url, location.href);
      let id = "";
      if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
      else if (u.hostname.includes("youtube")) id = u.searchParams.get("v") || u.pathname.split("/").pop();
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    } catch (_) {
      /* bỏ qua */
    }
    return url;
  }

  function initVideoPlayer() {
    const modal = document.getElementById("video-modal");
    const missingText = document.getElementById("toast")?.dataset.videoMissingText;

    // Video chưa có link → báo nhỏ + chuyển tới phần liên hệ
    document.querySelectorAll("[data-video-missing]").forEach((el) =>
      el.addEventListener("click", () => {
        toast(missingText);
        document.getElementById("contact")?.scrollIntoView({ behavior: smooth });
      })
    );

    if (!modal) return;
    const player = modal.querySelector("[data-player]");
    const closeBtn = modal.querySelector("[data-close]");
    let opener = null;

    function open(el) {
      const url = el.dataset.video;
      opener = el;
      player.innerHTML = "";
      if (/\.(mp4|webm)(\?|$)/i.test(url)) {
        // Video tự host trong public/videos/
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.className = "w-full h-full";
        player.appendChild(video);
      } else {
        const iframe = document.createElement("iframe");
        iframe.src = toEmbed(url);
        iframe.title = el.getAttribute("aria-label") || "Video";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.className = "w-full h-full";
        player.appendChild(iframe);
      }
      showLayer(modal);
      lockScroll();
      closeBtn?.focus();
    }

    function close() {
      if (modal.hidden) return;
      hideLayer(modal);
      player.innerHTML = ""; // dừng phát
      unlockScroll();
      opener?.focus({ preventScroll: true });
    }

    document.querySelectorAll("[data-video]").forEach((el) => el.addEventListener("click", () => open(el)));
    closeBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      else trapTab(modal, e);
    });
  }

  // ─── THANH TAB ĐÁY (tab đang xem tự sáng) ──────────────
  function initTabbar() {
    const bar = document.getElementById("tabbar");
    if (!bar) return;
    const glow = bar.querySelector(".tabbar__glow");
    const tabs = Array.from(bar.querySelectorAll("[data-tab]"));
    const targets = tabs
      .map((tab) => {
        const id = (tab.getAttribute("href") || "").startsWith("#") ? tab.getAttribute("href").slice(1) : "";
        const section = id && document.getElementById(id);
        return section ? { tab, section } : null;
      })
      .filter(Boolean);
    let current = null;

    function moveGlow() {
      if (!glow) return;
      if (!current || current.classList.contains("tab--cta")) {
        glow.style.setProperty("--o", "0");
        return;
      }
      const barBox = bar.getBoundingClientRect();
      const box = current.getBoundingClientRect();
      glow.style.setProperty("--x", `${box.left - barBox.left}px`);
      glow.style.setProperty("--w", `${box.width}px`);
      glow.style.setProperty("--o", "1");
    }

    function setActive(tab) {
      if (tab === current) return;
      current = tab;
      tabs.forEach((t) => (t === tab ? t.setAttribute("aria-current", "location") : t.removeAttribute("aria-current")));
      moveGlow();
    }

    let ticking = false;
    function update() {
      ticking = false;
      const line = window.innerHeight * 0.4;
      const hit = targets.find(({ section }) => {
        const r = section.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      setActive(hit ? hit.tab : null);
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", moveGlow);
    tabs.forEach((tab) => tab.addEventListener("click", () => targets.some((t) => t.tab === tab) && setActive(tab)));
    requestAnimationFrame(update); // đo vị trí sau khung hình đầu, tránh ép trình duyệt tính bố cục sớm

    // Điện thoại: bàn phím ảo mở → ẩn thanh tab để không che ô nhập
    if (window.matchMedia("(pointer: coarse)").matches) {
      const form = document.getElementById("contact-form");
      form?.addEventListener("focusin", (e) => {
        if (e.target.matches("input:not([type=radio]), textarea, select")) bar.classList.add("is-hidden");
      });
      form?.addEventListener("focusout", () => bar.classList.remove("is-hidden"));
    }
  }

  // ─── BẢNG MỤC LỤC ──────────────────────────────────────
  function initMenuSheet() {
    const btn = document.getElementById("menu-toggle");
    const sheet = document.getElementById("menu-sheet");
    if (!btn || !sheet) return;
    const panel = sheet.querySelector(".sheet__panel");

    function open() {
      showLayer(sheet);
      btn.setAttribute("aria-expanded", "true");
      lockScroll();
      (sheet.querySelector(".sheet__link") || sheet.querySelector("button"))?.focus({ preventScroll: true });
    }

    function close(returnFocus) {
      if (sheet.hidden) return;
      hideLayer(sheet, 450);
      btn.setAttribute("aria-expanded", "false");
      unlockScroll();
      if (returnFocus) btn.focus({ preventScroll: true });
    }

    btn.addEventListener("click", () => (sheet.hidden ? open() : close(true)));
    sheet.querySelectorAll("[data-sheet-close]").forEach((el) => el.addEventListener("click", () => close(true)));
    // Chọn một mục → đóng bảng, trình duyệt tự cuộn tới mục đó
    panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => close(false)));
    sheet.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close(true);
      else trapTab(panel, e);
    });
  }

  // ─── KHUNG CHAT HỎI ĐÁP ────────────────────────────────
  function initChat() {
    const chat = document.querySelector("[data-chat]");
    if (!chat || prefersReduced || !("IntersectionObserver" in window)) return;

    const bubbles = () => Array.from(chat.querySelectorAll(".bubble:not(.bubble--typing)"));
    const timers = [];
    let started = false;
    chat.classList.add("is-armed");

    function finish() {
      timers.forEach(clearTimeout);
      chat.querySelectorAll(".bubble--typing").forEach((t) => t.remove());
      bubbles().forEach((b) => b.classList.add("is-shown"));
    }

    function play() {
      started = true;
      // Chỉ diễn hoạt cảnh cho các cặp đang hiện; phần bị thu gọn hiện ngay khi mở
      const pairs = Array.from(chat.querySelectorAll(".chat__pair")).filter((p) => p.getClientRects().length);
      let t = 0;
      pairs.forEach((pair) => {
        const q = pair.querySelector(".bubble--q");
        const a = pair.querySelector(".bubble--a");
        timers.push(setTimeout(() => q?.classList.add("is-shown"), t));
        t += 260;
        timers.push(
          setTimeout(() => {
            const dots = document.createElement("div");
            dots.className = "bubble bubble--a bubble--typing";
            dots.setAttribute("aria-hidden", "true");
            dots.innerHTML = "<i></i><i></i><i></i>";
            a?.before(dots);
          }, t)
        );
        t += 520;
        timers.push(
          setTimeout(() => {
            pair.querySelector(".bubble--typing")?.remove();
            a?.classList.add("is-shown");
          }, t)
        );
        t += 220;
      });
      timers.push(setTimeout(finish, t + 200));
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(chat);
    chat.addEventListener("collapse:toggle", finish);
  }

  // ─── NÚT "HỎI LỊCH DỊCH VỤ NÀY" → điền sẵn form ────────
  function initServiceAsk() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const radios = Array.from(form.querySelectorAll('input[name="eventType"]'));
    const message = form.elements.message;

    document.querySelectorAll("[data-service]").forEach((link) =>
      link.addEventListener("click", () => {
        const service = link.dataset.service || "";
        if (message && !message.value.trim()) message.value = `Tôi quan tâm dịch vụ: ${service}. `;
        // Chọn sẵn loại sự kiện nếu khớp rõ ràng đúng 1 loại
        const key = service.toLowerCase().replace(/^mc\s+/, "").replace(/^lễ\s+/, "");
        const hits = radios.filter((r) => {
          const v = r.value.toLowerCase().split(" / ")[0];
          return v.includes(key) || key.includes(v);
        });
        if (hits.length === 1) hits[0].checked = true;
      })
    );
  }

  // ─── FORM LIÊN HỆ (mở ứng dụng email, không cần máy chủ) ─
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const status = form.querySelector("[data-form-status]");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();

      if (!name || !phone || !form.elements.phone.checkValidity()) {
        status.textContent = "Vui lòng nhập họ tên và số điện thoại hợp lệ.";
        (name ? form.elements.phone : form.elements.name).focus();
        return;
      }

      const email = form.dataset.email;
      if (!email) {
        status.textContent = "Kênh email đang được cập nhật — vui lòng gọi điện hoặc nhắn Zalo giúp mình nhé!";
        return;
      }

      const body = [
        `Họ tên: ${name}`,
        `Điện thoại: ${phone}`,
        `Loại sự kiện: ${data.get("eventType") || ""}`,
        `Ngày dự kiến: ${data.get("date") || ""}`,
        "",
        String(data.get("message") || ""),
      ].join("\n");
      const subject = `Yêu cầu báo giá MC — ${name}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Đang mở ứng dụng email của bạn...";
    });
  }

  // ─── Ô "LÊN ĐẦU TRANG" ─────────────────────────────────
  function initBackToTop() {
    document.querySelectorAll("[data-top]").forEach((btn) =>
      btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: smooth });
        document.querySelector(".brand")?.focus({ preventScroll: true });
      })
    );
  }

  // ─── INIT ─────────────────────────────────────────────
  initPop();
  initCollapse();
  initStory();
  initFlip();
  initGalleryFilter();
  initLightbox();
  initVideoPlayer();
  initTabbar();
  initMenuSheet();
  initChat();
  initServiceAsk();
  initContactForm();
  initBackToTop();
})();
