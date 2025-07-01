import { Box } from "lucide-react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Box className="text-blue-500 text-2xl mr-2" />
              <span className="text-xl font-bold">Shatzii</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered server management platform with local intelligence that works offline and saves you money.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">AI Solutions</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Pharaoh Control Panel</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI-Enhanced Deployment</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Smart Monitoring</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Security Suite</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("about")}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2024 Shatzii. All rights reserved.</p>
          <div className="flex space-x-6 text-gray-400 text-sm mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
