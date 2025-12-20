import React from 'react';

import { Button } from '@/components';

const ViewToggle = ({ options, activeId, onToggle }) => {
  const containerClass = "flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm self-center gap-4";
  const buttonBaseClass = "flex items-center gap-2 px-6 py-2 rounded-lg font-outfit font-bold transition-all";
  const activeClass = "bg-primary-accent text-white shadow-sm";
  const inactiveClass = "text-txt-placeholder hover:bg-gray-50";

  return (
    <div className={containerClass}>
      {options.map((option) => {
        // Capitalize to use as a JSX component
        const Icon = option.icon;

        return (
          <Button
            key={option.id}
            onClick={() => onToggle(option.id)}
            variant={`${
              activeId === option.id ? 'default' : 'ghost'
            }`}
          >
            <div className="flex items-center gap-2">
              {Icon && <Icon size={18} />}
              <span>{option.label}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default ViewToggle;