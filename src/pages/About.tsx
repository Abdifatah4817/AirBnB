import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Search, CalendarCheck, Home, Star, Users, Phone, Mail, MapPin, CheckCircle, Heart, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-nairobi.jpg";

const steps = [
  { icon: <Search className="w-6 h-6" />, title: "Search", description: "Browse verified properties across Nairobi's best neighborhoods." },
  { icon: <CalendarCheck className="w-6 h-6" />, title: "Book", description: "Select your dates, confirm your stay, and pay securely online." },
  { icon: <Key className="w-6 h-6" />, title: "Stay", description: "Check in and enjoy a premium Nairobi experience with local host support." },
];

const hostBenefits = [
  "Set your own nightly pricing",
  "Flexible availability calendar",
  "AI-powered pricing suggestions",
  "Verified host badge & priority listing",
  "Secure payouts via M-Pesa or bank transfer",
  "Dedicated host support team",
];

const trustPoints = [
  { icon: <Shield className="w-5 h-5" />, title: "Verified Hosts", description: "Every host completes ID verification and admin approval before going live." },
  { icon: <CheckCircle className="w-5 h-5" />, title: "Secure Payments", description: "All transactions are encrypted. Funds are held until check-in is confirmed." },
  { icon: <Star className="w-5 h-5" />, title: "Genuine Reviews", description: "Only guests who completed a stay can leave reviews — no fakes." },
  { icon: <Users className="w-5 h-5" />, title: "24/7 Support", description: "Our team is available around the clock for guests and hosts." },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Nairobi skyline at golden hour" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 to-foreground/70" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-5xl font-bold text-background mb-4"
          >
            About NairobiStay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg text-background/80 max-w-xl mx-auto"
          >
            The premier Airbnb alternative for Nairobi vacation rentals — connecting travelers with verified local hosts.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              NairobiStay exists to make premium short-term accommodation in Nairobi accessible, trustworthy, and delightful.
              We believe every traveler deserves a home away from home — and every Nairobi homeowner deserves a fair way to earn from their property.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24 bg-background-nested">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Nairobi is one of Africa's most vibrant cities — a hub for business, culture, and adventure. Yet finding quality
                short-term accommodation has always been a challenge. Global platforms overlook local nuances, and travelers
                often end up in listings that don't match their expectations.
              </p>
              <p>
                NairobiStay was built to change that. We started with a simple idea: what if every listing was personally verified,
                every host was vetted, and every stay felt like it was curated just for you?
              </p>
              <p>
                From Westlands' skyline apartments to Karen's leafy villas, we handpick neighborhoods that showcase the best of
                Nairobi. Our platform is designed for both international visitors seeking a premium Nairobi vacation rental and
                local hosts who want to earn fairly from their properties.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works — Guests */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">How It Works for Guests</h2>
            <p className="text-muted-foreground mt-2">Three simple steps to your perfect Nairobi stay</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  {s.icon}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/explore">Explore Stays</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How Hosts Earn */}
      <section className="py-16 lg:py-24 bg-background-nested">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <Home className="w-8 h-8 text-primary mb-4" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Earn as a Host</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Turn your Nairobi property into a source of income. Whether you have a spare room in Kilimani or
                a full villa in Karen, NairobiStay makes hosting easy, safe, and profitable.
              </p>
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to="/">Become a Host</Link>
              </Button>
            </motion.div>
            <motion.ul {...fadeUp} className="space-y-3">
              {hostBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  {b}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Trust & Safety</h2>
            <p className="text-muted-foreground mt-2">Your security is at the core of everything we do</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {trustPoints.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-lg border border-border"
              >
                <div className="text-primary mb-3">{t.icon}</div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1">{t.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Verification */}
      <section className="py-16 lg:py-24 bg-background-nested">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <Shield className="w-8 h-8 text-accent mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Host Verification</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Every host on NairobiStay goes through a multi-step verification process. Hosts submit a government-issued ID,
              verify their phone number, and pass admin review before any listing goes live. Verified hosts earn a
              <span className="text-accent font-medium"> Verified</span> badge displayed on their profile and listings,
              giving guests confidence in who they're booking with.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-foreground">
              <a href="mailto:mursalabdifatah17@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> mursalabdifatah17@gmail.com
              </a>
              <a href="https://wa.me/254740531856" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" /> +254 740 531 856
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Nairobi, Kenya
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
