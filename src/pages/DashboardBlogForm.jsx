import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './DashboardPages.module.css';
import blogData from '../data/blog.json';
import Editor from '../components/Editor';

const DashboardBlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        image: '',
        featured: false,
        content: { blocks: [] }
    });
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        const loadPost = async () => {
            if (isEditing) {
                setLoading(true);
                if (isSupabaseConfigured) {
                    try {
                        const queryId = isNaN(id) ? id : parseInt(id);
                        const { data, error } = await supabase
                            .from('blogs')
                            .select('*')
                            .eq('id', queryId)
                            .single();
                        if (error) throw error;
                        if (data) {
                            setFormData(data);
                            setLoading(false);
                            return;
                        }
                    } catch (error) {
                        console.error('Error fetching blog post:', error);
                    }
                }
                const post = blogData.find(p => p.id === parseInt(id));
                if (post) {
                    setFormData(post);
                }
                setLoading(false);
            }
        };
        loadPost();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditorChange = (data) => {
        setFormData(prev => ({ ...prev, content: data }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            author: formData.author,
            date: formData.date,
            excerpt: formData.excerpt,
            image: formData.image,
            featured: formData.featured,
            content: formData.content
        };

        if (isSupabaseConfigured) {
            try {
                if (isEditing) {
                    const queryId = isNaN(id) ? id : parseInt(id);
                    const { error } = await supabase
                        .from('blogs')
                        .update(payload)
                        .eq('id', queryId);
                    if (error) throw error;
                } else {
                    const { error } = await supabase
                        .from('blogs')
                        .insert([payload]);
                    if (error) throw error;
                }
                alert('Post saved successfully!');
                navigate('/dashboard/blogs');
                return;
            } catch (error) {
                console.error('Error saving blog post to Supabase:', error);
                alert('Could not save post to database. Please try again.');
                return;
            }
        }

        console.log('Saved Blog Post:', formData);
        alert('Post saved successfully! (Simulation)');
        navigate('/dashboard/blogs');
    };

    if (loading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading post data...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/dashboard/blogs')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                    >
                        <ArrowLeft size={24} color="hsl(var(--text-main))" />
                    </button>
                    <h1 className={styles.title}>{isEditing ? 'Edit Post' : 'New Blog Post'}</h1>
                </div>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Post Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1.1rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Excerpt (Short Description)</label>
                                <textarea
                                    name="excerpt"
                                    rows="3"
                                    required
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}
                                ></textarea>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    required
                                    value={formData.author}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Publish Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cover Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    placeholder="https://"
                                    value={formData.image}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <label htmlFor="featured" style={{ cursor: 'pointer' }}>Feature on Home Page</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Content</label>
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                            <Editor
                                data={formData.content}
                                onChange={handleEditorChange}
                                placeholder="Write your amazing story here..."
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/blogs')}
                            style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: '500' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.actionBtn}
                        >
                            <Save size={18} /> {isEditing ? 'Update Post' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DashboardBlogForm;
