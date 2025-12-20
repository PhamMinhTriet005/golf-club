import React from 'react';
import PropTypes from 'prop-types';
import { User, Calendar, Check, X, Hash, ArrowRight } from 'lucide-react';

import { Button } from '@/components';

const CardRequest = ({ 
  participant, 
  onViewProfile,
  onApprove, 
  onReject, 
  isProcessing = false 
}) => {
  const primaryColor = participant.background_color_hex || '#64748b';
  
  const styles = {
    container: { borderColor: `${primaryColor}40` },
    header: { backgroundColor: `${primaryColor}10`, color: primaryColor },
    badge: { backgroundColor: `${primaryColor}20`, color: primaryColor, borderColor: `${primaryColor}40` },
  };

  return (
    <div 
      className="group w-full bg-white rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
      style={styles.container}
    >
      {/* --- HEADER --- */}
      <div 
        className="p-5 relative h-20 flex justify-between items-start"
        style={styles.header}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm inline-flex items-center justify-center overflow-hidden p-0 w-11 h-11">
          {participant.profile_pic_url ? (
            <img 
              src={participant.profile_pic_url} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={24} style={{ color: primaryColor }} />
          )}
        </div>

        {participant.vga_number && (
          <div 
            className="text-xs font-bold px-3 py-1.5 rounded-full border font-outfit shadow-sm uppercase tracking-wide flex items-center gap-1"
            style={styles.badge}
          >
             <Hash size={10} /> {participant.vga_number}
          </div>
        )}
      </div>

      {/* --- BODY --- */}
      <div className="p-6 flex flex-col gap-4 grow bg-white relative z-10">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold font-outfit text-txt-dark leading-tight line-clamp-1">
            {participant.first_name} {participant.last_name}
          </h3>
          <div className="text-txt-placeholder text-sm font-outfit font-medium flex items-center gap-1.5">
            <Calendar size={14} />
            <span>Applied: {new Date(participant.registered_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-auto pt-2 flex flex-col gap-3 w-full">
          {/* View Profile Button (Similar to CardUser) */}
          <Button 
            onClick={onViewProfile} 
            variant='third' 
            className="w-full"
          >
            <div className='flex justify-center items-center gap-2'>
              <span className="font-semibold text-sm">View Profile</span>
              <ArrowRight size={16} />
            </div>
          </Button>

          {/* Admin Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={onReject} 
              disabled={isProcessing}
              variant="danger" 
              className="flex-1"
            >
              <div className='flex justify-center items-center gap-2'>
                <X size={16} />
                <span className="font-semibold text-sm">Reject</span>
              </div>
            </Button>

            <Button 
              onClick={onApprove} 
              disabled={isProcessing}
              className="flex-1"
            >
              <div className='flex justify-center items-center gap-2'>
                <span className="font-semibold text-sm">Approve</span>
                <Check size={16} />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

CardRequest.propTypes = {
  participant: PropTypes.object.isRequired,
  onViewProfile: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
};

export default CardRequest;