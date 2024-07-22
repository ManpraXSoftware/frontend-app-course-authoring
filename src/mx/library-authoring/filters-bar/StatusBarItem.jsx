import React from "react";
export const StatusBarItem = ({ title, children }) => (
    <div className="d-flex flex-column justify-content-between">
        <h5>{title}</h5>
        <div className="d-flex align-items-center">
            {children}
        </div>
    </div>
);

