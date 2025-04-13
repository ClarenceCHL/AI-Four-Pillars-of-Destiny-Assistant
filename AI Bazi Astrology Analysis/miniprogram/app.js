App({
  globalData: {
    userInfo: null,
    birthInfo: null,
    locationInfo: null,
    chatHistory: [],
    baziAnalysis: null, // 存储八字分析结果
    wuxingStrength: null // 存储五行强度分析
  },
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'your-env-id', // 请替换为你的云开发环境ID
        traceUser: true,
      })
    }
  }
}) 