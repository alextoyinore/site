import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import styles from './DashboardPages.module.css';
import eventsData from '../data/events.json';

const DashboardEvents = () => {
    // Note: In a real app with backend, we would fetch fresh data.
    // For this demo, data changes in the Form page won't persist here automatically without a context/backend.
    const [events, setEvents] = useState(eventsData);
    const navigate = useNavigate();

    const handleDeleteEvent = (id) => {
        if (confirm('Are you sure you want to delete this event?')) {
            setEvents(events.filter(e => e.id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Events</h1>
                <Link to="/dashboard/events/new" className={styles.actionBtn}>
                    <Plus size={18} /> Add New Event
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id}>
                                <td>{event.title}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td>{event.location}</td>
                                <td>
                                    <span className={`${styles.status} ${new Date(event.date) > new Date() ? styles.statusActive : styles.statusInactive}`}>
                                        {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.iconBtn} onClick={() => navigate(`/dashboard/events/edit/${event.id}`)}>
                                        <Edit size={18} />
                                    </button>
                                    <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteEvent(event.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardEvents;
