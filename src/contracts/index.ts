import ERC20ABI from './ERC20.json';
import CrowdfundingFactoryABI from './CrowdfundingFactory.json';

export const ContractAddresses = {
  // 主网代币合约地址
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
  
  // 测试网代币合约地址
  USDC_SEPOLIA: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' as `0x${string}`,
  USDC_BASE_SEPOLIA: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`,
  
  // 测试代币（用于测试网）
  TEST_TOKEN_SEPOLIA: '0x779877A7B0D9E8603169DdbD7856e61b4261aB14' as `0x${string}`, // LINK on Sepolia
  
  // 你的众筹工厂测试合约地址
  CROWDFUNDING_FACTORY: '0x9753137E0Ce905266F263f1847A722308B0990CB' as `0x${string}`,
};

export const ContractABIs = {
  ERC20: ERC20ABI,
  CROWDFUNDING_FACTORY: CrowdfundingFactoryABI,
};

export { ERC20ABI };