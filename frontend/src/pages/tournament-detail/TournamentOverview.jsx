import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Trophy, DollarSign, Users, User, Flag, CheckCircle } from 'lucide-react';

import { api } from '@/services';
import { useAuth } from '@/context'; 
import { Button } from '@/components';

const TournamentOverview = () => {
  const { data, refreshData, currentUser } = useOutletContext();
  const { token } = useAuth();
  const { details, participants } = data;
  const [registering, setRegistering] = useState(false);

  const userRegistration = participants.find(p => p.user_id === currentUser.id);
  const isUpcoming = details.status === 'UPCOMING';

  const handleRegister = async () => {
    if (!window.confirm("Confirm registration?")) return;
    setRegistering(true);
    try {
      await api.post('/tournaments/register', { tournamentId: details.tournament_id }, token);
      alert("Success! Status: PENDING.");
      refreshData(); 
    } catch (error) {
      alert(error.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full animate-fadeIn">
      {/* Left Column: Image & Stats */}
      <div className="col-span-12 md:col-span-5 h-full">
        <div className="rounded-xl border border-gray-100 shadow-md bg-white overflow-hidden relative">
          <img src={details.image_url} alt={details.name} className="w-full h-full object-cover"/>
        </div>
      </div>

      {/* Right Column: Description & Action */}
      <div className="col-span-12 md:col-span-7 flex flex-col h-full">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
          <h3 className="text-xl font-bold font-outfit text-primary-accent mb-4 border-b border-gray-100 pb-2">About Event</h3>
          <p className="text-txt-primary font-roboto whitespace-pre-wrap leading-relaxed grow">{details.description}</p>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            {!userRegistration ? (
              isUpcoming ? (
                <Button onClick={handleRegister} isLoading={registering} className="w-full flex justify-center gap-2">
                  <Flag size={18} /> Register Now
                </Button>
              ) : <div className="p-3 text-center bg-gray-100 rounded text-gray-500 font-bold">Closed</div>
            ) : (
              <div className={`p-3 text-center rounded font-bold border ${getStatusStyle(userRegistration.status)}`}>
                Status: {userRegistration.status}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <StatBox label="Format" value={details.format || 'Stroke Play'} icon={Trophy} />
            <StatBox label="Fee" value={`$${details.entry_fee}`} icon={DollarSign} />
            <StatBox label="Capacity" value={`${details.current_participants}/${details.max_participants}`} icon={Users} />
            <StatBox label="Host" value={details.creator_name} icon={User} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helpers
const StatBox = ({ label, value, icon: Icon }) => (
  <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="text-secondary-accent text-[10px] font-bold uppercase flex items-center gap-1 mb-1"><Icon size={12}/> {label}</div>
    <div className="font-bold text-txt-primary text-sm truncate">{value}</div>
  </div>
);

const getStatusStyle = (status) => {
  if (status === 'APPROVED') return 'bg-green-50 text-green-700 border-green-200';
  if (status === 'REJECTED') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-orange-50 text-orange-700 border-orange-200';
};

export default TournamentOverview;