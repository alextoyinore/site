import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './Events.module.css';
import initialEvents from '../data/events.json';

const getEventSnippet = (description) => {
    if (!description) return '';
    if (typeof description === 'string') return description;
    if (description.blocks && description.blocks.length > 0) {
        const textBlocks = description.blocks.filter(b => b.type === 'paragraph' || b.type === 'header');
        if (textBlocks.length > 0) {
            return textBlocks[0].data.text;
        }
    }
    return '';
};

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (isSupabaseConfigured) {
                try {
                    const { data, error } = await supabase
                        .from('events')
                        .select('*')
                        .order('date', { ascending: true });
                    if (error) throw error;
                    setEvents(data || []);
                    return;
                } catch (error) {
                    console.error('Error fetching events from Supabase:', error);
                }
            }
            setEvents(initialEvents);
        };
        fetchEvents();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Upcoming Events</h1>
            </div>

            <div className={styles.grid}>
                {events.map((event) => (
                    <div key={event.id} className={styles.card}>
                        <div className={styles.image} style={{ backgroundImage: `url(${event.image || 'https://via.placeholder.com/400x250'})` }}></div>
                        <div className={styles.content}>
                            <div className={styles.date}>
                                <Calendar size={16} /> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <h3>{event.title}</h3>
                            <div className={styles.location}>
                                <MapPin size={16} /> {event.location}
                            </div>
                            <p dangerouslySetInnerHTML={{ __html: getEventSnippet(event.description) }}></p>
                            <Link to={`/events/${event.id}`} className={styles.detailsBtn}>View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
