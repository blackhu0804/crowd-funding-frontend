'use client';

import { useAccount } from 'wagmi';
import { WalletConnect } from './WalletConnect';
import { ChainInfo } from './ChainInfo';
import { useContractRead } from '@/hooks/useContract';
import { ContractABIs } from '@/contracts';
import { OwnerManagementPanel } from './OwnerManagementPanel';
import { CampaignInfoCard } from './CampaignInfoCard';
import { CampaignStats } from './CampaignStats';
import { TierSupportCard } from './TierSupportCard';
import { CampaignStatsCard } from './CampaignStatsCard';

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
  const { data: name, refetch: refetchName } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'name'
  ) as { data: string | undefined; refetch: () => void };

  const { data: description, refetch: refetchDescription } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'description'
  ) as { data: string | undefined; refetch: () => void };

  const { data: goal, refetch: refetchGoal } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'goal'
  ) as { data: bigint | undefined; refetch: () => void };

  const { data: deadline, refetch: refetchDeadline } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'deadline'
  ) as { data: bigint | undefined; refetch: () => void };

  const { data: owner, refetch: refetchOwner } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'owner'
  ) as { data: string | undefined; refetch: () => void };

  const { data: contractBalance, refetch: refetchContractBalance } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'getContractBalance'
  ) as { data: bigint | undefined; refetch: () => void };

  const { data: campaignState, refetch: refetchCampaignState } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'getCampaginStatus'
  ) as { data: number | undefined; refetch: () => void };

  const { data: tiers, refetch: refetchTiers } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'getTiers'
  ) as { data: Tier[] | undefined; refetch: () => void };

  const { data: userContribution, refetch: refetchUserContribution } = useContractRead(
    { address: campaignAddress, abi: ContractABIs.CROWDFUNDING },
    'backers',
    [address]
  ) as { data: { totalContribution: bigint } | undefined; refetch: () => void };

  // 辅助函数
  const isExpired = () => {
    if (!deadline) return false;
    return Date.now() > Number(deadline) * 1000;
  };

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  // 刷新所有数据的函数
  const refreshAllData = async () => {
    try {
      await Promise.all([
        refetchName(),
        refetchDescription(),
        refetchGoal(),
        refetchDeadline(),
        refetchOwner(),
        refetchContractBalance(),
        refetchCampaignState(),
        refetchTiers(),
        refetchUserContribution()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
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
            {/* Owner Management Panel */}
            {isOwner && (
              <OwnerManagementPanel 
                campaignAddress={campaignAddress}
                tiers={tiers}
                onDataChange={refreshAllData}
              />
            )}

            {/* Campaign Info */}
            <CampaignInfoCard
              name={name}
              description={description}
              owner={owner}
              goal={goal}
              deadline={deadline}
              contractBalance={contractBalance}
              campaignState={campaignState}
            />

            {/* Campaign Stats */}
            <CampaignStats
              deadline={deadline}
              tiers={tiers}
              userContribution={userContribution}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tier Support Card */}
            <TierSupportCard
              campaignAddress={campaignAddress}
              tiers={tiers}
              campaignState={campaignState}
              isExpired={isExpired()}
              onDataChange={refreshAllData}
            />

            {/* Campaign Stats Card */}
            <CampaignStatsCard
              campaignAddress={campaignAddress}
              contractBalance={contractBalance}
              campaignState={campaignState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}