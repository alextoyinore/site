import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './PartnersSlider.module.css';
import partnersData from '../data/partners.json';

const PartnersSlider = () => {
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

    // Double the array for infinite scroll effect
    const list = partners.length > 0 ? [...partners, ...partners] : [];

    return (
        <section className={styles.sliderSection}>
            <div className={styles.container}>
                <h3 className={styles.title}>Trusted by our Partners</h3>
                <div className={styles.slider}>
                    <div className={styles.slideTrack}>
                        {list.map((partner, index) => (
                            <div key={`${partner.id}-${index}`} className={styles.slide}>
                                <img src={partner.logo} alt={partner.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnersSlider;
