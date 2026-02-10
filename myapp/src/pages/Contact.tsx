import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WhatsAppButton } from '../components/WhatsAppButton';

const SEO_TITLE = 'Contact Shakthi Thattuvadaset Corner | Snack Shop Salem';
const SEO_DESCRIPTION =
  "Contact Shakthi Thattuvadaset Corner, Salem's trusted traditional snack shop since 1996. Call now or visit our shop for fresh thattu vadai set and evening snacks.";

const SHOP_NAME = 'Shakthi Thattuvadaset Corner (Since 1996)';
const ADDRESS = '2nd Agraharam, Salem, Tamil Nadu, India';
const MOBILE = '+91 9790461432';
const MOBILE_TEL = 'tel:+919790461432';
const BUSINESS_CATEGORY = 'Traditional Snack Shop / Thattu Vadai Set Shop';

const SEO_INTRO =
  'Visit Shakthi Thattuvadaset Corner, one of the most trusted traditional snack shops serving fresh thattu vadai set and South Indian evening snacks since 1996. Located in 2nd Agraharam, Salem, our shop is easily accessible for takeaway snack lovers.';

const SEO_BODY =
  'For bulk orders, snack enquiries, or shop timing details, feel free to call us directly or visit our shop location. We are committed to serving fresh, hygienic, and authentic traditional snacks for all customers.';

/* Replace with your exact embed from Google Maps (Share → Embed a map) for 2nd Agraharam, Salem */
const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620962.6417372036!2d73.28937931250002!3d11.657965000000019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf1f90d729c0d%3A0x1d88516839c73a3d!2sSHAKTHI%20THATTU%20VADA%20SET%20CORNER%20(%20SINCE%201996)!5e1!3m2!1sen!2sus!4v1770721374555!5m2!1sen!2sus";

export function Contact() {
  const [form, setForm] = useState({ name: '', mobile: '', message: '' });

  useEffect(() => {
    document.title = SEO_TITLE;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', SEO_DESCRIPTION);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = SEO_DESCRIPTION;
      document.head.appendChild(meta);
    }
    return () => {
      document.title = 'Shakthi Thattuvadaset Corner | Order Food Online';
    };
  }, []);

  return (
    <>
      <WhatsAppButton />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-6xl px-4 py-8 md:py-14"
      >
        {/* Page header */}
        <header className="mb-12 text-center md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary md:text-base"
          >
            Get in touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-gray-600 md:text-lg"
          >
            {SEO_INTRO}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-3 max-w-2xl text-gray-600 md:text-base"
          >
            {SEO_BODY}
          </motion.p>
        </header>

        {/* Contact info cards + form grid */}
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Contact info cards */}
          <div className="space-y-5 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-shadow hover:shadow-xl md:p-7"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gray-500">Shop Name</h3>
              <p className="mt-1 font-semibold text-gray-900">{SHOP_NAME}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-shadow hover:shadow-xl md:p-7"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gray-500">Address</h3>
              <p className="mt-1 text-gray-800">{ADDRESS}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-shadow hover:shadow-xl md:p-7"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gray-500">Mobile</h3>
              <a
                href={MOBILE_TEL}
                className="mt-1 inline-block text-lg font-semibold text-primary transition-colors hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 rounded-lg px-1 -mx-1"
              >
                {MOBILE}
              </a>
              <p className="mt-1 text-xs text-gray-500">Tap to call</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-shadow hover:shadow-xl md:p-7"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gray-500">Category</h3>
              <p className="mt-1 text-gray-800">{BUSINESS_CATEGORY}</p>
            </motion.div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 md:p-8 lg:col-span-3"
          >
            <h2 className="font-display mb-6 text-xl font-bold text-gray-900 md:text-2xl">Send a message</h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-5"
            >
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-mobile" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  id="contact-mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your message, bulk order enquiry, or question..."
                />
              </div>
              <motion.button
                type="submit"
                className="w-full rounded-2xl bg-primary py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Google Map embed */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 md:mt-16"
        >
          <h2 className="font-display mb-4 text-xl font-bold text-gray-900 md:text-2xl">Find us</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="relative w-full pb-[56.25%]">
              <iframe
                title="Shakthi Thattuvadaset Corner - 2nd Agraharam, Salem"
                src={MAP_EMBED_SRC}
                className="absolute left-0 top-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-gray-500">
            2nd Agraharam, Salem, Tamil Nadu — Visit us for fresh thattu vadai set &amp; evening snacks
          </p>
        </motion.section>
      </motion.div>
    </>
  );
}
