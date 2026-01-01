import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from './Contact.module.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call to updated contact.php
        /*
        await fetch('/contact.php', {
            method: 'POST',
            body: JSON.stringify({ ...formData, type: 'inquiry' })
        });
        */

        setTimeout(() => {
            console.log('Contact Data:', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Contact Us</h1>
                <p>Have questions? We'd love to hear from you.</p>
            </div>

            <div className={styles.content}>
                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <MapPin className={styles.icon} />
                        <div>
                            <h3>Visit Us</h3>
                            <p>123 NGO Drive, Victoria Island<br />Lagos, Nigeria</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <Mail className={styles.icon} />
                        <div>
                            <h3>Email Us</h3>
                            <p>info@aadi.org</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <Phone className={styles.icon} />
                        <div>
                            <h3>Call Us</h3>
                            <p>+234 800 123 4567</p>
                        </div>
                    </div>
                </div>

                <div className={styles.formWrapper}>
                    {status === 'success' ? (
                        <div className={styles.success}>
                            <h2>Message Sent!</h2>
                            <p>Thank you for reaching out. We will get back to you shortly.</p>
                            <button onClick={() => setStatus('')} className={styles.resetBtn}>Send another message</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.group}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.group}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.group}>
                                <label>Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.group}>
                                <label>Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
