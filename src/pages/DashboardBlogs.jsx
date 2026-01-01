import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import styles from './DashboardPages.module.css';
import blogData from '../data/blog.json';

const DashboardBlogs = () => {
    const [posts, setPosts] = useState(blogData);
    const navigate = useNavigate();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this post?')) {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Blog Posts</h1>
                <Link to="/dashboard/blogs/new" className={styles.actionBtn}>
                    <Plus size={18} /> New Post
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img
                                            src={post.image}
                                            alt=""
                                            style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                        />
                                        <span>{post.title}</span>
                                        {post.featured && <span style={{ fontSize: '0.7rem', background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px' }}>Featured</span>}
                                    </div>
                                </td>
                                <td>{post.author}</td>
                                <td>{new Date(post.date).toLocaleDateString()}</td>
                                <td><span className={styles.statusActive}>Published</span></td>
                                <td>
                                    <button className={styles.iconBtn} onClick={() => navigate(`/blog/${post.id}`)} title="View"><Eye size={18} /></button>
                                    <button className={styles.iconBtn} onClick={() => navigate(`/dashboard/blogs/edit/${post.id}`)} title="Edit"><Edit size={18} /></button>
                                    <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(post.id)} title="Delete"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardBlogs;
