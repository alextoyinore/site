import { Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const Testimonials = () => {
    const testimonials = [
        {
            quote: "AADI gave me the hope and support I needed to finish my education. I am now the first university graduate in my family.",
            author: "Chioma Okonjo",
            role: "Beneficiary"
        },
        {
            quote: "Volunteering with AADI has been one of the most fulfilling experiences of my life. The impact is real and visible.",
            author: "David Ibrahim",
            role: "Volunteer"
        },
        {
            quote: "The dedication of the AADI team to community development is unmatched. They truly care about every child.",
            author: "Mrs. Adebayo",
            role: "School Principal"
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Success Stories</h2>
                    <p>Voices from our community.</p>
                </div>
                <div className={styles.grid}>
                    {testimonials.map((item, index) => (
                        <div key={index} className={styles.card}>
                            <Quote className={styles.icon} size={40} />
                            <p className={styles.quote}>"{item.quote}"</p>
                            <div className={styles.author}>
                                <h4>{item.author}</h4>
                                <span>{item.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
