import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './Blog.module.css';
import blogData from '../data/blog.json';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            if (isSupabaseConfigured) {
                try {
                    const { data, error } = await supabase
                        .from('blogs')
                        .select('*')
                        .order('date', { ascending: false });
                    if (error) throw error;
                    setPosts(data || []);
                    return;
                } catch (error) {
                    console.error('Error fetching blogs, using fallback:', error);
                }
            }
            setPosts(blogData);
        };
        fetchBlogs();
    }, []);
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Our Blog</h1>
                <p>Stories of impact, updates, and insights from AADI.</p>
            </header>

            <div className={styles.grid}>
                {posts.map(post => (
                    <div key={post.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <img src={post.image || 'https://via.placeholder.com/400x250'} alt={post.title} />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.meta}>
                                <span>{new Date(post.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{post.author}</span>
                            </div>
                            <h2 className={styles.title}>{post.title}</h2>
                            <p className={styles.excerpt}>{post.excerpt}</p>
                            <Link to={`/blog/${post.id}`} className={styles.readMore}>
                                Read Full Story &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
