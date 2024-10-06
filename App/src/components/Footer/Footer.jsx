import React from 'react';
import './Footer.css';
import { FaMapMarkerAlt, FaFlag } from 'react-icons/fa'; // Icons from react-icons (install via npm if needed)

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-button" onClick={() => console.log("Navigate button clicked")}>
                <FaMapMarkerAlt className="icon" /> {/* Navigate Icon */}
                <span className="button-text">Navigate</span>
            </div>
            <div className="footer-button" onClick={() => console.log("Report button clicked")}>
                <FaFlag className="icon" /> {/* Report Icon */}
                <span className="button-text">Report</span>
            </div>
        </footer>
    );
};

export default Footer;
