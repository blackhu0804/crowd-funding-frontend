import CrowdfundingFactoryABI from './CrowdfundingFactory.json';
import type { Abi } from 'viem';

export const ContractAddresses: Record<string, `0x${string}`> = {
  // 众筹工厂合约地址
  CROWDFUNDING_FACTORY: '0x9753137E0Ce905266F263f1847A722308B0990CB' as `0x${string}`,
};

export const ContractABIs: Record<string, Abi> = {
  CROWDFUNDING_FACTORY: CrowdfundingFactoryABI as Abi,
};