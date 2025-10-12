import React from 'react';
import Link from "next/link";

import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from '@/components/ui/button';

const footerSection = [
  {
    title: "Shop",
    links: [
      { title: "Electronics", href: "/electronics" },
      { title: "Fashion", href: "/fashion" },
      { title: "Home & Garden", href: "/home" },
      { title: "Sports", href: "/sports" },
      { title: "Deals", href: "/deals" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { title: "Contact Us", href: "/contact" },
      { title: "Help Center", href: "/help" },
      { title: "Track Your Order", href: "/track" },
      { title: "Returns & Exchanges", href: "/returns" },
      { title: "Size Guide", href: "/size-guide" },
    ],
  },
  {
    title: "About",
    links: [
      { title: "About TechMart", href: "/about" },
      { title: "Careers", href: "/career" },
      { title: "Press", href: "/press" },
      { title: "Investors Relations", href: "/investor" },
      { title: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    title: "Policies",
    links: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Cookie Policy", href: "/cookies" },
      { title: "Shipping Policy", href: "/shipping" },
      { title: "Refund Policy", href: "/refunds" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
];

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* company info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg"></span>
              </div>
              <span className="font-bold text-xl">TechMart</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your one-stop destination for the latest technology, fashion, and
              lifestyle products. Quality guaranteed with fast shipping and
              excellent customer service.
            </p>
            {/* contact info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Tech Street, Digital City, DC 12345</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@techmart.com</span>
              </div>
            </div>

            {/* social links */}
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button key={social.label} variant="outline" size="icon" asChild>
                  <Link href={social.href} target="_blank">
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* footer links */}
          {footerSection.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
