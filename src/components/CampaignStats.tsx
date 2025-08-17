'use client';

interface Tier {
  name: string;
  amount: bigint;
  backers: bigint;
}

interface CampaignStatsProps {
  deadline?: bigint;
  tiers?: Tier[];
  userContribution?: { totalContribution: bigint };
}

export function CampaignStats({ deadline, tiers, userContribution }: CampaignStatsProps) {
  
  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const formatEther = (wei: bigint) => {
    return (Number(wei) / 1e18).toFixed(4);
  };

  return (
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
  );
}