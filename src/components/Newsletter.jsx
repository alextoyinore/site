import styles from './Newsletter.module.css';

const Newsletter = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h2>Stay Connected</h2>
                    <p>Join our newsletter to receive updates on our latest projects, events, and success stories.</p>
                </div>
                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Enter your email address" required />
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
