//
import React, { useState } from "react";

import "./PinMute.css"

const PinMute = ({ group }) => {


  const handleAction = (action) => {
    console.log(`${action} clicked`);
    // Perform any action based on what was clicked
    // e.g., Mute notifications, Pin message, etc.
  };

  return (
        <div
          style={{
            position: "absolute",
            top: "100%", // Position it below the div
            left: "0",
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            zIndex: "1000", // Ensure it stays on top
            width: "200px", // Set width of dropdown
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li
              style={{ padding: "8px 0", cursor: "pointer" }}
              onClick={() => handleAction('Mute notifications')}
            >
              Mute notifications
            </li>
            <li
              style={{ padding: "8px 0", cursor: "pointer" }}
              onClick={() => handleAction('Pin message')}
            >
              Pin message
            </li>
            <li
              style={{ padding: "8px 0", cursor: "pointer" }}
              onClick={() => handleAction('Block')}
            >
              Block
            </li>
            <li
              style={{ padding: "8px 0", cursor: "pointer" }}
              onClick={() => handleAction('Archive')}
            >
              Archive
            </li>
            {/* Conditionally render Leave group if group is true */}
            {group && (
              <li
                style={{ padding: "8px 0", cursor: "pointer", color: "red" }}
                onClick={() => handleAction('Leave group')}
              >
                Leave group
              </li>
            )}
          </ul>
        </div>
  );
};

 
export default PinMute;