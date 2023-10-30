# vue3-H5-VantUI4

基于 vue3 + vite + （nutui or varlet or vant） + sass + viewport 适配方案 + axios 封装，构建手机端模板脚手架

如果你不熟悉 vue3，想继续使用 vue2 开发的，可以[点这里](https://github.com/crush2020/vue2-H5-VantUi)来获取 vue2-H5-VantUi

# node 版本要求

推荐 16.17.0+以上的版本，毕竟 2022 年了，别掐着 12+的版本了，你也可以使用nvm或nvm-windows在同一台电脑上管理多个 node 版本。

# 包管理器

尽量使用 yarn 或者 pnpm，本项目仅保证在 yarn 或 pnpm 下正确运行，npm 涉及到网络环境等各种情况的限制不做过多考虑。如要使用 npm 请不要切换淘宝镜像，会有各种奇怪的 bug。

# 启动项目

```bash
// 拉取项目
git clone https://github.com/crush2020/vue3-H5-VantUI4

// 安装依赖
yarn install

// 启动项目
yarn dev
```

# 静态资源

https://svn.shunwang.com/svn/icloud/Code/Code_A/APPSTORE/channel/wangwei-manage/trunk/wangwei-manage-front/src/main/resources/static

# 静态文件

https://svn.shunwang.com/svn/icloud/Code/Code_A/APPSTORE/channel/wangwei-manage/trunk/wangwei-manage-static/src/main/webapp/

然后，使用 svn 上传这些文件到代码仓库中。

打开 jenkins，找到 wangwei-manage-T（这里是 T 代表 trunk，如果是分支开发，请使用 B，代表 branches），找到对象的项目，构建对应的目录。然后等待测试部署测试后的反馈。
