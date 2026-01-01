import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EventRegister.module.css';
import events from '../data/events.json';

const EventRegister = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const event = events.find(e => e.id.toString() === id);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        attendees: 1
    });
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!event) {
            // Redirect or show error if event not found
        }
    }, [event]);

    if (!event) return <div className={styles.container}>Event not found</div>;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type: 'event_registration',
                    message: `Registering for Event: ${event.title} (ID: ${event.id}). Attendees: ${formData.attendees}`
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                setStatus('success');
            } else {
                alert('Error: ' + result.message);
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            alert('Network error.');
            setStatus('error');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1>Register for Event</h1>
                <h2 className={styles.eventTitle}>{event.title}</h2>
                <p className={styles.eventDate}>{new Date(event.date).toDateString()} | {event.location}</p>

                {status === 'success' ? (
                    <div className={styles.success}>
                        <h2>Registration Successful!</h2>
                        <p>You have been registered for {event.title}. We have sent a confirmation email to {formData.email}.</p>
                        <button onClick={() => navigate('/events')} className={styles.backBtn}>Back to Events</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.group}>
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className={styles.group}>
                            <label>Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className={styles.group}>
                            <label>Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className={styles.group}>
                            <label>Number of Attendees</label>
                            <input type="number" name="attendees" min="1" max="10" value={formData.attendees} onChange={handleChange} required />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EventRegister;
