import React from 'react';
import NewsSection from './NewsSection';
import FAQSection from './FAQSection';
import SwiperBanner from './SwiperBanner';
import FeaturesSlider from './FeaturesSlider';

const Home = () => {
    return (
        <div>
            <SwiperBanner></SwiperBanner>
            <FeaturesSlider></FeaturesSlider>
            <NewsSection></NewsSection>
            <FAQSection></FAQSection>
        </div>
    );
};

export default Home;