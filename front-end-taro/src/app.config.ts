export default {
  pages: [
    'pages/index/index',
    'pages/admin/login',
    'pages/dashboard',
    'pages/reports'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '宠物预约',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#007AFF',
    backgroundColor: '#fafafa',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/dashboard',
        text: '管理'
      }
    ]
  }
}