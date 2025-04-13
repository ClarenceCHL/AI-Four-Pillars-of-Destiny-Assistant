const app = getApp()

Page({
  data: {
    date: '',
    time: '',
    place: '',
    errorMessage: ''
  },

  // 日期选择器变化
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  // 时间选择器变化
  onTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },

  // 地点选择器变化
  onPlaceChange(e) {
    this.setData({
      place: e.detail.value
    })
  },

  // 开始分析
  startAnalysis() {
    // 验证输入
    if (!this.data.date || !this.data.time || !this.data.place) {
      this.setData({
        errorMessage: '请填写完整的出生信息'
      })
      return
    }

    // 构建出生信息对象
    const birthInfo = {
      date: this.data.date,
      time: this.data.time,
      place: this.data.place
    }

    // 保存到全局变量
    app.globalData.birthInfo = birthInfo

    // 跳转到分析页面，并传递参数
    const url = `/pages/analysis/analysis?birthInfo=${encodeURIComponent(JSON.stringify(birthInfo))}`
    console.log('跳转URL:', url)
    
    wx.navigateTo({
      url: url,
      success: () => {
        console.log('跳转成功')
      },
      fail: (error) => {
        console.error('跳转失败:', error)
        this.setData({
          errorMessage: '页面跳转失败，请重试'
        })
      }
    })
  }
}) 