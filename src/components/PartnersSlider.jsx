import styles from './PartnersSlider.module.css';
import partnersData from '../data/partners.json';

const PartnersSlider = () => {
    return (
        <section className={styles.sliderSection}>
            <div className={styles.container}>
                <h3 className={styles.title}>Trusted by our Partners</h3>
                <div className={styles.slider}>
                    <div className={styles.slideTrack}>
                        {[...partnersData, ...partnersData].map((partner, index) => (
                            <div key={`${partner.id}-${index}`} className={styles.slide}>
                                <img src={partner.logo} alt={partner.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnersSlider;
