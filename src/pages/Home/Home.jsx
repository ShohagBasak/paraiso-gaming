import React from 'react';
import FAQSection from './FAQSection';
import HomeTwo from './HomeTwo';
import Announcement from './Announcement';

const Home = () => {
    return (
        <div>
            <Announcement></Announcement>
            <HomeTwo></HomeTwo>
            <FAQSection></FAQSection>
        </div>
    );
}
export default Home;