import React from 'react';
import NewsSection from './NewsSection';
import FAQSection from './FAQSection';
import HomeTwo from './HomeTwo';
import Announcement from './Announcement';

const Home = () => {
    return (
        <div>
            <Announcement></Announcement>
            <HomeTwo></HomeTwo>
            <NewsSection></NewsSection>
            <FAQSection></FAQSection>
        </div>
    );
}
export default Home;