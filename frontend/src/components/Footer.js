import React, { useEffect } from 'react';
import '../styles/Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        // Add Font Awesome if not already loaded
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }

        // Add interactivity to footer links
        setTimeout(() => {
            const footer = document.querySelector('.training-footer');
            if (footer) {
                const footerLinks = footer.querySelectorAll('.footer-links a');
                footerLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const linkText = this.textContent.trim();
                        const icon = this.querySelector('i').className;
                        
                        // Create notification
                        const notification = document.createElement('div');
                        notification.style.cssText = `
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: linear-gradient(135deg, #1a5276, #2e86c1);
                            color: white;
                            padding: 15px 25px;
                            border-radius: 8px;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                            z-index: 1000;
                            animation: slideIn 0.3s ease;
                            border-left: 4px solid #85c1e9;
                            max-width: 300px;
                        `;
                        
                        notification.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <i class="${icon}" style="font-size: 1.2rem;"></i>
                                <div>
                                    <strong>${linkText}</strong>
                                    <div style="font-size: 0.85rem; opacity: 0.9;">Training component - Demo link</div>
                                </div>
                            </div>
                        `;
                        
                        document.body.appendChild(notification);
                        
                        // Remove notification after 3 seconds
                        setTimeout(() => {
                            notification.style.animation = 'slideOut 0.3s ease';
                            setTimeout(() => notification.remove(), 300);
                        }, 3000);
                    });
                });

                // Add CSS animations for notification
                if (!document.querySelector('style[data-footer-animations]')) {
                    const style = document.createElement('style');
                    style.setAttribute('data-footer-animations', 'true');
                    style.textContent = `
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                        @keyframes slideOut {
                            from { transform: translateX(0); opacity: 1; }
                            to { transform: translateX(100%); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        }, 100);
    }, []);

    return (
        <footer className="training-footer">
            <div className="footer-container">
                <div className="footer-content">
                    {/* Designer Info Column */}
                    <div className="designer-info">
                        <h3><i className="fas fa-user-cog"></i> Component Designed By</h3>
                        
                        <div className="designer-photo-section">
                            <div className="designer-photo-container">
                                <img 
                                    src="154be01a-0329-47dc-a108-589e144cd7f8.jpeg" 
                                    alt="G.S. Nuwantha - Software Developer" 
                                    className="designer-photo"
                                />
                            </div>
                            <div className="designer-contact">
                                <div className="designer-name">G.S. Nuwantha</div>
                                <div className="designer-role">Software Engineering Trainee</div>
                                <div className="training-badge">Industrial Training 2026</div>
                                <p><i className="fas fa-envelope"></i> gunasamith0@gmail.com</p>
                                <p><i className="fas fa-phone"></i> +94 766716296</p>
                            </div>
                        </div>
                        
                        <p className="designer-bio">
                            This software training component was designed and developed during the industrial training period at RDHS Ratnapura. 
                            Specializing in modern web technologies and healthcare software solutions.
                        </p>
                    </div>
                    
                    {/* Training Details Column */}
                    <div className="training-details">
                        <h4><i className="fas fa-user-tie"></i> Training Supervision & Details</h4>
                        
                        <div className="supervisor">Eng. Y.M.L Kumara</div>
                        <div className="supervisor-title">BTech Hons(Eng) AME (SL) - Training Supervisor</div>
                        
                        <div className="training-period">
                            <i className="fas fa-calendar-alt"></i>
                            <span>Industrial Training Period: {currentYear} (6 Months)</span>
                        </div>
                        
                        <div className="training-location">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Training Location: RDHS Office, Ratnapura, Sri Lanka</span>
                        </div>
                        
                        {/* Footer Columns */}
                        <div className="footer-columns">
                            <div className="footer-column">
                                <h5><i className="fas fa-tasks"></i> Training Components</h5>
                                <ul className="footer-links">
                                    <li><a href="/"><i className="fas fa-code"></i> Software Development</a></li>
                                    <li><a href="/"><i className="fas fa-database"></i> Database Management</a></li>
                                    <li><a href="/"><i className="fas fa-paint-brush"></i> UI/UX Design</a></li>
                                    <li><a href="/"><i className="fas fa-shield-alt"></i> Security Protocols</a></li>
                                    <li><a href="/"><i className="fas fa-clipboard-check"></i> Testing & QA</a></li>
                                </ul>
                            </div>
                            
                            <div className="footer-column">
                                <h5><i className="fas fa-cogs"></i> Technologies Used</h5>
                                <ul className="footer-links">
                                    <li><a href="/"><i className="fab fa-html5"></i> HTML</a></li>
                                    <li><a href="/"><i className="fab fa-css3-alt"></i> CSS</a></li>
                                    <li><a href="/"><i className="fab fa-js"></i> JavaScript</a></li>
                                    <li><a href="/"><i className="fas fa-mobile-alt"></i> Responsive Design</a></li>
                                    <li><a href="/"><i className="fab fa-git-alt"></i> Version Control (Git)</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="footer-divider"></div>
                
                <div className="footer-bottom">
                    <p>Software Training Component | RDHS Ratnapura Industrial Training Program</p>
                    
                    <div className="footer-logo">
                        <i className="fas fa-laptop-medical logo-icon"></i>
                        <span className="logo-text">HEALTHCARE SOFTWARE DEVELOPMENT</span>
                        <i className="fas fa-laptop-medical logo-icon"></i>
                    </div>
                    
                    <p className="certification-note">
                        This project was developed for educational and training purposes under the professional supervision 
                        of Eng. Y.M.L Kumara at RDHS Office, Ratnapura during the {currentYear} industrial training period.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;