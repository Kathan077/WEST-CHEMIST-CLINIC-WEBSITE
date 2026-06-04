import React from 'react';
import BlogHero from '@/components/blog/BlogHero';
import TrendingTopics from '@/components/blog/TrendingTopics';
import BlogGrid from '@/components/blog/BlogGrid';
import HealthTools from '@/components/blog/HealthTools';
import SocialFeed from '@/components/blog/SocialFeed';
import Newsletter from '@/components/blog/Newsletter';
import CTASection from '@/components/home/CTASection';

export const metadata = {
    title: 'Health Blog & Insights | West Chemist Clinic',
    description: 'Stay informed with the latest health tips, medical news, and clinical insights from our pharmaceutical experts.',
};

export default function BlogPage() {
    return (
        <main className="blog_page">
            <BlogHero />
            
            {/* Trending Tags Section */}
            <TrendingTopics />

            {/* Health Tools Section */}
            <HealthTools />

            {/* Main Blog Content Grid */}
            <BlogGrid />

            {/* Instagram Style Social Feed */}
            <SocialFeed />

            {/* Newsletter Subscription */}
            <Newsletter />

            {/* Reuse Home CTA */}
            <CTASection />
        </main>
    );
}
