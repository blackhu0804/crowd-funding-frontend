'use client';

import { useChainId } from 'wagmi';
import { sepolia, baseSepolia, mainnet, base } from 'wagmi/chains';

const CHAIN_INFO = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    isTestnet: false,
  },
  [base.id]: {
    name: 'Base Mainnet',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    isTestnet: false,
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    isTestnet: true,
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia Testnet',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    isTestnet: true,
  },
};

export function ChainInfo() {
  const chainId = useChainId();
  const chainInfo = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO] || {
    name: 'Unknown Network',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    isTestnet: false,
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${chainInfo.bgColor} ${chainInfo.color}`}>
      <div className={`w-2 h-2 rounded-full ${chainInfo.isTestnet ? 'bg-yellow-400' : 'bg-green-400'}`} />
      <span className="text-sm font-medium">{chainInfo.name}</span>
      {chainInfo.isTestnet && <span className="text-xs bg-yellow-200 px-2 py-0.5 rounded">测试网</span>}
    </div>
  );
}