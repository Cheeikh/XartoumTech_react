import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => (
    open ? (
        <div className="dialog">
            <button onClick={() => onOpenChange(false)}>Close</button>
            {children}
        </div>
    ) : null
);

const DialogContent = ({ children }) => (
    <div>{children}</div>
);

const DialogHeader = ({ children }) => (
    <div className="font-bold">{children}</div>
);

const DialogTitle = ({ children }) => (
    <h2>{children}</h2>
);

const DialogFooter = ({ children }) => (
    <div>{children}</div>
);

export  {DialogContent, DialogHeader, DialogTitle, DialogFooter };
