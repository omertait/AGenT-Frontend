import React, { useEffect, useState } from "react";
import "./Popup.css";

const Popup = ({ message, type = "primary", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFading(true);
    }, duration - 300); // Start fading 300ms before disappearing

    const hideTimer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`popup ${type} ${fading ? "fade-out" : ""}`}>
      <p>{message}</p>
    </div>
  );
};

export default Popup;
