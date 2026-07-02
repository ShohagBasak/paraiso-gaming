import { useState } from 'react';

const FAQSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "When is Paraiso Gaming launching?",
      answer: "Paraiso Gaming is expected to launch within the next 2–3 weeks. Our team is currently completing final testing and polishing every system to deliver the best possible experience at launch. Be sure to join our Discord and Forums to stay up to date with announcements, development updates, giveaways, and the official launch date."
    },
    {
      id: 2,
      question: "Can I transfer my stats if I come from Horizon Roleplay?",
      answer: "Yes. We are honoring many Horizon Roleplay players. Eligible players may qualify for equivalent statistics, faction ranks, leadership positions, and exclusive rewards. Every transfer request is reviewed individually by our management team."
    },
    {
      id: 3,
      question: "How do I get started on Paraiso Gaming?",
      answer: "Simply create your character and begin your journey. Whether you want to join law enforcement, emergency services, become a business owner, criminal, lawyer, journalist, or simply live as a civilian, Paraiso Gaming offers countless opportunities to create your own story."
    },
    {
      id: 4,
      question: "Is Paraiso Gaming beginner-friendly?",
      answer: "Absolutely. Whether you’re new to SA-MP roleplay or a longtime veteran, our staff and community are here to help. We provide guides, tutorials, and active support to ensure every player has an enjoyable experience from day one."
    },
    {
      id: 5,
      question: "What makes Paraiso Gaming different?",
      answer: "Paraiso Gaming is built around immersive roleplay, fair administration, balanced gameplay, and a player-first philosophy. Our goal is to create a long-lasting community where your decisions, achievements, and roleplay truly matter."
    }
  ];

  return (
    <section className="py-16 px-8 ">
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