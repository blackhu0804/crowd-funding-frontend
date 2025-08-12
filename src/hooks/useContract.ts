import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ethers } from 'ethers';

export interface ContractConfig {
  address: `0x${string}`;
  abi: any[];
  chainId?: number;
}

export function useContractRead(config: ContractConfig, functionName: string, args: any[] = []) {
  return useReadContract({
    address: config.address,
    abi: config.abi,
    functionName,
    args,
  });
}

export function useContractWrite(config: ContractConfig, functionName: string) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const write = async (args: any[] = [], value?: string) => {
    try {
      writeContract({
        address: config.address,
        abi: config.abi,
        functionName,
        args,
        value: value ? ethers.parseEther(value) : undefined,
      });
    } catch (err) {
      console.error('Write contract error:', err);
      throw err;
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    write,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}