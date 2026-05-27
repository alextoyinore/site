import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured) {
            // Permit entry in simulation mode if Supabase credentials are not configured
            setAuthenticated(true);
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setAuthenticated(!!session);
            setLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthenticated(!!session);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
                Checking authentication...
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
