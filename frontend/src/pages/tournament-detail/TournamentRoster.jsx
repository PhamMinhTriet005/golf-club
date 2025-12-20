import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { CardUser } from '@/components';

const TournamentRoster = () => {
  const { data } = useOutletContext();
  const navigate = useNavigate();
  const approvedParticipants = data.participants.filter(p => p.status === 'APPROVED');

  if (approvedParticipants.length === 0) {
    return (
      <div className="col-span-full w-full py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
        <p className="text-gray-400 italic font-medium">No confirmed participants yet.</p>
      </div>
    );
  }

  return (
    <>
      {approvedParticipants.map((p) => (
        <div key={p.user_id} className="w-full h-full animate-fadeIn">
          <CardUser 
            user={{
              firstName: p.first_name,
              lastName: p.last_name,
              profilePicUrl: p.profile_pic_url,
              bio: p.bio,
              backgroundColorHex: p.background_color_hex,
              email: p.email 
            }}
            role="PARTICIPANT"
            onAction={() => navigate(`/profile/${p.user_id}`)}
          />
        </div>
      ))}
    </>
  );
};

export default TournamentRoster;