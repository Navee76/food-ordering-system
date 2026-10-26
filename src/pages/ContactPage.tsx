import React, { useState } from 'react';
import { NavPage } from '../components/layout/Navbar';
import { useToast } from '../context/ToastContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ShieldAlert,
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: NavPage) => void;
}

const FAQS = [
  {
    q: 'How does FreshBite ensure food arrives piping hot?',
    a: 'Our delivery fleet is equipped with insulated thermal bags that maintain food temperature. In addition, our algorithm routes drivers within a 5-7 km radius for guaranteed under-30-minute arrival.',
  },
  {
    q: 'Can I customize my food (e.g. less spicy or extra chutney)?',
    a: 'Yes! When you click on any dish to view its details or when you are reviewing your cart, you can add "Special Cooking Instructions" which are communicated directly to the kitchen chefs.',
  },
  {
    q: 'What should I do if an item is missing or delayed?',
    a: 'You can track the active order in real time from your Account page or call the assigned delivery partner directly through the live tracking screen. If any issue arises, reach out to our 24/7 simulated support desk.',
  },
  {
    q: 'Are online payments secure on FreshBite?',
    a: 'This demo application features simulated payments for academic testing. No real bank or credit card data is transmitted or stored on any server.',
  },
];

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please provide your full name';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Please provide a valid email address';
    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters in your message';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedTicket(ticketId);
    showToast(`Inquiry received! Reference Ticket #${ticketId}`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
          We're Here For You
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#2D1B12]">
          Contact FreshBite Support
        </h1>
        <p className="text-xs sm:text-sm text-[#2D1B12]/70 leading-relaxed">
          Have a question about an order, restaurant partnership, or feedback? Drop us a note or browse frequent answers below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#2D1B12]/8 shadow-sm space-y-6">
          <div className="border-b border-[#2D1B12]/8 pb-4">
            <h2 className="text-xl font-black text-[#2D1B12]">Send Us a Message</h2>
            <p className="text-xs text-[#2D1B12]/60 mt-0.5">
              Fill in your details and our team will get back to you shortly.
            </p>
          </div>

          {/* Simulation Disclaimer */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px]">
              <strong>Simulation notice:</strong> Form submission is simulated locally for demo purposes. No message is sent to external email servers.
            </p>
          </div>

          {submittedTicket ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">
                Message Received!
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>. Your inquiry has been logged under ticket reference:
              </p>
              <div className="inline-block px-4 py-1.5 rounded-xl bg-white border border-emerald-300 font-mono font-bold text-emerald-900 text-sm">
                #{submittedTicket}
              </div>
              <p className="text-[11px] text-emerald-700">
                Our support team typically responds within 15 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmittedTicket(null);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF8F0] border text-xs font-semibold text-[#2D1B12] outline-none ${
                      errors.name ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF8F0] border text-xs font-semibold text-[#2D1B12] outline-none ${
                      errors.email ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Subject / Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/15 text-xs font-bold text-[#2D1B12] outline-none focus:border-[#FF6B35]"
                >
                  <option value="Order Inquiry">Order Inquiry / Delivery Issue</option>
                  <option value="Restaurant Partner">Restaurant Partner Onboarding</option>
                  <option value="Feedback">Compliment / Food Quality Feedback</option>
                  <option value="Careers">Internship & Careers</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or message in detail..."
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF8F0] border text-xs font-semibold text-[#2D1B12] outline-none ${
                    errors.message ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                  }`}
                />
                {errors.message && <p className="text-[11px] text-rose-600 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#FF6B35] text-white text-xs font-extrabold shadow-lg hover:bg-[#E85A27] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message (Simulated)</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Cards & FAQs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Contact Info */}
          <div className="bg-white rounded-3xl p-6 border border-[#2D1B12]/8 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-[#2D1B12] uppercase tracking-wider">
              Direct Contact Channels
            </h3>

            <div className="space-y-3 text-xs text-[#2D1B12]/80">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFF8F0]">
                <MapPin className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2D1B12]">Headquarters</p>
                  <p className="text-[11px] text-[#2D1B12]/60 mt-0.5">
                    FreshBite Technologies, 100 Feet Rd, Indiranagar, Bengaluru 560038
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFF8F0]">
                <Phone className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2D1B12]">Customer Hotline</p>
                  <p className="text-[11px] text-[#2D1B12]/60 mt-0.5">
                    +91 1800-419-BITE (Simulated Toll-Free)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFF8F0]">
                <Mail className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2D1B12]">Support Email</p>
                  <p className="text-[11px] text-[#2D1B12]/60 mt-0.5">
                    support@freshbite.example.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFF8F0]">
                <Clock className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2D1B12]">Delivery Operations</p>
                  <p className="text-[11px] text-[#2D1B12]/60 mt-0.5">
                    Monday – Sunday: 7:00 AM to 1:00 AM IST
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions Accordion */}
          <div className="bg-white rounded-3xl p-6 border border-[#2D1B12]/8 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#FF6B35]" />
              <h3 className="font-extrabold text-sm text-[#2D1B12] uppercase tracking-wider">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="divide-y divide-[#2D1B12]/5 space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="pt-2 first:pt-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left flex items-center justify-between gap-2 py-2 text-xs font-bold text-[#2D1B12] hover:text-[#FF6B35] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        openFaq === i ? 'rotate-180 text-[#FF6B35]' : 'text-[#2D1B12]/40'
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <p className="text-[11px] text-[#2D1B12]/70 leading-relaxed pb-2 animate-in fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
