import React, { useState } from 'react';

/**
 * TheVoid component – from the_void template.
 * A focused, distraction-free reading view for spiritual texts.
 * Features: Large serif title, author/date meta, inline images, Archive/Delete actions.
 */
const TheVoid = ({ title, author, date, readTime, content, onBack = () => { } }) => {
    return (
        <div className="min-h-screen bg-[#050505] text-[#E5E5E5]">
            <article className="max-w-[700px] mx-auto px-8 py-24">
                {/* Title */}
                <h1 className="font-body text-[44px] md:text-[56px] font-normal leading-[1.1] tracking-tight mb-6">
                    {title || "The Architecture of Silence"}
                </h1>

                {/* Meta */}
                <div className="border-t border-[#262626] pt-4 mb-16 font-mono text-[10px] uppercase tracking-widest text-[#404040] flex gap-6">
                    <span>By {author || "J. Doe"}</span>
                    <span>·</span>
                    <span>{readTime || "12"} Min Read</span>
                    <span>·</span>
                    <span>{date || "24.10.2023"}</span>
                </div>

                {/* Content */}
                <div
                    className="font-body text-[20px] leading-[1.75] tracking-normal space-y-8"
                    style={{ whiteSpace: 'pre-line' }}
                >
                    {content || `In the cacophony of the digital age, silence has become a luxury commodity. We trade our attention for dopamine, scrolling through infinite feeds that demand everything and return nothing. The void is not empty; it is a space where thought can finally expand to fill the container it is given.

True minimalism is not about the absence of objects, but the presence of meaning. When we strip away the decorative chrome of our interfaces, we are left with the raw data of human expression. Text, image, and the empty space that binds them together. This architecture of silence forces us to confront the content itself, without the crutch of ornamentation.

Consider the terminal. A black screen, a blinking cursor. It is the most honest interface we have ever built. It promises nothing but what you put into it. It is a mirror. Modern web design has spent two decades trying to break this mirror, covering it with stickers and glossy finishes. We need to scrape it clean.

To read deeply is an act of resistance. It requires a rejection of the immediate. It demands a tempo that is out of sync with the heartbeat of the network. In the void, time dilates. The 12-minute read becomes an hour of contemplation. The text ceases to be content and becomes context.

We build these spaces not because we hate design, but because we love it too much to see it wasted on distraction. The void is not a lack of design; it is design with a specific, singular purpose: to vanish.`}
                </div>

                {/* End of Transmission */}
                <div className="mt-24 pt-12 border-t border-[#262626] flex flex-col items-center gap-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#404040]">End of Transmission.</span>
                    <div className="flex gap-4">
                        <button
                            onClick={onBack}
                            className="px-6 py-3 border border-[#262626] font-mono text-xs uppercase tracking-widest hover:bg-[#E5E5E5] hover:text-[#050505] transition-colors"
                        >
                            [ Archive ]
                        </button>
                        <button className="px-6 py-3 border border-[#f04242]/30 text-[#f04242] font-mono text-xs uppercase tracking-widest hover:bg-[#f04242] hover:text-white transition-colors">
                            [ Delete ]
                        </button>
                    </div>
                </div>

                {/* Scroll to top */}
                <div className="flex justify-center mt-12 opacity-30">
                    <span className="text-[#404040]">↑</span>
                </div>
            </article>
        </div>
    );
};

export default TheVoid;
