// 农历数据
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950
]

// 节气数据
const SOLAR_TERMS = {
  "立春": [2, 3],
  "雨水": [2, 18],
  "惊蛰": [3, 5],
  "春分": [3, 20],
  "清明": [4, 4],
  "谷雨": [4, 19],
  "立夏": [5, 5],
  "小满": [5, 20],
  "芒种": [6, 5],
  "夏至": [6, 21],
  "小暑": [7, 6],
  "大暑": [7, 22],
  "立秋": [8, 7],
  "处暑": [8, 22],
  "白露": [9, 7],
  "秋分": [9, 22],
  "寒露": [10, 8],
  "霜降": [10, 23],
  "立冬": [11, 7],
  "小雪": [11, 22],
  "大雪": [12, 6],
  "冬至": [12, 21],
  "小寒": [1, 5],
  "大寒": [1, 20]
}

// 天干地支数据
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const WU_XING = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水']

// 时辰对应表
const TIME_ZHI = {
  23: '子', 0: '子', 1: '丑', 2: '丑', 3: '寅', 4: '寅', 5: '卯', 6: '卯',
  7: '辰', 8: '辰', 9: '巳', 10: '巳', 11: '午', 12: '午', 13: '未', 14: '未',
  15: '申', 16: '申', 17: '酉', 18: '酉', 19: '戌', 20: '戌', 21: '亥', 22: '亥'
}

class LunarCalendar {
  constructor(date) {
    this.date = new Date(date)
  }

  // 获取农历年份
  getLunarYear() {
    let year = this.date.getFullYear()
    let month = this.date.getMonth() + 1
    let day = this.date.getDate()
    
    // 计算距离1900年1月31日的天数
    let offset = (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000
    
    // 计算农历年份
    let lunarYear = 1900
    let temp = 0
    for (let i = 0; i < LUNAR_INFO.length; i++) {
      temp = this.getLunarYearDays(lunarYear)
      if (offset < temp) {
        break
      }
      offset -= temp
      lunarYear++
    }
    
    return lunarYear
  }

  // 获取农历月份
  getLunarMonth() {
    let year = this.getLunarYear()
    let offset = (Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()) - Date.UTC(1900, 0, 31)) / 86400000
    
    let lunarMonth = 1
    let temp = 0
    for (let i = 0; i < 13; i++) {
      temp = this.getLunarMonthDays(year, lunarMonth)
      if (offset < temp) {
        break
      }
      offset -= temp
      lunarMonth++
    }
    
    return lunarMonth
  }

  // 获取农历日期
  getLunarDay() {
    let year = this.getLunarYear()
    let month = this.getLunarMonth()
    let offset = (Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()) - Date.UTC(1900, 0, 31)) / 86400000
    
    let lunarDay = 1
    let temp = 0
    for (let i = 0; i < month; i++) {
      temp = this.getLunarMonthDays(year, i + 1)
      if (i < month - 1) {
        offset -= temp
      } else {
        lunarDay = offset + 1
      }
    }
    
    return lunarDay
  }

  // 获取农历年的总天数
  getLunarYearDays(year) {
    let sum = 348
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0
    }
    return sum + this.getLeapMonthDays(year)
  }

  // 获取农历闰月天数
  getLeapMonthDays(year) {
    if (this.getLeapMonth(year)) {
      return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29
    }
    return 0
  }

  // 获取农历闰月月份
  getLeapMonth(year) {
    return LUNAR_INFO[year - 1900] & 0xf
  }

  // 获取农历月份的天数
  getLunarMonthDays(year, month) {
    return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29
  }

  // 获取节气
  getSolarTerm() {
    const month = this.date.getMonth() + 1
    const day = this.date.getDate()
    
    for (let term in SOLAR_TERMS) {
      const [termMonth, termDay] = SOLAR_TERMS[term]
      if (month === termMonth && day === termDay) {
        return term
      }
    }
    return null
  }

  // 获取时辰
  getTimeZhi() {
    const hour = this.date.getHours()
    return TIME_ZHI[hour]
  }
}

// 修改导出方式
const lunar = {
  LunarCalendar: LunarCalendar,
  TIAN_GAN: TIAN_GAN,
  DI_ZHI: DI_ZHI,
  WU_XING: WU_XING,
  SOLAR_TERMS: SOLAR_TERMS,
  LUNAR_INFO: LUNAR_INFO,
  TIME_ZHI: TIME_ZHI
}

module.exports = lunar 