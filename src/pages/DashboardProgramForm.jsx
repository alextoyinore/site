import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './DashboardPages.module.css';
import fallbackPrograms from '../data/programs.json';
import Editor from '../components/Editor';

const DashboardProgramForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        color: 'var(--primary)',
        image: '',
        content: { blocks: [] } // EditorJS structure
    });
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        const loadProgram = async () => {
            if (isEditing) {
                setLoading(true);
                if (isSupabaseConfigured) {
                    try {
                        const queryId = isNaN(id) ? id : parseInt(id);
                        const { data: prog, error } = await supabase
                            .from('programs')
                            .select('*')
                            .eq('id', queryId)
                            .single();
                        if (error) throw error;
                        if (prog) {
                            let contentData = { blocks: [] };
                            if (typeof prog.content === 'object' && prog.content !== null) {
                                contentData = prog.content;
                            } else if (typeof prog.content === 'string') {
                                contentData = {
                                    blocks: [{ type: 'paragraph', data: { text: prog.content } }]
                                };
                            } else if (typeof prog.description === 'object' && prog.description !== null) {
                                contentData = prog.description;
                            }
                            
                            setFormData({
                                title: prog.title || '',
                                description: prog.description || '',
                                color: prog.color || 'var(--primary)',
                                image: prog.image || '',
                                content: contentData
                            });
                            setLoading(false);
                            return;
                        }
                    } catch (error) {
                        console.error('Error fetching program details from Supabase:', error);
                    }
                }

                // Fallback loading
                const prog = fallbackPrograms.find(p => p.id === parseInt(id));
                if (prog) {
                    let contentData = { blocks: [] };
                    if (typeof prog.description === 'object' && prog.description !== null) {
                        contentData = prog.description;
                    } else if (typeof prog.content === 'object' && prog.content !== null) {
                        contentData = prog.content;
                    } else {
                        contentData = {
                            blocks: [{ type: 'paragraph', data: { text: prog.desc || prog.description || '' } }]
                        };
                    }

                    setFormData({
                        title: prog.title || '',
                        description: prog.desc || prog.description || '',
                        color: prog.color || 'var(--primary)',
                        image: prog.image || '',
                        content: contentData
                    });
                }
                setLoading(false);
            }
        };
        loadProgram();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (data) => {
        setFormData(prev => ({ ...prev, content: data }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            description: formData.description,
            color: formData.color,
            image: formData.image,
            content: formData.content
        };

        if (isSupabaseConfigured) {
            try {
                if (isEditing) {
                    const queryId = isNaN(id) ? id : parseInt(id);
                    const { error } = await supabase
                        .from('programs')
                        .update(payload)
                        .eq('id', queryId);
                    if (error) throw error;
                } else {
                    const { error } = await supabase
                        .from('programs')
                        .insert([payload]);
                    if (error) throw error;
                }
                alert('Program saved successfully!');
                navigate('/dashboard/programs');
                return;
            } catch (error) {
                console.error('Error saving program:', error);
                alert(`Could not save program: ${error.message}`);
                return;
            }
        }

        console.log('Saved Program Data (Simulation):', formData);
        alert('Program saved successfully! (Simulation)');
        navigate('/dashboard/programs');
    };

    if (loading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading program data...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/programs')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                    >
                        <ArrowLeft size={24} color="hsl(var(--text-main))" />
                    </button>
                    <h1 className={styles.title}>{isEditing ? 'Edit Program' : 'Create New Program'}</h1>
                </div>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Program Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Youth Empowerment Outreach"
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Theme Accent Color</label>
                            <select
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', background: 'white' }}
                            >
                                <option value="var(--primary)">Deep Navy (Primary)</option>
                                <option value="var(--secondary)">Jade Green (Secondary)</option>
                                <option value="var(--accent)">Saffron Gold (Accent)</option>
                                <option value="#10b981">Emerald Green</option>
                                <option value="#ef4444">Red Coral</option>
                                <option value="#3b82f6">Ocean Blue</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cover Image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://images.unsplash.com/photo-..."
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Brief Snippet / Card Summary</label>
                            <input
                                type="text"
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Short 1-2 sentence overview for the card..."
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Detailed Description</label>
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                            <Editor
                                data={formData.content}
                                onChange={handleEditorChange}
                                placeholder="Write a detailed, beautiful post detailing the program's operations, pillars, and impact..."
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/programs')}
                            style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: '500' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.actionBtn}
                        >
                            <Save size={18} /> {isEditing ? 'Update Program' : 'Create Program'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DashboardProgramForm;
