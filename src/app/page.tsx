'use client';

import { WalletConnect } from "@/components/WalletConnect";
import { CrowdfundingFactory } from "@/components/CrowdfundingFactory";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Web3 众筹平台</h1>
              <p className="text-gray-600">去中心化众筹项目创建与管理</p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CrowdfundingFactory />
      </main>
    </div>
  );
}
