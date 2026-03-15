import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-4">
              Nairobi<span className="text-primary">Stay</span>
            </h3>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed">
              Discover premium short-term rentals in Nairobi's finest neighborhoods.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/explore" className="hover:text-primary transition-colors">All Listings</Link></li>
              <li><Link to="/explore?neighborhood=Westlands" className="hover:text-primary transition-colors">Westlands</Link></li>
              <li><Link to="/explore?neighborhood=Karen" className="hover:text-primary transition-colors">Karen</Link></li>
              <li><Link to="/explore?neighborhood=Kilimani" className="hover:text-primary transition-colors">Kilimani</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-sm">Hosting</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Become a Host</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Host Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Safety</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/50">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Nairobi, Kenya
          </div>
          <p>© 2026 NairobiStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
