
import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  viewMode: 'edit' | 'preview';
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, viewMode }) => {
  return (
    <div className={`
        relative mx-auto transition-all duration-300 ease-in-out bg-white overflow-hidden
        ${viewMode === 'preview' 
            ? 'w-full h-full border-0 rounded-none ring-0 shadow-none md:shadow-2xl md:w-[375px] md:h-[750px] md:max-h-[85vh] md:border-[12px] md:rounded-[3rem] md:ring-1 md:ring-black/5' 
            : 'w-[375px] h-[750px] max-h-[85vh] border-[12px] rounded-[3rem] ring-1 ring-black/5 shadow-2xl'
        }
        md:border-gray-900 md:bg-gray-900 flex flex-col
    `}>
        {/* Mobile Notch - Only visible in desktop frame mode */}
        <div className={`
            absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-30 pointer-events-none
            ${viewMode === 'preview' ? 'hidden md:block' : 'block'}
        `}></div>
        
        {/* Screen Content */}
        {/* 
            NOTE: 'transform-gpu' and 'perspective-1000' create a containing block for fixed descendants.
            This ensures the "fixed" drawer in ProfileView stays inside this phone screen 
            instead of covering the whole browser window during preview.
        */}
        <div className={`
            w-full h-full bg-white overflow-hidden relative transform-gpu perspective-1000 flex-1 flex flex-col
            ${viewMode === 'preview' ? 'rounded-none md:rounded-[2.2rem]' : 'rounded-[2.2rem]'}
        `}>
            <div className="w-full flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                {children}
            </div>
        </div>
    </div>
  );
};

export default PhoneMockup;
