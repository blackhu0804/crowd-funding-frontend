'use client';

import { CampaignDetail } from '@/components/CampaignDetail';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface CampaignPageProps {
  params: Promise<{
    address: `0x${string}`;
  }>;
}

export default function CampaignPage({ params }: CampaignPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  const handleBack = () => {
    router.push('/app');
  };

  return (
    <CampaignDetail 
      campaignAddress={resolvedParams.address} 
      onBack={handleBack}
    />
  );
}