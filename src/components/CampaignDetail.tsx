'use client';

import { useAccount } from 'wagmi';
import { WalletConnect } from './WalletConnect';
import { ChainInfo } from './ChainInfo';
import { useContractRead, useContractWrite } from '@/hooks/useContract';
import { ContractABIs } from '@/contracts';
import { useState, useEffect } from 'react';

interface CampaignDetailProps {
  campaignAddress: string;
  onBack: () => void;
}

interface CampaignInfo {
  owner: string;
  name: string;
  description: string;
  goal: bigint;
  deadline: bigint;
  amountRaised: bigint;
  isActive: boolean;
}

export function CampaignDetail({ campaignAddress, onBack }: CampaignDetailProps) {
  const { address, isConnected } = useAccount();
  const [donationAmount, setDonationAmount] = useState('');

  // 读取活动详情
  const { data: campaignInfo } = useContractRead(
    { address: campaignAddress as `0x${string}`, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'getCampaignInfo'
  ) as { data: CampaignInfo | undefined };

  const { data: contributors } = useContractRead(
    { address: campaignAddress as `0x${string}`, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'getContributors'
  );

  const { data: userContribution } = useContractRead(
    { address: campaignAddress as `0x${string}`, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'getContribution',
    [address]
  );

  // 捐赠功能
  const { write: donate, isPending: isDonating, isConfirming: isDonatingConfirming, isConfirmed: isDonated, error: donateError } = useContractWrite(
    { address: campaignAddress as `0x${string}`, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'contribute'
  );

  const handleDonate = async () => {
    if (!donationAmount || !isConnected) return;
    
    try {
      // Use dynamic import to avoid SSR issues
      const { ethers } = await import('ethers');
      await donate([], donationAmount);
      setDonationAmount('');
    } catch (err) {
      console.error('Donation failed:', err);
    }
  };

  const formatEther = (amount: bigint) => {
    if (!amount) return '0';
    // Use dynamic import for ethers
    return new Promise(async (resolve) => {
      const { ethers } = await import('ethers');
      resolve(ethers.formatEther(amount));
    });
  };

  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const calculateProgress = () => {
    if (!campaignInfo) return 0;
    const progress = (Number(campaignInfo.amountRaised) / Number(campaignInfo.goal)) * 100;
    return Math.min(progress, 100);
  };

  const isExpired = () => {
    if (!campaignInfo) return false;
    return Date.now() > Number(campaignInfo.deadline) * 1000;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-12 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">连接钱包开始</h2>
            <p className="text-gray-300 mb-8">请连接您的钱包以查看活动详情和进行捐赠</p>
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mr-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          <ChainInfo />
        </div>

        {/* Campaign Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Info */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {campaignInfo?.name || '加载中...'}
                  </h1>
                  <p className="text-gray-300 text-sm">
                    创建者: <span className="font-mono text-cyan-300">{campaignInfo?.owner.slice(0, 6)}...{campaignInfo?.owner.slice(-4)}</span>
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                  isExpired() ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                  campaignInfo?.isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                  'bg-gray-500/20 text-gray-300 border-gray-500/30'
                }`}>
                  {isExpired() ? '已过期' : campaignInfo?.isActive ? '进行中' : '已结束'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">筹款进度</span>
                  <span className="text-cyan-300 text-sm font-medium">{calculateProgress().toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-gray-300">
                    已筹集: <span className="text-white font-medium">{campaignInfo?.amountRaised ? 'Loading...' : '0'} ETH</span>
                  </span>
                  <span className="text-gray-300">
                    目标: <span className="text-white font-medium">{campaignInfo?.goal ? 'Loading...' : '0'} ETH</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">项目介绍</h3>
                <p className="text-gray-300 leading-relaxed">
                  {campaignInfo?.description || '暂无描述'}
                </p>
              </div>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 p-4 sm:p-6 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">截止时间</p>
                <p className="text-white font-medium text-sm">
                  {campaignInfo?.deadline ? formatTimestamp(campaignInfo.deadline) : '加载中...'}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 p-4 sm:p-6 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">支持人数</p>
                <p className="text-xl font-bold text-white">
                  {Array.isArray(contributors) ? contributors.length : 0}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 p-4 sm:p-6 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">我的贡献</p>
                <p className="text-lg font-bold text-cyan-300">
                  {userContribution ? 'Loading...' : '0'} ETH
                </p>
              </div>
            </div>
          </div>

          {/* Donation Sidebar */}
          <div className="space-y-6">
            {/* Donation Form */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">支持此项目</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">捐赠金额 (ETH)</label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="0.01"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    disabled={!campaignInfo?.isActive || isExpired()}
                  />
                </div>

                <button
                  onClick={handleDonate}
                  disabled={!donationAmount || isDonating || isDonatingConfirming || !campaignInfo?.isActive || isExpired()}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 px-6 rounded-xl hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed font-medium text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-cyan-500/25"
                >
                  {isDonating ? '处理中...' : isDonatingConfirming ? '确认中...' : '立即支持'}
                </button>

                {donateError && (
                  <div className="bg-red-500/20 text-red-300 p-4 rounded-xl border border-red-500/30">
                    错误: {donateError.message}
                  </div>
                )}

                {isDonated && (
                  <div className="bg-green-500/20 text-green-300 p-4 rounded-xl border border-green-500/30">
                    捐赠成功！感谢您的支持！
                  </div>
                )}

                {(!campaignInfo?.isActive || isExpired()) && (
                  <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-xl border border-yellow-500/30 text-center">
                    此活动已结束，无法继续捐赠
                  </div>
                )}
              </div>
            </div>

            {/* Recent Contributors */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">最近支持者</h3>
              
              {Array.isArray(contributors) && contributors.length > 0 ? (
                <div className="space-y-3">
                  {contributors.slice(0, 5).map((contributor: string, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="font-mono text-sm text-gray-300">
                        {contributor.slice(0, 6)}...{contributor.slice(-4)}
                      </span>
                      <span className="text-cyan-300 text-sm">💎</span>
                    </div>
                  ))}
                  {contributors.length > 5 && (
                    <p className="text-gray-400 text-sm text-center pt-2">
                      还有 {contributors.length - 5} 位支持者...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">还没有支持者</p>
                  <p className="text-gray-500 text-xs mt-1">成为第一个支持者吧！</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}