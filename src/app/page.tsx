'use client';

import { useRouter } from 'next/navigation';
import { LandingPage } from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();

  const handleEnterApp = () => {
    router.push('/app');
  };

  return <LandingPage onEnterApp={handleEnterApp} />;
}
