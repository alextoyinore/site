import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './ProgramDetail.module.css';
import fallbackPrograms from '../data/programs.json';

const DescriptionRenderer = ({ description }) => {
    if (!description) return null;
    if (typeof description === 'string') {
        return <p>{description}</p>;
    }
    if (description.blocks && description.blocks.length > 0) {
        return description.blocks.map((block, idx) => {
            switch (block.type) {
                case 'header':
                    const Tag = `h${block.data.level || 3}`;
                    return <Tag key={idx} className={styles.sectionHeader} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                case 'paragraph':
                    return <p key={idx} dangerouslySetInnerHTML={{ __html: block.data.text }} style={{ marginBottom: '1.25rem', lineHeight: '1.7' }} />;
                case 'list':
                    const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                    return (
                        <ListTag key={idx} className={styles.list}>
                            {block.data.items.map((item, index) => (
                                <li key={index} className={styles.listItem}>
                                    {block.data.style !== 'ordered' && <Check size={16} className={styles.listIcon} />}
                                    <span dangerouslySetInnerHTML={{ __html: item }} />
                                </li>
                            ))}
                        </ListTag>
                    );
                default:
                    return null;
            }
        });
    }
    return null;
};

const ProgramDetail = () => {
    const { id } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgram = async () => {
            setLoading(true);
            if (isSupabaseConfigured) {
                try {
                    const queryId = isNaN(id) ? id : parseInt(id);
                    const { data, error } = await supabase
                        .from('programs')
                        .select('*')
                        .eq('id', queryId)
                        .single();
                    if (error) throw error;
                    if (data) {
                        setProgram(data);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching program details, using fallback:', error);
                }
            }
            const fallbackProg = fallbackPrograms.find(p => p.id.toString() === id.toString());
            setProgram(fallbackProg || null);
            setLoading(false);
        };
        fetchProgram();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '8rem 2rem' }}>
                <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem', color: 'hsl(var(--primary))' }} />
                <h2>Loading program details...</h2>
            </div>
        );
    }

    if (!program) {
        return (
            <div className={styles.container} style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <h2>Program not found</h2>
                <p style={{ margin: '1rem 0 2rem' }}>The program you are looking for does not exist or has been removed.</p>
                <Link to="/programs" className={styles.backLink} style={{ justifyContent: 'center' }}>
                    <ArrowLeft size={18} /> Back to Programs
                </Link>
            </div>
        );
    }

    const accentColor = program.color || 'var(--primary)';

    return (
        <div className={styles.container}>
            <Link to="/programs" className={styles.backLink}>
                <ArrowLeft size={20} /> Back to Programs
            </Link>

            <div className={styles.header} style={{ borderTop: `6px solid ${accentColor}` }}>
                <div className={styles.heroWrapper}>
                    <img 
                        src={program.image || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000'} 
                        alt={program.title} 
                        className={styles.heroImage} 
                    />
                    <div className={styles.titleOverlay}>
                        <span className={styles.categoryBadge} style={{ backgroundColor: accentColor }}>Initiative</span>
                        <h1>{program.title}</h1>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.mainDescription}>
                    <h2>About the Program</h2>
                    <p className={styles.leadText}>{program.description || program.desc}</p>
                    <DescriptionRenderer description={program.content || program.description} />
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.supportCard}>
                        <h3>Support This Program</h3>
                        <p>Your generous contribution helps us sustain and expand the impact of our {program.title} initiatives.</p>
                        <Link to="/join" className={styles.actionBtn} style={{ background: accentColor }}>
                            Become a Volunteer
                        </Link>
                        <Link to="/join" className={styles.secondaryBtn} style={{ borderColor: accentColor, color: accentColor }}>
                            Support Financially
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetail;
