import React from 'react';
import Banner from './Banner';
import NewsSection from './NewsSection';
import FAQSection from './FAQSection';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <NewsSection></NewsSection>
            <FAQSection></FAQSection>
        </div>
    );
};

export default Home;