'use client';

import { useAccount, useChainId } from 'wagmi';
import { WalletConnect } from './WalletConnect';
import { ChainInfo } from './ChainInfo';
import { useContractRead, useContractWrite } from '@/hooks/useContract';
import { ContractAddresses, ContractABIs } from '@/contracts';
import { useState } from 'react';
import { ethers } from 'ethers';
import { sepolia, baseSepolia, mainnet, base } from 'wagmi/chains';

interface Campaign {
  campaginAddress: string;
  owner: string;
  name: string;
  creationTime: bigint;
}

const getFactoryAddress = (chainId: number) => {
  // 你的测试合约部署在Sepolia测试网
  return ContractAddresses.CROWDFUNDING_FACTORY;
};

export function CrowdfundingFactory() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');

  const contractAddress = getFactoryAddress(chainId);

  // 读取合约状态
  const { data: owner } = useContractRead(
    { address: contractAddress, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'owner'
  );

  const { data: paused } = useContractRead(
    { address: contractAddress, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'paused'
  );

  const { data: allCampaigns } = useContractRead(
    { address: contractAddress, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'getAllCampaigns'
  );

  const { data: userCampaigns } = useContractRead(
    { address: contractAddress, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'getUserCampagins',
    [address]
  );

  // 写入功能
  const { write: createCampaign, isPending: isCreating, isConfirming: isCreatingConfirming, isConfirmed: isCreated, error: createError } = useContractWrite(
    { address: contractAddress, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'createCampagin'
  );

  const { write: togglePause, isPending: isToggling, isConfirming: isTogglingConfirming, isConfirmed: isToggled, error: toggleError } = useContractWrite(
    { address: contractAddress, abi: ContractABIs.CROWDFUNDING_FACTORY },
    'togglePause'
  );

  const handleCreateCampaign = async () => {
    if (!name || !description || !goal || !duration) return;
    
    try {
      const goalInWei = ethers.parseEther(goal);
      const durationInDays = BigInt(duration);
      
      await createCampaign([name, description, goalInWei, durationInDays]);
      
      // 重置表单
      setName('');
      setDescription('');
      setGoal('');
      setDuration('');
    } catch (err) {
      console.error('Create campaign failed:', err);
    }
  };

  const handleTogglePause = async () => {
    try {
      await togglePause([]);
    } catch (err) {
      console.error('Toggle pause failed:', err);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const isOwner = address?.toLowerCase() === owner?.toLowerCase();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">连接钱包开始</h2>
          <p className="text-gray-300 mb-8">请连接您的钱包以访问众筹平台功能</p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">众筹工厂</h2>
            <p className="text-gray-300 text-lg">创建和管理众筹活动</p>
          </div>
          <div className="flex items-center space-x-4">
            <ChainInfo />
            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${
              paused ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'
            }`}>
              {paused ? '已暂停' : '运行中'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600/30 p-6 rounded-xl hover:border-cyan-500/30 transition-all duration-300">
            <p className="text-sm text-gray-400 mb-2">合约所有者</p>
            <p className="text-sm font-mono text-white truncate">{owner || '加载中...'}</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600/30 p-6 rounded-xl hover:border-purple-500/30 transition-all duration-300">
            <p className="text-sm text-gray-400 mb-2">合约地址</p>
            <p className="text-sm font-mono text-white truncate">{contractAddress}</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600/30 p-6 rounded-xl hover:border-pink-500/30 transition-all duration-300">
            <p className="text-sm text-gray-400 mb-2">总活动数</p>
            <p className="text-2xl font-bold text-white">{allCampaigns?.length || 0}</p>
          </div>
        </div>

        {isOwner && (
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <h3 className="font-bold text-yellow-300 mb-4 text-lg">管理员操作</h3>
            <button
              onClick={handleTogglePause}
              disabled={isToggling || isTogglingConfirming}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-400 hover:to-orange-400 disabled:from-gray-500 disabled:to-gray-600 font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              {isToggling ? '处理中...' : isTogglingConfirming ? '确认中...' : paused ? '恢复合约' : '暂停合约'}
            </button>
            {toggleError && (
              <p className="text-red-300 text-sm mt-3 bg-red-500/20 p-3 rounded-lg border border-red-500/30">{toggleError.message}</p>
            )}
            {isToggled && (
              <p className="text-green-300 text-sm mt-3 bg-green-500/20 p-3 rounded-lg border border-green-500/30">操作成功！</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 创建众筹活动 */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6">创建新活动</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">活动名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：新产品开发"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                disabled={paused}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">活动描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="详细描述你的众筹目标和用途"
                rows={4}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 resize-none"
                disabled={paused}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">目标金额 (ETH)</label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="1.0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                disabled={paused}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">持续时间 (天)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                min="1"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                disabled={paused}
              />
            </div>
            
            <button
              onClick={handleCreateCampaign}
              disabled={!name || !description || !goal || !duration || isCreating || isCreatingConfirming || paused}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 px-6 rounded-xl hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed font-medium text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-cyan-500/25"
            >
              {isCreating ? '创建中...' : isCreatingConfirming ? '确认中...' : '创建活动'}
            </button>
            
            {createError && (
              <div className="bg-red-500/20 text-red-300 p-4 rounded-xl border border-red-500/30">
                错误: {createError.message}
              </div>
            )}
            
            {isCreated && (
              <div className="bg-green-500/20 text-green-300 p-4 rounded-xl border border-green-500/30">
                活动创建成功！
              </div>
            )}
            
            {paused && (
              <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-xl border border-yellow-500/30">
                合约已暂停，无法创建新活动
              </div>
            )}
          </div>
        </div>

        {/* 用户活动列表 */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6">我的活动</h3>
          
          {userCampaigns && userCampaigns.length > 0 ? (
            <div className="space-y-4">
              {userCampaigns.map((campaign: Campaign, index: number) => (
                <div key={index} className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 p-6 rounded-xl hover:border-cyan-500/40 transition-all duration-300 transform hover:scale-[1.02]">
                  <h4 className="font-bold text-white text-lg mb-3">{campaign.name}</h4>
                  <p className="text-sm text-gray-300 mb-2">地址: <span className="font-mono text-cyan-300">{campaign.campaginAddress}</span></p>
                  <p className="text-sm text-gray-300">创建时间: <span className="text-purple-300">{formatTimestamp(campaign.creationTime)}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-400">你还没有创建任何活动</p>
            </div>
          )}
        </div>
      </div>

      {/* 所有活动列表 */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 mt-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">所有活动</h3>
        
        {allCampaigns && allCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allCampaigns.map((campaign: Campaign, index: number) => (
              <div key={index} className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 p-6 rounded-xl hover:border-purple-500/40 transition-all duration-300 transform hover:scale-[1.02]">
                <h4 className="font-bold text-white text-lg mb-3">{campaign.name}</h4>
                <p className="text-sm text-gray-300 mb-2">创建者: <span className="font-mono text-green-300">{campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}</span></p>
                <p className="text-sm text-gray-300 mb-2">地址: <span className="font-mono text-cyan-300">{campaign.campaginAddress.slice(0, 6)}...{campaign.campaginAddress.slice(-4)}</span></p>
                <p className="text-sm text-gray-300">创建时间: <span className="text-purple-300">{formatTimestamp(campaign.creationTime)}</span></p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">还没有任何活动</p>
            <p className="text-gray-500 text-sm mt-2">成为第一个创建众筹活动的人吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}