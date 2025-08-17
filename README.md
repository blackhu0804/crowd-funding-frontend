# CrowdChain - 去中心化众筹平台 🚀

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4)
![Wagmi](https://img.shields.io/badge/Wagmi-2.0+-purple)
![RainbowKit](https://img.shields.io/badge/RainbowKit-2.0+-orange)

一个基于区块链技术的现代化去中心化众筹平台，提供透明、安全、无中介的众筹解决方案。让创新项目直接连接支持者，实现真正的去中心化融资。

🚀 **在线体验**: [https://crowd-funding-frontend-se2a.vercel.app](https://crowd-funding-frontend-se2a.vercel.app)

## ✨ 功能特点

### 🔐 钱包集成
- ✅ 支持多种主流钱包（MetaMask、WalletConnect、Coinbase Wallet 等）
- ✅ 一键连接，安全便捷
- ✅ 自动检测网络切换

### 💎 众筹功能
- ✅ **创建众筹活动** - 设置目标金额、描述和持续时间
- ✅ **智能合约托管** - 资金安全透明，自动执行
- ✅ **实时进度追踪** - 动态显示筹资进度
- ✅ **自动退款机制** - 未达标项目自动退还投资

### 📊 管理功能
- ✅ **个人活动管理** - 查看和管理自己创建的项目
- ✅ **活动浏览** - 浏览平台所有众筹项目
- ✅ **管理员控制** - 合约暂停/恢复功能

### 🌍 网络支持
- ✅ **测试网**: Sepolia（已部署）
- 🚧 **主网**: 计划支持 Ethereum、Base
- 🚧 **其他测试网**: 计划支持 Base Sepolia

## 🛠 技术栈

### 前端技术
- **框架**: Next.js 15.4.6 (App Router)
- **语言**: TypeScript (严格模式)
- **样式**: Tailwind CSS v4
- **UI 组件**: 自定义组件库

### Web3 技术栈
- **钱包连接**: RainbowKit 2.0+
- **区块链交互**: Wagmi 2.0+
- **以太坊库**: Ethers.js v6
- **合约交互**: 自定义 Hooks

### 开发工具
- **构建工具**: Turbopack
- **代码规范**: ESLint
- **类型检查**: TypeScript
- **部署**: Vercel

## 🚀 快速开始

### 环境要求
- Node.js 18.0+ 
- npm 或 yarn
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/web3-cf-app.git
   cd web3-cf-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   
   创建 `.env.local` 文件：
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

   > 💡 获取 WalletConnect Project ID: 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/) 注册并创建项目

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📖 使用指南

### 🔗 连接钱包
1. 点击页面右上角"连接钱包"按钮
2. 选择你偏好的钱包类型（推荐 MetaMask）
3. 确保钱包切换到 Sepolia 测试网
4. 确认连接并授权

### 🎯 创建众筹项目
1. 确保钱包已连接并在 Sepolia 测试网
2. 点击"创建众筹"
3. 填写项目信息：
   - **项目名称**: 简洁明了的项目标题
   - **项目描述**: 详细说明项目内容和目标
   - **目标金额**: 设置筹资目标（ETH）
   - **持续时间**: 众筹持续天数
4. 确认交易并等待区块链确认

### 💰 支持项目
1. 浏览"所有项目"页面
2. 选择感兴趣的项目
3. 输入支持金额
4. 确认交易

### 📊 管理项目
- **查看我的项目**: 在"我的活动"中管理已创建的项目
- **追踪进度**: 实时查看筹资进度和支持者信息
- **提取资金**: 项目达标后可提取筹集的资金

## 🔧 开发命令

```bash
npm run dev          # 启动开发服务器 (Turbopack)
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行代码检查
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
├── components/             # React 组件
│   ├── WalletConnect.tsx   # 钱包连接组件
│   ├── TokenInteraction.tsx # 代币交互组件
│   ├── CrowdfundingFactory.tsx # 众筹工厂组件
│   ├── ChainInfo.tsx       # 网络信息组件
│   └── LandingPage.tsx     # 首页组件
├── config/
│   └── wagmi.ts           # Wagmi/RainbowKit 配置
├── providers/
│   └── Web3Provider.tsx   # Web3 上下文提供者
├── contracts/             # 智能合约 ABI 和地址
├── hooks/
│   └── useContract.ts     # 合约交互 Hooks
└── styles/               # 样式文件
```

## 🌐 支持的网络

| 网络 | 链 ID | 类型 | 状态 |
|------|-------|------|------|
| Sepolia | 11155111 | 测试网 | ✅ 已部署 |
| Ethereum Mainnet | 1 | 主网 | 🚧 计划中 |
| Base | 8453 | 主网 | 🚧 计划中 |
| Base Sepolia | 84532 | 测试网 | 🚧 计划中 |

## 📦 智能合约

### 合约代码仓库
🔗 **合约源码**: [https://github.com/blackhu0804/crowd-funding](https://github.com/blackhu0804/crowd-funding)

### 合约地址
- **CrowdfundingFactory** (Sepolia): `0x7958c5845f4638307e2871c0be6B6bEb22d29cC3`

### 主要功能
- ✅ 创建众筹活动
- ✅ 投资支持项目  
- ✅ 自动资金托管
- ✅ 达标自动释放
- ✅ 未达标自动退款
- ✅ 管理员控制

### 测试说明
> ⚠️ **注意**: 当前仅在 Sepolia 测试网部署，请使用测试 ETH 进行测试。可通过 [Sepolia Faucet](https://sepoliafaucet.com/) 获取测试 ETH。

## 🚀 部署

### 在线访问
- **生产环境**: [https://crowd-funding-frontend-se2a.vercel.app](https://crowd-funding-frontend-se2a.vercel.app)
- **状态**: ✅ 运行中

### Vercel 部署 (推荐)

1. **连接仓库**
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/web3-cf-app)

2. **环境变量配置**
   
   在 Vercel 后台添加：
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

3. **自动部署**
   
   推送到主分支即可自动部署

### 本地构建
```bash
npm run build
npm run start
```

## 🛣️ 路线图

- [x] 基础众筹功能实现
- [x] Sepolia 测试网部署
- [ ] 主网部署（Ethereum）
- [ ] Base 网络支持
- [ ] 项目分类和搜索功能
- [ ] NFT 奖励机制
- [ ] 社区治理功能

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 问题反馈

如果你遇到问题或有改进建议：

- 🐛 [报告 Bug](https://github.com/your-username/web3-cf-app/issues)
- 💡 [功能建议](https://github.com/your-username/web3-cf-app/issues)


---

⭐ 如果这个项目对你有帮助，请给我们一个 Star！
