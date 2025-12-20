import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { MapPin, Clock, List, Users, ShieldAlert } from 'lucide-react';

import { useAuth } from '@/context';
import { api } from '@/services';
import { formatDateTimeRange } from '@/utils';
import { Tray, Button, ViewToggle, Loading } from '@/components';

const TournamentLayout = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const json = await api.get(`/tournaments/${id}`, token);
      setData(json);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDetails(); }, [id, token]);

  if (loading) return <Loading />;
  if (!data) return <div className="text-center p-10">Tournament not found</div>;

  const { details, participants } = data;
  const isCreator = user.id === details.creator_id;
  
  const approvedCount = participants.filter(p => p.status === 'APPROVED').length;
  const pendingCount = participants.filter(p => p.status === 'PENDING').length;

  // --- Dynamic View Configuration ---
  const currentPath = location.pathname.split('/').pop();
  const activeTab = currentPath === id ? 'overview' : currentPath;

  const viewConfig = {
    overview: {
      variant: 'flex', // Overview manages its own internal grid
      title: null
    },
    roster: {
      variant: 'grid', // Uses Tray's built-in 4-column grid
      title: (
        <div className="flex items-center gap-2 pb-4 mb-2 border-b border-gray-100 w-full animate-fadeIn">
          <Users className="text-primary-accent" size={24} />
          <h2 className="text-2xl font-bold font-outfit text-primary-accent">
            Official Roster 
            <span className="text-lg bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full ml-3 border border-gray-200">
              {approvedCount}
            </span>
          </h2>
        </div>
      )
    },
    requests: {
      variant: 'grid', // Uses Tray's built-in 4-column grid
      title: (
        <div className="flex items-center gap-2 pb-4 mb-2 border-b border-gray-100 w-full animate-fadeIn">
          <ShieldAlert className="text-orange-600" size={24} />
          <h2 className="text-2xl font-bold font-outfit text-orange-600">
            Pending Applications 
            <span className="text-lg bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full ml-3 border border-orange-200">
              {pendingCount}
            </span>
          </h2>
        </div>
      )
    }
  };

  const currentConfig = viewConfig[activeTab] || viewConfig.overview;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: List },
    { id: 'roster', label: `Roster (${approvedCount})`, icon: Users },
  ];

  if (isCreator) {
    tabs.push({ 
      id: 'requests', 
      label: `Requests`, 
      icon: ShieldAlert,
      alert: pendingCount > 0 
    });
  }

  const handleTabChange = (tabId) => {
    const path = tabId === 'overview' ? `/tournament/${id}` : `/tournament/${id}/${tabId}`;
    navigate(path);
  };

  return (
    <>
      {/* Header Section */}
      <div className='col-start-2 col-span-10 flex flex-col pt-8 pb-0 items-center justify-center'>
        <div className='font-outfit text-primary-accent text-5xl font-extrabold text-center'>{details.name}</div>
        <div className='flex flex-wrap justify-center gap-4 mt-4 text-secondary-accent font-medium'>
          <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <MapPin size={18} className="text-txt-dark"/> {details.location}
          </span>
          <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <Clock size={18} className="text-txt-dark"/> 
            {formatDateTimeRange(details.start_date, details.end_date)}
          </span>
        </div>
        
        <div className="mt-8 w-full flex justify-center">
          <ViewToggle options={tabs} activeId={activeTab} onToggle={handleTabChange} />
        </div>
      </div>

      <div className='col-start-2 col-span-10 px-8 pt-2'>
        <Button variant='ghost' onClick={() => navigate('/tournaments')}>← Back to List</Button>
      </div>

      {/* --- DYNAMIC TRAY --- */}
      <Tray 
        pos="col-start-2" 
        size="col-span-10" 
        variant={currentConfig.variant} 
        title={currentConfig.title}
      >
        <Outlet context={{ data, refreshData: fetchDetails, currentUser: user }} />
      </Tray>
    </>
  );
};

export default TournamentLayout;