import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './DashboardPages.module.css';
import eventsData from '../data/events.json';

const DashboardEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingLiveData, setUsingLiveData] = useState(false);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);

        if (isSupabaseConfigured) {
            console.log('[DashboardEvents] Supabase is configured, attempting fetch...');
            try {
                const { data, error: sbError } = await supabase
                    .from('events')
                    .select('*')
                    .order('date', { ascending: true });

                console.log('[DashboardEvents] Response:', { data, error: sbError });

                if (sbError) {
                    throw sbError;
                }

                // Use live data even if empty (don't fall back just because table is empty)
                setEvents(data || []);
                setUsingLiveData(true);
                setLoading(false);
                return;
            } catch (err) {
                console.error('[DashboardEvents] Supabase error:', err);
                setError(`Database error: ${err.message || err.code || 'Unknown error'}`);
            }
        } else {
            console.warn('[DashboardEvents] Supabase not configured, using local data.');
        }

        // Fallback to local data
        setEvents(eventsData);
        setUsingLiveData(false);
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDeleteEvent = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        if (isSupabaseConfigured) {
            try {
                const { error: sbError } = await supabase
                    .from('events')
                    .delete()
                    .eq('id', id);
                if (sbError) throw sbError;
                setEvents(prev => prev.filter(e => e.id !== id));
                return;
            } catch (err) {
                console.error('[DashboardEvents] Delete error:', err);
                alert(`Could not delete: ${err.message}`);
                return;
            }
        }
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h1 className={styles.title}>Manage Events</h1>
                    {/* Live / Demo badge */}
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
                        onClick={fetchEvents}
                        className={styles.iconBtn}
                        title="Refresh"
                        style={{ padding: '0.5rem 0.75rem' }}
                    >
                        <RefreshCw size={16} />
                    </button>
                    <Link to="/dashboard/events/new" className={styles.actionBtn}>
                        <Plus size={18} /> Add New Event
                    </Link>
                </div>
            </div>

            {/* Error banner */}
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
                            Check your Supabase credentials in <code>.env</code> and that RLS policies allow SELECT.
                        </span>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                    <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
                    <p>Loading events...</p>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    {events.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                            <p>No events found. <Link to="/dashboard/events/new" style={{ color: 'hsl(var(--primary))' }}>Create the first one.</Link></p>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event.id}>
                                        <td>{event.title}</td>
                                        <td>{new Date(event.date).toLocaleDateString()}</td>
                                        <td>{event.location}</td>
                                        <td>
                                            <span className={`${styles.status} ${new Date(event.date) > new Date() ? styles.statusActive : styles.statusInactive}`}>
                                                {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className={styles.iconBtn} onClick={() => navigate(`/dashboard/events/edit/${event.id}`)}>
                                                <Edit size={18} />
                                            </button>
                                            <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteEvent(event.id)}>
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

export default DashboardEvents;
