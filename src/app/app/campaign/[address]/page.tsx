'use client';

import { CampaignDetail } from '@/components/CampaignDetail';
import { useRouter } from 'next/navigation';

interface CampaignPageProps {
  params: {
    address: string;
  };
}

export default function CampaignPage({ params }: CampaignPageProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/app');
  };

  return (
    <CampaignDetail 
      campaignAddress={params.address} 
      onBack={handleBack}
    />
  );
}