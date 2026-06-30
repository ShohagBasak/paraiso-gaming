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
      icon: <FaUserTie className="text-red-600" />,
      borderColor: "border-red-500/30",
      hoverBorder: "hover:border-red-500",
      textColor: "text-red-600",
      members: [
        { name: "Brian", role: "Community Manager", country: "us" }, 
        { name: "Surreal", role: "Director of Game Affairs | Tech", country: "ph" } 
      ]
    },
    {
      category: "Assistant Management",
      icon: <FaUserCog className="text-red-600" />,
      borderColor: "border-red-500/30",
      hoverBorder: "hover:border-red-500",
      textColor: "text-red-600",
      members: [
        { name: "Leamir", role: "Head Developer", country: "br" } 
      ]
    },
    {
      category: "Head Admin",
      icon: <FaShieldAlt className="text-fuchsia-900" />,
      borderColor: "border-fuchsia-900/30",
      hoverBorder: "hover:border-fuchsia-500",
      textColor: "text-fuchsia-900",
      members: [
        { name: "Mofuman", role: "Head Administrator", country: "us" },
        { name: "Danny", role: "Head Administrator", country: "gb" },
        { name: "Omarito", role: "Director of Gang Management", country: "eg" }
      ]
    },
    {
      category: "Senior Admin",
      icon: <FaUserShield className="text-purple-500" />,
      borderColor: "border-purple-500/30",
      hoverBorder: "hover:border-purple-500",
      textColor: "text-purple-400",
      members: [
        { name: "Sakura", role: "Director of Helper Management", country: "ph" }, 
        { name: "Andres", role: "Assistant Director of Helper", country: "ph" },
        { name: "Kloss", role: "Assistant Director of Helper", country: "nz" }
      ]
    },
    {
      category: "General Admin",
      icon: <FaUserShield className="text-blue-500" />,
      borderColor: "border-blue-500/30",
      hoverBorder: "hover:border-blue-500",
      textColor: "text-blue-400",
      members: [
        { name: "Tyler", role: "General Administrator", country: "ph" },
        { name: "Larz", role: "General Administrator", country: "nz" },
        { name: "Pharell", role: "General Administrator", country: "ca" }
      ]
    },
    {
      category: "Junior Admin",
      icon: <FaUserShield className="text-cyan-500" />,
      borderColor: "border-cyan-500/30",
      hoverBorder: "hover:border-cyan-500",
      textColor: "text-cyan-400",
      members: [
        {name: "Hataz ", role: "Helper Manager", country: "ph"}
      ]
    },
    {
      category: "Developers",
      icon: <FaCode className="text-green-500" />,
      borderColor: "border-green-500/30",
      hoverBorder: "hover:border-green-500",
      textColor: "text-green-400",
      members: [
        { name: "Drizzy", role: "Scripter", country: "ph" }
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

                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                          {staff.name}
                          {staff.country && (
                            <img 
                              src={`https://flagcdn.com/24x18/${staff.country}.png`} 
                              alt={staff.country} 
                              className="w-5 h-auto rounded-[2px] opacity-90 shadow-sm"
                              title={`Country: ${staff.country.toUpperCase()}`}
                            />
                          )}
                        </h3>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                          {staff.role}
                        </p>
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