import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';

const BASE_URL = 'http://localhost:5000';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, rolesRes] = await Promise.all([
          fetch(`${BASE_URL}/staff`, { credentials: 'include' }),
          fetch(`${BASE_URL}/staff-roles`, { credentials: 'include' })
        ]);
        const staffData = await staffRes.json();
        const rolesData = await rolesRes.json();

        setStaffList(Array.isArray(staffData) ? staffData : []);
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (err) {
        console.error("Failed to load staff roster data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Render the selected React Icon from FontAwesome dynamically or raw emoji/character
  const renderRoleIcon = (iconName, color) => {
    if (FaIcons[iconName]) {
      const IconComponent = FaIcons[iconName];
      return <IconComponent style={{ color }} />;
    }
    return <span style={{ color }} className="font-sans text-2xl select-none">{iconName}</span>;
  };

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
             <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-sm font-semibold tracking-wider uppercase">Loading administrative roster...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="bg-[#121820]/50 border border-slate-800 border-dashed rounded-xl p-10 text-center">
            <p className="text-slate-500 italic text-sm">No departments or staff members are currently listed.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {roles.map((role) => {
              // Filter staff members belonging to this category
              const members = staffList.filter(member => member.category === role.name);

              return (
                <div key={role.id} className="w-full">
                  
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
                    <div className="text-2xl">
                      {renderRoleIcon(role.icon_name, role.color)}
                    </div>
                    <h2 
                      style={{ color: role.color || '#ffffff' }}
                      className="text-2xl font-bold uppercase tracking-widest"
                    >
                      {role.name}
                    </h2>
                  </div>

                  {members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {members.map((staffMember, idx) => (
                        <div 
                          key={idx} 
                          style={{ borderColor: `${role.color || '#ffffff'}25` }}
                          className={`bg-[#121820] border rounded-xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = role.color; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${role.color || '#ffffff'}25`; }}
                        >
                          <div 
                            style={{ borderColor: `${role.color || '#ffffff'}40` }}
                            className="w-14 h-14 rounded-full bg-[#0a0f14] flex items-center justify-center border transition-colors overflow-hidden flex-shrink-0"
                          >
                            {staffMember.image_url ? (
                              <img src={staffMember.image_url} alt={staffMember.name} className="w-full h-full object-cover" />
                            ) : (
                              <FaUserCircle className="text-3xl text-slate-500 group-hover:text-white transition-colors" />
                            )}
                          </div>
                          
                          <div>
                            <h3 
                              style={{ color: role.color || '#ffffff' }}
                              className="text-lg font-bold transition-colors flex items-center gap-2"
                            >
                              {staffMember.name}
                              {staffMember.country && (
                                <img 
                                  src={`https://flagcdn.com/24x18/${staffMember.country.toLowerCase()}.png`} 
                                  alt={staffMember.country} 
                                  className="w-5 h-auto rounded-[2px] opacity-90 shadow-sm"
                                  title={`Country: ${staffMember.country.toUpperCase()}`}
                                />
                              )}
                            </h3>
                            {staffMember.role && (
                               <p className="text-xs font-medium text-slate-400 mt-0.5">
                                 {staffMember.role}
                               </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#121820]/30 border border-slate-850 border-dashed rounded-xl p-6 text-center">
                      <p className="text-slate-600 italic text-sm">No staff currently assigned to this position.</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

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