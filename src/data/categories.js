/**
 * ==========================================================================
 *  أقسام المنيو
 * --------------------------------------------------------------------------
 *  ترتيب المصفوفة هنا = ترتيب الأقسام في الموقع (في شريط التصنيفات وفي المنيو).
 *
 *  id     → لازم يطابق حقل `category` في src/data/menu.js
 *  name   → الاسم اللي بيظهر للزباين
 *  note   → سطر صغير تحت عنوان القسم (اختياري)
 *  accent → لون القسم، بيستخدم في البادچ وفي صورة الـ placeholder (درجة HSL)
 *  image  → اسم صورة القسم داخل src/assets/images/categories/ (اختياري)
 * ==========================================================================
 */

export const categories = [
  {
    id: 'foul',
    name: 'الفول والطعمية',
    note: 'الأساس اللي المحل قايم عليه',
    accent: 34,
    image: 'foul.jpg',
  },
  {
    id: 'sandwiches',
    name: 'السندوتشات',
    note: 'عيش طازة وحشو متظبط',
    accent: 22,
    image: 'sandwiches.jpg',
  },
  {
    id: 'breakfast',
    name: 'الفطار',
    note: 'أطباق تتاكل على مهل',
    accent: 44,
    image: 'breakfast.jpg',
  },
  {
    id: 'grill',
    name: 'الجريل',
    note: 'على الفحم… ومشوي صح',
    accent: 12,
    image: 'grill.jpg',
  },
  {
    id: 'burger',
    name: 'البرجر',
    note: 'لحمة مفرومة في المحل',
    accent: 18,
    image: 'burger.jpg',
  },
  {
    id: 'meals',
    name: 'الوجبات',
    note: 'أكلة كاملة بسعر واحد',
    accent: 28,
    image: 'meals.jpg',
  },
  {
    id: 'extras',
    name: 'الإضافات',
    note: 'اللي بيكمّل الطبق',
    accent: 88,
    image: 'extras.jpg',
  },
  {
    id: 'drinks',
    name: 'المشروبات',
    note: 'ساقع وسخن',
    accent: 168,
    image: 'drinks.jpg',
  },
]

/** يرجّع بيانات قسم بالـ id بتاعه. */
export const getCategory = (id) => categories.find((c) => c.id === id)

export default categories
