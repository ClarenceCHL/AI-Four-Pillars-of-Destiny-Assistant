const app = getApp()
const { analyzeBazi, getPersonalizedSuggestions } = require('../../utils/api')
const BaziCalculator = require('../../utils/bazi')

Page({
  data: {
    birthInfo: null,
    baziInfo: null,
    wuxingStrength: null,
    suggestions: null,
    isLoading: false,
    errorMessage: '',
    isAnalyzing: false
  },

  onLoad(options) {
    console.log('分析页面加载，参数:', options)
    
    // 尝试从全局变量获取出生信息
    if (app.globalData.birthInfo) {
      console.log('从全局变量获取出生信息:', app.globalData.birthInfo)
      this.setData({ birthInfo: app.globalData.birthInfo })
      this.calculateBazi()
      return
    }
    
    // 如果全局变量中没有，则尝试从URL参数获取
    if (options.birthInfo) {
      try {
        const birthInfo = JSON.parse(decodeURIComponent(options.birthInfo))
        console.log('从URL参数获取出生信息:', birthInfo)
        this.setData({ birthInfo })
        this.calculateBazi()
      } catch (error) {
        console.error('解析出生信息失败:', error)
        this.setData({
          errorMessage: '解析出生信息失败，请重试',
          isLoading: false
        })
      }
    } else {
      console.error('未收到出生信息参数')
      this.setData({
        errorMessage: '未收到出生信息，请重新输入',
        isLoading: false
      })
    }
  },

  calculateBazi() {
    if (!this.data.birthInfo) {
      console.error('缺少出生信息')
      this.setData({
        errorMessage: '缺少出生信息，请重新输入',
        isLoading: false
      })
      return
    }

    console.log('开始计算八字，出生信息:', this.data.birthInfo)
    this.setData({ isLoading: true, errorMessage: '' })

    try {
      const { date, time, place } = this.data.birthInfo
      console.log('创建 BaziCalculator 实例，参数:', { date, time, place })
      
      // 检查参数
      if (!date || !time) {
        throw new Error('日期或时间参数缺失')
      }

      const calculator = new BaziCalculator(date, time, place)
      console.log('BaziCalculator 实例创建成功')
      
      const bazi = calculator.getBazi()
      console.log('八字计算结果:', bazi)

      // 格式化八字信息
      const baziInfo = {
        yearPillar: bazi.year.gan + bazi.year.zhi,
        monthPillar: bazi.month.gan + bazi.month.zhi,
        dayPillar: bazi.day.gan + bazi.day.zhi,
        hourPillar: bazi.hour.gan + bazi.hour.zhi,
        analysis: 'AI正在生成分析结果'
      }

      // 格式化五行强度
      const wuxingStrength = {
        wood: bazi.wuxingStrength['木'],
        fire: bazi.wuxingStrength['火'],
        earth: bazi.wuxingStrength['土'],
        metal: bazi.wuxingStrength['金'],
        water: bazi.wuxingStrength['水']
      }

      // 保存计算结果到全局变量
      app.globalData.baziAnalysis = baziInfo
      app.globalData.wuxingStrength = wuxingStrength

      this.setData({
        baziInfo,
        wuxingStrength,
        isLoading: false
      })

      // 开始AI分析
      this.analyzeBazi()
    } catch (error) {
      console.error('八字计算失败:', error)
      console.error('错误堆栈:', error.stack)
      this.setData({
        errorMessage: `八字计算失败: ${error.message || '未知错误'}`,
        isLoading: false
      })
    }
  },

  async analyzeBazi() {
    this.setData({ isAnalyzing: true })
    
    try {
      const result = await analyzeBazi(this.data.birthInfo)
      console.log('AI分析结果:', result)
      
      if (!result || !result.baziInfo) {
        throw new Error('AI分析结果格式错误')
      }

      // 更新分析内容
      const baziInfo = {
        ...this.data.baziInfo,
        analysis: result.baziInfo.analysis
      }

      this.setData({
        baziInfo,
        isAnalyzing: false
      })
    } catch (error) {
      console.error('AI分析失败:', error)
      this.setData({
        errorMessage: `AI分析失败: ${error.message}`,
        isAnalyzing: false
      })
    }
  },

  startPersonalizedConsultation() {
    if (this.data.errorMessage || !this.data.baziInfo) {
      console.error('无法开始个性化咨询:', this.data.errorMessage)
      return
    }
    
    console.log('开始个性化咨询')
    wx.navigateTo({
      url: '/pages/chat/chat?mode=consultation'
    })
  },

  retry() {
    console.log('重试八字分析')
    this.calculateBazi()
  }
}) 