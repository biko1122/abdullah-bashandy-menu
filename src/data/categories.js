/**
 *  أقسام المنيو — مطابقة لتقسيم سيستم الكاشير
 *  (السفرة والمشروبات والأرز اتشالوا — الموقع والواتساب ديليفري بس)
 */

export const categories = [
  {
    id: 'foul',
    name: 'ساندوتشات الفول',
    note: 'الأساس اللي المحل قايم عليه',
    accent: 34,
  },
  {
    id: 'falafel',
    name: 'ساندوتشات الفلافل',
    note: 'طعمية مقلية على الطلب',
    accent: 96,
  },
  {
    id: 'potato-sandwiches',
    name: 'ساندوتشات البطاطس',
    note: 'بطاطس وشيبسي وبورية في رغيف',
    accent: 46,
  },
  {
    id: 'mixed-sandwiches',
    name: 'سندوتشات متنوعة',
    note: 'جبن وبيض ومش وبالانجان',
    accent: 110,
  },
  {
    id: 'signature',
    name: 'ساندوتشات بشندي المميزة',
    note: 'خلطات المحل المخصوصة',
    accent: 14,
  },
  {
    id: 'grill',
    name: 'اللحوم والفراخ',
    note: 'جريل وجبن ولحوم',
    accent: 8,
  },
  {
    id: 'crepe',
    name: 'كريب بشندي',
    accent: 280,
  },
  {
    id: 'boxes',
    name: 'علب بشندي',
    note: 'تتاكل في البيت',
    accent: 140,
  },
  {
    id: 'falafel-pieces',
    name: 'أقراص وبيض',
    accent: 92,
  },
  {
    id: 'platters',
    name: 'أطباق الأومليت',
    note: 'على طبق — وينفع ديليفري',
    accent: 200,
  },
  {
    id: 'bread',
    name: 'عيش',
    accent: 40,
  },
]

export const getCategory = (id) => categories.find((c) => c.id === id)

export default categories
