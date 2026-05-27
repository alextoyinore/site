import { useState, useEffect } from 'react';
import { Users, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './Dashboard.module.css';

const getRelativeTimeString = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 5) return 'just now';
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + (interval === 1 ? " yr ago" : " yrs ago");
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + (interval === 1 ? " mo ago" : " mos ago");
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + (interval === 1 ? " hr ago" : " hrs ago");
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + (interval === 1 ? " min ago" : " mins ago");
    return seconds + " secs ago";
};

const Dashboard = () => {
    const [stats, setStats] = useState([
        { id: 1, label: 'Total Donations', value: '$12,450', icon: <CreditCard size={24} />, color: 'var(--primary)' },
        { id: 2, label: 'Active Volunteers', value: '142', icon: <Users size={24} />, color: 'var(--secondary)' },
        { id: 3, label: 'Upcoming Events', value: '3', icon: <Calendar size={24} />, color: 'var(--accent)' },
        { id: 4, label: 'Impact Reach', value: '5,000+', icon: <TrendingUp size={24} />, color: '#10b981' },
    ]);

    const [recentActivity, setRecentActivity] = useState([]);
    const [loadingActivity, setLoadingActivity] = useState(true);

    useEffect(() => {
        const fetchStatsAndActivity = async () => {
            if (!isSupabaseConfigured) {
                // Use fallback mock activities if not configured
                setRecentActivity([
                    { id: 1, user: 'John Doe', action: 'Registered for', target: 'Community Health Fair', time: '2 mins ago' },
                    { id: 2, user: 'Sarah Smith', action: 'Donated', target: '$50.00', time: '1 hour ago' },
                    { id: 3, user: 'Mike Jenkins', action: 'Applied as', target: 'Volunteer', time: '3 hours ago' },
                    { id: 4, user: 'Emily White', action: 'Registered for', target: 'Women Tech Workshop', time: '5 hours ago' },
                ]);
                setLoadingActivity(false);
                return;
            }

            setLoadingActivity(true);
            try {
                // 1. Fetch Total Donations
                const { data: donations } = await supabase.from('donations').select('amount');
                const totalDonations = donations ? donations.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) : 0;

                // 2. Fetch Active Volunteers
                const { count: activeVolunteers } = await supabase
                    .from('volunteers')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'Active');

                // 3. Fetch Upcoming Events
                const { count: upcomingEvents } = await supabase
                    .from('events')
                    .select('*', { count: 'exact', head: true })
                    .gte('date', new Date().toISOString().split('T')[0]);

                setStats([
                    { id: 1, label: 'Total Donations', value: `$${totalDonations.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`, icon: <CreditCard size={24} />, color: 'var(--primary)' },
                    { id: 2, label: 'Active Volunteers', value: String(activeVolunteers || 0), icon: <Users size={24} />, color: 'var(--secondary)' },
                    { id: 3, label: 'Upcoming Events', value: String(upcomingEvents || 0), icon: <Calendar size={24} />, color: 'var(--accent)' },
                    { id: 4, label: 'Impact Reach', value: '5,000+', icon: <TrendingUp size={24} />, color: '#10b981' },
                ]);

                // 4. Fetch Recent Activities
                const [recDonations, recRegistrations, recVolunteers] = await Promise.all([
                    supabase.from('donations').select('id, donor, amount, created_at').order('created_at', { ascending: false }).limit(5),
                    supabase.from('event_registrations').select('id, name, created_at, events(title)').order('created_at', { ascending: false }).limit(5),
                    supabase.from('volunteers').select('id, name, role, created_at').order('created_at', { ascending: false }).limit(5)
                ]);

                let items = [];

                if (recDonations.data) {
                    recDonations.data.forEach(item => {
                        items.push({
                            id: `don-${item.id}`,
                            user: item.donor || 'Anonymous',
                            action: 'Donated',
                            target: `$${parseFloat(item.amount).toFixed(2)}`,
                            time: new Date(item.created_at)
                        });
                    });
                }

                if (recRegistrations.data) {
                    recRegistrations.data.forEach(item => {
                        items.push({
                            id: `reg-${item.id}`,
                            user: item.name,
                            action: 'Registered for',
                            target: item.events?.title || 'an Event',
                            time: new Date(item.created_at)
                        });
                    });
                }

                if (recVolunteers.data) {
                    recVolunteers.data.forEach(item => {
                        items.push({
                            id: `vol-${item.id}`,
                            user: item.name,
                            action: 'Applied as',
                            target: item.role || 'Volunteer',
                            time: new Date(item.created_at)
                        });
                    });
                }

                // Sort by date descending
                items.sort((a, b) => b.time - a.time);

                setRecentActivity(
                    items.slice(0, 8).map(it => ({
                        id: it.id,
                        user: it.user,
                        action: it.action,
                        target: it.target,
                        time: getRelativeTimeString(it.time)
                    }))
                );
            } catch (error) {
                console.error('Error fetching dashboard summary:', error);
            } finally {
                setLoadingActivity(false);
            }
        };

        fetchStatsAndActivity();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                {stats.map(stat => (
                    <div key={stat.id} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <h4 className={styles.statValue}>{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Recent Activity</h3>
                <div className={styles.activityList}>
                    {loadingActivity ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                            Loading activities...
                        </div>
                    ) : recentActivity.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                            No recent activity recorded yet.
                        </div>
                    ) : (
                        recentActivity.map(item => (
                            <div key={item.id} className={styles.activityItem}>
                                <div className={styles.activityIcon}>
                                    {(item.user || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.activityContent}>
                                    <p><strong>{item.user}</strong> {item.action} <strong>{item.target}</strong></p>
                                    <span className={styles.time}>{item.time}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
