import Taro from '@tarojs/taro'
import { API_URLS } from '../shared/constants'

interface WebSocketMessage {
  type: string
  data?: any
  timestamp?: string
  appointmentId?: string
}

interface WebSocketOptions {
  url: string
  protocols?: string[]
  onOpen?: () => void
  onMessage?: (data: WebSocketMessage) => void
  onClose?: () => void
  onError?: (error: any) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export class WebSocketManager {
  private task: any = null
  private options: WebSocketOptions
  private reconnectAttempts = 0
  private reconnectTimer: any = null
  private isConnected = false

  constructor(options: WebSocketOptions) {
    this.options = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      ...options
    }
  }

  // 连接WebSocket
  async connect(): Promise<void> {
    if (this.task) {
      this.close()
    }

    this.task = await Taro.connectSocket({
      url: this.options.url,
      header: {
        'content-type': 'application/json'
      },
      protocols: this.options.protocols || []
    })

    this.task.onOpen(() => {
      console.log('✅ WebSocket连接成功')
      this.isConnected = true
      this.reconnectAttempts = 0

      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }

      if (this.options.onOpen) {
        this.options.onOpen()
      }
    })

    this.task.onMessage((res: any) => {
      try {
        const data = JSON.parse(res.data)
        console.log('📨 收到WebSocket消息:', data)

        if (this.options.onMessage) {
          this.options.onMessage(data)
        }
      } catch (error) {
        console.error('❌ 解析WebSocket消息失败:', error)
      }
    })

    this.task.onClose(() => {
      console.log('🔴 WebSocket连接关闭')
      this.isConnected = false

      if (this.options.onClose) {
        this.options.onClose()
      }

      // 自动重连
      this.attemptReconnect()
    })

    this.task.onError((error: any) => {
      console.error('❌ WebSocket连接错误:', error)
      this.isConnected = false

      if (this.options.onError) {
        this.options.onError(error)
      }

      // 自动重连
      this.attemptReconnect()
    })
  }

  // 发送消息
  send(message: WebSocketMessage): void {
    if (this.isConnected && this.task) {
      this.task.send({
        data: JSON.stringify(message)
      })
    } else {
      console.warn('⚠️ WebSocket未连接，无法发送消息')
    }
  }

  // 关闭连接
  close(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.task) {
      this.task.close()
      this.task = null
    }

    this.isConnected = false
    this.reconnectAttempts = 0
  }

  // 获取连接状态
  getConnectionStatus(): boolean {
    return this.isConnected
  }

  // 尝试重连
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts!) {
      console.error(`❌ 达到最大重连次数(${this.options.maxReconnectAttempts})，停止重连`)
      return
    }

    if (!this.reconnectTimer) {
      console.log(`🔄 尝试重连... (${this.reconnectAttempts + 1}/${this.options.maxReconnectAttempts})`)

      this.reconnectTimer = setTimeout(() => {
        this.reconnectAttempts++
        this.connect()
      }, this.options.reconnectInterval)
    }
  }
}

// 数据看板专用的WebSocket管理器
export class DataBoardWebSocketManager extends WebSocketManager {
  private onTodayStatsCallback: ((stats: any) => void) | null = null
  private onTodayNewAppointmentsCallback: ((appointments: any) => void) | null = null

  constructor() {
    super({
      url: API_URLS.WEBSOCKET_URL,
      protocols: ['databoard-protocol'],
      onMessage: (data) => {
        this.handleMessage(data)
      }
    })
  }

  // 订阅数据更新
  subscribe(): void {
    this.send({ type: 'subscribe' })
  }

  // 设置今日统计数据回调
  setOnTodayStatsCallback(callback: (stats: any) => void): void {
    console.log('websocket.ts -> setOnTodayStatsCallback')
    this.onTodayStatsCallback = callback
  }

  // 设置今日新增预约数据回调
  setOnTodayNewAppointmentsCallback(callback: (appointments: any[]) => void): void {
    console.log('websocket.ts -> setOnTodayNewAppointmentsCallback')
    this.onTodayNewAppointmentsCallback = callback
  }

  // 处理消息
  private handleMessage(data: any): void {
    console.log('websocket.ts -> handleMessage', data.type)
    if ((data.type === 'today_stats' || data.type === 'stats_updated') && this.onTodayStatsCallback) {
      this.onTodayStatsCallback(data.data.stats)
    }
    else if (data.type === 'appointment_updated' && this.onTodayNewAppointmentsCallback) {
      this.onTodayNewAppointmentsCallback(data.data || {})
    }
  }
}

// 创建数据看板WebSocket实例
export const dataBoardWebSocket = new DataBoardWebSocketManager()