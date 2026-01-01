import { Users, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const stats = [
        { id: 1, label: 'Total Donations', value: '$12,450', icon: <CreditCard size={24} />, color: 'var(--primary)' },
        { id: 2, label: 'Active Volunteers', value: '142', icon: <Users size={24} />, color: 'var(--secondary)' },
        { id: 3, label: 'Upcoming Events', value: '3', icon: <Calendar size={24} />, color: 'var(--accent)' },
        { id: 4, label: 'Impact Reach', value: '5,000+', icon: <TrendingUp size={24} />, color: '#10b981' },
    ];

    const recentActivity = [
        { id: 1, user: 'John Doe', action: 'Registered for', target: 'Community Health Fair', time: '2 mins ago' },
        { id: 2, user: 'Sarah Smith', action: 'Donated', target: '$50.00', time: '1 hour ago' },
        { id: 3, user: 'Mike Jenkins', action: 'Applied as', target: 'Volunteer', time: '3 hours ago' },
        { id: 4, user: 'Emily White', action: 'Registered for', target: 'Women Tech Workshop', time: '5 hours ago' },
    ];

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
                    {recentActivity.map(item => (
                        <div key={item.id} className={styles.activityItem}>
                            <div className={styles.activityIcon}>
                                {item.user.charAt(0)}
                            </div>
                            <div className={styles.activityContent}>
                                <p><strong>{item.user}</strong> {item.action} <strong>{item.target}</strong></p>
                                <span className={styles.time}>{item.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
