/**
 * 时区配置
 */

import dayjs from 'dayjs'
export const SUPPORTED_TIMEZONES = [
  'Etc/GMT+12', // UTC−12:00 – Baker Island
  'Etc/GMT+11', // UTC−11:00 – American Samoa
  'Pacific/Honolulu', // UTC−10:00 – Hawaii
  'Etc/GMT+9', // UTC−09:00 – Alaska
  'Etc/GMT+8', // UTC−08:00 – Pacific Time (US & Canada)
  'Etc/GMT+7', // UTC−07:00 – Mountain Time (US & Canada)
  'Etc/GMT+6', // UTC−06:00 – Central Time (US & Canada)
  'Etc/GMT+5', // UTC−05:00 – Eastern Time (US & Canada)
  'Etc/GMT+4', // UTC−04:00 – Atlantic Time (Canada)
  'America/Argentina/Buenos_Aires', // UTC−03:00 – Buenos Aires
  'Atlantic/South_Georgia', // UTC−02:00 – South Georgia
  'Etc/GMT+1', // UTC−01:00 – Azores
  'Etc/GMT', // UTC±00:00 – Greenwich Mean Time (GMT)
  'Etc/GMT-1', // UTC+01:00 – Central European Time (Berlin, Paris)
  'Etc/GMT-2', // UTC+02:00 – Eastern European Time (Athens, Cairo)
  'Europe/Moscow', // UTC+03:00 – Moscow, Nairobi
  'Etc/GMT-4', // UTC+04:00 – Gulf Standard Time (Dubai)
  'Asia/Karachi', // UTC+05:00 – Pakistan Standard Time (Karachi)
  'Asia/Dhaka', // UTC+06:00 – Bangladesh Time (Dhaka)
  'Asia/Bangkok', // UTC+07:00 – Indochina Time (Bangkok, Hanoi)
  'Asia/Shanghai', // UTC+08:00 – China Standard Time (Beijing, Singapore)
  'Asia/Tokyo', // UTC+09:00 – Japan Standard Time (Tokyo)
  'Etc/GMT-10', // UTC+10:00 – Australian Eastern Time (Sydney)
  'Etc/GMT-11', // UTC+11:00 – Solomon Islands Time
  'Etc/GMT-12', // UTC+12:00 – New Zealand Standard Time (Auckland)
]

export const TIMEZONE_LABELS_ORIGIN = {
  'Etc/GMT+12': 'UTC{{offset}} - Baker Island',
  'Etc/GMT+11': 'UTC{{offset}} - American Samoa',
  'Pacific/Honolulu': 'UTC{{offset}} - Hawaii',
  'Etc/GMT+9': 'UTC{{offset}} - Alaska',
  'Etc/GMT+8': 'UTC{{offset}} - Pacific Time (US & Canada)',
  'Etc/GMT+7': 'UTC{{offset}} - Mountain Time (US & Canada)',
  'Etc/GMT+6': 'UTC{{offset}} - Central Time (US & Canada)',
  'Etc/GMT+5': 'UTC{{offset}} - Eastern Time (US & Canada)',
  'Etc/GMT+4': 'UTC{{offset}} - Atlantic Time (Canada)',
  'America/Argentina/Buenos_Aires': 'UTC{{offset}} - Buenos Aires',
  'Atlantic/South_Georgia': 'UTC{{offset}} - South Georgia',
  'Etc/GMT+1': 'UTC{{offset}} - Azores',
  'Etc/GMT': 'UTC{{offset}} - Greenwich Mean Time (GMT) / London',
  'Etc/GMT-1': 'UTC{{offset}} - Central European Time (Berlin, Paris)',
  'Etc/GMT-2': 'UTC{{offset}} - Eastern European Time (Athens, Cairo)',
  'Europe/Moscow': 'UTC{{offset}} - Moscow, Nairobi',
  'Etc/GMT-4': 'UTC{{offset}} - Gulf Standard Time (Dubai)',
  'Asia/Karachi': 'UTC{{offset}} - Pakistan Standard Time (Karachi)',
  'Asia/Dhaka': 'UTC{{offset}} - Bangladesh Time (Dhaka)',
  'Asia/Bangkok': 'UTC{{offset}} - Indochina Time (Bangkok, Hanoi)',
  'Asia/Shanghai': 'UTC{{offset}} - China Standard Time (Beijing, Singapore)',
  'Asia/Tokyo': 'UTC{{offset}} - Japan Standard Time (Tokyo)',
  'Etc/GMT-10': 'UTC{{offset}} - Australian Eastern Time (Sydney)',
  'Etc/GMT-11': 'UTC{{offset}} - Solomon Islands Time',
  'Etc/GMT-12': 'UTC{{offset}} - New Zealand Standard Time (Auckland)',
}

export const TIMEZONE_LABELS = new Proxy(TIMEZONE_LABELS_ORIGIN, {
  get: (target, name: keyof typeof TIMEZONE_LABELS_ORIGIN) => {
    if (!(name in TIMEZONE_LABELS_ORIGIN)) return ''
    const text = target[name]
    const offset = dayjs.tz(Date.now(), name).utcOffset()
    const offsetAbs = Math.abs(offset)
    const hours = Math.floor(offsetAbs / 60)
    const minutes = offsetAbs % 60
    const sign = offset > 0 ? '+' : offset < 0 ? '-' : '±'
    const offsetFormat = `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    return text.replace('{{offset}}', offsetFormat)
  },
})

export const SUPPORTED_TIMEZONES_TG = [
  'UTC-12',
  'UTC-11',
  'UTC-10',
  'UTC-9',
  'UTC-8',
  'UTC-7',
  'UTC-6',
  'UTC-5',
  'UTC-4',
  'UTC-3',
  'UTC-2',
  'UTC-1',
  'UTC+0',
  'UTC+1',
  'UTC+2',
  'UTC+3',
  'UTC+4',
  'UTC+5',
  'UTC+6',
  'UTC+7',
  'UTC+8',
  'UTC+9',
  'UTC+10',
  'UTC+11',
  'UTC+12',
]

export const TIMEZONE_LABELS_TG = {
  'UTC-12': 'UTC-12 (Baker Island)',
  'UTC-11': 'UTC-11 (Samoa)',
  'UTC-10': 'UTC-10 (Hawaii)',
  'UTC-9': 'UTC-9 (Alaska)',
  'UTC-8': 'UTC-8 (Los Angeles, Vancouver)',
  'UTC-7': 'UTC-7 (Denver, Phoenix)',
  'UTC-6': 'UTC-6 (Chicago, Mexico City)',
  'UTC-5': 'UTC-5 (New York, Toronto)',
  'UTC-4': 'UTC-4 (Santiago, Atlantic)',
  'UTC-3': 'UTC-3 (Sao Paulo, Buenos Aires)',
  'UTC-2': 'UTC-2 (South Georgia)',
  'UTC-1': 'UTC-1 (Azores)',
  'UTC+0': 'UTC+0 (London, Dublin)',
  'UTC+1': 'UTC+1 (Paris, Berlin, Rome)',
  'UTC+2': 'UTC+2 (Cairo, Helsinki)',
  'UTC+3': 'UTC+3 (Moscow, Istanbul)',
  'UTC+4': 'UTC+4 (Dubai, Baku)',
  'UTC+5': 'UTC+5 (Karachi, Tashkent)',
  'UTC+6': 'UTC+6 (Almaty, Dhaka)',
  'UTC+7': 'UTC+7 (Bangkok, Jakarta)',
  'UTC+8': 'UTC+8 (Beijing, Singapore, Hong Kong)',
  'UTC+9': 'UTC+9 (Tokyo, Seoul)',
  'UTC+10': 'UTC+10 (Sydney, Melbourne)',
  'UTC+11': 'UTC+11 (Solomon Islands)',
  'UTC+12': 'UTC+12 (Auckland, Fiji)',
}
