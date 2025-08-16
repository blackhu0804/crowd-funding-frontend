# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js-based Web3 DApp for crowdfunding interactions using RainbowKit, Wagmi, and Ethers.js. The application provides token interaction capabilities and crowdfunding campaign management on Ethereum and Base networks.

## Development Commands

```bash
# Development
npm run dev          # Start development server with turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture & Key Components

### Core Structure
- **Framework**: Next.js 15.4.6 with App Router
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4
- **Web3 Stack**: RainbowKit + Wagmi + Ethers.js v6

### Directory Layout
- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - React components for UI features
  - `WalletConnect.tsx` - RainbowKit wallet connection button
  - `TokenInteraction.tsx` - ERC20 token operations (balance, transfer)
  - `CrowdfundingFactory.tsx` - Campaign creation and management
  - `ChainInfo.tsx` - Network status display
- `/src/config/wagmi.ts` - Wagmi/RainbowKit configuration
- `/src/providers/Web3Provider.tsx` - Web3 context provider wrapper
- `/src/contracts/` - Smart contract ABIs and addresses
- `/src/hooks/useContract.ts` - Custom contract interaction hooks

### Web3 Configuration
- **Networks**: Mainnet, Base, Sepolia, Base Sepolia
- **WalletConnect**: Requires NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in environment
- **Contract Addresses**: Defined in `/src/contracts/index.ts`
  - USDC tokens on multiple networks
  - Custom CrowdfundingFactory test contract

### Key Features
1. **Multi-chain support** with network-specific token addresses
2. **Token interactions**: Balance checking, transfers, token info display
3. **Crowdfunding factory**: Campaign creation, user campaigns, admin controls
4. **Responsive design** with Tailwind CSS
5. **Transaction states** with loading indicators and error handling

### Environment Setup
Create `.env.local` with:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Contract Integration
- **ERC20 Token**: Standard token operations across networks
- **CrowdfundingFactory**: Campaign creation and management
- **Custom hooks**: `useContractRead` and `useContractWrite` for simplified contract interactions

### Testing Notes
- Uses testnet contracts on Sepolia and Base Sepolia
- USDC test tokens available for testing transfers
- Factory contract supports campaign creation with ETH goals