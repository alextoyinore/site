import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './Sponsors.module.css';
import sponsorsData from '../data/sponsors.json';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        const fetchSponsors = async () => {
            if (isSupabaseConfigured) {
                try {
                    const { data, error } = await supabase
                        .from('sponsors')
                        .select('*');
                    if (error) throw error;
                    setSponsors(data || []);
                    return;
                } catch (error) {
                    console.error('Error fetching sponsors from Supabase, using fallback:', error);
                }
            }
            setSponsors(sponsorsData);
        };
        fetchSponsors();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Our Sponsors</h1>
                <p>Generous support that fuels our community programs.</p>
            </div>

            <div className={styles.grid}>
                {sponsors.map(sponsor => (
                    <div key={sponsor.id} className={styles.card}>
                        <div className={styles.logoWrapper}>
                            <img src={sponsor.logo} alt={sponsor.name} className={styles.logo} />
                        </div>
                        <h3 className={styles.name}>{sponsor.name}</h3>
                        <span className={styles.level}>{sponsor.level}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sponsors;
