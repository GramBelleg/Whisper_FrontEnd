import LogOut from "../../../assets/images/logout.svg?react";
import { useState } from 'react';
import LogoutModal from "./LogoutModal";

const LogoutButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (  
    <>
      <div onClick={() => setIsOpen(true)} className="icon-container logout-icon">
        <LogOut data-testid="logout-icon" className="icon" />
      </div>
      {isOpen && <LogoutModal handleCancel={handleCancel} />}
    </>
  );
};

export default LogoutButton;
