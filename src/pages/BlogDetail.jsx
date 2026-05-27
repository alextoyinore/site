import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import styles from './BlogDetail.module.css';
import blogData from '../data/blog.json';

// Simple Block Renderer Component
const BlockRenderer = ({ block }) => {
    switch (block.type) {
        case 'header':
            const Tag = `h${block.data.level}`;
            return <Tag className={styles.blockHeader} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        case 'paragraph':
            return <p className={styles.blockParagraph} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
                <ListTag className={styles.blockList}>
                    {block.data.items.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                </ListTag>
            );
        case 'image':
            return (
                <figure className={styles.blockImage}>
                    <img src={block.data.file.url} alt={block.data.caption || ''} />
                    {block.data.caption && <figcaption>{block.data.caption}</figcaption>}
                </figure>
            );
        case 'quote':
            return (
                <blockquote className={styles.blockQuote}>
                    <p>{block.data.text}</p>
                    {block.data.caption && <cite>- {block.data.caption}</cite>}
                </blockquote>
            );
        case 'table':
            // Basic table rendering
            return (
                <div className={styles.tableWrapper}>
                    <table className={styles.blockTable}>
                        <tbody>
                            {block.data.content.map((row, rIndex) => (
                                <tr key={rIndex}>
                                    {row.map((cell, cIndex) => (
                                        <td key={cIndex} dangerouslySetInnerHTML={{ __html: cell }} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        default:
            console.warn('Unknown block type', block.type);
            return null;
    }
};

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            if (isSupabaseConfigured) {
                try {
                    // Try parsing id to int if it is numerical for compatibility
                    const queryId = isNaN(id) ? id : parseInt(id);
                    const { data, error } = await supabase
                        .from('blogs')
                        .select('*')
                        .eq('id', queryId)
                        .single();
                    if (error) throw error;
                    if (data) {
                        setPost(data);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching blog detail from Supabase, using fallback:', error);
                }
            }
            const fallbackPost = blogData.find(p => p.id.toString() === id.toString());
            setPost(fallbackPost || null);
            setLoading(false);
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '5rem' }}>
                <h2>Loading post...</h2>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '5rem' }}>
                <h2>Post not found</h2>
                <Link to="/blog" className={styles.backLink}>Go back to Blog</Link>
            </div>
        );
    }

    return (
        <article className={styles.article}>
            <div className={styles.hero} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${post.image})` }}>
                <div className={styles.heroContent}>
                    <Link to="/blog" className={styles.backLinkHero}>
                        <ArrowLeft size={20} /> Back to Blog
                    </Link>
                    <h1>{post.title}</h1>
                    <div className={styles.meta}>
                        <span><User size={16} /> {post.author}</span>
                        <span><Calendar size={16} /> {new Date(post.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {post.content && post.content.blocks && post.content.blocks.map(block => (
                    <BlockRenderer key={block.id} block={block} />
                ))}
            </div>
        </article>
    );
};

export default BlogDetail;
