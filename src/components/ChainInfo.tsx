'use client';

import { useChainId } from 'wagmi';
import { sepolia, baseSepolia, mainnet, base } from 'wagmi/chains';

const CHAIN_INFO = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    color: 'text-green-300',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    dotColor: 'bg-green-400',
    isTestnet: false,
  },
  [base.id]: {
    name: 'Base Mainnet',
    color: 'text-blue-300',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    dotColor: 'bg-blue-400',
    isTestnet: false,
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    color: 'text-yellow-300',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    dotColor: 'bg-yellow-400',
    isTestnet: true,
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia Testnet',
    color: 'text-purple-300',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    dotColor: 'bg-purple-400',
    isTestnet: true,
  },
};

export function ChainInfo() {
  const chainId = useChainId();
  const chainInfo = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO] || {
    name: 'Unknown Network',
    color: 'text-gray-300',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/30',
    dotColor: 'bg-gray-400',
    isTestnet: false,
  };

  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl backdrop-blur-sm border ${chainInfo.bgColor} ${chainInfo.borderColor} ${chainInfo.color}`}>
      <div className={`w-3 h-3 rounded-full ${chainInfo.dotColor} animate-pulse`} />
      <span className="text-sm font-medium">{chainInfo.name}</span>
      {chainInfo.isTestnet && (
        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md border border-yellow-500/30">
          测试网
        </span>
      )}
    </div>
  );
}