import React from 'react';
import { useAccount, useEnsName, useEnsAvatar } from 'wagmi';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showAddress?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  size = 'md', 
  showAddress = false,
  className = '' 
}) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });

  if (!isConnected || !address) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const displayName = ensName || formatAddress(address);
  const initials = ensName 
    ? ensName.slice(0, 2).toUpperCase()
    : address.slice(2, 4).toUpperCase();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-primary/20 flex items-center justify-center overflow-hidden`}>
        {ensAvatar ? (
          <img 
            src={ensAvatar} 
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-bold text-primary">{initials}</span>
        )}
      </div>
      
      {showAddress && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {ensName || 'Anonymous'}
          </span>
          <span className="text-xs text-caption">
            {formatAddress(address)}
          </span>
        </div>
      )}
    </div>
  );
};
