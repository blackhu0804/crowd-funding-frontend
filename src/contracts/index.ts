import CrowdfundingFactoryABI from './CrowdfundingFactory.json';
import CrowdfundingABI from './Crowdfunding.json';
import type { Abi } from 'viem';

export const ContractAddresses: Record<string, `0x${string}`> = {
  // 众筹工厂合约地址
  CROWDFUNDING_FACTORY: '0x7958c5845f4638307e2871c0be6B6bEb22d29cC3' as `0x${string}`,
};

export const ContractABIs: Record<string, Abi> = {
  CROWDFUNDING_FACTORY: CrowdfundingFactoryABI as Abi,
  CROWDFUNDING: CrowdfundingABI as Abi,
};