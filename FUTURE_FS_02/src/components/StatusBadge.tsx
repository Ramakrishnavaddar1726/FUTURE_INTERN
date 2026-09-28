import React, { useState, useRef, useEffect } from 'react';
import { LeadStatus } from '../types/crm.js';
import { ChevronDown, Check } from 'lucide-react';

interface StatusBadgeProps {
  status: LeadStatus;
  interactive?: boolean;
  onStatusChange?: (newStatus: LeadStatus) => void;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  interactive = false,
  onStatusChange,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStyles = (st: LeadStatus) => {
    switch (st) {
      case 'New':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
          dot: 'bg-blue-500',
        };
      case 'Contacted':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
          dot: 'bg-amber-500',
        };
      case 'Converted':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
          dot: 'bg-emerald-500',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const currentStyle = getStyles(status);
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Converted'];

  if (!interactive || !onStatusChange) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${currentStyle.bg} ${sizeClasses}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.dot} animate-pulse`} />
        {status}
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group inline-flex items-center gap-1.5 rounded-full border transition-all shadow-2xs cursor-pointer ${currentStyle.bg} ${sizeClasses}`}
        title="Click to update status"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.dot}`} />
        <span>{status}</span>
        <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Update Status
          </div>
          {statuses.map((st) => {
            const stStyle = getStyles(st);
            const isSelected = st === status;
            return (
              <button
                key={st}
                type="button"
                onClick={() => {
                  onStatusChange(st);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors hover:bg-slate-50 ${
                  isSelected ? 'font-semibold text-slate-900 bg-slate-50' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${stStyle.dot}`} />
                  {st}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
