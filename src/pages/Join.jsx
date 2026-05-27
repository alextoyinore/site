import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './Join.module.css';

const Join = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'volunteer',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase
                    .from('volunteers')
                    .insert([
                        {
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            role: formData.type,
                            message: formData.message,
                            status: 'Pending'
                        }
                    ]);
                if (error) throw error;
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', type: 'volunteer', message: '' });
                return;
            } catch (error) {
                console.error('Error submitting volunteer application:', error);
                alert('Could not submit application to the database. Please try again.');
                setStatus('error');
                return;
            }
        }

        // Simulate API call
        setTimeout(() => {
            console.log('Form Data:', formData);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', type: 'volunteer', message: '' });
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1>Join Our Mission</h1>
                <p className={styles.subtitle}>Become a member, volunteer, or partner.</p>

                {status === 'success' ? (
                    <div className={styles.success}>
                        <h2>Thank you!</h2>
                        <p>Your application has been received. We will contact you shortly.</p>
                        <button onClick={() => setStatus('')} className={styles.resetBtn}>Submit another</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.group}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.group}>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.group}>
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.group}>
                            <label>I want to join as a:</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="volunteer">Volunteer</option>
                                <option value="member">Member</option>
                                <option value="partner">Partner</option>
                                <option value="sponsor">Sponsor</option>
                            </select>
                        </div>

                        <div className={styles.group}>
                            <label>Message (Optional)</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                            ></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Join;
