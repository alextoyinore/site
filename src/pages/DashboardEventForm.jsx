import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import styles from './DashboardPages.module.css';
import eventsData from '../data/events.json';
import Editor from '../components/Editor';

const DashboardEventForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: { blocks: [] } // EditorJS structure
    });

    useEffect(() => {
        if (isEditing) {
            const event = eventsData.find(e => e.id === parseInt(id));
            if (event) {
                // Determine if description is string or object (EditorJS data)
                // For existing strings in json, we might need a converter or just leave empty blocks
                let descData = { blocks: [] };
                if (typeof event.description === 'object') {
                    descData = event.description;
                } else if (typeof event.description === 'string') {
                    // Simple hack to show existing string description as a paragraph block
                    descData = {
                        blocks: [{ type: 'paragraph', data: { text: event.description } }]
                    };
                }

                setFormData({
                    title: event.title,
                    date: event.date,
                    location: event.location,
                    description: descData
                });
            }
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (data) => {
        setFormData(prev => ({ ...prev, description: data }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, send API request here.
        // For this demo, we can't easily persist to the JSON file across pages without a backend.
        console.log('Saved Event Data:', formData);
        alert('Event saved successfully! (Note: Data persistence requires a backend)');
        navigate('/dashboard/events');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/dashboard/events')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                    >
                        <ArrowLeft size={24} color="hsl(var(--text-main))" />
                    </button>
                    <h1 className={styles.title}>{isEditing ? 'Edit Event' : 'Create New Event'}</h1>
                </div>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Event Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location</label>
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                            <Editor
                                data={formData.description}
                                onChange={handleEditorChange}
                                placeholder="Write a detailed description for the event..."
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/events')}
                            style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: '500' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.actionBtn}
                        >
                            <Save size={18} /> {isEditing ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DashboardEventForm;
