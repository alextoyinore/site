import { useState, useEffect } from 'react';
import { Trash2, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './DashboardPages.module.css';

const DashboardVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    const mockVolunteers = [
        { id: 1, name: 'Alice Walker', email: 'alice@example.com', role: 'Volunteer', status: 'Active' },
        { id: 2, name: 'Bob Harris', email: 'bob@example.com', role: 'Member', status: 'Pending' },
        { id: 3, name: 'Charlie Kim', email: 'charlie@example.com', role: 'Volunteer', status: 'Active' },
    ];

    const fetchVolunteers = async () => {
        setLoading(true);
        if (isSupabaseConfigured) {
            try {
                const { data, error } = await supabase
                    .from('volunteers')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                if (data) {
                    setVolunteers(data);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Error fetching volunteers:', error);
            }
        }
        setVolunteers(mockVolunteers);
        setLoading(false);
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleApprove = async (id) => {
        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase
                    .from('volunteers')
                    .update({ status: 'Active' })
                    .eq('id', id);
                if (error) throw error;
                setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: 'Active' } : v));
                return;
            } catch (error) {
                console.error('Error approving volunteer:', error);
                alert('Could not approve. Please try again.');
                return;
            }
        }
        setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: 'Active' } : v));
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to remove this person?')) {
            if (isSupabaseConfigured) {
                try {
                    const { error } = await supabase
                        .from('volunteers')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    setVolunteers(volunteers.filter(v => v.id !== id));
                    return;
                } catch (error) {
                    console.error('Error removing volunteer:', error);
                    alert('Could not remove. Please try again.');
                    return;
                }
            }
            setVolunteers(volunteers.filter(v => v.id !== id));
        }
    };

    if (loading) return <div className={styles.container}>Loading volunteers...</div>;

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
                                    {volunteer.status !== 'Active' && (
                                        <button className={styles.iconBtn} onClick={() => handleApprove(volunteer.id)} title="Approve">
                                            <CheckCircle size={18} />
                                        </button>
                                    )}
                                    <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(volunteer.id)} title="Remove">
                                        <Trash2 size={18} />
                                    </button>
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
