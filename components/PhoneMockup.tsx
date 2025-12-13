import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  viewMode: 'edit' | 'preview';
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, viewMode }) => {
  return (
    <div className={`
        relative mx-auto transition-all duration-500 ease-in-out bg-white overflow-hidden shadow-2xl
        ${viewMode === 'preview' 
            ? 'w-full h-full md:w-[375px] md:h-[750px] md:border-[12px] md:rounded-[3rem] md:ring-1 md:ring-black/5' 
            : 'w-[375px] h-[750px] border-[12px] rounded-[3rem] ring-1 ring-black/5'
        }
        md:border-gray-900 md:bg-gray-900
    `}>
        {/* Mobile Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-30 hidden md:block"></div>
        
        {/* Screen Content */}
        {/* 
            NOTE: 'transform-gpu' and 'perspective-1000' create a containing block for fixed descendants.
            This ensures the "fixed" drawer in ProfileView stays inside this phone screen 
            instead of covering the whole browser window during preview.
        */}
        <div className="w-full h-full bg-white overflow-hidden relative md:rounded-[2.2rem] transform-gpu perspective-1000">
            <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
                {children}
            </div>
        </div>
    </div>
  );
};

export default PhoneMockup;