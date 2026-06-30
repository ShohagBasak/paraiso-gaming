import React from 'react';
import { FaGem, FaCrown, FaStar, FaCheck, FaPaypal, FaCreditCard, FaBitcoin } from 'react-icons/fa';

const Donate = () => {
  // Donation VIP Packages Data with Stripe URLs
  const donationPackages = [
    {
      id: 1,
      name: "Supporter",
      price: "$5.00",
      duration: "Per Month",
      icon: <FaStar className="text-4xl text-cyan-400" />,
      color: "cyan",
      borderColor: "border-cyan-500/30",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
      buttonColor: "bg-cyan-500 hover:bg-cyan-400 text-black",
      // Stripe Payment Link (Replace with your actual link)
      paymentUrl: "https://buy.stripe.com/test_5kQdR94BF6jB3cjdmh8ww00", 
      features: [
        "Priority Server Queue (Level 1)",
        "Exclusive Discord Role",
        "$25,000 In-game Cash",
        "Supporter Vehicle Pack"
      ]
    },
    {
      id: 2,
      name: "Premium VIP",
      price: "$15.00",
      duration: "Per Month",
      icon: <FaGem className="text-5xl text-purple-400" />,
      color: "purple",
      borderColor: "border-purple-500",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]",
      buttonColor: "bg-purple-500 hover:bg-purple-400 text-white",
      isPopular: true,
      // Stripe Payment Link (Replace with your actual link)
      paymentUrl: "https://buy.stripe.com/test_your_link_2",
      features: [
        "Priority Server Queue (Level 2)",
        "Premium Discord VIP Role",
        "$100,000 In-game Cash",
        "1x Custom Import Car",
        "Custom Phone Number"
      ]
    },
    {
      id: 3,
      name: "Elite Boss",
      price: "$35.00",
      duration: "Lifetime",
      icon: <FaCrown className="text-4xl text-yellow-400" />,
      color: "yellow",
      borderColor: "border-yellow-500/30",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]",
      buttonColor: "bg-yellow-500 hover:bg-yellow-400 text-black",
      // Stripe Payment Link (Replace with your actual link)
      paymentUrl: "https://buy.stripe.com/test_5kQdR94BF6jB3cjdmh8ww00",
      features: [
        "Highest Priority Queue",
        "Elite Boss Discord Role",
        "$500,000 In-game Cash",
        "Create Custom Gang/Business",
        "3x Custom Import Cars",
        "Custom License Plate"
      ]
    }
  ];

  // Handle Checkout Click
  const handleCheckout = (url) => {
    // Redirects the user to the Stripe Checkout Page
    window.location.href = url;
  };

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#0a0f14] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-4">
            Support The <span className="text-cyan-500">Server</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            All donations go directly towards server hosting, development, and community events. We appreciate your support!
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {donationPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative bg-[#121820] rounded-3xl p-8 border ${pkg.borderColor} transition-all duration-300 ${pkg.hoverShadow} flex flex-col ${pkg.isPopular ? 'md:-translate-y-4 md:scale-105 z-10 shadow-2xl' : ''}`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">{pkg.icon}</div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">{pkg.name}</h3>
                <div className="flex justify-center items-end gap-1">
                  <span className="text-4xl font-black text-white">{pkg.price}</span>
                  <span className="text-slate-400 font-medium pb-1">/ {pkg.duration}</span>
                </div>
              </div>

              <div className="flex-1 mb-8">
                <ul className="space-y-4">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <FaCheck className={`text-${pkg.color}-400 mt-1 flex-shrink-0`} />
                      <span className="text-sm md:text-base leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stripe Checkout Button */}
              <button 
                onClick={() => handleCheckout(pkg.paymentUrl)}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:scale-105 ${pkg.buttonColor}`}
              >
                Purchase Now
              </button>
            </div>
          ))}
        </div>

        {/* Disclaimer Section */}
        <div className="mt-20 border-t border-slate-800 pt-10 text-center">
          <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest font-bold">
            Secure Payments via Stripe
          </p>
          <div className="flex justify-center items-center gap-6 text-4xl text-slate-500 mb-8">
            <FaPaypal className="hover:text-blue-500 transition-colors cursor-pointer" />
            <FaCreditCard className="hover:text-cyan-500 transition-colors cursor-pointer" />
            <FaBitcoin className="hover:text-yellow-500 transition-colors cursor-pointer" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Donate;