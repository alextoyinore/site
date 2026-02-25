import styles from './About.module.css';

const About = () => {
    return (
        <div className={styles.container}>
            <section className={styles.history}>
                <h1>About AADI</h1>
                <p>
                    Abigail Aina Development Initiative is a foundation established to support the vulnerable in the society
                    while empowering them to discover, develop, and have the forum to exhibit their God-given potentials to the world.
                </p>
                <p>
                    AADI is born to bring hope, dignity, and sustainable improvement to lives through carefully structured programs which includes:
                </p>
                <ul className={styles.programList}>
                    <li>Poverty Alleviation</li>
                    <li>Economic Empowerment</li>
                    <li>Campaign against Gender Inequalities</li>
                    <li>Education support</li>
                    <li>Environmental intervention and other impactful social interventions</li>
                </ul>
                <p>
                    These programs are specifically tailored to benefit indigent and vulnerable members of society,
                    with the ultimate goal of bettering their lives and bringing lasting succor to them.
                </p>
                <p className={styles.ctaText}>
                    AADI will be glad to have you on the train either as a beneficiary, partner, donor, facilitator, adviser and the like.
                </p>
            </section>

            <section className={styles.team}>
                <h2>Our Team</h2>
                <div className={styles.teamGrid}>
                    {['Chioma Adebayo', 'Yusuf Ibrahim', 'Ngozi Okonjo'].map((name, i) => (
                        <div key={i} className={styles.teamCard}>
                            <div className={styles.avatar}></div>
                            <h3>{name}</h3>
                            <p>Director</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
