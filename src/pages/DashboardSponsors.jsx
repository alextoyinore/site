import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './DashboardPages.module.css';
import sponsorsData from '../data/sponsors.json';
import Modal from '../components/Modal';

const DashboardSponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSponsor, setCurrentSponsor] = useState({ id: null, name: '', level: 'Bronze Sponsor' });
    const [loading, setLoading] = useState(true);

    const fetchSponsors = async () => {
        setLoading(true);
        if (isSupabaseConfigured) {
            try {
                const { data, error } = await supabase
                    .from('sponsors')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                if (data) {
                    setSponsors(data);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Error fetching dashboard sponsors:', error);
            }
        }
        setSponsors(sponsorsData);
        setLoading(false);
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const resetForm = () => {
        setCurrentSponsor({ id: null, name: '', level: 'Bronze Sponsor' });
        setIsEditing(false);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEditSponsor = (sponsor) => {
        setCurrentSponsor(sponsor);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDeleteSponsor = async (id) => {
        if (confirm('Are you sure you want to delete this sponsor?')) {
            if (isSupabaseConfigured) {
                try {
                    const { error } = await supabase
                        .from('sponsors')
                        .delete()
                        .eq('id', id);
                    if (error) throw error;
                    setSponsors(sponsors.filter(s => s.id !== id));
                    return;
                } catch (error) {
                    console.error('Error deleting sponsor:', error);
                    alert('Could not delete sponsor from database.');
                    return;
                }
            }
            setSponsors(sponsors.filter(s => s.id !== id));
        }
    };

    const handleSaveSponsor = async (e) => {
        e.preventDefault();

        if (isSupabaseConfigured) {
            try {
                if (isEditing) {
                    const { error } = await supabase
                        .from('sponsors')
                        .update({
                            name: currentSponsor.name,
                            level: currentSponsor.level
                        })
                        .eq('id', currentSponsor.id);
                    if (error) throw error;
                    setSponsors(sponsors.map(s => s.id === currentSponsor.id ? { ...currentSponsor } : s));
                } else {
                    const payload = {
                        name: currentSponsor.name,
                        level: currentSponsor.level,
                        logo: "https://via.placeholder.com/150"
                    };
                    const { data, error } = await supabase
                        .from('sponsors')
                        .insert([payload])
                        .select();
                    if (error) throw error;
                    if (data && data.length > 0) {
                        setSponsors([data[0], ...sponsors]);
                    }
                }
                setIsModalOpen(false);
                resetForm();
                return;
            } catch (error) {
                console.error('Error saving sponsor:', error);
                alert('Could not save sponsor to database.');
                return;
            }
        }

        if (isEditing) {
            setSponsors(sponsors.map(s => s.id === currentSponsor.id ? { ...currentSponsor } : s));
        } else {
            const sponsorToAdd = {
                id: Date.now(),
                ...currentSponsor,
                logo: "https://via.placeholder.com/150"
            };
            setSponsors([sponsorToAdd, ...sponsors]);
        }

        setIsModalOpen(false);
        resetForm();
    };

    if (loading) return <div className={styles.container}>Loading sponsors...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Sponsors</h1>
                <button className={styles.actionBtn} onClick={handleOpenAdd}>
                    <Plus size={18} /> Add New Sponsor
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sponsor Name</th>
                            <th>Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sponsors.map(sponsor => (
                            <tr key={sponsor.id}>
                                <td>{sponsor.name}</td>
                                <td>{sponsor.level}</td>
                                <td>
                                    <button className={styles.iconBtn} onClick={() => handleEditSponsor(sponsor)}><Edit size={18} /></button>
                                    <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteSponsor(sponsor.id)}><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title={isEditing ? "Edit Sponsor" : "Add New Sponsor"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSaveSponsor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Sponsor Name</label>
                        <input
                            type="text"
                            required
                            value={currentSponsor.name}
                            onChange={(e) => setCurrentSponsor({ ...currentSponsor, name: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Sponsorship Level</label>
                        <select
                            value={currentSponsor.level}
                            onChange={(e) => setCurrentSponsor({ ...currentSponsor, level: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                        >
                            <option value="Bronze Sponsor">Bronze Sponsor</option>
                            <option value="Silver Sponsor">Silver Sponsor</option>
                            <option value="Gold Sponsor">Gold Sponsor</option>
                            <option value="Platinum Sponsor">Platinum Sponsor</option>
                        </select>
                    </div>
                    <button type="submit" className={styles.actionBtn} style={{ justifyContent: 'center', marginTop: '1rem' }}>
                        {isEditing ? "Update Sponsor" : "Add Sponsor"}
                    </button>
                </form>
            </Modal>
        </div>
    );
};
export default DashboardSponsors;
