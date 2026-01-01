import styles from './DashboardPages.module.css';

const DashboardSettings = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
            </div>

            <div className={styles.tableContainer} style={{ padding: '2rem' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Site Name</label>
                        <input type="text" defaultValue="AADI" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Admin Email</label>
                        <input type="email" defaultValue="admin@aadi.org" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                    </div>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" defaultChecked />
                            Enable Email Notifications
                        </label>
                    </div>
                    <div>
                        <button type="submit" className={styles.actionBtn}>Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DashboardSettings;
