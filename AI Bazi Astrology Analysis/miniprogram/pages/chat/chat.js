const app = getApp()
const { chatWithAI, getPersonalizedSuggestions } = require('../../utils/api')

Page({
  data: {
    messages: [],
    inputValue: '',
    isLoading: false,
    errorMessage: '',
    isConsultationMode: false,
    currentStep: 'location' // 当前咨询步骤：location -> direction -> details
  },

  onLoad(options) {
    // 检查是否是咨询模式
    const isConsultationMode = options.mode === 'consultation'
    this.setData({ isConsultationMode })

    // 根据模式设置不同的欢迎消息
    if (isConsultationMode) {
      this.setData({
        messages: [{
          role: 'assistant',
          content: '让我更多的从八字命理学的角度为你排忧解难。你有什么生活中拿不准的事，纠结的选择，都可以告诉我。'
        }]
      })
    } else {
      this.setData({
        messages: [{
          role: 'assistant',
          content: '让我从八字命理学的角度为你排忧解难。请你告诉我你的出生年月日时，我会为你进行详细的八字分析。'
        }]
      })
    }
  },

  // 输入框内容变化
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 发送消息
  async sendMessage() {
    if (!this.data.inputValue.trim() || this.data.isLoading) return

    const userMessage = this.data.inputValue.trim()
    
    // 添加用户消息到列表
    this.setData({
      messages: [...this.data.messages, {
        role: 'user',
        content: userMessage
      }],
      inputValue: '',
      isLoading: true,
      errorMessage: ''
    })

    try {
      let response
      if (this.data.isConsultationMode) {
        // 在咨询模式下，将八字分析信息作为上下文
        const context = {
          baziAnalysis: app.globalData.baziAnalysis,
          wuxingStrength: app.globalData.wuxingStrength,
          messages: this.data.messages,
          currentStep: this.data.currentStep
        }
        response = await getPersonalizedSuggestions(context)
        
        // 更新当前步骤
        if (this.data.currentStep === 'location') {
          this.setData({ currentStep: 'direction' })
        } else if (this.data.currentStep === 'direction') {
          this.setData({ currentStep: 'details' })
        }
      } else {
        // 普通聊天模式
        response = await chatWithAI([
          ...this.data.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ])
      }

      // 添加AI回复到消息列表
      this.setData({
        messages: [...this.data.messages, {
          role: 'assistant',
          content: response
        }],
        isLoading: false
      })
    } catch (error) {
      console.error('发送消息失败:', error)
      this.setData({
        errorMessage: '发送消息失败，请重试',
        isLoading: false
      })
    }
  },

  // 重试发送
  retry() {
    if (this.data.messages.length > 0) {
      const lastUserMessage = this.data.messages.findLast(msg => msg.role === 'user')
      if (lastUserMessage) {
        this.setData({
          inputValue: lastUserMessage.content
        }, () => {
          this.sendMessage()
        })
      }
    }
  }
}) 