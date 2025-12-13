import React from 'react';
import { UserProfile } from '../../types';
import { Lock, AlertCircle, Loader2, X, Check } from 'lucide-react';
import { INPUT_CLASS, INPUT_ERROR_CLASS, LABEL_CLASS, SECTION_TITLE_CLASS, isValidUrl } from './editorUtils';

interface IdentitySectionProps {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
  errors: Record<string, string>;
  usernameStatus: 'idle' | 'checking' | 'available' | 'taken';
  isUsernameLocked: boolean;
}

const IdentitySection: React.FC<IdentitySectionProps> = ({ 
  profile, 
  onChange, 
  errors, 
  usernameStatus,
  isUsernameLocked 
}) => {
  return (
    <section>
        <h2 className={SECTION_TITLE_CLASS}>On-Chain Identity</h2>
        <div className="grid gap-5">
            <div className={isUsernameLocked ? "opacity-70" : ""}>
                <label className={LABEL_CLASS}>{isUsernameLocked ? "Username (Locked)" : "Username"}</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={profile.username} 
                        onChange={(e) => !isUsernameLocked && onChange('username', e.target.value)}
                        disabled={isUsernameLocked}
                        className={`${isUsernameLocked ? `${INPUT_CLASS} bg-gray-100 cursor-not-allowed` : INPUT_CLASS}`} 
                    />
                    {isUsernameLocked ? (
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    ) : (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                            {usernameStatus === 'taken' && <X className="w-4 h-4 text-red-500" />}
                            {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-500" />}
                        </div>
                    )}
                </div>
            </div>
            <div>
                <label className={LABEL_CLASS}>Display Name</label>
                <input type="text" value={profile.displayName} onChange={e => onChange('displayName', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
                <label className={LABEL_CLASS}>Bio</label>
                <textarea value={profile.bio} onChange={e => onChange('bio', e.target.value)} className={INPUT_CLASS} rows={3} />
            </div>
            <div>
                <label className={LABEL_CLASS}>Avatar URL</label>
                <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={profile.avatarUrl} 
                            onChange={e => onChange('avatarUrl', e.target.value)} 
                            placeholder="https://..." 
                            className={errors.avatarUrl ? INPUT_ERROR_CLASS : INPUT_CLASS} 
                        />
                        {profile.avatarUrl && isValidUrl(profile.avatarUrl) && <img src={profile.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt="Avatar preview" />}
                    </div>
                    {errors.avatarUrl && (
                        <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3"/> {errors.avatarUrl}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <input type="checkbox" id="verified" checked={profile.verified} onChange={e => onChange('verified', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                    <label htmlFor="verified" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Show Verified Badge</label>
            </div>
        </div>
    </section>
  );
};

export default IdentitySection;
