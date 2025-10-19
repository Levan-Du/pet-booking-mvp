export default {
  pages: [
    'pages/index/index',
    'pages/admin/login',
    'pages/dashboard/dashboard',
    'pages/databoard/databoard',
    'pages/reports/reports',
    'pages/store/store',
    'pages/appointment-detail/appointment-detail',
    'pages/operation-log/operation-log'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '宠物服务预约',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#007AFF',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/dashboard/dashboard',
        text: '预约管理',
        iconPath: '/static/images/dashboard.png',
        selectedIconPath: '/static/images/dashboard.png'
      },
      {
        pagePath: 'pages/databoard/databoard',
        text: '数据看板',
        iconPath: '/static/images/databoard.png',
        selectedIconPath: '/static/images/databoard.png'
      },
      {
        pagePath: 'pages/reports/reports',
        text: '报表统计',
        iconPath: '/static/images/reports.png',
        selectedIconPath: '/static/images/reports.png'
      }
    ]
  }
}