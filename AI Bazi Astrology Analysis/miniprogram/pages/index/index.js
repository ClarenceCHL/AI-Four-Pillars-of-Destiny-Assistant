const app = getApp()

Page({
  data: {
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  },

  onBirthDateChange(e) {
    this.setData({
      birthDate: e.detail.value
    })
  },

  onBirthTimeChange(e) {
    this.setData({
      birthTime: e.detail.value
    })
  },

  onBirthPlaceInput(e) {
    this.setData({
      birthPlace: e.detail.value
    })
  },

  onSubmit() {
    const { birthDate, birthTime, birthPlace } = this.data
    
    if (!birthDate || !birthTime || !birthPlace) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    // 保存用户信息到全局数据
    app.globalData.birthInfo = {
      date: birthDate,
      time: birthTime,
      place: birthPlace
    }

    // 跳转到分析页面
    wx.navigateTo({
      url: '/pages/analysis/analysis'
    })
  }
}) 