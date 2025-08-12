import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, base, sepolia, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Web3 CF App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your_project_id_here',
  chains: [mainnet, polygon, arbitrum, base, sepolia, baseSepolia],
  ssr: true,
});