
export default {
  pages: [
    'pages/index/index',
    'pages/admin/login',
    'pages/management/management',
    'pages/databoard/databoard',
    'pages/reports/reports',
    'pages/store/store',
    'pages/appointment-detail/appointment-detail',
    'pages/operation-log/operation-log',
    'pages/user/user'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '宠物服务预约',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#b4282d',
    backgroundColor: '#fafafa',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/management/management',
        iconPath: './static/images/dashboard.png',
        selectedIconPath: './static/images/dashboard.png',
        text: '预约管理'
      },
      {
        pagePath: 'pages/databoard/databoard',
        iconPath: './static/images/databoard.png',
        selectedIconPath: './static/images/databoard.png',
        text: '数据看板'
      },
      {
        pagePath: 'pages/reports/reports',
        iconPath: './static/images/reports.png',
        selectedIconPath: './static/images/reports.png',
        text: '报表'
      }
    ]
  }
}