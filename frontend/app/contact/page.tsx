'use client';

import { useState } from 'react';
import { MessageCircle, Instagram, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const WA  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';
const IG  = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'thegulfedit';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setFormData({ name: '', whatsapp: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-16">
        <span className="section-label block mb-4">Get in Touch</span>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-6">Contact Us</h1>
        <p className="font-body text-ink-light max-w-lg mx-auto leading-relaxed">
          Have a question about an order, sizing, or a specific brand? Our family team is here to help. We usually respond within a few hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-5xl mx-auto">
        
        {/* ── Contact Info ───────────────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-2xl text-ink mb-8">Direct Channels</h2>
          
          <div className="space-y-6">
            <a 
              href={`https://wa.me/${WA}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-6 bg-sand border border-sand-dark hover:border-gold transition-colors group"
            >
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-gold flex-shrink-0">
                <MessageCircle size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-body text-base font-medium text-ink mb-1 group-hover:text-gold transition-colors">WhatsApp</h3>
                <p className="font-body text-sm text-ink-light mb-2">Fastest way to reach us for order updates and quick questions.</p>
                <span className="font-body text-xs tracking-widest uppercase text-ink font-medium">+{WA}</span>
              </div>
            </a>

            <a 
              href={`https://instagram.com/${IG}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-6 bg-sand border border-sand-dark hover:border-gold transition-colors group"
            >
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-gold flex-shrink-0">
                <Instagram size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-body text-base font-medium text-ink mb-1 group-hover:text-gold transition-colors">Instagram</h3>
                <p className="font-body text-sm text-ink-light mb-2">Follow us for new arrivals and behind-the-scenes in Oman.</p>
                <span className="font-body text-xs tracking-widest uppercase text-ink font-medium">@{IG}</span>
              </div>
            </a>
          </div>

          <div className="mt-12 p-6 border border-sand-dark">
            <h3 className="font-body text-sm font-medium text-ink mb-2">Business Hours</h3>
            <p className="font-body text-sm text-ink-light leading-relaxed">
              Monday – Saturday<br />
              10:00 AM – 8:00 PM (PKT)<br />
              <em>We monitor WhatsApp outside these hours for urgent order issues.</em>
            </p>
          </div>
        </div>

        {/* ── Contact Form ───────────────────────────────────────────────── */}
        <div className="bg-cream border border-sand-dark p-8 md:p-10">
          <h2 className="font-display text-2xl text-ink mb-8">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-body text-xs text-ink-light mb-2 ml-1">Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                className="input" 
                placeholder="Your name" 
              />
            </div>
            
            <div>
              <label className="block font-body text-xs text-ink-light mb-2 ml-1">WhatsApp Number</label>
              <input 
                type="tel" 
                name="whatsapp" 
                required 
                value={formData.whatsapp} 
                onChange={handleChange} 
                className="input" 
                placeholder="e.g. 03001234567" 
              />
            </div>
            
            <div>
              <label className="block font-body text-xs text-ink-light mb-2 ml-1">Message</label>
              <textarea 
                name="message" 
                required 
                value={formData.message} 
                onChange={handleChange} 
                className="input min-h-[150px] resize-y" 
                placeholder="How can we help?" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full h-14"
            >
              {loading ? 'Sending...' : <><Send size={16} strokeWidth={1.5} /> Send Message</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
