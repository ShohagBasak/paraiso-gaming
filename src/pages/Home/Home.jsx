import React from 'react';
import Banner from './Banner';
import NewsSection from './NewsSection';
import FAQSection from './FAQSection';
import SwiperBanner from './SwiperBanner';

const Home = () => {
    return (
        <div>
            <SwiperBanner></SwiperBanner>
            <Banner></Banner>
            <NewsSection></NewsSection>
            <FAQSection></FAQSection>
        </div>
    );
};

export default Home;