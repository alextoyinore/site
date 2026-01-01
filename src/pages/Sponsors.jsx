import styles from './Sponsors.module.css';
import sponsorsData from '../data/sponsors.json';

const Sponsors = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Our Sponsors</h1>
                <p>Generous support that fuels our community programs.</p>
            </div>

            <div className={styles.grid}>
                {sponsorsData.map(sponsor => (
                    <div key={sponsor.id} className={styles.card}>
                        <div className={styles.logoWrapper}>
                            <img src={sponsor.logo} alt={sponsor.name} className={styles.logo} />
                        </div>
                        <h3 className={styles.name}>{sponsor.name}</h3>
                        <span className={styles.level}>{sponsor.level}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sponsors;
