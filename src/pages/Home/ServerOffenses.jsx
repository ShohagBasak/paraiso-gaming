import React from 'react';

const ServerOffenses = () => {
  const offensesData = [
    { offense: "Deathmatching (DM)", description: "Attacking a player without a valid in character reason.", punishment: ["Prison 1-4 hours", "Warn", "2-20 hour weapon restriction", "Fine money/materials up to 25% total wealth"] },
    { offense: "Revengekilling (RK)", description: "Provoking a new fight or attacking a player after you were recently killed by that player. When you die, you lose 30 minutes of memory.", punishment: ["Prison 1-2 hours", "Warn"] },
    { offense: "Non-RP Vehicle Ramming", description: "Ramming a player with any vehicle without a valid IC reason. Carparking is prohibited.", punishment: ["Prison 1-2 hours"] },
    { offense: "Robbing/Scamming Over Limit", description: "Robbing or scamming any player for more than $10,000 or 5,000 materials/equivalent value.", punishment: ["Prison 1-2 hours", "Warn", "Fine 2x amount scammed"] },
    { offense: "Attempting to Scam", description: "Attempting to scam someone for more than $10,000.", punishment: ["Prison 1 hour", "Warn if repeated"] },
    { offense: "Donation Scam", description: "Promising any donator item in exchange for in-game items and not making the donation.", punishment: ["Ban"] },
    { offense: "OOC Hit", description: "Placing a contract with an out of character reason, without knowing their name, or multiple times for the same interaction.", punishment: ["Prison 1-2 hours", "Warn", "Fine 2x hit amount"] },
    { offense: "Spamming", description: "Excessively spamming any command or chat.", punishment: ["Prison 5-30 minutes", "Fine up to 6% total wealth"] },
    { offense: "Metagaming", description: "Using out of character information for in character purposes.", punishment: ["Prison 1 hour", "Fine up to 6% total wealth"] },
    { offense: "Powergaming", description: "Performing an action your character is incapable of. Example: /me takes all your money or /me takes all your guns.", punishment: ["Prison 1 hour"] },
    { offense: "Healing in a Gunfight", description: "Healing within 10 seconds of being injured or while actively being chased.", punishment: ["Prison 1 hour", "Warn if repeated"] },
    { offense: "Heliblading / Carparking / Carbombing / Planebombing / Ninja Jacking", description: "Intentionally heliblading, carparking, carbombing, planebombing, or ninja jacking.", punishment: ["Prison 1-2 hours", "Warn"] },
    { offense: "Gun Discharge Exploits", description: "Any gun discharge exploit including QS/CS/C-bug/C-sliding.", punishment: ["Prison 1 hour", "Warn if repeated"] },
    { offense: "Exploiting Out of Prison/Jail", description: "Intentionally exploiting out of prison or jail.", punishment: ["Prison 3 hours", "Warn", "Fine 10% total wealth"] },
    { offense: "False Statement to Admin", description: "Knowingly providing a false statement to an administrator.", punishment: ["Prison 1-3 hours", "Warn", "Fine 20% total wealth"] },
    { offense: "Accepting Exploited Money/Items", description: "Accepting goods obtained through hacks or exploits and failing to report them.", punishment: ["Ban", "Fine double amount received"] },
    { offense: "Mass Exploiting", description: "Exploiting a critical server bug and failing to report it.", punishment: ["Ban", "Fine double amount exploited"] },
    { offense: "General Exploiting", description: "Exploiting animations, restricted vehicles, etc.", punishment: ["Prison 1-2 hours", "Warn if repeated"] },
    { offense: "Failure to Report Ban Evader", description: "Knowingly failing to report any person who is ban evading.", punishment: ["Prison 2 hours", "Warn"] },
    { offense: "Sharing Personal Information", description: "Sharing personal information of another community member without consent.", punishment: ["Ban"] },
    { offense: "Server Advertising", description: "Advertising another SA-MP server/community.", punishment: ["Ban"] },
    { offense: "Hacking", description: "Using any program, modification, or tool that gives an unfair advantage.", punishment: ["Ban"] },
    { offense: "Distributing/Sharing Hacks", description: "Sharing or providing downloads for unfair advantage programs/tools.", punishment: ["Ban"] },
    { offense: "Money & Auto-Job Farming", description: "Using auto-scripts to complete jobs or farm money.", punishment: ["Ban"] },
    { offense: "Selling Leadership Accounts", description: "Selling any account with rank/leadership position in a gang or faction.", punishment: ["Ban", "Banned from faction/gang leadership if unbanned"] },
    { offense: "Avoiding Percentage Fine", description: "Transferring money/materials to avoid percentage fines.", punishment: ["Prison 1-3 hours", "Warn", "Fine 50% total wealth", "Ban if repeated"] },
    { offense: "Abuse of /report", description: "Abusing the report function.", punishment: ["Muted from /report and progressive punishment"] },
    { offense: "Abuse of /newb", description: "Abusing newbie chat.", punishment: ["Muted from /newbie and progressive punishment"] },
    { offense: "Abuse of /ads", description: "Abusing the advertisement system.", punishment: ["Muted from /ads and progressive punishment"] },
    { offense: "Releasing Hitman Names", description: "Releasing the name of any hitman.", punishment: ["Prison 1-2 hours", "Warn", "Fine 20% total wealth"] },
    { offense: "Alt-tabbing/Logging Off to Avoid Death/Arrest", description: "Pausing, disconnecting, or entering Point/Event to avoid death or arrest.", punishment: ["Prison 1-2 hours", "Warn", "Fine 10% total wealth"] },
    { offense: "Exploiting Point/Events", description: "Entering Point/Event while pursued by law enforcement, wanted, or escaping prison.", punishment: ["Prison 1 hour"] },
    { offense: "Using /kill to Avoid Roleplay", description: "Using /kill to avoid interaction from any player, including LEA arrests or robberies.", punishment: ["Prison 1 hour"] },
    { offense: "Exploiting Death to Avoid Arrest", description: "Drowning or damaging your vehicle to make it explode during pursuit to avoid arrest.", punishment: ["Prison 1 hour", "Warn if repeated"] },
    { offense: "Alt-tabbing/Logging Off/Using /kill to Avoid Hit", description: "Avoiding a hitman contract by pausing, disconnecting, or using /kill.", punishment: ["Prison 1-3 hours", "Warn", "Fine 2x hit amount"] },
    { offense: "Non-RP Behavior", description: "Behavior considered non-roleplay or unrealistic.", punishment: ["Prison 1-2 hours", "Warn if repeated"] },
    { offense: "Robbing Level 1 Players", description: "Forcing a level 1 player to give you anything of financial worth or violating robbery rules.", punishment: ["Prison up to 1 hour"] },
    { offense: "Robbing/Kidnapping as Level 1", description: "Robbing or kidnapping other players while being level 1 or violating robbery rules.", punishment: ["Prison up to 1 hour"] },
    { offense: "Aiding a Ban Evader", description: "Knowingly aiding any person who is ban evading.", punishment: ["Ban"] },
    { offense: "Creating Alt Accounts to Rulebreak", description: "Creating or using an alternative account with intent of rulebreaking.", punishment: ["Ban"] },
    
    // Faction Rules
    { offense: "FACTION MEMBER: Entering Faction Restricted Door", description: "Entering a faction restricted door while being shot at or chased.", punishment: ["Prison 1 hour", "Warn if repeated"] },
    { offense: "FACTION MEMBER: Abuse of Broadcast Functions", description: "Abusing /gov, /nr, /live, or /m.", punishment: ["Prison 1-2 hours", "Fine 5% total wealth", "Ban if repeated"] },
    { offense: "FACTION MEMBER: Abuse of /d or /r", description: "Abusing radio or department chat.", punishment: ["Prison 15-30 minutes", "Kick from faction if repeated"] },
    { offense: "FACTION MEMBER: Stacking Charges", description: "Placing charges that are not standard or are repetitive.", punishment: ["Prison 1-2 hours", "Warn", "Fine 10% total wealth", "Kick from faction if repeated"] },
    { offense: "FACTION MEMBER: Excessive Ticket/Jail/Prison", description: "Prisoning, jailing, or ticketing a player with an excessive/non-routine amount.", punishment: ["Prison 1-2 hours", "Fine 2x ticket", "Kick from faction if repeated"] },
    { offense: "FACTION MEMBER: Rushtazing", description: "Tazing a player while they are engaging in combat.", punishment: ["Prison 1-2 hours", "Warn if repeated", "Kick from faction if repeated"] },
    { offense: "FACTION MEMBER: Abuse of Faction Vehicles", description: "Abusing a faction vehicle in any shape or form.", punishment: ["Prison 1-2 hours", "Kick from faction if repeated"] },
    { offense: "FACTION MEMBER: Using /cancel Contract to Avoid Falling Hit", description: "Using /cancel contract to avoid failing a hit.", punishment: ["Prison 1-2 hours", "Added failed hit to record", "Fine 20% total wealth", "Ban from faction if repeated"] },
    
    // Gang Rules
    { offense: "GANG MEMBER: Point Rules Violation", description: "Violating point rules.", punishment: ["Prison 1-2 hours", "Further gang punishment depending on management"] },
    { offense: "GANG MEMBER: Alt-tabbing/Exploiting to Capture Point", description: "Alt-tabbing or exploiting in an attempt to capture the point.", punishment: ["Prison 1-2 hours", "Warn"] },
    { offense: "GANG MEMBER: Gang Slot Vandalization", description: "Vandalizing a gang slot.", punishment: ["Minimum 1 month temporary ban depending on severity"] },
    { offense: "GANG MEMBER: Non-RP Recruiting", description: "Using invite command without proper and sufficient roleplay with the person being invited.", punishment: ["Prison 1 hour", "Minimum 1 month gang R5+ position ban", "Further gang punishment depending on management"] }
  ];

  // Data Filtering
  const generalRules = offensesData.filter(item => !item.offense.includes("FACTION MEMBER") && !item.offense.includes("GANG MEMBER"));
  
  const factionRules = offensesData
    .filter(item => item.offense.includes("FACTION MEMBER"))
    .map(item => ({ ...item, offense: item.offense.replace("FACTION MEMBER: ", "") }));
    
  const gangRules = offensesData
    .filter(item => item.offense.includes("GANG MEMBER"))
    .map(item => ({ ...item, offense: item.offense.replace("GANG MEMBER: ", "") }));

  // Reusable Table Component
  const RulesTable = ({ title, data, headerColor, borderColor }) => (
    <div className="mb-16">
      <h2 className={`text-2xl md:text-3xl font-bold uppercase tracking-widest mb-6 ${headerColor}`}>
        {title}
      </h2>
      <div className="w-full overflow-x-auto rounded-xl shadow-2xl bg-[#121820]">
        <table className="w-full text-left border-collapse border border-slate-700/80">
          <thead>
            <tr className="bg-[#1e2733] text-white font-semibold text-base">
              <th className={`p-4 min-w-[200px] border border-slate-700/80 border-b-2 ${borderColor}`}>Offense</th>
              <th className={`p-4 min-w-[300px] border border-slate-700/80 border-b-2 ${borderColor}`}>Description</th>
              <th className={`p-4 min-w-[200px] border border-slate-700/80 border-b-2 ${borderColor}`}>Punishment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 align-top border border-slate-700/80">
                  <span className={`font-bold ${headerColor}`}>{item.offense}</span>
                </td>
                <td className="p-4 align-top text-sm md:text-base leading-relaxed text-slate-300 border border-slate-700/80">
                  {item.description}
                </td>
                <td className="p-4 align-top border border-slate-700/80">
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                    {item.punishment.map((punish, idx) => (
                      <li key={idx} className={punish.includes("Ban") ? "text-red-400 font-medium" : ""}>
                        {punish}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <section className="py-20 mt-10 px-4 sm:px-8 min-h-screen text-slate-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 tracking-tight uppercase">
            Server Offenses
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            These are the official server offenses and their respective punishments. Ignorance of the rules is not an excuse. Please review them carefully.
          </p>
        </div>

        {/* 1. General Rules Table */}
        <RulesTable 
          title="General Rules" 
          data={generalRules} 
          headerColor="text-white" 
          borderColor="border-b-cyan-500" 
        />

        {/* 2. Faction Rules Table */}
        <RulesTable 
          title="Faction Rules" 
          data={factionRules} 
          headerColor="text-blue-400" 
          borderColor="border-b-blue-500" 
        />

        {/* 3. Gang Rules Table */}
        <RulesTable 
          title="Gang Rules" 
          data={gangRules} 
          headerColor="text-red-400" 
          borderColor="border-b-red-500" 
        />

        {/* Note / Warning Box */}
        <div className="mt-8 p-6 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
          <p className="text-red-400 font-bold uppercase tracking-wider mb-2">Important Notice</p>
          <p className="text-sm md:text-base text-slate-300">
            <span className="font-semibold text-white">NOTE:</span> Warnings are registered on your account and can be viewed with <code className="bg-slate-800 px-2 py-0.5 rounded text-cyan-400">/stats</code> in-game. If you reach 3 warnings then your account will be auto banned.
          </p>
        </div>

      </div>
    </section>
  );
};

export default ServerOffenses;