import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import styles from './DashboardPages.module.css';

const DashboardVolunteers = () => {
    // Mock data for volunteers
    const volunteers = [
        { id: 1, name: 'Alice Walker', email: 'alice@example.com', role: 'Volunteer', status: 'Active' },
        { id: 2, name: 'Bob Harris', email: 'bob@example.com', role: 'Member', status: 'Pending' },
        { id: 3, name: 'Charlie Kim', email: 'charlie@example.com', role: 'Volunteer', status: 'Active' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Volunteers & Members</h1>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers.map(volunteer => (
                            <tr key={volunteer.id}>
                                <td>{volunteer.name}</td>
                                <td>{volunteer.email}</td>
                                <td>{volunteer.role}</td>
                                <td>
                                    <span className={`${styles.status} ${volunteer.status === 'Active' ? styles.statusActive : styles.statusPending}`}>
                                        {volunteer.status}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.iconBtn} title="Approve"><CheckCircle size={18} /></button>
                                    <button className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Remove"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardVolunteers;
