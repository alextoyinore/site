import styles from './Mission.module.css';
import { BookOpen, Users, Heart } from 'lucide-react';

const Mission = () => {
    const cards = [
        {
            icon: <BookOpen size={40} />,
            title: 'Child Education',
            desc: 'Providing school supplies, scholarships, and after-school programs.'
        },
        {
            icon: <Users size={40} />,
            title: 'Women Empowerment',
            desc: 'Skill acquisition workshops and micro-grants for women entrepreneurs.'
        },
        {
            icon: <Heart size={40} />,
            title: 'Community Support',
            desc: 'Health outreach, feeding programs, and community development.'
        }
    ];

    return (
        <section className={styles.mission}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Our Mission</h2>
                    <p>Building sustainable futures through education and empowerment.</p>
                </div>
                <div className={styles.grid}>
                    {cards.map((card, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.icon}>{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mission;
