# MC Portfolio — Giao diện "Bento Board" (Temp7)

Website một trang cho MC sự kiện. **Cả trang là một bảng ô (bento)** trên nền xám bê tông:
ô trắng, ô đen và ô xanh chanh xếp khít nhau như màn hình ứng dụng điện thoại.

- **Màn hình đầu** là bảng ô: ảnh MC, tên, ô "đang nhận lịch", tiêu đề, ô **Đặt lịch qua Zalo**, ô **Showreel** và 4 ô số liệu.
- **Thanh tab nổi ở đáy màn hình** (Dịch vụ · Ảnh · Video · Hồ sơ · **Đặt lịch**) tự sáng theo phần đang xem.
- Nút **Mục lục** ở ô đầu trang mở bảng ô trượt lên từ đáy.
- **Cảm nhận** đặt ngay sau màn hình đầu, ô tiêu đề tự tính điểm trung bình.
- **Dịch vụ**: mỗi dịch vụ là một ô ảnh, chạm vào thì **ô lật mặt** để xem mô tả + nút hỏi lịch (form tự điền sẵn).
- **Gallery**: lưới ô ngang / vuông / dọc xen kẽ, có nút lọc, bấm để phóng to, vuốt để chuyển ảnh.
- **Hỏi đáp** hiện dạng **khung chat** (câu hỏi bên phải, MC trả lời bên trái).
- **Liên hệ**: ô Gọi / Zalo / Email / Facebook / YouTube + form báo giá (chọn loại sự kiện bằng nút tròn).

Công nghệ: HTML + Tailwind CSS v4 + JavaScript thuần — không framework, không bundler.
Toàn bộ nội dung nằm trong **một file duy nhất: `site.config.js`**.

---

## Sửa nội dung (không cần biết code)

### Bước 1 — Cài đặt (làm một lần)

1. Cài **Node.js** bản 20 trở lên tại https://nodejs.org (chọn bản LTS).
2. Mở thư mục `Temp7` trong VS Code → menu **Terminal → New Terminal**.
3. Gõ `npm install` rồi Enter. Chờ chạy xong.

### Bước 2 — Mở file nội dung

Chỉ mở **`site.config.js`**. Không cần mở `index.html`, `src/` hay `dist/`.
File chia thành các mục đánh số (`// ─── 4. HERO ───`, `// ─── 6. DỊCH VỤ ───`…), mỗi mục có ghi chú
mục đó hiện ở đâu trên trang và ảnh cần kích thước bao nhiêu.

### Bước 3 — Sửa chữ

- Chỉ sửa phần chữ **nằm giữa hai dấu ngoặc kép** `"..."`.
- Thay các chữ `[IN_HOA]` bằng thông tin thật, VD: `phone: "[SO_DIEN_THOAI]"` → `phone: "0901 234 567"`.
- Muốn xuống dòng trong tiêu đề: gõ `\n` (VD `"Khoảnh Khắc Đáng Nhớ\nBắt Đầu Từ Sân Khấu"`).
- Trong chữ cần dấu ngoặc kép → dùng `“ ”` thay cho `"`.

### Bước 4 — Thay ảnh

1. Đặt ảnh vào đúng thư mục trong `public/images/` (bảng bên dưới), tên viết thường, không dấu, có số: `service-01.webp`.
2. Ghi đường dẫn trong `site.config.js` dạng `public/images/...` (**không** có dấu `/` ở đầu).
3. Muốn điện thoại tải ảnh nhẹ hơn: đặt thêm một bản nhỏ **cùng tên, thêm đuôi `-m`** bên cạnh
   (VD `service-01.webp` + `service-01-m.webp`). Trang **tự dùng** bản `-m` trên điện thoại, không cần khai báo.
4. Ảnh chưa có → trang tự hiện ô xám có sọc đúng tỉ lệ, không bị vỡ. Build sẽ liệt kê file còn thiếu.

### Bước 5 — Thêm / bớt mục

Các danh sách (dịch vụ, video, ảnh, đối tác, cảm nhận, hỏi đáp) là các khối `{ ... },` nằm trong `items: [ ... ]`.

- **Thêm**: copy nguyên một khối từ `{` đến `},` rồi dán ngay bên dưới, sửa nội dung.
- **Bớt**: xóa cả khối từ `{` đến `},`.
- Danh sách rỗng (`items: []`) → cả mục đó tự ẩn.

### Bước 6 — Đổi số mục hiện sẵn trên điện thoại

Trên điện thoại, danh sách dài được thu gọn, phần còn lại nằm sau nút **"Xem thêm (N)"**.
Đổi số mục hiện sẵn bằng key `mobileVisible` ở từng khu vực:

| Khu vực | Key | Mặc định |
|---|---|---|
| Cảm nhận | `testimonials.mobileVisible` | 2 |
| Dịch vụ | `services.mobileVisible` | 4 |
| Gallery | `gallery.mobileVisible` | 4 (nên để 4 hoặc 8 để lưới ảnh không hở ô) |
| Video | `videos.mobileVisible` | 4 |
| Hỏi đáp | `faq.mobileVisible` | 3 |

Từ màn hình 1024px trở lên luôn hiện đủ. Không có JavaScript thì cũng hiện đủ.

### Bước 7 — Build và xem thử

- `npm run build` → tạo bản chính thức trong `dist/`.
- `npm run dev` → mở http://localhost:5173, tự build lại mỗi khi bạn lưu file.

Đọc thông báo trong terminal:
- **Cảnh báo vàng**: ảnh khai báo nhưng chưa có file, placeholder `[IN_HOA]` chưa thay. Trang vẫn chạy.
- **Lỗi đỏ**: thường do gõ sai cú pháp — xem mục "Lỗi hay gặp" bên dưới.

### Bước 8 — Xem trên điện thoại

1. Máy tính và điện thoại **cùng một mạng Wi-Fi**.
2. Chạy `npm run dev`, terminal in thêm dòng **"Mạng LAN (điện thoại): http://192.168.x.x:5173/"**.
3. Mở địa chỉ đó bằng trình duyệt trên điện thoại (hoặc gửi qua Zalo cho chính mình rồi bấm).

### Bước 9 — Đưa lên GitHub Pages

1. Tạo repo trên GitHub (VD `mc-portfolio`), đẩy toàn bộ thư mục lên nhánh `main`.
2. Trên GitHub: **Settings → Pages → Source: GitHub Actions**.
3. Mỗi lần đẩy code lên `main`, workflow `.github/workflows/deploy.yml` tự build và đăng trang
   (hoặc vào tab **Actions** bấm chạy tay).
4. Lấy link trang (VD `https://ten-ban.github.io/mc-portfolio/`) điền vào `seo.url` để ảnh chia sẻ Zalo/Facebook hiện đúng.

### Lỗi hay gặp

| Triệu chứng | Nguyên nhân thường gặp |
|---|---|
| `SyntaxError: Unexpected token` | Thiếu dấu phẩy `,` ở cuối dòng hoặc cuối khối `{ ... }` |
| `Unterminated string` | Thiếu một dấu ngoặc kép `"` |
| `Unexpected end of input` | Xóa nhầm dấu `}` hoặc `]` — số dấu mở và đóng phải bằng nhau |
| Ảnh không hiện | Sai đường dẫn (có `/` ở đầu, sai chữ hoa/thường, sai đuôi `.webp`/`.jpg`) |
| Nút bấm nhảy về mục Liên hệ | Link còn là placeholder `[ZALO_LINK]`… — thay bằng link thật |

---

## Các key mới của giao diện này

Được **thêm** vào `site.config.js` (không đổi tên key cũ). Xóa đi trang vẫn chạy với chữ mặc định,
nên file config của Temp khác copy sang vẫn dùng được.

| Key | Tác dụng |
|---|---|
| `ui.*` | Chữ trên nút "Xem thêm", "Thu gọn", "Mục lục", "Đóng", gợi ý lật ô, thông báo video chưa có |
| `hero.image.mobile` / `hero.image.desktop` | Ảnh ô MC trong bảng hero (dùng thay `backgroundMobile/Desktop`) |
| `hero.imagePosition` | Điểm lấy nét ảnh hero (đặt vào khuôn mặt) |
| `hero.availability` | Ô "đang nhận lịch" có chấm nhấp nháy (để `""` thì ẩn) |
| `about.summary`, `about.storyToggleLabel` | Tóm tắt luôn hiện + chữ nút mở câu chuyện đầy đủ |
| `services.askLabel`, `services.askMore` | Chữ nút hỏi lịch ở mặt sau ô lật + ô "sự kiện khác" cuối danh sách |
| `*.mobileVisible` | Số mục hiện sẵn trên điện thoại (xem Bước 6) |
| `faq` | Mục Hỏi đáp dạng khung chat |
| `tabBar` | Các tab ở thanh đáy (3–4 tab + ô "Đặt lịch") |

Các key `hero.scrollIndicator` vẫn giữ để tương thích nhưng giao diện này không dùng.
`about.stats` hiện thành 4 ô số liệu trong bảng hero.

## Placeholder cần thay

| Placeholder | Ý nghĩa / ví dụ |
|---|---|
| `[TEN_MC]` | Tên MC / thương hiệu |
| `[SO_NAM_KINH_NGHIEM]`, `[SO_SU_KIEN]` | Số liệu, VD `8`, `500` |
| `[SO_DIEN_THOAI]` | `0901 234 567` (tự tạo link `tel:`) |
| `[ZALO_LINK]` | `https://zalo.me/0901234567` |
| `[EMAIL]` | Email nhận yêu cầu báo giá từ form |
| `[FACEBOOK_LINK]`, `[YOUTUBE_LINK]` | Link trang cá nhân |
| `[YOUTUBE_SHOWREEL_URL]`, `[YOUTUBE_VIDEO_01..04]` | Link YouTube hoặc `public/videos/xxx.mp4` |
| `[WEBSITE_URL]` | URL website sau khi deploy (cần cho ảnh chia sẻ Facebook/Zalo) |
| `[DIA_CHI]` | Khu vực hoạt động (còn placeholder thì ô này tự ẩn) |

## Ảnh

Ảnh sự kiện thật đã được cắt + chuyển `.webp` sẵn cho hero, giới thiệu, dịch vụ, video, gallery và ảnh chia sẻ.
**Còn thiếu**: logo đối tác và avatar khách hàng (đang hiện tên công ty / chữ cái đầu).

| Thư mục / file | Điện thoại | Máy tính |
|---|---|---|
| `hero/hero-01-m.webp`, `hero/hero-01.webp` | 600×750 (4:5) | 900×1200 (3:4) |
| `about/portrait-mobile.webp`, `about/portrait.webp` | 400×500 (4:5) | 600×800 (3:4) |
| `services/service-01..06.webp` (+ `-m`) | 480×480 | 640×640 (vuông) |
| `videos/showreel-thumb.webp` (+ `-m`) | 800×450 | 1280×720 |
| `videos/video-01..04.webp` (+ `-m`) | 480×270 | 640×360 |
| `gallery/gallery-01..08.webp` (+ `-m`) | 720×540 / 540×720 | 1200×900 (ngang) / 900×1200 (dọc) |
| `partners/partner-01..06.webp` *(chưa có)* | 200×80, nền trong suốt | dùng chung |
| `testimonials/avatar-01..04.webp` *(chưa có)* | 100×100 vuông | dùng chung |
| `og/og-cover.jpg` | 1200×630 JPG (ảnh khi chia sẻ link) | — |
| `public/videos/*.mp4` | (tùy chọn) video tự host, H.264 | dùng chung |

## Các lệnh

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Build (không minify), server http://localhost:5173 + địa chỉ LAN, tự build lại khi sửa `index.html`, `site.config.js`, `src/`, `public/` |
| `npm run build` | Build bản chính thức (CSS minify) vào `dist/` |
| `npm run preview` | Chỉ phục vụ `dist/` đang có, không build |
| `node scripts/build.mjs --html-only` | Chỉ ghép HTML, bỏ qua CSS (nhanh) |

- Đổi cổng: `PORT=3000 npm run dev` (PowerShell: `$env:PORT=3000; npm run dev`).
- Giả lập GitHub Pages dạng project: `npm run dev -- --base=/mc-portfolio/` rồi mở http://localhost:5173/mc-portfolio/.
- Windows báo lỗi "running scripts is disabled": dùng `npm.cmd run dev` thay cho `npm run dev`.

## Giao diện

| | |
|---|---|
| Nền | xám bê tông `#E5E6E1`, ô trắng `#FFFFFF`, ô đen `#111214` |
| Điểm nhấn | xanh chanh acid `#CBF23D` (chữ đen trên chanh 14.6:1) |
| Font | Space Grotesk 500/700 (tiêu đề, con số) · Manrope 400/600 (nội dung) |
| Hiệu ứng | ô "bật" lên lệch nhịp khi cuộn tới, ô dịch vụ lật 3D, mảng sáng trượt theo tab đang xem, bong bóng chat hiện lần lượt |

Màu và font khai báo một lần trong `@theme` của `src/input.css`. Người dùng bật "giảm chuyển động" trên máy
sẽ không thấy hiệu ứng (ô lật đổi mặt bằng ẩn/hiện).

## Cấu trúc thư mục

```
├── site.config.js        # NỘI DUNG website (sửa ở đây)
├── index.html            # Khung HTML (template)
├── src/
│   ├── templates.js      # Bộ render: config → HTML (các ô bento)
│   ├── input.css         # CSS nguồn Tailwind v4 (màu, font trong @theme)
│   └── js/main.js        # JS phía trình duyệt (tab đáy, mục lục, ô lật, gallery, video, chat, form)
├── public/               # icons/, images/<khu-vuc>/, videos/
├── scripts/
│   ├── build.mjs         # Build → dist/
│   └── dev.mjs           # Server phát triển (cổng 5173, có địa chỉ LAN)
└── .github/workflows/deploy.yml
```
