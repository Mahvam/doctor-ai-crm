import { useState, useEffect } from 'react';

const emptyContact = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'Lead',
  notes: '',
};

export default function ContactForm({ contact, onSave, onCancel }) {
  const [form, setForm] = useState(emptyContact);

  useEffect(() => {
    setForm(contact ? { ...emptyContact, ...contact } : emptyContact);
  }, [contact]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  const inputClass = "w-full px-3 py-2 rounded border text-sm text-gray-200 outline-none focus:ring-1";
  const inputStyle = { backgroundColor: '#111d3c', borderColor: '#1e2d54' };
  const focusRingStyle = { '--tw-ring-color': '#c9a84c' };

  return (
    <div className="flex-1 p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#c9a84c' }}>
        {contact ? 'Edit Contact' : 'Add Contact'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
            style={inputStyle}
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle}
            placeholder="+1 555 000 0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle}
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle}
          >
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            style={inputStyle}
            placeholder="Any additional notes..."
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded font-semibold text-sm"
            style={{ backgroundColor: '#c9a84c', color: '#0a1128' }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded font-semibold text-sm border"
            style={{ borderColor: '#1e2d54', color: '#9ca3af' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
