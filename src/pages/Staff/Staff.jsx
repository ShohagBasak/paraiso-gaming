import React from 'react';
import { 
  FaUserTie, 
  FaShieldAlt, 
  FaCode, 
  FaUserShield, 
  FaUserCog, 
  FaUserCircle 
} from 'react-icons/fa';

const Staff = () => {

  const staffData = [
    {
      category: "Management",
      icon: <FaUserTie className="text-[#ff2d2d]" />,
      borderColor: "border-[#ff2d2d]/30",
      hoverBorder: "hover:border-[#ff2d2d]",
      textColor: "text-[#ff2d2d]",
      members: [
        { name: "Brian", role: "", country: "us" }, 
        { name: "Surreal", role: "", country: "ph" } 
      ]
    },
    {
      category: "Assistant Management",
      icon: <FaUserCog className="text-[#ff2d2d]" />,
      borderColor: "border-[#ff2d2d]/30",
      hoverBorder: "hover:border-[#ff2d2d]",
      textColor: "text-[#ff2d2d]",
      members: [
        { name: "Leamir", role: "", country: "br" } 
      ]
    },
    {
      category: "Head Admin",
      icon: <FaShieldAlt className="text-[#9B59B6]" />,
      borderColor: "border-[#9B59B6]/30",
      hoverBorder: "hover:border-[#9B59B6]",
      textColor: "text-[#9B59B6]",
      members: [
        { name: "Mofuman", role: "", country: "us" },
        { name: "Danny", role: "", country: "gb" },
        { name: "Omarito", role: "", country: "eg" }
      ]
    },
    {
      category: "Senior Admin",
      icon: <FaUserShield className="text-[#F39C12]" />,
      borderColor: "border-[#F39C12]/30",
      hoverBorder: "hover:border-[#F39C12]",
      textColor: "text-[#F39C12]",
      members: [
        { name: "Sakura", role: "", country: "ph" }, 
        { name: "Andres", role: "", country: "ph" },
        { name: "Kloss", role: "", country: "nz" }
      ]
    },
    {
      category: "General Admin",
      icon: <FaUserShield className="text-[#F1C40F]" />,
      borderColor: "border-[#F1C40F]/30",
      hoverBorder: "hover:border-[#F1C40F]",
      textColor: "text-[#F1C40F]",
      members: [
        { name: "Tyler", role: "", country: "ph" },
        { name: "Larz", role: "", country: "nz" },
        { name: "Pharell", role: "", country: "ca" }
      ]
    },
    {
      category: "Junior Admin",
      icon: <FaUserShield className="text-[#7ED321]" />,
      borderColor: "border-[#7ED321]/30",
      hoverBorder: "hover:border-[#7ED321]",
      textColor: "text-[#7ED321]",
      members: [
        {name: "Hataz ", role: "", country: "ph"}
      ]
    },
    {
      category: "Developers",
      icon: <FaCode className="text-[#1ABC9C]" />,
      borderColor: "border-[#1ABC9C]/30",
      hoverBorder: "hover:border-[#1ABC9C]",
      textColor: "text-[#1ABC9C]",
      members: [
        { name: "Drizzy", role: "", country: "ph" }
      ]
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#0a0f14] min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 tracking-tight uppercase">
            Administrative Roster
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Meet the official Paraiso Roleplay Staff Team.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {staffData.map((section, index) => (
            <div key={index} className="w-full">
              
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
                <div className="text-2xl">{section.icon}</div>
                <h2 className={`text-2xl font-bold uppercase tracking-widest ${section.textColor}`}>
                  {section.category}
                </h2>
              </div>

              {section.members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {section.members.map((staff, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-[#121820] border ${section.borderColor} rounded-xl p-5 flex items-center gap-4 transition-all duration-300 ${section.hoverBorder} hover:-translate-y-1 hover:shadow-lg group`}
                    >
                      <div className={`w-14 h-14 rounded-full bg-[#0a0f14] flex items-center justify-center border border-slate-700 group-hover:${section.borderColor} transition-colors`}>
                        <FaUserCircle className="text-3xl text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                      
                      <div>
                        <h3 className={`text-lg font-bold ${section.textColor} transition-colors flex items-center gap-2`}>
                          {staff.name}
                          {staff.country && (
                            <img 
                              src={`https://flagcdn.com/24x18/${staff.country.toLowerCase()}.png`} 
                              alt={staff.country} 
                              className="w-5 h-auto rounded-[2px] opacity-90 shadow-sm"
                              title={`Country: ${staff.country.toUpperCase()}`}
                            />
                          )}
                        </h3>
                        {staff.role && (
                           <p className="text-xs font-medium text-slate-400 mt-0.5">
                             {staff.role}
                           </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#121820]/50 border border-slate-800 border-dashed rounded-xl p-6 text-center">
                  <p className="text-slate-500 italic text-sm">No staff currently assigned to this position.</p>
                </div>
              )}

            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 pb-8 border-t border-b border-slate-800/80 text-center bg-[#121820]/30 rounded-lg">
          <p className="text-red-500/90 font-medium text-sm md:text-base">
            This roster is maintained by the Management Team and is updated whenever staff changes occur.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Staff;