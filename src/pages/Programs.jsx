import { ArrowRight } from 'lucide-react';
import styles from './Programs.module.css';

const Programs = () => {
    const programs = [
        {
            title: 'Girl Child Education',
            desc: 'Scholarships and supplies for girls in rural areas to ensure they complete secondary education.',
            color: 'var(--primary)'
        },
        {
            title: 'Women Entrepreneurship',
            desc: 'Micro-grants and business training for women starting small businesses.',
            color: 'var(--accent)'
        },
        {
            title: 'Health Outreach',
            desc: 'Free medical checkups and malaria prevention supplies for communities.',
            color: 'var(--secondary)'
        }
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Our Programs</h1>
            <div className={styles.grid}>
                {programs.map((prog, index) => (
                    <div key={index} className={styles.card} style={{ borderTopColor: prog.color }}>
                        <h2>{prog.title}</h2>
                        <p>{prog.desc}</p>
                        <button className={styles.learnMore}>
                            Learn More <ArrowRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Programs;
