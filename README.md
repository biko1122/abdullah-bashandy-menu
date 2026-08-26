# عبد الله بشندي — منيو رقمي ذكي

منيو رقمي لمطعم **عبد الله بشندي** — السيدة زينب، القاهرة.

الموقع ده **مش موقع طلبات**. مفيش تسجيل دخول، مفيش دفع، مفيش توصيل، مفيش checkout، ومفيش أي backend.
هو منيو كامل + آلة حاسبة للوجبة: تتصفّح، تختار، تظبط الكمية، وتشوف الإجمالي على طول.

---

## A. التشغيل

```bash
npm install
npm run dev      # http://localhost:5173
```

للنسخة النهائية:

```bash
npm run build    # بيطلع مجلد dist/
npm run preview  # معاينة النسخة النهائية
```

**المتطلبات:** Node.js 18 أو أحدث.
**التقنيات:** React 18 + Vite + React Router. الحفظ في `localStorage` بس — من غير سيرفر ولا قاعدة بيانات.

---

## B. هيكل المشروع

```
abdallah-bashandy/
├── index.html                  ← اللغة ar + dir=rtl + خطوط جوجل
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg             ← أيقونة التبويب
└── src/
    ├── main.jsx                ← نقطة البداية + المزوّدات (Providers)
    ├── App.jsx                 ← الهيكل والمسارات
    ├── App.css
    │
    ├── assets/
    │   ├── brand/
    │   │   ├── logo.svg              ← الشعار الكامل
    │   │   └── logo-mark.svg         ← العلامة المختصرة
    │   ├── icons/
    │   └── images/
    │       ├── hero/                 ← صورة الواجهة الرئيسية
    │       ├── menu/                 ← ⭐ صور الأصناف (الأهم)
    │       ├── categories/           ← صور الأقسام (اختيارية)
    │       ├── atmosphere/           ← صور المحل والشارع
    │       └── decorative/           ← خلفيات وزخارف
    │
    ├── components/
    │   ├── Navbar/                   ← الهيدر اللاصق + زرار اختياراتك
    │   ├── Hero/                     ← واجهة الصفحة الرئيسية
    │   ├── CategoryNav/              ← شريط الأقسام اللاصق
    │   ├── MenuSection/              ← قسم مرقّم في المنيو
    │   ├── MenuCard/                 ← كارت الصنف
    │   ├── ItemModal/                ← تفاصيل الصنف (bottom sheet / نافذة)
    │   ├── SelectionBar/             ← الشريط العايم على الموبايل
    │   ├── SelectionDrawer/          ← قائمة "اختياراتك" والإجمالي
    │   ├── QuantityControl/          ← − 1 +
    │   ├── Search/                   ← خانة البحث
    │   ├── FoodImage/                ← الصورة أو البديل المرسوم
    │   ├── MealBuilder/              ← "اعمل وجبتك"
    │   ├── PopularSection/           ← "الناس بتحب إيه؟"
    │   ├── StorySection/             ← "من قلب السيدة زينب"
    │   ├── LocationSection/          ← المكان والتواصل
    │   ├── Footer/
    │   ├── Sheet/                    ← قاعدة النوافذ (وصول + كيبورد)
    │   └── Ornaments/                ← زخارف وأيقونات SVG
    │
    ├── data/                   ← ⭐ كل اللي هتعدّله موجود هنا
    │   ├── menu.js                   ← الأصناف والأسعار
    │   ├── categories.js             ← الأقسام وترتيبها
    │   ├── restaurant.js             ← الاسم والعنوان والتواصل
    │   └── mealBuilder.js            ← أصناف "اعمل وجبتك"
    │
    ├── context/
    │   ├── SelectionContext.jsx      ← "اختياراتك" + حساب الإجمالي
    │   └── FavoritesContext.jsx      ← المفضلة (القلب)
    │
    ├── pages/
    │   ├── Home.jsx                  ← /
    │   └── Menu.jsx                  ← /menu
    │
    ├── utils/
    │   ├── currency.js               ← شكل السعر
    │   ├── images.js                 ← ربط أسماء الصور بمساراتها
    │   └── search.js                 ← منطق البحث
    │
    └── styles/
        └── global.css                ← ⭐ نظام التصميم (الألوان والخطوط)
```

**الصفحات اتنين بس:** `/` و `/menu`. مفيش `/login` ولا `/checkout` ولا `/account`.

---

## C. دليل الصور

الموقع شغال دلوقتي **من غير أي صورة** — بيرسم بديل بلون القسم وعليه أول كلمة من اسم الصنف.
أول ما تحط الصورة بالاسم الصح، بتظهر مكان البديل لوحدها. مفيش أي `import` تكتبه.

**الطريقة:**

1. حط الصورة في `src/assets/images/menu/`
2. اتأكد إن اسم الملف هو نفسه المكتوب في حقل `image` في `src/data/menu.js`

بس كده.

> لو حطيت `foul.webp` بدل `foul.jpg` هتشتغل برضه — البحث بيتم على الاسم من غير الامتداد.

### الصور المطلوبة

| المكان | الملف | الغرض | المقاس المقترح | الصيغة |
| --- | --- | --- | --- | --- |
| `images/hero/` | `hero-main.jpg` | صورة الواجهة الرئيسية | 1200 × 1600 (طولي) | JPG / WebP |
| `images/atmosphere/` | `shopfront.jpg` | واجهة المحل في قسم "من قلب السيدة زينب" | 1200 × 1500 | JPG / WebP |
| `images/menu/` | `foul.jpg` … | صورة لكل صنف (70 صنف) | 800 × 600 (4:3) | JPG / WebP |
| `images/categories/` | `foul.jpg`, `grill.jpg` … | صور الأقسام (اختيارية) | 800 × 600 | JPG / WebP |
| `assets/brand/` | `logo.svg` | الشعار الكامل | متجه (SVG) | SVG |
| `assets/brand/` | `logo-mark.svg` | العلامة المختصرة | 64 × 64 | SVG |
| `public/` | `favicon.svg` | أيقونة التبويب | 64 × 64 | SVG |

**نصايح:** خلّي حجم صورة الصنف أقل من 200KB، وصوّر الأكل من فوق أو بزاوية 45° على خلفية غامقة —
ده بيريّح العين مع خلفية الموقع الورقية.

### أسماء ملفات صور الأصناف

الأسماء دي هي اللي مكتوبة فعلاً في `src/data/menu.js`:

```
الفول والطعمية   foul.jpg · foul-hot-oil.jpg · foul-tahini.jpg · foul-alexandrian.jpg ·
                 foul-ghee.jpg · foul-eggs.jpg · taameya.jpg · stuffed-taameya.jpg ·
                 taameya-plate.jpg · foul-taameya-mix.jpg · foul-basterma.jpg

السندوتشات       foul-sandwich.jpg · foul-hot-sandwich.jpg · foul-tahini-sandwich.jpg ·
                 taameya-sandwich.jpg · stuffed-taameya-sandwich.jpg · potato-sandwich.jpg ·
                 eggplant-sandwich.jpg · egg-sandwich.jpg · basterma-egg-sandwich.jpg ·
                 mixed-sandwich.jpg · foul-cheese-sandwich.jpg

الفطار           fried-eggs.jpg · basterma-eggs.jpg · shakshuka.jpg · fried-potato-plate.jpg ·
                 eggplant-plate.jpg · potato-eggs.jpg · large-foul-plate.jpg ·
                 breakfast-tray.jpg · egyptian-omelette.jpg

الجريل           kofta.jpg · shish-tawook.jpg · grilled-chicken.jpg · kebab.jpg ·
                 mixed-grill.jpg · lamb-chops.jpg · kofta-skewer.jpg · grilled-chicken-breast.jpg

البرجر           classic-burger.jpg · cheese-burger.jpg · double-burger.jpg ·
                 chicken-burger.jpg · spicy-burger.jpg · mushroom-burger.jpg

الوجبات          foul-taameya-meal.jpg · burger-meal.jpg · kofta-meal.jpg ·
                 tawook-meal.jpg · full-breakfast-meal.jpg

الإضافات         tahini.jpg · baba-ghanoush.jpg · pickles.jpg · green-salad.jpg ·
                 tahini-salad.jpg · white-cheese.jpg · fries.jpg · hot-sauce.jpg ·
                 baladi-bread.jpg · white-rice.jpg

المشروبات        tea.jpg · mint-tea.jpg · coffee.jpg · nescafe.jpg · water.jpg ·
                 cola.jpg · seven-up.jpg · juice.jpg · lemon-mint.jpg · rayeb.jpg
```

---

## D. إضافة صنف جديد

افتح `src/data/menu.js` وضيف كائن جديد جوه مصفوفة `menu` — حطه في مكانه حسب القسم:

```javascript
{
  id: 'foul-012',                        // لازم يكون فريد
  name: 'فول بالطماطم',
  description: 'فول متقلب مع طماطم وبصل.',
  category: 'foul',                      // id القسم من categories.js
  price: 30,                             // بالجنيه، رقم بس
  image: 'foul-tomato.jpg',              // الملف جوه assets/images/menu/
  popular: false,                        // true = يظهر في "الناس بتحب إيه؟"
  available: true,                       // false = يظهر رمادي ومش بيتضاف
  tags: ['فول', 'طماطم'],                // كلمات إضافية للبحث
  options: [],                           // اختيارات (اختياري — الشكل تحت)
}
```

**صنف باختيارات** (زي نوع العيش أو الحشو):

```javascript
options: [
  {
    id: 'bread',
    name: 'العيش',
    required: true,                      // لازم يختار — و(+) بيفتح النافذة بدل ما يضيف على طول
    choices: [
      { id: 'baladi', name: 'بلدي', priceDelta: 0 },
      { id: 'fino',   name: 'فينو', priceDelta: 3 },   // بيزوّد 3 ج.م على السعر
    ],
  },
]
```

نفس الصنف باختيارات مختلفة بيتحسب كسطرين منفصلين في "اختياراتك" — وده مقصود.

**إضافة قسم جديد:** ضيف كائن في `src/data/categories.js` (الترتيب هناك = الترتيب في الموقع)،
وبعدين استخدم الـ `id` بتاعه في حقل `category` للأصناف.

---

## E. تغيير الأسعار

كل الأسعار في مكان واحد: `src/data/menu.js` — حقل `price` في كل صنف. أرقام صحيحة بالجنيه.

> ⚠️ **الأسعار الحالية تجريبية.** لما تحط الأسعار الحقيقية، غيّر السطر ده في نفس الملف:
>
> ```javascript
> export const PRICES_ARE_DEMO = false
> ```
>
> وده بيخفّي تنبيه "أسعار مبدئية" من الصفحة الرئيسية والمنيو والفوتر.

**شكل السعر** (أرقام عربية بدل الإنجليزية) — من `src/utils/currency.js`:

```javascript
export const CURRENCY_LABEL = 'ج.م'        // رمز العملة
export const USE_ARABIC_NUMERALS = false   // خليها true عشان ٣٥ بدل 35
```

---

## F. تغيير الألوان

كل الألوان متغيرات CSS في أول `src/styles/global.css`:

```css
:root {
  --background: #f2e9db;   /* خلفية الصفحة — ورق قديم */
  --surface:    #fbf6ec;   /* خلفية الكروت */
  --primary:    #8f2f19;   /* الطوبي المحروق — لون الأزرار */
  --accent:     #c4892b;   /* الدهبي */
  --herb:       #4c6141;   /* الأخضر */
  --charcoal:   #17120c;   /* الفحم — الأقسام الغامقة */
  --text:       #1d1710;
  --muted:      #857463;
  --border:     #ddcdb4;
}
```

غيّر القيم دي وهي بتتطبّق على الموقع كله فورًا. الخطوط في نفس المكان
(`--font-display` للاسم، `--font-heading` للعناوين، `--font-body` للنص) —
ولو غيّرت خط، غيّر لينك جوجل فونتس في `index.html` كمان.

---

## G. تغيير اسم المطعم والبيانات

كله في `src/data/restaurant.js`:

```javascript
name: 'عبد الله بشندي',
nameLatin: 'ABDELALLAH BASHANDY',
tagline: 'أكل مصري على أصوله',
location: { district: 'السيدة زينب', city: 'القاهرة', address: '31 شارع الشيخ علي يوسف' },
contact: { phone: { value: '01xxxxxxxxx', isPlaceholder: true }, … },
```

- أي حقل قيمته `null` **مش بيظهر** في الموقع خالص.
- أي حقل عليه `isPlaceholder: true` بيظهر جنبه كلمة **(مبدئي)** عشان تفتكر تغيّره.
- التليفون والفيسبوك والإنستجرام دلوقتي قيم مؤقتة — مش بيانات رسمية.
- الاسم بيتحدّث تلقائيًا في الهيدر والهيرو والفوتر وعنوان التبويب.

---

## H. الحساب — إزاي بيشتغل؟

الحسبة بسيطة ومفيهاش أي رسوم:

```
سعر السطر = (سعر الصنف + مجموع priceDelta للاختيارات) × الكمية
الإجمالي   = مجموع كل السطور
```

مفيش توصيل، ولا ضرايب، ولا رسوم خدمة، ولا أي حاجة تانية.

الكود في [`src/context/SelectionContext.jsx`](src/context/SelectionContext.jsx):

- **الإضافة** — نفس الصنف بنفس الاختيارات بيزوّد الكمية بدل ما يعمل سطر جديد (`فول × 2`).
- **التخزين** — بنحفظ في `localStorage` الـ id والاختيارات والكمية بس. الأسعار والأسماء
  بتتقري من `menu.js` وقت العرض، يعني لو غيّرت سعر النهاردة، أي اختيارات محفوظة قديمة
  بتتحسب بالسعر الجديد تلقائيًا.
- **التقليل** — لما الكمية توصل 1 وتنقّص تاني، السطر بيتشال.
- **المسح** — زرار "مسح الاختيارات" بيفضّي كل حاجة.

الوظايف المتاحة من `useSelection()`:

```javascript
const {
  lines,             // السطور بتفاصيلها (الصنف، الاختيارات، سعر الوحدة، إجمالي السطر)
  total,             // الإجمالي
  itemCount,         // عدد الحاجات
  isEmpty,
  addItem,           // addItem(item, { quantity, choiceIds })
  increaseQuantity,  // (key)
  decreaseQuantity,  // (key)
  setQuantity,       // (key, quantity)
  removeItem,        // (key)
  clearSelection,
  quantityOfItem,    // (itemId) → الكمية المختارة من الصنف ده
} = useSelection()
```

---

## اللي الموقع بيعمله

تصفّح المنيو · بحث · فلترة بالأقسام · تفاصيل الصنف · إضافة أصناف · تغيير الكميات ·
حساب الإجمالي فورًا · حذف صنف · مسح الكل · مفضلة (قلب) · "اعمل وجبتك".

## اللي الموقع **مش** بيعمله (بقصد)

تسجيل دخول · حساب · طلب أونلاين · دفع · checkout · توصيل · عنوان · باك إند.

---

## ملاحظات تقنية

- **RTL كامل** — الاتجاه متظبط من `index.html`، والستايل كله بيستخدم
  `inset-inline` و `margin-inline` عشان يشتغل صح مع العربي.
- **الموبايل الأول** — bottom sheet للتفاصيل، شريط أقسام أفقي، وشريط "اختياراتك" عايم تحت.
- **إمكانية الوصول** — HTML دلالي، تركيز محصور جوه النوافذ، إغلاق بـ Escape،
  `aria-label` على كل الأزرار، رابط تخطّي للمحتوى، واحترام `prefers-reduced-motion`.
- **الأداء** — صور المنيو بـ `loading="lazy"`، ومفيش أي مكتبة خارجية غير React والراوتر.
