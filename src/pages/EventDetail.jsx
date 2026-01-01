import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import styles from './EventDetail.module.css';
import events from '../data/events.json';

const EventDetail = () => {
    const { id } = useParams();
    const event = events.find(e => e.id.toString() === id);

    if (!event) {
        return <div className={styles.container}>Event not found</div>;
    }

    return (
        <div className={styles.container}>
            <Link to="/events" className={styles.backLink}>
                <ArrowLeft size={20} /> Back to Events
            </Link>

            <div className={styles.header}>
                <img src={event.image} alt={event.title} className={styles.heroImage} />
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
                    <p>{event.description}</p>
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
