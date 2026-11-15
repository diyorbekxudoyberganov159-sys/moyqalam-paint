# 🎨 Mo'yqalam — chizish (Paint) ilovasi

**Mo'yqalam** — barmoq bilan rasm chizish uchun oflayn mobil ilova. Qalam rangi va qalinligini tanlash, o'chirg'ich, bekor qilish/qaytarish (undo/redo), kanvasni tozalash va rasmni **PNG** sifatida saqlash imkoniyatlari bor. Ilova internetsiz to'liq ishlaydi, barcha ma'lumotlar telefonning o'zida saqlanadi.

| | |
|---|---|
| **Fan** | Mobil ilovalarni ishlab chiqish |
| **Topshiriq** | 29-variant — Chizish (Paint) ilovasi |
| **Talaba** | Xudoyberganov Diyorbek Zarifboy o'g'li |
| **O'qituvchi** | Sarvarbek Azimov |
| **Platforma** | Android, iOS (React Native + Expo), qo'shimcha ravishda Web |

---

## 📸 Skrinshotlar

| Kanvas | O'chirg'ich | Nomni tekshirish |
|:---:|:---:|:---:|
| <img src="docs/screenshots/01_kanvas.png" width="230"> | <img src="docs/screenshots/02_ochirgich.png" width="230"> | <img src="docs/screenshots/03_saqlash_tekshiruv.png" width="230"> |

| Mening rasmlarim | Rasmni ko'rish |
|:---:|:---:|
| <img src="docs/screenshots/04_galereya.png" width="230"> | <img src="docs/screenshots/05_rasmni_korish.png" width="230"> |

**Landshaft (yotiq) rejim** — asboblar paneli o'ng tomonga o'tadi:

<img src="docs/screenshots/06_landshaft.png" width="600">

---

## ✅ Topshiriq talablari va ularning bajarilishi

| Talab (topshiriqdan) | Holat | Qayerda amalga oshirilgan |
|---|:---:|---|
| Barmoq bilan chizish | ✅ | `src/components/DrawingCanvas.tsx` — `PanResponder` + SVG |
| Qalam rangini tanlash | ✅ | 12 ta tayyor rang + istalgan HEX rang (`ColorPalette.tsx`, `ColorInputModal.tsx`) |
| Qalam qalinligini tanlash | ✅ | Slayder 1–40 px, namunasi bilan (`WidthSelector.tsx`) |
| O'chirg'ich | ✅ | Alohida asbob, o'z qalinligi bilan (`Toolbar.tsx`) |
| Undo / Redo **to'g'ri ishlaydi** | ✅ | `src/logic/history.ts` — 8 ta unit test bilan tekshirilgan |
| Kanvasni tozalash | ✅ | Tasdiqlash oynasi bilan; tozalashni ham undo qilish mumkin |
| Rasmni **PNG** sifatida saqlash | ✅ | `react-native-view-shot` → `expo-file-system` (`drawingRepository.ts`) |

### Qo'shimcha imkoniyatlar

- **Avtomatik saqlash (qoralama)** — ilova yopilib qayta ochilganda chizma joyida qoladi.
- **Sozlamalar eslab qolinadi** — oxirgi rang, qalinlik va asbob.
- **"Mening rasmlarim" galereyasi** — saqlangan PNG rasmlar ro'yxati (sana bilan).
- **Saqlangan rasmni qayta tahrirlash** — chiziqlar ham saqlanadi, rasm kanvasga qaytariladi.
- **Telefon galereyasiga eksport** va **ulashish** (Telegram, Gmail va h.k.).
- **Nomini o'zgartirish** va **o'chirish** (tasdiqlash bilan).
- **Moslashuvchan dizayn** — telefon (tik/yotiq) va planshetda to'g'ri ko'rinadi.

---

## 🛡️ Barqarorlik va noto'g'ri kiritishlarni tekshirish

| Holat | Ilova javobi |
|---|---|
| Bo'sh kanvasni saqlashga urinish | "Kanvas bo'sh — avval biror narsa chizing" xabari |
| Rasm nomi bo'sh yoki faqat probel | "Rasm nomini kiriting." |
| Nom 2 belgidan qisqa / 40 dan uzun | Tegishli xato xabari |
| Nomda `\ / : * ? " < > \|` belgilari | Xato xabari (fayl nomi uchun taqiqlangan) |
| Takroriy nom (katta-kichik harf farqsiz) | "Bu nom bilan rasm allaqachon saqlangan." |
| Noto'g'ri HEX rang (`#12ZZ`) | "Noto'g'ri rang kodi..." |
| Bo'sh kanvasni tozalash | Tugma faol emas, tarixga "bo'sh" qadam yozilmaydi |
| Undo/redo qiladigan narsa yo'q | Tugmalar kulrang (faol emas) |
| Saqlangan ma'lumot buzilgan bo'lsa | Ilova qulamaydi — noto'g'ri yozuvlar tashlab yuboriladi |
| Galereyaga saqlashga ruxsat berilmasa | Tushunarli xabar, ilova ishlashda davom etadi |

Internet, server yoki Firebase **ishlatilmaydi**.

---

## 🧰 Texnologiyalar

| Texnologiya | Vazifasi |
|---|---|
| **React Native 0.88 + Expo SDK 58** | Bitta kod bilan Android va iOS |
| **TypeScript** | Turlar orqali xatolarni oldindan aniqlash |
| `react-native-svg` | Chiziqlarni vektor (Path) ko'rinishida chizish |
| `react-native-view-shot` | Kanvasni PNG rasmga aylantirish |
| `expo-file-system` | PNG fayllarni ilova papkasida saqlash |
| `@react-native-async-storage/async-storage` | Qoralama, sozlamalar va rasmlar ro'yxati (lokal baza) |
| `expo-media-library` | Rasmni telefon galereyasiga saqlash |
| `expo-sharing` | Rasmni boshqa ilovalarga ulashish |
| `@react-navigation/native-stack` | Ekranlar orasida navigatsiya |
| `@react-native-community/slider` | Qalinlik slayderi |
| **Jest** (`jest-expo`) | Unit testlar |

---

## 🏗️ Arxitektura

Kod qatlamlarga ajratilgan: **model → mantiq → ma'lumot → hook → UI**. Har bir qatlam faqat o'zidan pastdagisini ishlatadi.

```
src/
├── models/        # Ma'lumot turlari: Point, Stroke, SavedDrawing, BrushSettings
├── constants/     # Ranglar palitrasi, mavzu (theme), chegaralar
├── logic/         # Sof funksiyalar (UI va bazasiz) — testlar bilan qoplangan
│   ├── history.ts     # undo/redo reduceri
│   ├── path.ts        # nuqtalar → silliq SVG path
│   └── validation.ts  # kiritishlarni tekshirish
├── data/          # Saqlash qatlami
│   ├── drawingRepository.ts   # saqlangan rasmlar (CRUD)
│   ├── draftStorage.ts        # qoralama (avto-saqlash)
│   ├── settingsStorage.ts     # sozlamalar
│   ├── imageFiles.ts / .web.ts    # PNG fayllar (telefon / brauzer)
│   └── imageExport.ts / .web.ts   # galereyaga saqlash, ulashish
├── hooks/         # useDrawingHistory, useBrushSettings — holat + saqlashni birlashtiradi
├── components/    # Qayta ishlatiladigan UI: kanvas, panel, palitra, modal, toast
├── screens/       # CanvasScreen, GalleryScreen, ViewerScreen
└── navigation/    # Stack navigator va ekran parametrlari turlari
__tests__/         # Jest unit testlar (27 ta)
```

### Undo/Redo qanday ishlaydi

Kanvas holati — bu chiziqlar ro'yxati (`Stroke[]`). Tarix uchta qismdan iborat:

```
past:    [ [], [A], [A,B] ]     ← oldingi holatlar
present: [A,B,C]                 ← ekranda ko'rinayotgan
future:  []                      ← bekor qilinganlar (redo uchun)
```

- **Yangi chiziq / tozalash** → `present` `past` ga o'tadi, `future` tozalanadi.
- **Undo** → `past` dan oxirgisi `present` bo'ladi, eski `present` `future` boshiga qo'yiladi.
- **Redo** → teskarisi.
- Tarix 100 qadam bilan cheklangan (xotirani tejash uchun).

### Ekranlar sxemasi

```
┌──────────────┐  "Rasmlarim"  ┌──────────────┐   rasm    ┌──────────────┐
│    Kanvas    │ ────────────▶ │  Galereya    │ ────────▶ │ Rasmni ko'rish│
│ (bosh ekran) │ ◀──────────── │ (ro'yxat)    │           │ (amallar)     │
└──────────────┘  "Tahrirlash" └──────────────┘           └──────────────┘
```

---

## 🚀 Ishga tushirish

**Talab:** Node.js 20+ va telefonda [Expo Go](https://expo.dev/go) ilovasi (yoki Android emulyator).

```bash
# 1. Kutubxonalarni o'rnatish
npm install

# 2. Ishga tushirish
npx expo start
```

Terminalda chiqqan **QR kodni** telefondagi Expo Go ilovasi bilan skanerlang (telefon va kompyuter bitta Wi-Fi tarmog'ida bo'lishi kerak). Emulyatorda ochish uchun terminalda `a` tugmasini bosing.

Kompyuter brauzerida ko'rish: `npx expo start --web`

### APK yaratish

```bash
npm install -g eas-cli
eas login                                  # bepul Expo akkaunti
eas build -p android --profile preview     # tayyor .apk fayl havolasi beriladi
```

### Testlar va tekshiruvlar

```bash
npm test            # 27 ta unit test (undo/redo, path, validatsiya, saqlash)
npm run typecheck   # TypeScript tekshiruvi
```

---

## 🧪 Qo'lda sinov ro'yxati

- [x] Internet o'chirilgan holda chizish, saqlash, galereya ishlaydi
- [x] Ilova yopilib qayta ochilganda chizma va sozlamalar saqlanib qoladi
- [x] Undo → Redo → yangi chiziq: redo tarixi to'g'ri tozalanadi
- [x] Tozalash → Undo: chizma qaytadi
- [x] Bo'sh nom, takroriy nom, noto'g'ri belgilar, noto'g'ri HEX — xato xabari chiqadi
- [x] Saqlangan PNG galereyada ko'rinadi, ochiladi, ulashiladi, o'chiriladi
- [x] Ekran burilganda (landshaft) va planshetda dizayn buzilmaydi

---

## 🤖 AI'dan foydalanish

Topshiriq talabiga ko'ra, AI vositalari qayerda ishlatilgani:

- **Claude (Anthropic)** — loyiha tuzilmasini (qatlamlarga ajratish) rejalashtirish, undo/redo reduceri, chiziqlarni Bezier egri chiziqlari bilan silliqlash funksiyasi, saqlash qatlami va UI komponentlarining kodini yozishda, unit testlarni tuzishda va README'ni tayyorlashda yordam berdi.
- Expo SDK 58 dagi yangi `expo-file-system` (File/Directory) API'si va `expo-media-library/legacy` importi AI yordamida aniqlandi.
- Kod ishga tushirilib sinab ko'rildi, testlar yozildi va kodning har bir qismi tushunib chiqildi (izohlar o'zbek tilida yozilgan).

---

## 📄 Litsenziya

MIT — [LICENSE](LICENSE)
