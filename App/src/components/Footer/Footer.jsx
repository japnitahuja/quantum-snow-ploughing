import React from 'react';
import './Footer.css';
import { FaMapMarkerAlt, FaFlag } from 'react-icons/fa'; // Icons from react-icons (install via npm if needed)

const Footer = ({changeDestination, navigate}) => {
    return (
        <footer className="footer">
            <div className="footer-button" onClick={navigate}>
                <FaMapMarkerAlt className="icon" /> {/* Navigate Icon */}
                <span className="button-text">Navigate</span>
            </div>
            <div className="footer-button" onClick={changeDestination}>
                <FaFlag className="icon" /> {/* Report Icon */}
                <span className="button-text">Report</span>
            </div>
        </footer>
    );
};

export default Footer;
