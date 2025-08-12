'use client';

import { useAccount, useChainId } from 'wagmi';
import { WalletConnect } from './WalletConnect';
import { ChainInfo } from './ChainInfo';
import { useContractRead, useContractWrite } from '@/hooks/useContract';
import { ContractAddresses, ContractABIs } from '@/contracts';
import { useState } from 'react';
import { ethers } from 'ethers';
import { sepolia, baseSepolia, mainnet, base } from 'wagmi/chains';

const getContractAddress = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
      return ContractAddresses.USDC;
    case base.id:
      return ContractAddresses.USDC;
    case sepolia.id:
      return ContractAddresses.USDC_SEPOLIA;
    case baseSepolia.id:
      return ContractAddresses.USDC_BASE_SEPOLIA;
    default:
      return ContractAddresses.USDC_BASE_SEPOLIA; // 默认使用Base Sepolia
  }
};

const getTokenSymbol = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
      return 'USDC';
    case base.id:
      return 'USDC';
    case sepolia.id:
      return 'USDC';
    case baseSepolia.id:
      return 'USDC';
    default:
      return 'TOKEN';
  }
};

export function TokenInteraction() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const contractAddress = getContractAddress(chainId);
  const tokenSymbol = getTokenSymbol(chainId);

  // 读取代币信息
  const { data: name } = useContractRead(
    { address: contractAddress, abi: ContractABIs.ERC20 },
    'name'
  );
  
  const { data: symbol } = useContractRead(
    { address: contractAddress, abi: ContractABIs.ERC20 },
    'symbol'
  );
  
  const { data: decimals } = useContractRead(
    { address: contractAddress, abi: ContractABIs.ERC20 },
    'decimals'
  );

  const { data: totalSupply } = useContractRead(
    { address: contractAddress, abi: ContractABIs.ERC20 },
    'totalSupply'
  );

  const { data: balance } = useContractRead(
    { address: contractAddress, abi: ContractABIs.ERC20 },
    'balanceOf',
    [address]
  );

  // 转账功能
  const { write: transfer, isPending, isConfirming, isConfirmed, error } = useContractWrite(
    { address: contractAddress, abi: ContractABIs.ERC20 },
    'transfer'
  );

  const handleTransfer = async () => {
    if (!recipient || !amount) return;
    
    try {
      const amountInWei = ethers.parseUnits(amount, decimals || 6);
      await transfer([recipient, amountInWei]);
      setRecipient('');
      setAmount('');
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  const formatBalance = (balance: bigint) => {
    return ethers.formatUnits(balance, decimals || 6);
  };

  const formatSupply = (supply: bigint) => {
    return ethers.formatUnits(supply, decimals || 6);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">请先连接钱包</h2>
        <WalletConnect />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">代币信息</h2>
          <ChainInfo />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">代币名称</p>
            <p className="text-lg font-semibold">{name || '加载中...'}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">代币符号</p>
            <p className="text-lg font-semibold">{symbol || tokenSymbol}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">小数位数</p>
            <p className="text-lg font-semibold">{decimals?.toString() || '6'}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">合约地址</p>
            <p className="text-sm font-mono truncate">{contractAddress}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded mb-6">
          <p className="text-sm text-gray-600">你的余额</p>
          <p className="text-xl font-bold text-blue-600">
            {balance ? formatBalance(balance) : '0'} {symbol || tokenSymbol}
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4">转账</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                接收地址
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                数量 ({symbol || tokenSymbol})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={handleTransfer}
              disabled={!recipient || !amount || isPending || isConfirming}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPending ? '等待签名...' : isConfirming ? '确认中...' : '转账'}
            </button>
            
            {isConfirmed && (
              <div className="bg-green-100 text-green-800 p-3 rounded">
                转账成功！
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded">
                错误: {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}