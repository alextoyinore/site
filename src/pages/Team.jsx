import styles from './Team.module.css';
import teamData from '../data/team.json';

const Team = () => {
    const board = teamData.filter(member => member.category === 'board');

    const TeamSection = ({ title, members }) => (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <div className={styles.grid}>
                {members.map(member => (
                    <div key={member.id} className={styles.card}>
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

            <div className={styles.introSection}>
                <h2>BOARD OF TRUSTEES</h2>
                <h3>ABIGAIL AINA DEVELOPMENT INITIATIVE (AADI)</h3>
                <p>
                    Abigail Aina Development Initiative (AADI) is managed by a Board of Trustees made up of
                    responsible and accomplished personalities whose expertise spans institutions and professions
                    such as Healthcare, Compliance, Protocol, Business continuity, Advocacy, Entrepreneur and Law.
                    Their collective experience strengthens the foundation’s commitment to bolster corporate integrity,
                    sustainability, and impactful service delivery.
                </p>
                <p>The Board members of AADI includes:</p>
            </div>

            <TeamSection title="Board of Trustees" members={board} />

            <div className={styles.conclusionSection}>
                <p>
                    The Board of Trustees of AADI represents a blend of compassion, professionalism, compliance,
                    resilience, and justice. With their diverse backgrounds and shared commitment to service,
                    they provide strong leadership and oversight for the realization of AADI’s mission of
                    empowering the less privileged and to promote sustainable development.
                </p>
            </div>
        </div>
    );
};

export default Team;
