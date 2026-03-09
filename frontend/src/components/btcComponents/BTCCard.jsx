import React from 'react';
import { Lock } from 'lucide-react';
import useBTCPrice from '../../hooks/useBTCPrice';

const BTCCard = ({ accountData }) => {
  const { btcPrice, loading, error, lastUpdated } = useBTCPrice();
  
  const currentBTCPrice = btcPrice || accountData.btcRate;
  const fiatBalance = accountData.btcBalance * currentBTCPrice;
  
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const priceChange = btcPrice && accountData.btcRate ? 
    ((btcPrice - accountData.btcRate) / accountData.btcRate * 100).toFixed(2) : 0;
  
  const isPriceUp = priceChange > 0;
  const isPriceDown = priceChange < 0;

  return (
    <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-xl p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-5 rounded-full blur-3xl"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs opacity-75">
              BITCOIN WALLET
            </span>
            {loading && (
              <span className="text-[10px] bg-gray-600 px-2 py-0.5 rounded-full animate-pulse">
                Updating...
              </span>
            )}
          </div>
          <p className="text-sm font-semibold">
            {accountData.accountHolder}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-75 mb-1">
            Crypto Account
          </p>
          <p className="text-sm font-semibold flex items-center gap-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            BTC
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm opacity-75 mb-1">Bitcoin Balance</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold">
            {accountData.btcBalance.toFixed(6)} BTC
          </p>
          <Lock size={18} className="opacity-50" />
        </div>
        <p className="text-sm opacity-75 mt-1">
          ≈ ${fiatBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className="opacity-75">
            ● 1 BTC = 
          </span>
          <span className="font-semibold">
            ${currentBTCPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
          {btcPrice && !loading && (
            <span className={`text-xs font-medium ${isPriceUp ? 'text-green-400' : isPriceDown ? 'text-red-400' : 'opacity-75'}`}>
              {isPriceUp && '↑'} {isPriceDown && '↓'} {Math.abs(priceChange)}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="opacity-75">Live Rate</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-[10px] opacity-50">
        <span>
          {lastUpdated ? `Updated: ${formatLastUpdated()}` : 'Fetching live rate...'}
        </span>
        {error && (
          <span className="text-yellow-400" title={error}>
            Using cached rate
          </span>
        )}
      </div>
    </div>
  );
};

export default BTCCard;