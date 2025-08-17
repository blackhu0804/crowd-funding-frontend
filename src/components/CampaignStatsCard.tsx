'use client';

interface CampaignStatsCardProps {
  campaignAddress: `0x${string}`;
  contractBalance?: bigint;
  campaignState?: number;
}

export function CampaignStatsCard({ campaignAddress, contractBalance, campaignState }: CampaignStatsCardProps) {
  
  const formatEther = (wei: bigint) => {
    return (Number(wei) / 1e18).toFixed(4);
  };

  const getStateText = () => {
    if (campaignState === 0) return '进行中';
    if (campaignState === 1) return '成功';
    if (campaignState === 2) return '失败';
    return '未知';
  };

  return (
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
  );
}