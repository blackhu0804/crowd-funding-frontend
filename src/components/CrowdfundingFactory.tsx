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
        <h2 className="text-2xl font-bold mb-4">请先连接钱包</h2>
        <WalletConnect />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">众筹工厂</h2>
            <p className="text-gray-600">创建和管理众筹活动</p>
          </div>
          <div className="flex items-center space-x-4">
            <ChainInfo />
            <div className={`px-3 py-1 rounded-full text-sm ${
              paused ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {paused ? '已暂停' : '运行中'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">合约所有者</p>
            <p className="text-sm font-mono truncate">{owner || '加载中...'}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">合约地址</p>
            <p className="text-sm font-mono truncate">{contractAddress}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">总活动数</p>
            <p className="text-lg font-semibold">{allCampaigns?.length || 0}</p>
          </div>
        </div>

        {isOwner && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
            <h3 className="font-semibold mb-2">管理员操作</h3>
            <button
              onClick={handleTogglePause}
              disabled={isToggling || isTogglingConfirming}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:bg-gray-400"
            >
              {isToggling ? '处理中...' : isTogglingConfirming ? '确认中...' : paused ? '恢复合约' : '暂停合约'}
            </button>
            {toggleError && (
              <p className="text-red-600 text-sm mt-2">{toggleError.message}</p>
            )}
            {isToggled && (
              <p className="text-green-600 text-sm mt-2">操作成功！</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 创建众筹活动 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">创建新活动</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">活动名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：新产品开发"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={paused}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">活动描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="详细描述你的众筹目标和用途"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={paused}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">目标金额 (ETH)</label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="1.0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={paused}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">持续时间 (天)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={paused}
              />
            </div>
            
            <button
              onClick={handleCreateCampaign}
              disabled={!name || !description || !goal || !duration || isCreating || isCreatingConfirming || paused}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCreating ? '创建中...' : isCreatingConfirming ? '确认中...' : '创建活动'}
            </button>
            
            {createError && (
              <div className="bg-red-100 text-red-800 p-3 rounded">
                错误: {createError.message}
              </div>
            )}
            
            {isCreated && (
              <div className="bg-green-100 text-green-800 p-3 rounded">
                活动创建成功！
              </div>
            )}
            
            {paused && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded">
                合约已暂停，无法创建新活动
              </div>
            )}
          </div>
        </div>

        {/* 用户活动列表 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">我的活动</h3>
          
          {userCampaigns && userCampaigns.length > 0 ? (
            <div className="space-y-4">
              {userCampaigns.map((campaign: Campaign, index: number) => (
                <div key={index} className="border p-4 rounded-lg">
                  <h4 className="font-semibold">{campaign.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">地址: {campaign.campaginAddress}</p>
                  <p className="text-sm text-gray-600">创建时间: {formatTimestamp(campaign.creationTime)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">你还没有创建任何活动</p>
          )}
        </div>
      </div>

      {/* 所有活动列表 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h3 className="text-xl font-bold mb-4">所有活动</h3>
        
        {allCampaigns && allCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCampaigns.map((campaign: Campaign, index: number) => (
              <div key={index} className="border p-4 rounded-lg">
                <h4 className="font-semibold">{campaign.name}</h4>
                <p className="text-sm text-gray-600 mb-1">创建者: {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}</p>
                <p className="text-sm text-gray-600 mb-1">地址: {campaign.campaginAddress.slice(0, 6)}...{campaign.campaginAddress.slice(-4)}</p>
                <p className="text-sm text-gray-600">创建时间: {formatTimestamp(campaign.creationTime)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">还没有任何活动</p>
        )}
      </div>
    </div>
  );
}