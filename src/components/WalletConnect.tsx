'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletConnect() {
  return (
    <div className="flex items-center space-x-4">
      <ConnectButton
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
        chainStatus={{
          smallScreen: 'icon',
          largeScreen: 'full',
        }}
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />
    </div>
  );
}