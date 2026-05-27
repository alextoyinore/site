import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        if (!isSupabaseConfigured) {
            // Demo mode login
            setTimeout(() => {
                setLoading(false);
                navigate('/dashboard');
            }, 800);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setErrorMsg(error.message || 'Failed to sign in. Please verify credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.glassCard}>
                <div className={styles.logo}>
                    <h2>AADI <span>Admin Portal</span></h2>
                    <p>Enter credentials to access the dashboard</p>
                </div>

                {!isSupabaseConfigured && (
                    <div className={styles.demoBanner}>
                        <AlertCircle size={18} />
                        <span>Supabase is not configured. Running in Demo Mode.</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className={styles.form}>
                    {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            required={isSupabaseConfigured}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@aadi.org"
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                required={isSupabaseConfigured}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Authenticating...' : (
                            <>
                                <LogIn size={18} />
                                <span>{isSupabaseConfigured ? 'Sign In' : 'Enter Demo Mode'}</span>
                            </>
                        )}
                    </button>
                </form>

                {!isSupabaseConfigured && (
                    <div className={styles.extraActions}>
                        <button onClick={handleDemoLogin} className={styles.demoBtn}>
                            Quick Bypass Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
