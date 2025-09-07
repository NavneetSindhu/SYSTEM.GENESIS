import React, { useState } from 'react';
import type { Dossier } from '../types';

interface DossierFileProps {
    dossier: Dossier | 'generating';
}

const DossierField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <span className="font-bold" style={{ color: 'var(--theme-text-color)' }}>&gt; {label}:</span>
        <span className="ml-2" style={{ color: 'var(--theme-text-color-dim)' }}>{children}</span>
    </div>
);

const DossierListField: React.FC<{ label: string; items: string[] }> = ({ label, items }) => (
    <div>
        <span className="font-bold" style={{ color: 'var(--theme-text-color)' }}>&gt; {label}:</span>
        <ul className="ml-6 mt-1 space-y-1" style={{ color: 'var(--theme-text-color-dim)' }}>
            {items.map((item, index) => <li key={index}>- {item}</li>)}
        </ul>
    </div>
);


export const DossierFile: React.FC<DossierFileProps> = ({ dossier }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    if (dossier === 'generating') {
        return (
             <div className="p-4 bg-black/50 text-center mt-6" style={{ border: '1px dashed var(--theme-border-color-light)'}}>
                <p className="text-lg animate-pulse" style={{ fontFamily: "'VT323', monospace", color: 'var(--theme-text-color-dim)' }}>
                    [ RETRIEVING_DOSSIER_DATA... ]
                </p>
            </div>
        )
    }

    const handleCopy = () => {
        // FIX: Removed redundant check. The type of `dossier` is already narrowed to `Dossier`
        // because the component returns early if it's 'generating'.

        const dossierText = `
CALLSIGN: ${dossier.callsign}
BACKGROUND: ${dossier.background}

ABILITIES:
${dossier.abilities.map(a => `- ${a}`).join('\n')}

WEAKNESSES:
${dossier.weaknesses.map(w => `- ${w}`).join('\n')}

QUOTE: "${dossier.quote}"
        `.trim();

        navigator.clipboard.writeText(dossierText).then(() => {
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2500);
        }).catch(err => {
            console.error('Failed to copy dossier text:', err);
        });
    };

    return (
        <div className="p-px" style={{ background: 'linear-gradient(to bottom, var(--theme-border-color-light), transparent)' }}>
            <div className="bg-black p-4 text-flicker-subtle">
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                    <h3 className="text-2xl" style={{ fontFamily: "'VT323', monospace" }}>[ DOSSIER_FILE: CLASSIFIED ]</h3>
                    <button
                        onClick={handleCopy}
                        className="text-lg py-1 px-3 border transition-colors whitespace-nowrap"
                        style={{ fontFamily: "'VT323', monospace", borderColor: 'var(--theme-border-color)', color: 'var(--theme-color)' }}
                        onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--theme-color)'; e.currentTarget.style.color = 'black'; }}
                        onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--theme-color)'; }}
                    >
                        {copyStatus === 'copied' ? '[ COPIED! ]' : '[ COPY_DATA ]'}
                    </button>
                </div>
                <div className="space-y-3 font-mono text-base">
                    <DossierField label="CALLSIGN">{dossier.callsign}</DossierField>
                    <DossierField label="BACKGROUND">{dossier.background}</DossierField>
                    <DossierListField label="ABILITIES" items={dossier.abilities} />
                    <DossierListField label="WEAKNESSES" items={dossier.weaknesses} />
                    <DossierField label="QUOTE">"{dossier.quote}"</DossierField>
                </div>
            </div>
        </div>
    );
};