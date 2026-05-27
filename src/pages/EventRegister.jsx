import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './EventRegister.module.css';
import events from '../data/events.json';

const EventRegister = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        attendees: 1
    });
    const [status, setStatus] = useState('');

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
                    console.error('Error fetching event for registration:', error);
                }
            }
            const fallbackEvent = events.find(e => e.id.toString() === id.toString());
            setEvent(fallbackEvent || null);
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    if (loading) return <div className={styles.container}>Loading registration form...</div>;
    if (!event) return <div className={styles.container}>Event not found</div>;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase
                    .from('event_registrations')
                    .insert([
                        {
                            event_id: isNaN(event.id) ? null : parseInt(event.id),
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            attendees: parseInt(formData.attendees)
                        }
                    ]);
                if (error) throw error;
                setStatus('success');
                return;
            } catch (error) {
                console.error('Error saving registration to Supabase:', error);
                alert('Could not submit registration. Please try again.');
                setStatus('error');
                return;
            }
        }

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
        }, 1500);
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
