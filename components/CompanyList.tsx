import React, { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import GlassPanel from './GlassPanel';
import { Building, Mail, Phone, FileText, Calendar, Plus, X } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';

interface Company {
  id: string;
  name: string;
  registration_number: string | null;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const CompanyList: React.FC = () => {
  const { profile } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    notes: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Company name is required');
      return;
    }

    try {
      setCreating(true);
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: formData.name.trim(),
          registration_number: formData.registration_number.trim() || null,
          address: formData.address.trim() || null,
          contact_email: formData.contact_email.trim() || null,
          contact_phone: formData.contact_phone.trim() || null,
          notes: formData.notes.trim() || null,
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to list
      setCompanies(prev => [...prev, data]);

      // Reset form and close modal
      setFormData({
        name: '',
        registration_number: '',
        address: '',
        contact_email: '',
        contact_phone: '',
        notes: '',
      });
      setShowCreateModal(false);
    } catch (err: any) {
      alert('Failed to create company: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading companies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-rose-400">Error: {error}</div>
      </div>
    );
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'partner' || profile?.role === 'manager';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Companies</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500">
            {companies.length} {companies.length === 1 ? 'company' : 'companies'}
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sea-500 hover:bg-sea-600 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus size={18} />
              Add Company
            </button>
          )}
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No companies found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <GlassPanel key={company.id} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-sea-100">
                  <Building size={20} className="text-sea-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {company.name}
                  </h3>
                  {company.registration_number && (
                    <p className="text-xs text-slate-500 mt-1">
                      Reg: {company.registration_number}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {company.contact_email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="flex-shrink-0" />
                    <span className="truncate">{company.contact_email}</span>
                  </div>
                )}

                {company.contact_phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={14} className="flex-shrink-0" />
                    <span>{company.contact_phone}</span>
                  </div>
                )}

                {company.address && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <FileText size={14} className="flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{company.address}</span>
                  </div>
                )}

                {company.notes && (
                  <div className="flex items-start gap-2 text-slate-600 mt-3 pt-3 border-t border-slate-200">
                    <FileText size={14} className="flex-shrink-0 mt-0.5" />
                    <span className="text-xs line-clamp-3">{company.notes}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-200">
                  <Calendar size={12} />
                  <span>Added {new Date(company.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Add New Company</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-500"
                  placeholder="e.g., Acme Corporation Ltd."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-500"
                  placeholder="e.g., U12345AB2020PTC123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-500"
                  rows={3}
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-500"
                    placeholder="email@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-500"
                  rows={3}
                  placeholder="Additional notes or information..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-sea-500 hover:bg-sea-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
