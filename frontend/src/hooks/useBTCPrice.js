import { useState, useEffect } from 'react';

const useBTCPrice = () => {
  const [btcPrice, setBtcPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch BTC price');
        }
        
        const data = await response.json();
        setBtcPrice(data.bitcoin.usd);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        console.error('BTC Price fetch error:', err);
        setError(err.message);
        setBtcPrice(69898);
      } finally {
        setLoading(false);
      }
    };

    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { btcPrice, loading, error, lastUpdated };
};

export default useBTCPrice;