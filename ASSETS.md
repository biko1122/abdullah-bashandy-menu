# دليل استبدال الصور والشعارات

الموقع مبني عشان يشتغل **من غير أي صورة** — كل صنف من غير صورة بيظهر ببديل مرسوم
(خلفية بلون القسم + أول كلمة من اسم الصنف). أول ما تحط الصورة بالاسم الصح، بتظهر مكانه لوحدها.

## الطريقة (خطوتين)

1. حط الملف في المجلد الصح تحت `src/assets/images/`
2. اتأكد إن اسم الملف = اللي مكتوب في `image` جوه `src/data/menu.js`

**مفيش أي كود تكتبه.** Vite بيجمّع الصور تلقائيًا عن طريق `src/utils/images.js`.

> الامتداد مش مهم: لو حطيت `foul.webp` بدل `foul.jpg` هتشتغل عادي.
> الصيغ المدعومة: `jpg` · `jpeg` · `png` · `webp` · `avif` · `svg`

---

## 1. الشعار

| الملف | الغرض | المقاس | الصيغة |
| --- | --- | --- | --- |
| `src/assets/brand/logo.svg` | الشعار الكامل (اسم + علامة) | متجه، نسبة ~320×96 | SVG |
| `src/assets/brand/logo-mark.svg` | العلامة المختصرة لوحدها | 64 × 64 | SVG |
| `public/favicon.svg` | أيقونة تبويب المتصفح | 64 × 64 | SVG |

**مهم:** الشعار اللي بيظهر في الهيدر والفوتر دلوقتي **مرسوم بالكود** (نص عربي + علامة SVG)
في `src/components/Ornaments/Ornaments.jsx` — عشان يفضل حاد على أي شاشة ويتلوّن مع الثيم.
لو عندك شعار جاهز وعايز تستخدمه بدل المرسوم، غيّر مكوّن `BrandMark` هناك.

---

## 2. صورة الواجهة (Hero)

| الملف | الغرض | المقاس | الصيغة |
| --- | --- | --- | --- |
| `src/assets/images/hero/hero-main.jpg` | الصورة الكبيرة في أول الصفحة الرئيسية | **1200 × 1600** (طولي 3:4) | JPG / WebP |

الإطار طولي على الديسكتوب وعرضي على الموبايل — فاختار صورة الموضوع فيها في النص.
أحسن اختيار: طبق فول أو طعمية مصوّر من قريب على خلفية غامقة.

---

## 3. صور المحل (Atmosphere)

| الملف | الغرض | المقاس | الصيغة |
| --- | --- | --- | --- |
| `src/assets/images/atmosphere/shopfront.jpg` | قسم "من قلب السيدة زينب" | **1200 × 1500** | JPG / WebP |

صورة الواجهة أو الشارع أو الشيف وهو بيقلي الطعمية — أي حاجة فيها روح المكان.

---

## 4. صور الأصناف (الأهم)

المجلد: `src/assets/images/menu/`
**المقاس المقترح: 800 × 600 (نسبة 4:3)** — الصيغة: JPG أو WebP — الحجم: أقل من 200KB للصورة.

### القائمة الكاملة (70 صورة)

#### الفول والطعمية
| الملف | الصنف |
| --- | --- |
| `foul.jpg` | فول بلدي |
| `foul-hot-oil.jpg` | فول بالزيت الحار |
| `foul-tahini.jpg` | فول بالطحينة |
| `foul-alexandrian.jpg` | فول إسكندراني |
| `foul-ghee.jpg` | فول بالسمنة البلدي |
| `foul-eggs.jpg` | فول بالبيض |
| `taameya.jpg` | طعمية بلدي |
| `stuffed-taameya.jpg` | طعمية محشية |
| `taameya-plate.jpg` | طبق طعمية |
| `foul-taameya-mix.jpg` | خلطة فول وطعمية |
| `foul-basterma.jpg` | فول بالبسطرمة |

#### السندوتشات
| الملف | الصنف |
| --- | --- |
| `foul-sandwich.jpg` | ساندوتش فول |
| `foul-hot-sandwich.jpg` | ساندوتش فول بالزيت الحار |
| `foul-tahini-sandwich.jpg` | ساندوتش فول بالطحينة |
| `taameya-sandwich.jpg` | ساندوتش طعمية |
| `stuffed-taameya-sandwich.jpg` | ساندوتش طعمية محشية |
| `potato-sandwich.jpg` | ساندوتش بطاطس |
| `eggplant-sandwich.jpg` | ساندوتش باذنجان |
| `egg-sandwich.jpg` | ساندوتش بيض |
| `basterma-egg-sandwich.jpg` | ساندوتش بيض بالبسطرمة |
| `mixed-sandwich.jpg` | ساندوتش ميكس |
| `foul-cheese-sandwich.jpg` | ساندوتش فول بالجبنة |

#### الفطار
| الملف | الصنف |
| --- | --- |
| `fried-eggs.jpg` | بيض مقلي |
| `basterma-eggs.jpg` | بيض بالبسطرمة |
| `shakshuka.jpg` | شكشوكة |
| `fried-potato-plate.jpg` | طبق بطاطس محمرة |
| `eggplant-plate.jpg` | طبق باذنجان |
| `potato-eggs.jpg` | بطاطس بالبيض |
| `large-foul-plate.jpg` | طبق فول كبير |
| `breakfast-tray.jpg` | صينية فطار مشترك |
| `egyptian-omelette.jpg` | عجة بلدي |

#### الجريل
| الملف | الصنف |
| --- | --- |
| `kofta.jpg` | كفتة مشوية |
| `shish-tawook.jpg` | شيش طاووق |
| `grilled-chicken.jpg` | نص فرخة مشوية |
| `kebab.jpg` | كباب ضاني |
| `mixed-grill.jpg` | ميكس جريل |
| `lamb-chops.jpg` | ريش ضاني |
| `kofta-skewer.jpg` | سيخ كفتة |
| `grilled-chicken-breast.jpg` | صدور فراخ مشوية |

#### البرجر
| الملف | الصنف |
| --- | --- |
| `classic-burger.jpg` | كلاسيك برجر |
| `cheese-burger.jpg` | تشيز برجر |
| `double-burger.jpg` | دبل برجر |
| `chicken-burger.jpg` | تشيكن برجر |
| `spicy-burger.jpg` | سبايسي برجر |
| `mushroom-burger.jpg` | مشروم برجر |

#### الوجبات
| الملف | الصنف |
| --- | --- |
| `foul-taameya-meal.jpg` | وجبة فول وطعمية |
| `burger-meal.jpg` | وجبة برجر |
| `kofta-meal.jpg` | وجبة كفتة |
| `tawook-meal.jpg` | وجبة شيش طاووق |
| `full-breakfast-meal.jpg` | وجبة فطار كامل |

#### الإضافات
| الملف | الصنف |
| --- | --- |
| `tahini.jpg` | طحينة |
| `baba-ghanoush.jpg` | بابا غنوج |
| `pickles.jpg` | مخلل |
| `green-salad.jpg` | سلطة خضراء |
| `tahini-salad.jpg` | سلطة طحينة |
| `white-cheese.jpg` | جبنة بيضاء |
| `fries.jpg` | بطاطس محمرة |
| `hot-sauce.jpg` | صوص حار |
| `baladi-bread.jpg` | عيش بلدي |
| `white-rice.jpg` | أرز أبيض |

#### المشروبات
| الملف | الصنف |
| --- | --- |
| `tea.jpg` | شاي |
| `mint-tea.jpg` | شاي بالنعناع |
| `coffee.jpg` | قهوة |
| `nescafe.jpg` | نسكافيه |
| `water.jpg` | مياه معدنية |
| `cola.jpg` | بيبسي |
| `seven-up.jpg` | سفن |
| `juice.jpg` | عصير برتقال طبيعي |
| `lemon-mint.jpg` | عصير ليمون بالنعناع |
| `rayeb.jpg` | لبن رايب |

---

## 5. صور الأقسام (اختيارية)

المجلد: `src/assets/images/categories/` — المقاس: **800 × 600**

`foul.jpg` · `sandwiches.jpg` · `breakfast.jpg` · `grill.jpg` · `burger.jpg` ·
`meals.jpg` · `extras.jpg` · `drinks.jpg`

الأسماء دي مكتوبة في `src/data/categories.js`. مش مستخدمة في التصميم الحالي، بس المجلد
والحقل موجودين لو حبيت تضيف كروت للأقسام بعدين.

---

## 6. الزخارف

المجلد: `src/assets/images/decorative/`

الزخارف الحالية (الشرايط والنقوش والحبيبات) كلها **SVG مرسوم بالكود** — يعني بتتحمّل فورًا
وبتتلوّن مع الثيم. لو عندك زخارف جاهزة، حطها هنا واستخدمها من
`src/components/Ornaments/Ornaments.jsx`.

---

## نصايح للتصوير

- زاوية واحدة لكل الأصناف (من فوق أو 45°) بتخلي المنيو مترابط.
- خلفية غامقة أو خشب داكن بتطلّع الأكل قدام مع خلفية الموقع الورقية.
- سيب مساحة فاضية حوالين الطبق — الكارت بيقص الصورة على 4:3.
- ضغط الصور قبل ما تحطها (TinyPNG أو Squoosh) — الموبايل هيشكرك.
