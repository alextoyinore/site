import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './DashboardPages.module.css';

const DashboardDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const mockDonations = [
        { id: 1234, donor: 'Anonymous', amount: 50.00, date: '2023-10-25', status: 'Completed' },
        { id: 1235, donor: 'Sarah Smith', amount: 120.00, date: '2023-10-24', status: 'Completed' },
        { id: 1236, donor: 'John Doe', amount: 25.00, date: '2023-10-23', status: 'Completed' },
    ];

    useEffect(() => {
        const fetchDonations = async () => {
            setLoading(true);
            if (isSupabaseConfigured) {
                try {
                    const { data, error } = await supabase
                        .from('donations')
                        .select('*')
                        .order('date', { ascending: false });
                    if (error) throw error;
                    if (data) {
                        setDonations(data);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching donations:', error);
                }
            }
            setDonations(mockDonations);
            setLoading(false);
        };
        fetchDonations();
    }, []);

    const handleExportCSV = () => {
        if (donations.length === 0) return;
        const headers = ['Transaction ID', 'Donor', 'Amount', 'Date', 'Status'];
        const rows = donations.map(d => [
            d.id,
            d.donor,
            typeof d.amount === 'number' ? d.amount : parseFloat(d.amount),
            d.date,
            d.status
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `donations_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className={styles.container}>Loading donations...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Donations History</h1>
                <button className={styles.actionBtn} onClick={handleExportCSV}>
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Donor</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(donation => (
                            <tr key={donation.id}>
                                <td>#{donation.id}</td>
                                <td>{donation.donor}</td>
                                <td>{typeof donation.amount === 'number' ? `$${donation.amount.toFixed(2)}` : `$${parseFloat(donation.amount).toFixed(2)}`}</td>
                                <td>{new Date(donation.date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`${styles.status} ${styles.statusSuccess}`}>
                                        {donation.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardDonations;
