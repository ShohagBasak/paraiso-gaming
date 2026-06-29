import { useState } from 'react';

const FAQSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How do I connect to the server?",
      answer: "Open GTA San Andreas Multiplayer, click Connect, and enter our IP address: 999.999.999.99:1999. Then click Connect and enjoy the game!"
    },
    {
      id: 2,
      question: "What bonuses do new players get?",
      answer: "New players receive $500,000 starting money and a 50% discount on purchases for the first 7 days on the server."
    },
    {
      id: 3,
      question: "How can I become a staff member?",
      answer: "Visit the Apply page and submit your application. We regularly recruit new moderators and helpers for the server."
    },
    {
      id: 4,
      question: "How do I level up on the server?",
      answer: "You can level up by completing various jobs such as: driving a taxi, mining materials, selling goods, or completing special missions."
    },
    {
      id: 5,
      question: "How many players can play on the server?",
      answer: "Our server supports up to 1000 players. We have 50+ custom jobs, multiple factions, weekly events, and much more to explore!"
    }
  ];

  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">Frequently Asked Questions</h2>
        <div className="bg-slate-800/80 backdrop-blur border border-cyan-500 rounded-lg overflow-hidden">
          {faqData.map((faq) => (
            <div key={faq.id} className="border-b border-cyan-500/20 last:border-b-0">
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full p-6 flex justify-between items-center hover:bg-slate-700/30 transition-colors"
              >
                <h3 className="text-lg font-bold text-cyan-300 text-left">{faq.question}</h3>
                <span className="text-cyan-400 text-2xl">
                  {openFaq === faq.id ? '−' : '+'}
                </span>
              </button>
              
              {openFaq === faq.id && (
                <div className="px-6 pb-6 text-gray-300 bg-slate-700/20">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;