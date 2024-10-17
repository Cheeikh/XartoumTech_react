import React from 'react';

const Card = ({ children, className }) => (
    <div className={`border rounded p-4 ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="font-bold mb-2">{children}</div>
);

const CardContent = ({ children }) => (
    <div className="mb-2">{children}</div>
);

const CardFooter = ({ children }) => (
    <div className="mt-2">{children}</div>
);

export { Card, CardHeader, CardContent, CardFooter };
