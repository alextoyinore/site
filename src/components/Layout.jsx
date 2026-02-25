import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, paddingTop: isHome ? 0 : 'var(--header-height)' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
