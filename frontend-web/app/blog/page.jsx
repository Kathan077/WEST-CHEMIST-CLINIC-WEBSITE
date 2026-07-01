"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import BlogHero from '@/components/blog/BlogHero';
import BlogGrid from '@/components/blog/BlogGrid';
import HealthTools from '@/components/blog/HealthTools';
import SocialFeed from '@/components/blog/SocialFeed';
import CTASection from '@/components/home/CTASection';
import '@/components/blog/BlogGrid.css';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch blogs from API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(`${API_URL}/api/blogs`);
                const data = await res.json();
                if (data.success && data.data) {
                    setPosts(data.data);
                }
            } catch (err) {
                console.error("Error fetching blogs from API:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const openReader = (post) => {
        router.push(`/blog/${post.slug}`);
    };

    // Determine featured post (latest post)
    const featuredPost = posts.length > 0 ? posts[0] : null;
    
    // Remaining posts for the grid (excluding the featured one if there is more than 1)
    const gridPosts = posts.length > 1 ? posts.slice(1) : posts;

    return (
        <main className="blog_page">
            <BlogHero 
                featuredPost={featuredPost} 
                onReadClick={() => featuredPost && openReader(featuredPost)} 
            />

            {/* Health Tools Section */}
            <HealthTools />

            {/* Main Blog Content Grid */}
            <BlogGrid 
                posts={gridPosts} 
                loading={loading} 
                onReadClick={openReader} 
                showWelcomeIfEmpty={posts.length === 0}
            />

            {/* Instagram Style Social Feed */}
            <SocialFeed />

            {/* Reuse Home CTA */}
            <CTASection />
        </main>
    );
}
