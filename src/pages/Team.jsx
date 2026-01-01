import styles from './Team.module.css';
import teamData from '../data/team.json';

const Team = () => {
    const founder = teamData.filter(member => member.category === 'founder');
    const board = teamData.filter(member => member.category === 'board');
    const management = teamData.filter(member => member.category === 'management');

    const TeamSection = ({ title, members }) => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <div className={styles.grid}>
                {members.map(member => (
                    <div key={member.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <img src={member.image} alt={member.name} className={styles.image} />
                        </div>
                        <div className={styles.info}>
                            <h3 className={styles.name}>{member.name}</h3>
                            <p className={styles.role}>{member.role}</p>
                            <p className={styles.bio}>{member.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Our Team</h1>
                <p>Meet the dedicated individuals driving our mission forward.</p>
            </div>

            <TeamSection title="Founder" members={founder} />
            <TeamSection title="Board of Directors" members={board} />
            <TeamSection title="Management Team" members={management} />
        </div>
    );
};

export default Team;
