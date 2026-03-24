import React from 'react'

export const MaterialSymbol = ({ icon, className = '', fill = false }) => {
    return (
        <span 
            className={`material-symbols-outlined ${className}`}
            style={{ 
                fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 300, 'GRAD' 0, 'opsz' 24` 
            }}
        >
            {icon}
        </span>
    )
}
