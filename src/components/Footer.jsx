import React from "react";
import { Phone, MessageCircle, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-white text-gray-900 mt-12 border-t border-gray-100 shadow-xl">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <a href="tel:+2348066979178" className="hover:text-blue-600">+2348066979178</a>
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <a href="https://wa.me/2348066979178" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">Live Support (WhatsApp)</a>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Address</h3>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 mr-2 mt-1" />
            <p>17, Ajeniya street, Obalende, Ikoyi Lagos</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">MyStore</h3>
          <p className="text-sm text-gray-500">Secure payments • Free returns</p>
          <p className="text-sm text-gray-500 mt-2">© {new Date().getFullYear()} MyStore. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
