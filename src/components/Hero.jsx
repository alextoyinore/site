import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import heroImage from '../assets/images/hero.png';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <div className={styles.badge}>Abigail Aina Development Initiative</div>
                <h1 className={styles.title}>
                    Empowering the <span className={styles.highlight}>Future</span> of Nigeria
                </h1>
                <p className={styles.subtitle}>
                    We are dedicated to uplifting women and providing quality education to children in underserved communities. Join us in making a difference.
                </p>
                <div className={styles.actions}>
                    <Link to="/programs" className={styles.primaryBtn}>
                        Our Programs
                    </Link>
                    <Link to="/join" className={styles.secondaryBtn}>
                        Get Involved <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
            <div className={styles.imageWrapper}>
                <img src={heroImage} alt="Teacher helping student" className={styles.heroImage} />
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>500+</span>
                    <span className={styles.statLabel}>Lives Impacted</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
