import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Package, Clock, MapPin, CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { bulkOrderService } from '../lib/bulkOrderService';
import type { BulkOrderConfig, BulkOrderFormData } from '../types/bulkOrder';
import emailjs from '@emailjs/browser';

export default function BulkOrders() {
  const [config, setConfig] = useState<BulkOrderConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BulkOrderFormData>({
    name: '',
    mobile_number: '',
    order_quantity: '',
    delivery_date: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await bulkOrderService.getBulkOrderConfig();
      if (data) {
        setConfig(data);
      } else {
        console.warn('No bulk order configuration found');
      }
    } catch (error) {
      console.error('Failed to load bulk order config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (config?.contact_number) {
      window.open(`tel:${config.contact_number}`, '_blank');
    }
  };

  const handleWhatsApp = () => {
    if (config?.whatsapp_number) {
      const message = encodeURIComponent('Hi! I\'m interested in placing a bulk order.');
      window.open(`https://wa.me/${config.whatsapp_number.replace(/[^\d]/g, '')}?text=${message}`, '_blank');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const REQUEST_TIMEOUT_MS = 60000; // Increased to 60 seconds for better reliability

    const run = async () => {
      // Submit to database
      const enquiryData = await bulkOrderService.submitBulkOrderEnquiry(formData);
      
      if (!enquiryData) {
        throw new Error('Failed to submit enquiry to database');
      }
      
      // Send email notification using EmailJS (with error handling)
      try {
        const emailParams = {
          to_email: config?.email || 'orders@shakthithattuvada.com',
          from_name: formData.name,
          from_email: formData.mobile_number,
          phone: formData.mobile_number,
          order_quantity: formData.order_quantity,
          delivery_date: formData.delivery_date || 'Not specified',
          message: formData.message,
          subject: `New Bulk Order Enquiry - ${formData.name}`
        };

        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID_BULK_ORDER,
          emailParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (emailError) {
        console.warn('Email notification failed, but enquiry was submitted:', emailError);
        // Continue even if email fails - the enquiry is already in the database
      }

      setSubmitted(true);
      setFormData({
        name: '',
        mobile_number: '',
        order_quantity: '',
        delivery_date: '',
        message: ''
      });
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
      }, 3000);
    };

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Please check your connection and try again.')), REQUEST_TIMEOUT_MS)
    );

    try {
      await Promise.race([run(), timeout]);
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      alert('Failed to submit enquiry. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    // Use fallback configuration if database config is not available
    const fallbackConfig = {
      title: 'Bulk Orders – Shakthi Thattuvada Set Corner',
      subtitle: 'Wholesale snack orders for shops and events.',
      minimum_order: 2630,
      small_thattu_vada_quantity: 10,
      small_thattu_vada_weight: '1.5kg total',
      big_muruku_quantity: 10,
      big_thattu_vada_quantity: 10,
      box_price: 40,
      total_price: 2630,
      contact_number: '+919876543210',
      whatsapp_number: '+919876543210',
      email: 'orders@shakthithattuvada.com'
    };
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="px-4 py-8 md:px-6 md:py-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{fallbackConfig.title}</h1>
                    <p className="text-white/90 text-sm md:text-base mt-1">{fallbackConfig.subtitle}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-400 text-red-900 rounded-2xl px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-400 font-bold text-sm">₹</span>
                  </div>
                  <div>
                    <p className="font-semibold">Minimum Bulk Order</p>
                    <p className="text-sm">₹{fallbackConfig.minimum_order.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Us for Bulk Orders</h2>
            <p className="text-gray-600 mb-6">Please contact us directly for bulk order inquiries. Our team will get back to you with the best wholesale prices.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => window.open(`tel:${fallbackConfig.contact_number}`, '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-lg transition-colors"
              >
                <Phone className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Call Now</p>
                  <p className="text-sm opacity-90">{fallbackConfig.contact_number}</p>
                </div>
              </button>

              <button
                onClick={() => window.open(`https://wa.me/${fallbackConfig.whatsapp_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Hi! I\'m interested in placing a bulk order.')}`, '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm opacity-90">Quick response</p>
                </div>
              </button>

              <button
                onClick={() => window.open(`mailto:${fallbackConfig.email}`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Email</p>
                  <p className="text-sm opacity-90">{fallbackConfig.email}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-red-500 to-red-600 text-white"
      >
        <div className="px-4 py-8 md:px-6 md:py-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{config.title}</h1>
                  <p className="text-white/90 text-sm md:text-base mt-1">{config.subtitle}</p>
                </div>
              </div>
              
              {/* Minimum Order Notice */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-yellow-400 text-red-900 rounded-2xl px-4 py-3 md:px-6 md:py-4 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-400 font-bold text-sm">₹</span>
                </div>
                <div>
                  <p className="font-semibold">Minimum Bulk Order</p>
                  <p className="text-sm">₹{config.minimum_order.toLocaleString('en-IN')}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8 space-y-6">
        {/* Bulk Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" />
              THATTU VADA Wholesale Pack
            </h2>
          </div>
          
          <div className="p-4 md:p-6 space-y-4">
            {/* Product List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Small Thattu Vada</p>
                    <p className="text-sm text-gray-600">{config.small_thattu_vada_weight}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{config.small_thattu_vada_quantity} packets</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Big Muruku</p>
                    <p className="text-sm text-gray-600">Traditional snack</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{config.big_muruku_quantity} packets</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Big Thattu Vada</p>
                    <p className="text-sm text-gray-600">Premium quality</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{config.big_thattu_vada_quantity} packets</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Box Cost</p>
                    <p className="text-sm text-gray-600">Premium packaging</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">₹{config.box_price}</p>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm md:text-base text-white/90">Total Wholesale Price</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">₹{config.total_price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCall}
              className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-4 md:p-6 flex items-center justify-center gap-3 shadow-lg transition-colors"
            >
              <Phone className="w-5 h-5 md:w-6 md:h-6" />
              <div className="text-left">
                <p className="font-semibold">Call Now</p>
                <p className="text-sm opacity-90">Speak with our team</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-4 md:p-6 flex items-center justify-center gap-3 shadow-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              <div className="text-left">
                <p className="font-semibold">WhatsApp</p>
                <p className="text-sm opacity-90">Chat for quick response</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(`mailto:${config?.email || 'orders@shakthithattuvada.com'}`, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 md:p-6 flex items-center justify-center gap-3 shadow-lg transition-colors"
            >
              <Mail className="w-5 h-5 md:w-6 md:h-6" />
              <div className="text-left">
                <p className="font-semibold">Email</p>
                <p className="text-sm opacity-90">Send us details</p>
              </div>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl p-4 md:p-6 flex items-center justify-center gap-3 shadow-lg transition-all"
          >
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-semibold text-lg">Contact for Bulk Orders</span>
          </motion.button>
        </motion.div>

        {/* Enquiry Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: 20 }}
                className="bg-white rounded-3xl shadow-lg p-4 md:p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bulk Order Enquiry</h3>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Enquiry Submitted!</h4>
                    <p className="text-gray-600">We'll contact you soon regarding your bulk order.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order Quantity *</label>
                      <input
                        type="text"
                        name="order_quantity"
                        value={formData.order_quantity}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="e.g., 5 wholesale packs, 20 packets total"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                      <input
                        type="date"
                        name="delivery_date"
                        value={formData.delivery_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                        placeholder="Any special requirements or questions..."
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white rounded-xl py-4 font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5" />
                          Submit Enquiry
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Quick Delivery</h4>
            <p className="text-sm text-gray-600">Fast and reliable delivery for bulk orders</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Fresh Products</h4>
            <p className="text-sm text-gray-600">Always fresh and high-quality snacks</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Wide Coverage</h4>
            <p className="text-sm text-gray-600">Serving shops and events across the region</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
