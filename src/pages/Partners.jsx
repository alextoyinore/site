import styles from './Partners.module.css';
import partnersData from '../data/partners.json';

const Partners = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Our Partners</h1>
                <p>Collaborating with organizations to create lasting impact.</p>
            </div>

            <div className={styles.grid}>
                {partnersData.map(partner => (
                    <a key={partner.id} href={partner.website} target="_blank" rel="noopener noreferrer" className={styles.card}>
                        <div className={styles.logoWrapper}>
                            <img src={partner.logo} alt={partner.name} className={styles.logo} />
                        </div>
                        <h3 className={styles.name}>{partner.name}</h3>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Partners;
