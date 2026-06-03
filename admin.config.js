export default {
  login: {
    url: '/uni_modules/uni-id-pages/pages/login/login-withpwd'
  },
  index: {
    url: '/pages/article/list' // 登录后默认进入攻略管理
  },
  error: {
    url: '/pages/error/404'
  },
  navBar: {
    logo: '/static/logo.png',
    langs: [
      { text: '中文简体', lang: 'zh-Hans' }
    ],
    themes: [
      { text: '默认', value: 'default' }
    ],
    debug: {
      enable: process.env.NODE_ENV !== 'production',
      engine: [
        { name: '百度', url: 'https://www.baidu.com/baidu?wd=ERR_MSG' }
      ]
    }
  },
  sideBar: {
    staticMenu: [
      {
        menu_id: 'content',
        text: '内容管理',
        icon: 'admin-icons-doc',
        url: '',
        children: [
          {
            menu_id: 'article-list',
            text: '攻略管理',
            icon: 'admin-icons-doc',
            value: '/pages/article/list'
          },
          {
            menu_id: 'destination-list',
            text: '目的地管理',
            icon: 'admin-icons-map',
            value: '/pages/destination/list'
          }
        ]
      },
      {
        menu_id: 'settings',
        text: '转化配置',
        icon: 'admin-icons-set',
        url: '',
        children: [
          {
            menu_id: 'cta-list',
            text: 'CTA 触点配置',
            icon: 'admin-icons-file',
            value: '/pages/cta/list'
          }
        ]
      }
    ]
  }
}
