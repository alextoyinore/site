import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './Programs.module.css';
import fallbackPrograms from '../data/programs.json';

const Programs = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            setLoading(true);
            if (isSupabaseConfigured) {
                try {
                    const { data, error } = await supabase
                        .from('programs')
                        .select('*')
                        .order('id', { ascending: true });
                    if (error) throw error;
                    setPrograms(data || []);
                    setLoading(false);
                    return;
                } catch (error) {
                    console.error('Error fetching programs from Supabase, using fallback:', error);
                }
            }
            setPrograms(fallbackPrograms);
            setLoading(false);
        };
        fetchPrograms();
    }, []);

    if (loading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '5rem' }}>
                <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem', color: 'hsl(var(--primary))' }} />
                <h2>Loading programs...</h2>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Our Programs</h1>
            <div className={styles.grid}>
                {programs.map((prog) => (
                    <div key={prog.id} className={styles.card} style={{ borderTopColor: prog.color || 'var(--primary)' }}>
                        <h2>{prog.title}</h2>
                        <p>{prog.description || prog.desc}</p>
                        <Link to={`/programs/${prog.id}`} className={styles.learnMore}>
                            Learn More <ArrowRight size={16} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Programs;
