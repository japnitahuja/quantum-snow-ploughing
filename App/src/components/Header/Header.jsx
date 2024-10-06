import React from 'react';
import './Header.css'; // Import the CSS file for styling
import logo from "../../assets/logo.svg"

const Header = () => {
    return (
        <header className="header">
            <div className="logo-container">
                <img
                    src={logo} // Replace with your logo image path
                    alt="Logo"
                    className="logo"
                />
            </div>
        </header>
    );
};

export default Header;
