import Hero from '../components/Hero';
import Mission from '../components/Mission';
import Impact from '../components/Impact';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import PartnersSlider from '../components/PartnersSlider';
import DonateWidget from '../components/DonateWidget';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import blogData from '../data/blog.json';

const Home = () => {
    // Get latest 3 featured posts
    const featuredPosts = blogData.filter(p => p.featured).slice(0, 3);

    return (
        <div className={styles.container}>
            <Hero />
            <PartnersSlider />
            <Mission />

            {/* Featured Programs Preview */}
            <section className={styles.featuredPrograms}>
                <div className={styles.sectionHeader}>
                    <h2>Our Core Initiatives</h2>
                    <p>We focus on sustainable development through these key pillars.</p>
                </div>
                <div className={styles.programGrid}>
                    <div className={styles.programCard} style={{ borderTopColor: 'var(--primary)' }}>
                        <h3>Girl Child Education</h3>
                        <p>Scholarships and supplies for girls in rural areas to ensure they complete secondary education.</p>
                        <Link to="/programs" className={styles.learnMore}>Learn More <ArrowRight size={16} /></Link>
                    </div>
                    <div className={styles.programCard} style={{ borderTopColor: 'var(--accent)' }}>
                        <h3>Women Entrepreneurship</h3>
                        <p>Micro-grants and business training for women starting small businesses.</p>
                        <Link to="/programs" className={styles.learnMore}>Learn More <ArrowRight size={16} /></Link>
                    </div>
                    <div className={styles.programCard} style={{ borderTopColor: 'var(--secondary)' }}>
                        <h3>Health Outreach</h3>
                        <p>Free medical checkups and malaria prevention supplies for communities.</p>
                        <Link to="/programs" className={styles.learnMore}>Learn More <ArrowRight size={16} /></Link>
                    </div>
                </div>
                <div className={styles.centerBtn}>
                    <Link to="/programs" className={styles.viewAllBtn}>View All Programs</Link>
                </div>
            </section>

            {/* Featured Blogs Section */}
            {featuredPosts.length > 0 && (
                <section className={styles.section} style={{ background: '#f8fafc', padding: '5rem 2rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'hsl(var(--text-main))' }}>Latest from our Blog</h2>
                                <p style={{ fontSize: '1.2rem', color: 'hsl(var(--text-secondary))' }}>Read about our latest activities and impact stories.</p>
                            </div>
                            <Link to="/blog" style={{ color: 'hsl(var(--primary))', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>View All Posts <ArrowRight size={16} /></Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {featuredPosts.map(post => (
                                <Link to={`/blog/${post.id}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', height: '100%', transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ height: '200px', overflow: 'hidden' }}>
                                            <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
                                        </div>
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'hsl(var(--primary))', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>{new Date(post.date).toLocaleDateString()}</span>
                                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', lineHeight: '1.4' }}>{post.title}</h3>
                                            <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.6', fontSize: '1rem', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{post.excerpt}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Impact />
            <Testimonials />

            <Newsletter />
            <DonateWidget />
        </div>
    );
};

export default Home;
