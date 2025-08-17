'use client';

import { useAccount } from 'wagmi';
import { WalletConnect } from './WalletConnect';
import { ChainInfo } from './ChainInfo';
import { useContractRead, useContractWrite } from '@/hooks/useContract';
import { ContractABIs } from '@/contracts';

interface CampaignDetailProps {
  campaignAddress: `0x${string}`;
  onBack: () => void;
}

interface Tier {
  name: string;
  amount: bigint;
  backers: bigint;
}

export function CampaignDetail({ campaignAddress, onBack }: CampaignDetailProps) {
  const { address, isConnected } = useAccount();

  // 基本信息读取
  const { data: name } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'name'
  ) as { data: string | undefined };

  const { data: description } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'description'
  ) as { data: string | undefined };

  const { data: goal } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'goal'
  ) as { data: bigint | undefined };

  const { data: deadline } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'deadline'
  ) as { data: bigint | undefined };

  const { data: owner } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'owner'
  ) as { data: string | undefined };

  const { data: contractBalance } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'getContractBalance'
  ) as { data: bigint | undefined };

  const { data: campaignState } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'getCampaginStatus'
  ) as { data: number | undefined };

  const { data: tiers } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'getTiers'
  ) as { data: Tier[] | undefined };

  const { data: userContribution } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'backers',
    [address]
  ) as { data: { totalContribution: bigint } | undefined };

  // 捐赠功能
  const { write: fundTier, isPending: isFunding, isConfirming: isFundingConfirming, isConfirmed: isFunded, error: fundError } = useContractWrite(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'fund'
  );

  const handleFund = async (tierIndex: number) => {
    if (!isConnected || !tiers || tierIndex >= tiers.length) return;
    
    try {
      fundTier([tierIndex], tiers[tierIndex].amount.toString());
    } catch (err) {
      console.error('Funding failed:', err);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const calculateProgress = () => {
    if (!goal || !contractBalance) return 0;
    const progress = (Number(contractBalance) / Number(goal)) * 100;
    return Math.min(progress, 100);
  };

  const isExpired = () => {
    if (!deadline) return false;
    return Date.now() > Number(deadline) * 1000;
  };

  const formatEther = (wei: bigint) => {
    return (Number(wei) / 1e18).toFixed(4);
  };

  const getStateText = () => {
    if (isExpired()) return '已过期';
    if (campaignState === 0) return '进行中';
    if (campaignState === 1) return '成功';
    if (campaignState === 2) return '失败';
    return '未知';
  };

  const getStateColor = () => {
    if (isExpired() || campaignState === 2) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (campaignState === 1) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (campaignState === 0) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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
                    {name || '加载中...'}
                  </h1>
                  <p className="text-gray-300 text-sm">
                    创建者: <span className="font-mono text-cyan-300">{owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : '加载中...'}</span>
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-medium border ${getStateColor()}`}>
                  {getStateText()}
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
                    已筹集: <span className="text-white font-medium">{contractBalance ? formatEther(contractBalance) : '0'} ETH</span>
                  </span>
                  <span className="text-gray-300">
                    目标: <span className="text-white font-medium">{goal ? formatEther(goal) : '0'} ETH</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">项目介绍</h3>
                <p className="text-gray-300 leading-relaxed">
                  {description || '暂无描述'}
                </p>
              </div>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 p-4 sm:p-6 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">截止时间</p>
                <p className="text-white font-medium text-sm">
                  {deadline ? formatTimestamp(deadline) : '加载中...'}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 p-4 sm:p-6 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">支持级别</p>
                <p className="text-xl font-bold text-white">
                  {tiers?.length || 0}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 p-4 sm:p-6 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">我的贡献</p>
                <p className="text-lg font-bold text-cyan-300">
                  {userContribution?.totalContribution ? formatEther(userContribution.totalContribution) : '0'} ETH
                </p>
              </div>
            </div>
          </div>

          {/* Donation Sidebar */}
          <div className="space-y-6">
            {/* Donation Form */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">支持级别</h3>
              
              {tiers && tiers.length > 0 ? (
                <div className="space-y-4">
                  {tiers.map((tier, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-4 hover:bg-gray-600/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-medium text-lg">{tier.name}</h4>
                          <p className="text-gray-400 text-sm">{Number(tier.backers)} 人支持</p>
                        </div>
                        <div className="text-right">
                          <p className="text-cyan-300 font-bold text-lg">{formatEther(tier.amount)} ETH</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleFund(index)}
                        disabled={isFunding || isFundingConfirming || campaignState !== 0 || isExpired()}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                      >
                        {isFunding ? '处理中...' : isFundingConfirming ? '确认中...' : '支持此级别'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">还没有支持级别</p>
                  <p className="text-gray-500 text-xs mt-1">创建者还未设置支持级别</p>
                </div>
              )}
              
              {fundError && (
                <div className="bg-red-500/20 text-red-300 p-4 rounded-xl border border-red-500/30 mt-4">
                  错误: {fundError.message}
                </div>
              )}

              {isFunded && (
                <div className="bg-green-500/20 text-green-300 p-4 rounded-xl border border-green-500/30 mt-4">
                  支持成功！感谢您的支持！
                </div>
              )}

              {(campaignState !== 0 || isExpired()) && (
                <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-xl border border-yellow-500/30 text-center mt-4">
                  此活动已结束，无法继续支持
                </div>
              )}
            </div>

            {/* Recent Contributors */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">活动统计</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">合约地址</span>
                  <span className="font-mono text-sm text-cyan-300">
                    {campaignAddress.slice(0, 6)}...{campaignAddress.slice(-4)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">合约余额</span>
                  <span className="text-white font-medium">
                    {contractBalance ? formatEther(contractBalance) : '0'} ETH
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">状态</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    campaignState === 0 ? 'bg-blue-500/20 text-blue-300' :
                    campaignState === 1 ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {getStateText()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}