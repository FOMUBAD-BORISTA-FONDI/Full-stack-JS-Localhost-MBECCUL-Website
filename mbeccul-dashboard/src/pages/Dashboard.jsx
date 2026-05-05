import { useBank } from '../context/BankContext';
// import { useAuth } from '../context/AuthContext';
// import StatCard from '../components/StatCard';
// import TransactionItem from '../components/TransactionItem';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
export default function Dashboard() {
    const { totalBalance, activeAccounts, totalDeposits, totalWithdrawals,
        transactions } = useBank();
    const { user } = useAuth();
    const recentTx = transactions.slice(0, 5); // show last 5
    return (
        <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0, color: '#1A1A2E' }}>MBECCUL Dashboard</h1>
                <p style={{ color: 'gray', margin: '4px 0 0' }}>
                    Welcome back, <strong>{user?.name}</strong>
                </p>
            </div>
            {/* Stat cards row */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px'
            }}>
                <StatCard label="Total Assets Under Management" value={
                    formatCurrency(totalBalance)} icon={<DollarSign size={22} />}
                    color="#1A1A2E" />
                <StatCard label="Active Member Accounts" value={activeAccounts
                } icon={<Users size={22} />} color="#16A34A"
                />
                <StatCard label="Total Deposits" value={formatCurrency
                    (totalDeposits)} icon={<TrendingUp size={22} />} color
                    ="#2563EB" />
                <StatCard label="Total Withdrawals" value={formatCurrency
                    (totalWithdrawals)} icon={<TrendingDown size={22} />} color="#
DC2626" />
            </div>
            {/* Recent transactions */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '12px'
            }}>
                <h2 style={{ margin: 0 }}>Recent Transactions</h2>
                <Link to="/transactions" style={{
                    fontSize: '13px', color: '#2563EB'
                }}>View all </Link>
            </div>
            <div style={{
                border: '1px solid #E5E7EB', borderRadius: '10px',
                overflow: 'hidden'
            }}>
                {recentTx.length === 0
                    ? <p style={{
                        padding: '20px', color: 'gray', textAlign: 'center'
                    }}>No transactions yet.</p>
                    : recentTx.map(tx => <TransactionItem key={tx.id} tx={tx} />)}
            </div>
        </div >
    );
}