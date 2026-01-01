import { Download } from 'lucide-react';
import styles from './DashboardPages.module.css';

const DashboardDonations = () => {
    // Mock data for donations
    const donations = [
        { id: 1234, donor: 'Anonymous', amount: '$50.00', date: '2023-10-25', status: 'Completed' },
        { id: 1235, donor: 'Sarah Smith', amount: '$120.00', date: '2023-10-24', status: 'Completed' },
        { id: 1236, donor: 'John Doe', amount: '$25.00', date: '2023-10-23', status: 'Completed' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Donations History</h1>
                <button className={styles.actionBtn}>
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
                                <td>{donation.amount}</td>
                                <td>{donation.date}</td>
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
