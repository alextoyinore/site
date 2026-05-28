import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './DashboardPages.module.css';
import fallbackPrograms from '../data/programs.json';

const DashboardPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingLiveData, setUsingLiveData] = useState(false);
    const navigate = useNavigate();

    const fetchPrograms = async () => {
        setLoading(true);
        setError(null);

        if (isSupabaseConfigured) {
            console.log('[DashboardPrograms] Supabase configured, attempting fetch...');
            try {
                const { data, error: sbError } = await supabase
                    .from('programs')
                    .select('*')
                    .order('id', { ascending: true });

                if (sbError) throw sbError;

                setPrograms(data || []);
                setUsingLiveData(true);
                setLoading(false);
                return;
            } catch (err) {
                console.error('[DashboardPrograms] Supabase error:', err);
                setError(`Database error: ${err.message || err.code || 'Unknown error'}`);
            }
        }

        // Fallback to local data
        setPrograms(fallbackPrograms);
        setUsingLiveData(false);
        setLoading(false);
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleDeleteProgram = async (id) => {
        if (!confirm('Are you sure you want to delete this program?')) return;

        if (isSupabaseConfigured) {
            try {
                const { error: sbError } = await supabase
                    .from('programs')
                    .delete()
                    .eq('id', id);
                if (sbError) throw sbError;
                setPrograms(prev => prev.filter(p => p.id !== id));
                return;
            } catch (err) {
                console.error('[DashboardPrograms] Delete error:', err);
                alert(`Could not delete program: ${err.message}`);
                return;
            }
        }
        setPrograms(prev => prev.filter(p => p.id !== id));
        alert('Program deleted successfully! (Simulation)');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h1 className={styles.title}>Manage Programs</h1>
                    {!loading && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.75rem', fontWeight: '600', padding: '3px 8px',
                            borderRadius: '999px',
                            background: usingLiveData ? '#d1fae5' : '#fef3c7',
                            color: usingLiveData ? '#065f46' : '#92400e'
                        }}>
                            {usingLiveData ? <Wifi size={12} /> : <WifiOff size={12} />}
                            {usingLiveData ? 'Live' : 'Demo'}
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={fetchPrograms}
                        className={styles.iconBtn}
                        title="Refresh"
                        style={{ padding: '0.5rem 0.75rem' }}
                    >
                        <RefreshCw size={16} />
                    </button>
                    <Link to="/dashboard/programs/new" className={styles.actionBtn}>
                        <Plus size={18} /> Add New Program
                    </Link>
                </div>
            </div>

            {error && (
                <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem',
                    color: '#991b1b', fontSize: '0.9rem'
                }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <div>
                        <strong>Could not load from database — showing demo data instead.</strong>
                        <br />
                        <code style={{ fontSize: '0.8rem', opacity: 0.8 }}>{error}</code>
                        <br />
                        <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                            Check your Supabase credentials and database migrations.
                        </span>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                    <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
                    <p>Loading programs...</p>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    {programs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                            <p>No programs found. <Link to="/dashboard/programs/new" style={{ color: 'hsl(var(--primary))' }}>Create the first one.</Link></p>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Program Title</th>
                                    <th>Color Accent</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map(prog => (
                                    <tr key={prog.id}>
                                        <td style={{ fontWeight: '600' }}>{prog.title}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '14px',
                                                    height: '14px',
                                                    borderRadius: '50%',
                                                    backgroundColor: prog.color || 'var(--primary)',
                                                    border: '1px solid rgba(0,0,0,0.1)'
                                                }}></span>
                                                <code style={{ fontSize: '0.85rem' }}>{prog.color || 'var(--primary)'}</code>
                                            </div>
                                        </td>
                                        <td style={{ color: 'hsl(var(--text-light))', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {prog.description || prog.desc}
                                        </td>
                                        <td>
                                            <button className={styles.iconBtn} onClick={() => navigate(`/dashboard/programs/edit/${prog.id}`)} title="Edit Program">
                                                <Edit size={18} />
                                            </button>
                                            <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteProgram(prog.id)} title="Delete Program">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardPrograms;
