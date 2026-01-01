import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h3>Abigail Aina Development Initiative</h3>
                    <p>Abigail Aina Development Initiative - Empowering women and educating children for a brighter future.</p>
                </div>
                <div className={styles.column}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/programs">Our Programs</Link></li>
                        <li><Link to="/blog">Our Blog</Link></li>
                        <li><Link to="/events">Events</Link></li>
                        <li><Link to="/partners">Our Partners</Link></li>
                        <li><Link to="/sponsors">Sponsors</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h4>Contact</h4>
                    <p>Lagos, Nigeria</p>
                    <p>info@aadi.org</p>
                    <p>+234 800 123 4567</p>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} Abigail Aina Development Initiative. All rights reserved.</p>
            </div>
        </footer >
    );
};

export default Footer;
