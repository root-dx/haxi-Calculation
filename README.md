# 哈希计算工具

基于 Vue 3 + Electron 的哈希计算工具，支持 SHA-256 和 SM3 算法。

## 功能特性

- ✅ 支持 SHA-256 算法（国际通用标准）
- ✅ 支持 SM3 算法（国家商用密码标准）
- ✅ 支持大文件（最大 2GB）流式计算
- ✅ 拖拽上传或点击选择文件
- ✅ 本地计算，不传输、不存储任何数据
- ✅ 一键复制哈希值和完整信息
- ✅ 便携版免安装运行

## 开发环境

- Node.js 18+
- npm 或 pnpm

## 安装依赖

```bash
cd hash-calculator
npm install
```

## 开发模式

```bash
# 启动开发服务器
npm run dev

# 同时启动 Electron
npm run electron:dev
```

## 构建

### 构建便携版（免安装）

```bash
npm run build:win-portable
```

构建完成后，会在 `release` 目录生成 `哈希计算工具 1.0.0.exe`，双击即可运行，无需安装。

### 构建安装版

```bash
npm run build:win
```

构建完成后，会在 `release` 目录生成安装程序。

## 项目结构

```
hash-calculator/
├── electron/           # Electron 主进程
│   ├── main.cjs       # 主进程入口
│   └── preload.cjs    # 预加载脚本
├── src/               # 渲染进程源代码
│   ├── components/    # Vue 组件
│   ├── utils/         # 工具函数
│   ├── App.vue        # 主组件
│   ├── main.js        # 入口文件
│   └── style.css      # 全局样式
├── index.html         # HTML 模板
├── package.json       # 项目配置
└── vite.config.js     # Vite 配置
```

## 技术栈

- Vue 3 - 前端框架
- Electron - 桌面应用框架
- Vite - 构建工具
- hash-wasm - 哈希计算库（支持 SHA-256 和 SM3）
