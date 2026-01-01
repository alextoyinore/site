import styles from './About.module.css';

const About = () => {
    return (
        <div className={styles.container}>
            <section className={styles.history}>
                <h1>Who We Are</h1>
                <p>Founded in 2015, we started with a small group of volunteers dedicated to making education accessible.</p>
                <p>Today, we have impacted thousands of lives across Nigeria through our various outreach programs.</p>
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
