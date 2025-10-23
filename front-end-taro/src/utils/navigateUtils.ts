import Taro from '@tarojs/taro';

export const redirectTo = (redirectToUrl) => {
  // 获取当前页面路径
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const currentPath = `/${currentPage.route}`;

  // 跳转到登录页
  Taro.redirectTo({
    url: `${redirectToUrl}?redirect=${encodeURIComponent(currentPath)}`
  });
}