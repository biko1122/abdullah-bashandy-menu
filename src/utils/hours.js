/**
 * ==========================================================================
 *  مواعيد استقبال الطلبات
 * --------------------------------------------------------------------------
 *      مفتوح للطلب:  ٦ صباحًا  →  ١ بعد نص الليل
 *      مقفول:        ١ بعد نص الليل  →  ٦ صباحًا
 *
 *  المحل نفسه بيفضل فاتح لحد ٢ الفجر، بس بنقفل استقبال الطلبات
 *  الساعة ١ عشان المطبخ يلحق يخلّص.
 *
 *  ⚠️ حاجتين مهمين:
 *
 *  1. بنحسب بتوقيت **القاهرة** مش ساعة جهاز الزبون — لأن حد ممكن
 *     يفتح الموقع من السعودية أو من جهاز ساعته مظبوطة غلط.
 *     Intl بتتعامل مع التوقيت الصيفي لوحدها.
 *
 *  2. اللي هنا **للعرض بس**. المنع الحقيقي في السيرفر
 *     (bashandy-backend/src/services/hours.service.js) لأن أي حد
 *     يقدر يعدّل المتصفح. لو غيّرت المواعيد، غيّرها في الملفين.
 * ==========================================================================
 */

export const OPENS_AT = 6 // ٦ صباحًا
export const CLOSES_AT = 1 // ١ بعد نص الليل
const TIME_ZONE = 'Africa/Cairo'

/** الساعة والدقيقة في القاهرة دلوقتي */
export const cairoTime = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type) => Number(parts.find((part) => part.type === type)?.value ?? 0)
  return { hour: get('hour') % 24, minute: get('minute') }
}

/**
 * بنستقبل طلبات دلوقتي؟
 * الفترة بتلف حوالين منتصف الليل، فبنسأل العكس: مقفول لو الساعة
 * من ١ لحد ٦ — وأي وقت غير كده مفتوح.
 */
export const isOrderingOpen = (date = new Date()) => {
  const { hour } = cairoTime(date)
  return !(hour >= CLOSES_AT && hour < OPENS_AT)
}

/** الساعة كام دلوقتي في القاهرة — بصيغة 01:30 */
export const cairoClock = (date = new Date()) => {
  const { hour, minute } = cairoTime(date)
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

/** كام ساعة فاضلة لحد ما نفتح — للرسالة اللي بتظهر للزبون */
export const hoursUntilOpen = (date = new Date()) => {
  const { hour, minute } = cairoTime(date)
  let hours = OPENS_AT - hour
  if (minute > 0) hours -= 1
  return Math.max(hours, 0)
}

export default { OPENS_AT, CLOSES_AT, isOrderingOpen, cairoClock, hoursUntilOpen }
