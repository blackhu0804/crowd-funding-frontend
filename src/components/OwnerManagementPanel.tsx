'use client';

import { useState } from 'react';
import { useContractWrite } from '@/hooks/useContract';
import { ContractABIs } from '@/contracts';

interface Tier {
  name: string;
  amount: bigint;
  backers: bigint;
}

interface OwnerManagementPanelProps {
  campaignAddress: `0x${string}`;
  tiers?: Tier[];
}

export function OwnerManagementPanel({ campaignAddress, tiers }: OwnerManagementPanelProps) {
  const [showTierManagement, setShowTierManagement] = useState(false);
  const [newTierName, setNewTierName] = useState('');
  const [newTierAmount, setNewTierAmount] = useState('');
  const [tierToDelete, setTierToDelete] = useState<number | null>(null);

  // Tier 管理功能
  const { write: addTier, isPending: isAddingTier, isConfirming: isAddingTierConfirming, isConfirmed: isTierAdded, error: addTierError } = useContractWrite(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'addTier'
  );

  const { write: removeTier, isPending: isRemovingTier, isConfirming: isRemovingTierConfirming, isConfirmed: isTierRemoved, error: removeTierError } = useContractWrite(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'removeTier'
  );

  const handleAddTier = async () => {
    if (!newTierName.trim() || !newTierAmount) return;
    
    try {
      const amountInWei = (parseFloat(newTierAmount) * 1e18).toString();
      addTier([newTierName.trim(), amountInWei]);
      setNewTierName('');
      setNewTierAmount('');
    } catch (err) {
      console.error('Add tier failed:', err);
    }
  };

  const handleRemoveTier = async (tierIndex: number) => {
    if (tierIndex < 0) return;
    
    try {
      removeTier([tierIndex]);
      setTierToDelete(null);
    } catch (err) {
      console.error('Remove tier failed:', err);
    }
  };

  const formatEther = (wei: bigint) => {
    return (Number(wei) / 1e18).toFixed(4);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">创建者管理中心</h2>
            <p className="text-gray-300 text-sm">您拥有此活动的完全管理权限</p>
          </div>
        </div>
        <button
          onClick={() => setShowTierManagement(!showTierManagement)}
          className="px-4 py-2.5 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 hover:text-white transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium">{showTierManagement ? '收起管理' : '管理级别'}</span>
            <svg className={`w-4 h-4 transition-transform duration-300 ${showTierManagement ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>
      
      {showTierManagement && (
        <div className="space-y-6">
          {/* 添加新级别 */}
          <div className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-5">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">添加支持级别</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>级别名称</span>
                </label>
                <input
                  type="text"
                  value={newTierName}
                  onChange={(e) => setNewTierName(e.target.value)}
                  placeholder="例如：早期支持者、VIP 支持者"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-gray-500/70"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>支持金额 (ETH)</span>
                </label>
                <input
                  type="number"
                  value={newTierAmount}
                  onChange={(e) => setNewTierAmount(e.target.value)}
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-gray-500/70"
                />
              </div>
            </div>
            
            <button
              onClick={handleAddTier}
              disabled={!newTierName.trim() || !newTierAmount || isAddingTier || isAddingTierConfirming}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg flex items-center justify-center space-x-2"
            >
              {isAddingTier || isAddingTierConfirming ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isAddingTier ? '处理中...' : '确认中...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>添加级别</span>
                </>
              )}
            </button>
            
            {addTierError && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-red-300">操作失败</p>
                  <p className="text-sm text-red-400 mt-1">{addTierError.message}</p>
                </div>
              </div>
            )}
            
            {isTierAdded && (
              <div className="mt-4 bg-green-500/10 border border-green-500/30 text-green-300 p-4 rounded-xl flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">级别添加成功！</p>
              </div>
            )}
          </div>
          
          {/* 存在的级别管理 */}
          {tiers && tiers.length > 0 && (
            <div className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-5">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m9-2V7a2 2 0 00-2-2h-2m0 0V3a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">已有级别管理</h3>
              </div>
              <div className="space-y-3">
                {tiers.map((tier, index) => (
                  <div key={index} className="bg-gray-800/30 border border-gray-600/30 rounded-xl p-4 hover:bg-gray-700/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-cyan-300 font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-medium text-lg">{tier.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-300">
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <span className="text-cyan-300">{formatEther(tier.amount)} ETH</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>{Number(tier.backers)} 人支持</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setTierToDelete(tierToDelete === index ? null : index)}
                          className="px-3 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/40 transition-all duration-300 border border-red-500/30 text-sm font-medium"
                        >
                          {tierToDelete === index ? '取消' : '删除'}
                        </button>
                        {tierToDelete === index && (
                          <button
                            onClick={() => handleRemoveTier(index)}
                            disabled={isRemovingTier || isRemovingTierConfirming}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-sm font-medium transition-all duration-300 flex items-center space-x-1"
                          >
                            {isRemovingTier || isRemovingTierConfirming ? (
                              <>
                                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>处理中...</span>
                              </>
                            ) : (
                              <span>确认删除</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {removeTierError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-red-300">删除失败</p>
                    <p className="text-sm text-red-400 mt-1">{removeTierError.message}</p>
                  </div>
                </div>
              )}
              
              {isTierRemoved && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 text-green-300 p-4 rounded-xl flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium">级别删除成功！</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}