'use client';

interface CampaignInfoCardProps {
  name?: string;
  description?: string;
  owner?: string;
  goal?: bigint;
  deadline?: bigint;
  contractBalance?: bigint;
  campaignState?: number;
}

export function CampaignInfoCard({
  name,
  description,
  owner,
  goal,
  deadline,
  contractBalance,
  campaignState
}: CampaignInfoCardProps) {
  

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

  return (
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
  );
}