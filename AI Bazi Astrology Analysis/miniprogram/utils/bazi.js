const lunar = require('./lunar')

class BaziCalculator {
  constructor(birthDate, birthTime, birthPlace) {
    // 将日期格式转换为 iOS 支持的格式
    const formattedDate = birthDate.replace(/-/g, '/')
    this.birthDate = new Date(`${formattedDate} ${birthTime}`)
    this.birthPlace = birthPlace
    this.lunar = new lunar.LunarCalendar(this.birthDate)
  }

  // 计算年柱
  calculateYearPillar() {
    const lunarYear = this.lunar.getLunarYear()
    const yearGanIndex = (lunarYear - 4) % 10
    const yearZhiIndex = (lunarYear - 4) % 12
    return {
      gan: lunar.TIAN_GAN[yearGanIndex],
      zhi: lunar.DI_ZHI[yearZhiIndex],
      wuxing: lunar.WU_XING[yearGanIndex]
    }
  }

  // 计算月柱
  calculateMonthPillar() {
    const lunarMonth = this.lunar.getLunarMonth()
    const solarTerm = this.lunar.getSolarTerm()
    const yearGan = this.calculateYearPillar().gan
    const baseMonthGanIndex = lunar.TIAN_GAN.indexOf(yearGan) * 2
    
    // 根据节气调整月柱
    let monthGanIndex = (baseMonthGanIndex + lunarMonth - 1) % 10
    if (solarTerm) {
      // 如果当天是节气，需要调整月柱
      const termIndex = Object.keys(lunar.SOLAR_TERMS).indexOf(solarTerm)
      if (termIndex % 2 === 0) { // 节
        monthGanIndex = (monthGanIndex + 1) % 10
      }
    }
    
    const monthZhiIndex = (lunarMonth + 2) % 12
    return {
      gan: lunar.TIAN_GAN[monthGanIndex],
      zhi: lunar.DI_ZHI[monthZhiIndex],
      wuxing: lunar.WU_XING[monthGanIndex]
    }
  }

  // 计算日柱
  calculateDayPillar() {
    const lunarDay = this.lunar.getLunarDay()
    const lunarMonth = this.lunar.getLunarMonth()
    const lunarYear = this.lunar.getLunarYear()
    
    // 计算距离甲子日的天数
    const baseDate = new Date(1900, 0, 31)
    const days = Math.floor((this.birthDate - baseDate) / (24 * 60 * 60 * 1000))
    
    // 计算日柱天干
    const dayGanIndex = (days + 10) % 10
    // 计算日柱地支
    const dayZhiIndex = (days + 10) % 12
    
    return {
      gan: lunar.TIAN_GAN[dayGanIndex],
      zhi: lunar.DI_ZHI[dayZhiIndex],
      wuxing: lunar.WU_XING[dayGanIndex]
    }
  }

  // 计算时柱
  calculateHourPillar() {
    const hour = this.birthDate.getHours()
    const dayGan = this.calculateDayPillar().gan
    const baseHourGanIndex = lunar.TIAN_GAN.indexOf(dayGan) * 2
    const hourGanIndex = (baseHourGanIndex + Math.floor(hour / 2)) % 10
    const hourZhiIndex = Math.floor(hour / 2) % 12
    
    return {
      gan: lunar.TIAN_GAN[hourGanIndex],
      zhi: lunar.DI_ZHI[hourZhiIndex],
      wuxing: lunar.WU_XING[hourGanIndex]
    }
  }

  // 计算五行强弱
  calculateWuxingStrength() {
    const pillars = {
      year: this.calculateYearPillar(),
      month: this.calculateMonthPillar(),
      day: this.calculateDayPillar(),
      hour: this.calculateHourPillar()
    }
    
    const wuxingCount = {
      '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    }
    
    // 统计五行出现次数
    Object.values(pillars).forEach(pillar => {
      wuxingCount[pillar.wuxing]++
    })
    
    // 计算五行强弱
    const wuxingStrength = {}
    for (let wuxing in wuxingCount) {
      wuxingStrength[wuxing] = wuxingCount[wuxing] / 4
    }
    
    return wuxingStrength
  }

  // 获取完整八字
  getBazi() {
    const yearPillar = this.calculateYearPillar()
    const monthPillar = this.calculateMonthPillar()
    const dayPillar = this.calculateDayPillar()
    const hourPillar = this.calculateHourPillar()
    const wuxingStrength = this.calculateWuxingStrength()

    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      wuxingStrength: wuxingStrength
    }
  }
}

module.exports = BaziCalculator 