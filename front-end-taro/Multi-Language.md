# 多语言支持文档

## 概述

宠物预约系统已实现完整的多语言支持，支持中英文界面切换。系统使用 React Context 和自定义国际化工具来管理语言状态和文本翻译。

## 目录结构

```
src/shared/i18n/
├── index.ts              # 国际化工具函数
├── LanguageContext.tsx   # 语言上下文管理
├── LanguageSwitcher.tsx # 语言切换组件
├── LanguageSwitcher.scss # 语言切换器样式
└── locales/
    ├── zh-CN.ts          # 中文语言包
    └── en-US.ts          # 英文语言包
```

## 核心组件

### 1. LanguageProvider

包装整个应用的根组件，提供语言上下文。

```tsx
import { LanguageProvider } from './shared/i18n/LanguageContext'

function App({ children }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}
```

### 2. useLanguage Hook

在组件中使用语言功能和翻译。

```tsx
import { useLanguage } from './shared/i18n/LanguageContext'

function MyComponent() {
  const { locale, setLocale, t } = useLanguage()
  
  return (
    <div>
      <span>{t('common.loading')}</span>
      <button onClick={() => setLocale('en-US')}>
        Switch to English
      </button>
    </div>
  )
}
```

### 3. LanguageSwitcher

下拉式语言切换器组件，显示国旗图标和下拉选择。

```tsx
import { LanguageSwitcher } from './shared/i18n/LanguageSwitcher'

function CustomNavbar() {
  return (
    <div className="navbar">
      {/* 其他导航内容 */}
      <LanguageSwitcher />
    </div>
  )
}
```

**功能特点：**
- 🇨🇳 显示当前语言的国旗图标
- ▼ 点击展开下拉菜单
- 🌐 支持中英文切换
- 💾 自动保存语言设置
- 🎯 点击外部自动关闭

## 语言包结构

语言包采用分层结构，便于管理和维护：

```typescript
export default {
  common: {
    loading: '加载中...',
    submit: '提交',
    confirm: '确认',
    // ... 更多通用文本
  },
  nav: {
    home: '首页',
    booking: '预约',
    dashboard: '预约管理',
    // ... 导航文本
  },
  booking: {
    title: '宠物服务预约',
    selectService: '选择服务',
    selectDate: '选择日期',
    // ... 预约相关文本
  },
  dashboard: {
    title: '预约管理',
    pending: '待确认',
    confirmed: '已确认',
    // ... 仪表板文本
  },
  petTypes: {
    dog: '狗狗',
    cat: '猫咪',
    other: '其他'
  },
  sizes: {
    small: '小型',
    medium: '中型',
    large: '大型'
  },
  errors: {
    required: '此项为必填项',
    invalidPhone: '请输入有效的手机号码'
  }
}
```

## 界面展示

### 下拉式语言切换器

**默认状态：**
```
[🇨🇳 ▼]
```

**展开状态：**
```
[🇨🇳 ▲]
├── 🇨🇳 中文
└── 🇺🇸 English
```

**功能特性：**
- ✅ 国旗图标直观显示当前语言
- ✅ 下拉箭头指示展开/收起状态
- ✅ 悬停效果和点击反馈
- ✅ 点击外部区域自动关闭
- ✅ 响应式设计，适配移动端

## 使用方法

### 1. 基本翻译

使用 `t()` 函数进行文本翻译：

```tsx
const { t } = useLanguage()

// 简单翻译
t('common.loading') // 返回当前语言的"加载中..."或"Loading..."

// 带参数的翻译（需要扩展语言包支持）
t('booking.availableSlots', { count: 3 }) // "3个空位" 或 "3 available slots"
```

### 2. 语言切换

```tsx
const { locale, setLocale, availableLocales } = useLanguage()

// 切换语言
setLocale('en-US')

// 获取可用语言列表
availableLocales.forEach(({ code, name }) => {
  console.log(`${code}: ${name}`)
})
```

### 3. 在类组件中使用

对于类组件，可以使用高阶组件或 Context.Consumer：

```tsx
import LanguageContext from './shared/i18n/LanguageContext'

class MyClassComponent extends React.Component {
  static contextType = LanguageContext
  
  render() {
    const { t } = this.context
    return <div>{t('common.loading')}</div>
  }
}
```

## 添加新语言

### 1. 创建语言包文件

在 `src/shared/i18n/locales/` 目录下创建新的语言文件：

```typescript
// fr-FR.ts
export default {
  common: {
    loading: 'Chargement...',
    submit: 'Soumettre',
    // ... 法语翻译
  },
  // ... 其他文本分类
}
```

### 2. 注册新语言

在 `src/shared/i18n/index.ts` 中添加新语言：

```typescript
import frFR from './locales/fr-FR'

export const i18n = {
  // ... 现有配置
  resources: {
    // ... 现有语言
    'fr-FR': frFR
  },
  getAvailableLocales: () => [
    // ... 现有语言
    { code: 'fr-FR', name: 'Français' }
  ]
}
```

## 最佳实践

### 1. 文本键名规范

- 使用小写字母和连字符
- 按功能模块分组
- 保持一致的命名约定

### 2. 动态内容处理

对于包含变量的文本，使用占位符：

```typescript
// 语言包定义
booking: {
  availableSlots: '{count}个空位'
}

// 使用方式
t('booking.availableSlots', { count: 5 })
```

### 3. 复数形式处理

对于需要复数形式的文本：

```typescript
// 语言包定义
common: {
  itemCount: {
    one: '{count} 项',
    other: '{count} 项'
  }
}

// 使用方式（需要扩展翻译函数支持复数）
t('common.itemCount', { count: items.length })
```

## 故障排除

### 1. 文本未翻译

检查：
- 键名是否正确
- 语言包是否包含该键
- 组件是否正确使用 useLanguage Hook

### 2. 语言切换不生效

检查：
- LanguageProvider 是否正确包装应用
- 本地存储权限是否正常
- 语言代码是否正确

### 3. 构建错误

检查：
- 语言包文件语法是否正确
- 导入路径是否正确
- TypeScript 类型定义是否完整

## 扩展功能

### 1. 日期和时间本地化

可以扩展支持日期格式本地化：

```typescript
import { format } from 'date-fns'
import { enUS, zhCN } from 'date-fns/locale'

const dateLocales = {
  'en-US': enUS,
  'zh-CN': zhCN
}

function formatDate(date: Date, locale: string) {
  return format(date, 'PP', { locale: dateLocales[locale] })
}
```

### 2. 数字和货币格式化

```typescript
function formatCurrency(amount: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CNY'
  }).format(amount)
}
```

## 预约状态管理

### 状态定义

系统支持以下预约状态：

| 状态代码 | 中文显示 | 英文显示 | 描述 |
|---------|---------|---------|------|
| `pending` | 待确认 | Pending | 新创建的预约，等待商家确认 |
| `confirmed` | 已确认 | Confirmed | 商家已确认预约 |
| `in_progress` | 进行中 | In Progress | 客户已到店，服务正在进行中 |
| `completed` | 已完成 | Completed | 服务已完成 |
| `cancelled` | 已取消 | Cancelled | 商家取消预约 |
| `broken` | 客户爽约 | Broken | 客户未按约定时间到达或自行取消 |

### 状态流转规则

**允许的状态变更：**
- **待确认** → 已确认 / 已取消
- **已确认** → 进行中 / 已取消 / 客户爽约
- **进行中** → 已完成 / 已取消
- **已完成** → 不可更改（最终状态）
- **已取消** → 不可更改（最终状态）
- **客户爽约** → 不可更改（最终状态）

### 操作按钮

在预约管理页面，根据当前状态显示相应的操作按钮：

- **待确认状态**：显示"确认"和"取消"按钮
- **已确认状态**：显示"开始服务"、"标记爽约"和"取消"按钮
- **进行中状态**：显示"完成"和"取消"按钮
- **已完成/已取消/客户爽约状态**：不显示操作按钮

### 扫码签到功能

系统支持二维码扫码签到功能：

**商家端功能：**
- 在预约管理页面点击"扫码签到"按钮
- 打开摄像头扫描客户预约二维码
- 自动将预约状态更新为"进行中"

**客户端功能：**
- 客户在预约详情页面查看预约二维码
- 二维码包含预约ID信息，格式：`appointment:{appointmentId}`
- 到店后向商家出示二维码进行签到

**技术实现：**
- 使用Taro的扫码API实现摄像头扫描
- 动态生成二维码，不存储二维码图片
- 二维码包含时间戳验证，防止重复使用

### 样式定义

每种状态都有对应的视觉样式：

```scss
.status-badge.pending {
  background-color: #fff3cd;  /* 黄色背景 */
  color: #856404;             /* 深黄色文字 */
}

.status-badge.confirmed {
  background-color: #d1ecf1;   /* 浅蓝色背景 */
  color: #0c5460;             /* 深蓝色文字 */
}

.status-badge.in_progress {
  background-color: #d4edda;   /* 浅绿色背景 */
  color: #155724;             /* 深绿色文字 */
}

.status-badge.completed {
  background-color: #d4edda;   /* 浅绿色背景 */
  color: #155724;             /* 深绿色文字 */
}

.status-badge.cancelled {
  background-color: #f8d7da;   /* 浅红色背景 */
  color: #721c24;             /* 深红色文字 */
}

.status-badge.broken {
  background-color: #e9ecef;   /* 浅灰色背景 */
  color: #495057;             /* 深灰色文字 */
}
```

## 总结

多语言支持系统提供了：
- ✅ 完整的中英文支持
- ✅ 动态语言切换
- ✅ 本地存储持久化
- ✅ 类型安全的翻译函数
- ✅ 可扩展的架构设计
- ✅ 完整的预约状态管理
- ✅ 客户爽约状态支持

系统已为后续添加更多语言支持做好了准备，只需按照上述步骤添加新的语言包即可。