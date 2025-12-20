import React, { useState } from 'react';
import { useOutletContext, Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { api } from '@/services';
import { useAuth } from '@/context';
import { CardRequest } from '@/components';

const TournamentRequests = () => {
  const { data, refreshData, currentUser } = useOutletContext();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);

  // Security Check
  if (currentUser.id !== data.details.creator_id) {
    return <Navigate to={`/tournament/${data.details.tournament_id}`} replace />;
  }

  const pendingParticipants = data.participants.filter(p => p.status === 'PENDING');

  const handleStatusChange = async (userId, newStatus) => {
    setProcessingId(userId);
    try {
      await api.post('/tournaments/manage', { 
        tournamentId: data.details.tournament_id, 
        targetUserId: userId, 
        status: newStatus 
      }, token);
      await refreshData();
    } catch (err) { 
      alert('Action failed: ' + err.message); 
    } finally {
      setProcessingId(null);
    }
  };

  if (pendingParticipants.length === 0) {
    return (
      <div className="col-span-full w-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
        <CheckCircle size={48} className="text-green-300 mb-4"/>
        <p className="text-gray-500 font-medium font-outfit text-lg">All caught up!</p>
        <p className="text-gray-400 text-sm">No pending requests at the moment.</p>
      </div>
    );
  }

  return (
    <>
      {pendingParticipants.map((p) => (
        <div key={p.user_id} className="w-full h-full animate-fadeIn">
          <CardRequest 
            participant={p} 
            isProcessing={processingId === p.user_id}
            onViewProfile={() => navigate(`/profile/${p.user_id}`)}
            onApprove={() => handleStatusChange(p.user_id, 'APPROVED')}
            onReject={() => handleStatusChange(p.user_id, 'REJECTED')}
          />
        </div>
      ))}
    </>
  );
};

export default TournamentRequests;