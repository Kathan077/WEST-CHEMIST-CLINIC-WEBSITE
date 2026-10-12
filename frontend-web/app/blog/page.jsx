"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import BlogHero from '@/components/blog/BlogHero';
import BlogGrid from '@/components/blog/BlogGrid';
import CTASection from '@/components/home/CTASection';
import '@/components/blog/BlogGrid.css';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [heroCMS, setHeroCMS] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch blogs and hero CMS from API
    useEffect(() => {
        const fetchBlogsAndCMS = async () => {
            try {
                const [blogsRes, cmsRes] = await Promise.all([
                    fetch(`${API_URL}/api/blogs`),
                    fetch(`${API_URL}/api/blogs-cms`)
                ]);
                const blogsData = await blogsRes.json();
                if (blogsData.success && blogsData.data) {
                    setPosts(blogsData.data);
                }
                const cmsData = await cmsRes.json();
                if (cmsData.success && cmsData.data?.hero) {
                    setHeroCMS(cmsData.data.hero);
                }
            } catch (err) {
                console.error("Error fetching blogs from API:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogsAndCMS();
    }, []);

    const openReader = (post) => {
        router.push(`/blog/${post.slug}`);
    };

    // Determine featured post:
    // If heroCMS specifies a selectedPostId, find it; otherwise fallback to posts[0]
    let featuredPost = null;
    if (heroCMS?.selectedPostId) {
        featuredPost = posts.find(p => p._id === heroCMS.selectedPostId) || (posts.length > 0 ? posts[0] : null);
    } else {
        featuredPost = posts.length > 0 ? posts[0] : null;
    }
    
    // Remaining posts for the grid (excluding the featured one if there is more than 1)
    const gridPosts = featuredPost 
        ? posts.filter(p => p._id !== featuredPost._id) 
        : (posts.length > 1 ? posts.slice(1) : posts);

    return (
        <main className="blog_page">
            <BlogHero 
                featuredPost={featuredPost} 
                heroCMS={heroCMS}
                onReadClick={() => featuredPost && openReader(featuredPost)} 
            />

            {/* Main Blog Content Grid */}
            <BlogGrid 
                posts={gridPosts.length > 0 ? gridPosts : posts} 
                loading={loading} 
                onReadClick={openReader} 
                showWelcomeIfEmpty={posts.length === 0}
            />

            {/* Reuse Home CTA */}
            <CTASection />
        </main>
    );
}
