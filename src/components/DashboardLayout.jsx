import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Home, Heart, Briefcase, Image, FileText } from 'lucide-react';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const menuItems = [
        { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Events', path: '/dashboard/events', icon: <Calendar size={20} /> },
        { name: 'Blog', path: '/dashboard/blogs', icon: <FileText size={20} /> },
        { name: 'Gallery', path: '/dashboard/gallery', icon: <Image size={20} /> },
        { name: 'Reports', path: '/dashboard/reports', icon: <FileText size={20} /> },
        { name: 'Volunteers', path: '/dashboard/volunteers', icon: <Users size={20} /> },
        { name: 'Sponsors', path: '/dashboard/sponsors', icon: <Briefcase size={20} /> },
        { name: 'Donations', path: '/dashboard/donations', icon: <Heart size={20} /> },
        { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>AADI <span>Admin</span></h2>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <Link to="/" className={styles.navItem}>
                        <Home size={20} />
                        <span>Back to Site</span>
                    </Link>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h3>Dashboard</h3>
                    <div
                        className={styles.userProfile}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        style={{ position: 'relative', cursor: 'pointer' }}
                    >
                        <div className={styles.avatar}>A</div>
                        <span>Admin User</span>

                        {isProfileOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '10px',
                                background: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                padding: '0.5rem',
                                minWidth: '150px',
                                zIndex: 100
                            }}>
                                <button className={styles.logoutBtn} style={{ width: '100%', justifyContent: 'flex-start' }}>
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
