'use client';

import { useContractWrite } from '@/hooks/useContract';
import { ContractABIs } from '@/contracts';

interface Tier {
  name: string;
  amount: bigint;
  backers: bigint;
}

interface TierSupportCardProps {
  campaignAddress: `0x${string}`;
  tiers?: Tier[];
  campaignState?: number;
  isExpired: boolean;
}

export function TierSupportCard({ campaignAddress, tiers, campaignState, isExpired }: TierSupportCardProps) {
  
  // 捐赠功能
  const { write: fundTier, isPending: isFunding, isConfirming: isFundingConfirming, isConfirmed: isFunded, error: fundError } = useContractWrite(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'fund'
  );

  const handleFund = async (tierIndex: number) => {
    if (!tiers || tierIndex >= tiers.length) return;
    
    try {
      fundTier([tierIndex], tiers[tierIndex].amount.toString());
    } catch (err) {
      console.error('Funding failed:', err);
    }
  };

  const formatEther = (wei: bigint) => {
    return (Number(wei) / 1e18).toFixed(4);
  };

  return (
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
                disabled={isFunding || isFundingConfirming || campaignState !== 0 || isExpired}
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

      {(campaignState !== 0 || isExpired) && (
        <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-xl border border-yellow-500/30 text-center mt-4">
          此活动已结束，无法继续支持
        </div>
      )}
    </div>
  );
}