'use client';

import { useState } from 'react';
import { WalletConnect } from "@/components/WalletConnect";
import { TokenInteraction } from "@/components/TokenInteraction";
import { CrowdfundingFactory } from "@/components/CrowdfundingFactory";

export default function Home() {
  const [activeTab, setActiveTab] = useState('token');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Web3 DApp</h1>
              <p className="text-gray-600">钱包连接与合约交互示例</p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('token')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'token'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              代币交互
            </button>
            <button
              onClick={() => setActiveTab('crowdfunding')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'crowdfunding'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              众筹工厂
            </button>
          </nav>
        </div>

        {activeTab === 'token' ? (
          <TokenInteraction />
        ) : (
          <CrowdfundingFactory />
        )}
      </main>
    </div>
  );
}
