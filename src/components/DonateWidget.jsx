import { Heart } from 'lucide-react';
import styles from './DonateWidget.module.css';

const DonateWidget = () => {
    return (
        <div className={styles.floatingWidget}>
            <a href="https://buy.stripe.com/test_donate" target="_blank" rel="noopener noreferrer" className={styles.donateBtn}>
                <Heart fill="white" size={24} />
                <span>Donate</span>
            </a>
        </div>
    );
};

export default DonateWidget;
