import { useEffect, useState } from 'react';
import { getWallet, topUpWallet } from '../../services/walletServices';
import './WalletWidget.css';

function WalletWidget() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await getWallet();
      setWalletBalance(response.data.walletBalance || 0);
    } catch (error) {
      console.error(error);
      setStatus('Unable to load wallet balance');
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    setStatus('Processing...');

    if (!topUpAmount || Number(topUpAmount) <= 0) {
      setStatus('Enter a valid amount');
      return;
    }

    try {
      const response = await topUpWallet(Number(topUpAmount));
      setWalletBalance(response.data.walletBalance);
      setTopUpAmount('');
      setStatus(response.data.message);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to top up wallet');
    }
  };

  return (
    <div className="wallet-widget glass-panel">
      <div className="wallet-header">
        <div>
          <p className="wallet-label">Wallet Balance</p>
          <h3>₹{walletBalance.toFixed(2)}</h3>
        </div>
        <span className="wallet-badge">Quick Pay</span>
      </div>

      <form className="wallet-form" onSubmit={handleTopUp}>
        <input
          type="number"
          value={topUpAmount}
          min="1"
          step="1"
          placeholder="Top-up amount"
          onChange={(e) => setTopUpAmount(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Top Up</button>
      </form>
      {status && <p className="wallet-status">{status}</p>}
    </div>
  );
}

export default WalletWidget;
