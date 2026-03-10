import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Phone, MessageCircle, Save, RefreshCw, Users, Calendar } from 'lucide-react';
import { bulkOrderService } from '../../lib/bulkOrderService';
import type { BulkOrderConfig, BulkOrderEnquiry } from '../../types/bulkOrder';

export default function AdminBulkOrders() {
  const [config, setConfig] = useState<BulkOrderConfig | null>(null);
  const [enquiries, setEnquiries] = useState<BulkOrderEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'enquiries'>('config');
  const [formData, setFormData] = useState<Partial<BulkOrderConfig>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [configData, enquiriesData] = await Promise.all([
        bulkOrderService.getBulkOrderConfig(),
        bulkOrderService.getBulkOrderEnquiries()
      ]);
      
      setConfig(configData);
      setEnquiries(enquiriesData);
      
      if (configData) {
        setFormData({
          title: configData.title,
          subtitle: configData.subtitle,
          minimum_order: configData.minimum_order,
          small_thattu_vada_quantity: configData.small_thattu_vada_quantity,
          small_thattu_vada_weight: configData.small_thattu_vada_weight,
          big_muruku_quantity: configData.big_muruku_quantity,
          big_thattu_vada_quantity: configData.big_thattu_vada_quantity,
          box_price: configData.box_price,
          total_price: configData.total_price,
          contact_number: configData.contact_number,
          whatsapp_number: configData.whatsapp_number,
          email: configData.email
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    
    setSaving(true);
    const REQUEST_TIMEOUT_MS = 60000; // Increased to 60 seconds for better reliability

    const run = async () => {
      const updatedConfig = await bulkOrderService.updateBulkOrderConfig({
        ...formData,
        id: config.id
      });
      
      if (updatedConfig) {
        setConfig(updatedConfig);
      }
    };

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Please check your connection and try again.')), REQUEST_TIMEOUT_MS)
    );

    try {
      await Promise.race([run(), timeout]);
    } catch (error) {
      console.error('Failed to save config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const updateEnquiryStatus = async (id: string, status: BulkOrderEnquiry['status']) => {
    const REQUEST_TIMEOUT_MS = 60000; // Increased to 60 seconds for better reliability

    const run = async () => {
      const updated = await bulkOrderService.updateBulkOrderEnquiryStatus(id, status);
      if (updated) {
        setEnquiries(prev => prev.map(enq => enq.id === id ? updated : enq));
      }
    };

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Please check your connection and try again.')), REQUEST_TIMEOUT_MS)
    );

    try {
      await Promise.race([run(), timeout]);
    } catch (error) {
      console.error('Failed to update enquiry status:', error);
    }
  };

  const getStatusColor = (status: BulkOrderEnquiry['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bulk Orders Management</h1>
        <p className="text-gray-600">Manage wholesale order configurations and customer enquiries</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === 'config'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          Configuration
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === 'enquiries'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Enquiries ({enquiries.length})
        </button>
      </div>

      {activeTab === 'config' && config && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Product Configuration */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order (₹)</label>
                <input
                  type="number"
                  name="minimum_order"
                  value={formData.minimum_order || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Small Thattu Vada (packets)</label>
                <input
                  type="number"
                  name="small_thattu_vada_quantity"
                  value={formData.small_thattu_vada_quantity || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Small Thattu Vada Weight</label>
                <input
                  type="text"
                  name="small_thattu_vada_weight"
                  value={formData.small_thattu_vada_weight || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Big Muruku (packets)</label>
                <input
                  type="number"
                  name="big_muruku_quantity"
                  value={formData.big_muruku_quantity || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Big Thattu Vada (packets)</label>
                <input
                  type="number"
                  name="big_thattu_vada_quantity"
                  value={formData.big_thattu_vada_quantity || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Box Price (₹)</label>
                <input
                  type="number"
                  name="box_price"
                  value={formData.box_price || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (₹)</label>
                <input
                  type="number"
                  name="total_price"
                  value={formData.total_price || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contact_number"
                  value={formData.contact_number || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsapp_number"
                  value={formData.whatsapp_number || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveConfig}
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Configuration
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {activeTab === 'enquiries' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {enquiries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Enquiries Yet</h3>
              <p className="text-gray-600">Customer bulk order enquiries will appear here</p>
            </div>
          ) : (
            enquiries.map((enquiry) => (
              <motion.div
                key={enquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{enquiry.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {enquiry.mobile_number}
                      </div>
                      
                      {enquiry.delivery_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Delivery: {new Date(enquiry.delivery_date).toLocaleDateString()}
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <p className="font-medium text-gray-900">Order Quantity:</p>
                        <p>{enquiry.order_quantity}</p>
                      </div>
                      
                      {enquiry.message && (
                        <div className="mt-2">
                          <p className="font-medium text-gray-900">Message:</p>
                          <p className="text-gray-600">{enquiry.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {enquiry.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateEnquiryStatus(enquiry.id, 'contacted')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Mark as Contacted
                        </button>
                        <button
                          onClick={() => updateEnquiryStatus(enquiry.id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Confirm Order
                        </button>
                      </>
                    )}
                    
                    {enquiry.status === 'contacted' && (
                      <button
                        onClick={() => updateEnquiryStatus(enquiry.id, 'confirmed')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Confirm Order
                      </button>
                    )}
                    
                    <button
                      onClick={() => window.open(`tel:${enquiry.mobile_number}`, '_blank')}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    
                    <button
                      onClick={() => window.open(`https://wa.me/${enquiry.mobile_number.replace(/[^\d]/g, '')}`, '_blank')}
                      className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  Enquiry ID: {enquiry.id} • Received: {new Date(enquiry.created_at).toLocaleString()}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
