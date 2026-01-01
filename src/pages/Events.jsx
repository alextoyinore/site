import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Plus } from 'lucide-react';
import styles from './Events.module.css';
import initialEvents from '../data/events.json';

const Events = () => {
    const [events, setEvents] = useState(initialEvents);
    // Simulating Admin View
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Upcoming Events</h1>
                <button className={styles.adminToggle} onClick={() => setIsAdmin(!isAdmin)}>
                    {isAdmin ? 'Exit Admin' : 'Admin View'}
                </button>
            </div>

            {isAdmin && (
                <div className={styles.adminControls}>
                    <button className={styles.addBtn}>
                        <Plus size={18} /> Post New Event
                    </button>
                </div>
            )}

            <div className={styles.grid}>
                {events.map((event) => (
                    <div key={event.id} className={styles.card}>
                        <div className={styles.image} style={{ backgroundImage: `url(${event.image})` }}></div>
                        <div className={styles.content}>
                            <div className={styles.date}>
                                <Calendar size={16} /> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <h3>{event.title}</h3>
                            <div className={styles.location}>
                                <MapPin size={16} /> {event.location}
                            </div>
                            <p>{event.description}</p>
                            <Link to={`/events/${event.id}`} className={styles.detailsBtn}>View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
