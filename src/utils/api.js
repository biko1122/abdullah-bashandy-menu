/**
 * ==========================================================================
 *  الاتصال بالباكند
 * --------------------------------------------------------------------------
 *  كل الطلبات اللي بتروح للسيرفر بتعدّي من هنا — مكان واحد للعنوان،
 *  ولمعالجة الأخطاء، ولمهلة الانتظار.
 *
 *  عنوان السيرفر بيتقرا من متغيّر البيئة VITE_API_URL:
 *    تطوير : .env.local  →  VITE_API_URL=http://localhost:4000
 *    نشر   : من إعدادات Vercel
 *
 *  لو مش محطوط، بيستخدم localhost:4000 (السيرفر المحلي).
 * ==========================================================================
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

/** مهلة الانتظار — بعدها بنعتبر إن السيرفر مش راد. */
const TIMEOUT_MS = 15000

/**
 * خطأ جاي من الـ API — بيحمل الرسالة اللي السيرفر بعتها
 * عشان نعرضها للمستخدم زي ما هي.
 */
export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status ?? 0
    this.code = code ?? null
    this.details = details ?? null
  }

  /** الخطأ ده معناه إن السيرفر مش شغال أصلاً؟ */
  get isNetworkError() {
    return this.status === 0
  }
}

/**
 * طلب للـ API.
 * بيرجّع الـ data جوه الرد، وبيرمي ApiError لو حصلت مشكلة.
 */
const request = async (path, { method = 'GET', body, signal } = {}) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  /* لو المستخدم لغى الطلب من برّه، بنلغي بتاعنا كمان */
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true })

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch (error) {
    clearTimeout(timer)
    if (error.name === 'AbortError') {
      throw new ApiError('السيرفر أخد وقت طويل. جرّب تاني.', { code: 'TIMEOUT' })
    }
    throw new ApiError('مش قادر أوصل للسيرفر. اتأكد إنك متصل بالإنترنت.', {
      code: 'NETWORK',
    })
  }
  clearTimeout(timer)

  /* بعض الأخطاء بترجع من غير JSON (زي 502 من الاستضافة) */
  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok || payload?.success === false) {
    const error = payload?.error ?? {}
    throw new ApiError(error.message || 'حصل خطأ. جرّب تاني.', {
      status: response.status,
      code: error.code,
      details: error.details,
    })
  }

  return payload?.data ?? payload
}

/* ------------------------------ المنيو ------------------------------ */

export const fetchMenu = () => request('/api/menu?available=true')
export const fetchProducts = (query = '') => request(`/api/products${query}`)

/* ----------------------------- الأوردرات ----------------------------- */

/**
 * إرسال أوردر جديد.
 *
 * ⚠️ لاحظ إن اللي بيتبعت هو **الأكواد والكميات بس** — مفيش ولا سعر.
 *    السيرفر بيجيب الأسعار من قاعدة البيانات ويحسب لوحده.
 *    ده اللي بيمنع أي حد يعدّل السعر من المتصفح ويطلب بجنيه.
 *
 * payload = {
 *   type: 'DELIVERY' | 'PICKUP',
 *   customer: { name, phone, address? },
 *   note?: string,
 *   items: [{ sku, quantity, choices: { bread: 'soury' } }]
 * }
 */
export const createOrder = (payload) =>
  request('/api/orders', { method: 'POST', body: { ...payload, source: 'WEBSITE' } })

export const fetchOrder = (id) => request(`/api/orders/${id}`)

/** بيتأكد إن السيرفر شغال — بنستخدمه قبل ما نوري صفحة الطلب. */
export const checkHealth = () => request('/api/health')

export const API_BASE_URL = BASE_URL
