import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/docs-demo/",
  title: "运维笔记",
  description: "记录运维技术栈",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/zabbix_configuration' }
    ],

    sidebar: [
      {
        text: 'Linux部署',
        items: [
          { text: 'Linux部署Zabbix', link: '/zabbix_configuration' },
          { text: 'Linux部署Jumpserver堡垒机', link: '/jumpserver1' }
        ]
      }
    ],

    // socialLinks: [
    //   { icon: 'gitee', link: 'https://gitee.com/' }
    // ],

    footer:{
      copyright:"Copyright © 2025-present Alistar",
    },
  }
})
