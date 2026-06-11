# Nexovias — Ana Website AI Sistemi

## Proje Genel Bakış
**Nexovias** — AI Revenue Intelligence Platform için tek sayfalık kurumsal web sitesi.

- **Dosya yapısı:** Tek dosya `index.html` (inline CSS + JS + Tailwind CDN)
- **Dil:** İngilizce (içerik), Türkçe (geliştirici notları)
- **Framework:** Vanilla HTML/CSS/JS + TailwindCSS (CDN)
- **API:** Yok — statik sayfa

## Tasarım Sistemi: "Kinetic Cybernetics"

Tam tasarım sistemi referansı: `DESIGN (1).md`

### Renkler
```
--primary:   #00FFC2  (Neon Yeşil — CTA, vurgu, aktif state)
--secondary: #00D1FF  (Neon Cyan — ikincil aksiyon, data viz)
--bg:        #000000  (Saf siyah arka plan)
--card:      #080808  (Kart/konteyner arka planı)
--border:    rgba(255,255,255,0.07)   (Standart border)
--border-active: rgba(0,255,194,0.35) (Hover/aktif border)
--text:      #FFFFFF
--text-dim:  rgba(255,255,255,0.55)
```

### Tipografi
- **Başlıklar (h1-h4):** Plus Jakarta Sans
- **Gövde metni:** Hanken Grotesk
- **Mono/label/chip:** Geist

### CSS Sınıf Sistemi
```
.btn-p      → Primary buton (solid #00FFC2)
.btn-o      → Outline buton (transparent + border)
.card       → Kart konteyner (#080808, 12px radius)
.inp        → Input alanı (dark, focus glow)
.slabel     → Section label (Geist, uppercase, primary renk)
.nav-a      → Navigation linki
.ftab       → Filter tab (Geist, monospace)
.dot-bg     → Nokta matris arka plan deseni (24px grid)
.mono       → Geist font utility
```

### Tasarım Prensipleri
- **Elevation:** Shadow yerine tonal katmanlama + neon glow efektleri
- **Border radius:** 4px buton/input, 8-12px kart/modal
- **Spacing:** 8px ölçek sistemi (8, 16, 24, 32, 48, 64, 80, 128)
- **Layout:** Desktop 12-col grid, mobile 4-col grid
- **Section boşluğu:** Min 128px desktop (premium, editorial his)
- **Glassmorphism:** Nav ve overlay'de backdrop-blur: 20px

## Geliştirme Kuralları

### Kod Yazımı
- Tek `index.html` dosyasına yaz — ayrı CSS/JS dosyası oluşturma
- Yeni CSS sınıfları için mevcut `.btn-p`, `.card` vb. pattern'ı takip et
- Tailwind utility class'ları + custom CSS birlikte kullanılabilir
- Inline event handler yerine JS'te `addEventListener` kullan

### Bileşen Ekleme
Yeni section/bileşen eklerken:
1. `DESIGN (1).md` dosyasındaki renk ve tipografi tokenlarına uy
2. `.dot-bg` class'ı section arka planı için kullanılabilir
3. Primary hover state için `box-shadow: 0 0 28px rgba(0,255,194,.38)` glow ekle
4. Kartlarda featured state için `radial-gradient(#00FFC2 5% opacity)` köşe efekti

### Marka Sesi
- Teknik, otoriter, yenilikçi
- "Controlled Power" hissi — sofistike ve premium
- Boşluk (whitespace) kasıtlı ve editorial

## Önemli Dosyalar
| Dosya | Açıklama |
|-------|----------|
| `index.html` | Ana website — tüm kod burada |
| `DESIGN (1).md` | Kinetic Cybernetics tasarım sistemi |
| `COMPANY NAME.docx` | Şirket bilgileri |

## Şirket
Şirket adı ve detayları için `COMPANY NAME.docx` dosyasına bak.
