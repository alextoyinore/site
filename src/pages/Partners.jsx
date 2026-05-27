import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './Partners.module.css';
import partnersData from '../data/partners.json';

const Partners = () => {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const fetchPartners = async () => {
            if (isSupabaseConfigured) {
                try {
                    const { data, error } = await supabase
                        .from('partners')
                        .select('*');
                    if (error) throw error;
                    setPartners(data || []);
                    return;
                } catch (error) {
                    console.error('Error fetching partners from Supabase, using fallback:', error);
                }
            }
            setPartners(partnersData);
        };
        fetchPartners();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Our Partners</h1>
                <p>Collaborating with organizations to create lasting impact.</p>
            </div>

            <div className={styles.grid}>
                {partners.map(partner => (
                    <a key={partner.id} href={partner.website} target="_blank" rel="noopener noreferrer" className={styles.card}>
                        <div className={styles.logoWrapper}>
                            <img src={partner.logo} alt={partner.name} className={styles.logo} />
                        </div>
                        <h3 className={styles.name}>{partner.name}</h3>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Partners;
