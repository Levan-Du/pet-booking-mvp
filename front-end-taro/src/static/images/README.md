# 静态资源目录

此目录用于存放项目的静态资源文件，包括图片、图标等。

## 需要的图片文件

根据项目需求，需要准备以下图片文件：

1. **宠物类型图标**
   - `dog.png` - 狗狗图标
   - `cat.png` - 猫咪图标  
   - `other.png` - 其他宠物图标

2. **应用图标**
   - 应用图标文件（根据各平台要求）

## 使用说明

在代码中引用静态资源时，使用相对路径：

```typescript
// 在React组件中
<Image src="/static/images/dog.png" />

// 在SCSS中
background-image: url('/static/images/dog.png');
```

请确保所有图片文件都已正确放置在此目录中。