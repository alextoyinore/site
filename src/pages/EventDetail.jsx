import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './EventDetail.module.css';
import events from '../data/events.json';

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
                    return <Tag key={idx} style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'hsl(var(--text-main))' }} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                case 'paragraph':
                    return <p key={idx} dangerouslySetInnerHTML={{ __html: block.data.text }} style={{ marginBottom: '1rem', lineHeight: '1.6' }} />;
                case 'list':
                    const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                    return (
                        <ListTag key={idx} style={{ paddingLeft: '1.5rem', margin: '1rem 0', lineHeight: '1.6' }}>
                            {block.data.items.map((item, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
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

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            if (isSupabaseConfigured) {
                try {
                    const queryId = isNaN(id) ? id : parseInt(id);
                    const { data, error } = await supabase
                        .from('events')
                        .select('*')
                        .eq('id', queryId)
                        .single();
                    if (error) throw error;
                    if (data) {
                        setEvent(data);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching event details, using fallback:', error);
                }
            }
            const fallbackEvent = events.find(e => e.id.toString() === id.toString());
            setEvent(fallbackEvent || null);
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '5rem' }}>
                <h2>Loading event details...</h2>
            </div>
        );
    }

    if (!event) {
        return <div className={styles.container}>Event not found</div>;
    }

    return (
        <div className={styles.container}>
            <Link to="/events" className={styles.backLink}>
                <ArrowLeft size={20} /> Back to Events
            </Link>

            <div className={styles.header}>
                <img src={event.image || 'https://via.placeholder.com/800x400'} alt={event.title} className={styles.heroImage} />
                <div className={styles.titleWrapper}>
                    <h1>{event.title}</h1>
                    <div className={styles.meta}>
                        <span className={styles.metaItem}><Calendar size={18} /> {new Date(event.date).toLocaleDateString()}</span>
                        <span className={styles.metaItem}><MapPin size={18} /> {event.location}</span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.description}>
                    <h2>About this Event</h2>
                    <DescriptionRenderer description={event.description} />
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.card}>
                        <h3>Event Details</h3>
                        <ul>
                            <li><strong>Date:</strong> {new Date(event.date).toDateString()}</li>
                            <li><strong>Time:</strong> 10:00 AM - 4:00 PM</li>
                            <li><strong>Venue:</strong> {event.location}</li>
                        </ul>
                        <Link to={`/events/${event.id}/register`} className={styles.registerBtn}>Register Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
