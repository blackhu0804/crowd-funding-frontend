# Web3 众筹平台

基于 Next.js 的去中心化众筹平台，支持创建和管理众筹活动。

## 功能特点

- ✅ 连接钱包（支持多种钱包）
- ✅ 创建众筹活动
- ✅ 查看个人创建的众筹活动
- ✅ 浏览所有众筹活动
- ✅ 管理员权限控制（暂停/恢复合约）

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **Web3**: RainbowKit, Wagmi, Ethers.js v6
- **样式**: Tailwind CSS v4
- **网络**: 支持 Ethereum, Base, Sepolia, Base Sepolia

## 快速开始

### 环境配置

1. 克隆项目
2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建 `.env.local` 文件：
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

5. 打开 [http://localhost:3000](http://localhost:3000) 查看应用

## 使用说明

### 创建众筹活动
1. 连接钱包
2. 填写活动名称、描述、目标金额（ETH）和持续时间（天）
3. 确认交易创建活动

### 管理活动
- 在"我的活动"中查看个人创建的活动
- 在"所有活动"中浏览平台上的所有众筹活动

### 管理员功能
- 合约所有者可以暂停或恢复整个众筹平台

## 部署

使用 Vercel 平台一键部署：
```bash
npm run build
```

然后部署到 [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

## 合约信息

- **合约地址**: `0x9753137E0Ce905266F263f1847A722308B0990CB` (Sepolia测试网)
- **支持网络**: Ethereum, Base, Sepolia, Base Sepolia
