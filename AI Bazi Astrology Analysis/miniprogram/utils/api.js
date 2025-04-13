// DeepSeek API 配置
const DEEPSEEK_API_KEY = 'DEEPSEEK_API_KEY'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 计算八字
const calculateBazi = (birthInfo) => {
  // 这里添加八字计算逻辑
  const { date, time } = birthInfo
  // 示例返回格式
  return {
    year: { gan: '甲', zhi: '子' },
    month: { gan: '乙', zhi: '丑' },
    day: { gan: '丙', zhi: '寅' },
    hour: { gan: '丁', zhi: '卯' },
    wuxingStrength: {
      wood: 0.8,
      fire: 0.6,
      earth: 0.4,
      metal: 0.3,
      water: 0.9
    }
  }
}

// 分析八字
const analyzeBazi = async (birthInfo) => {
  try {
    console.log('开始分析八字，出生信息:', birthInfo)
    
    // 计算八字
    const bazi = calculateBazi(birthInfo)
    console.log('八字计算结果:', bazi)

    // 构建分析请求
    const requestData = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的八字分析师，请用大白话简单直接的解释以下八字，语气需要高度拟人化让用户觉得在和真人对话。分析内容包括：1. 喜神，用神，和忌神，并用大白话解释一下分别是什么意思 2. 身强还是身弱 3. 适合住在什么元素多的区域 4. 结合大运流年讲讲需要赚钱方面要注意些什么'
        },
        {
          role: 'user',
          content: `请分析这个八字：${bazi.year.gan}${bazi.year.zhi} ${bazi.month.gan}${bazi.month.zhi} ${bazi.day.gan}${bazi.day.zhi} ${bazi.hour.gan}${bazi.hour.zhi}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }

    // 调用 DeepSeek API
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: DEEPSEEK_API_URL,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        data: requestData,
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.choices) {
            resolve(res.data.choices[0].message.content)
          } else {
            reject(new Error(`API 请求失败: ${res.statusCode} - ${JSON.stringify(res.data)}`))
          }
        },
        fail: (error) => {
          reject(new Error(`API 请求失败: ${error.errMsg}`))
        }
      })
    })

    // 返回格式化后的数据
    return {
      baziInfo: {
        year: { gan: bazi.year.gan, zhi: bazi.year.zhi },
        month: { gan: bazi.month.gan, zhi: bazi.month.zhi },
        day: { gan: bazi.day.gan, zhi: bazi.day.zhi },
        hour: { gan: bazi.hour.gan, zhi: bazi.hour.zhi },
        analysis: response
      },
      wuxingStrength: bazi.wuxingStrength
    }
  } catch (error) {
    console.error('八字分析失败:', error)
    throw error
  }
}

// 获取个性化建议
const getPersonalizedSuggestions = async (context) => {
  try {
    console.log('开始获取个性化建议，上下文:', context)
    
    const requestData = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的八字分析师，请根据用户的八字和具体问题提供个性化建议。要求用简单易懂的大白话建议，不要用专业术语，不要分段，几句简单的话语即可，并且语气要高度拟人化，有一定的情绪起伏'
        },
        {
          role: 'user',
          content: `基于以下分析结果：${context.baziAnalysis}\n\n五行强度：${JSON.stringify(context.wuxingStrength)}\n\n请针对用户的问题提供建议：${context.messages[context.messages.length - 1].content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }

    // 调用 DeepSeek API
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: DEEPSEEK_API_URL,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        data: requestData,
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.choices) {
            resolve(res.data.choices[0].message.content)
          } else {
            reject(new Error(`API 请求失败: ${res.statusCode} - ${JSON.stringify(res.data)}`))
          }
        },
        fail: (error) => {
          reject(new Error(`API 请求失败: ${error.errMsg}`))
        }
      })
    })

    return response
  } catch (error) {
    console.error('获取个性化建议失败:', error)
    throw error
  }
}

// 聊天对话
const chatWithAI = async (messages) => {
  try {
    console.log('开始AI对话，消息:', messages)
    
    const requestData = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的八字分析师，请根据用户的问题提供简单且通俗易懂的解答。要求用大白话解释，不要用专业术语，不要分段，几句简单的话语即可，并且语气要轻松幽默'
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000
    }

    // 调用 DeepSeek API
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: DEEPSEEK_API_URL,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        data: requestData,
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.choices) {
            resolve(res.data.choices[0].message.content)
          } else {
            reject(new Error(`API 请求失败: ${res.statusCode} - ${JSON.stringify(res.data)}`))
          }
        },
        fail: (error) => {
          reject(new Error(`API 请求失败: ${error.errMsg}`))
        }
      })
    })

    return response
  } catch (error) {
    console.error('AI对话失败:', error)
    throw error
  }
}

module.exports = {
  analyzeBazi,
  chatWithAI,
  getPersonalizedSuggestions
} 