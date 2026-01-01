import { Users, School, Heart, Globe } from 'lucide-react';
import styles from './Impact.module.css';

const Impact = () => {
    const stats = [
        { icon: <Users size={32} />, value: '5,000+', label: 'Lives Impacted' },
        { icon: <School size={32} />, value: '50+', label: 'Schools Visited' },
        { icon: <Heart size={32} />, value: '100+', label: 'Volunteers' },
        { icon: <Globe size={32} />, value: '10+', label: 'Communities Served' },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Our Impact</h2>
                    <p>Making a tangible difference in the lives of women and children.</p>
                </div>
                <div className={styles.grid}>
                    {stats.map((stat, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.icon}>{stat.icon}</div>
                            <div className={styles.value}>{stat.value}</div>
                            <div className={styles.label}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Impact;
