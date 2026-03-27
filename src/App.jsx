import { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import ContactDetail from './components/ContactDetail';
import ChatPanel from './components/ChatPanel';

const STORAGE_KEY = 'doctor_ai_crm_contacts';

function loadContacts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveContacts(contacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export default function App() {
  const [contacts, setContacts] = useState(loadContacts);
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit' | 'detail'
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    saveContacts(contacts);
  }, [contacts]);

  function handleSave(formData) {
    if (selected && view === 'edit') {
      setContacts(prev => prev.map(c => c.id === selected.id ? { ...c, ...formData } : c));
    } else {
      setContacts(prev => [...prev, { id: crypto.randomUUID(), ...formData, aiHistory: [] }]);
    }
    setView('list');
    setSelected(null);
  }

  function handleDelete(id) {
    if (window.confirm('Delete this contact?')) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  }

  function handleEdit(contact) {
    setSelected(contact);
    setView('edit');
  }

  function handleView(contact) {
    setSelected(contact);
    setView('detail');
  }

  function handleAdd() {
    setSelected(null);
    setView('add');
  }

  function handleCancel() {
    setView('list');
    setSelected(null);
  }

  return (
    <div className="flex" style={{ minHeight: '100vh', backgroundColor: '#0a1128' }}>
      {/* Sidebar nav */}
      <div
        className="w-48 shrink-0 flex flex-col border-r pt-6"
        style={{ backgroundColor: '#0d1730', borderColor: '#1e2d54' }}
      >
        <div className="px-5 mb-8">
          <h2 className="text-lg font-bold" style={{ color: '#c9a84c' }}>Doctor AI</h2>
          <p className="text-xs text-gray-500">CRM</p>
        </div>
        <button
          onClick={() => setView('list')}
          className={`text-left px-5 py-2.5 text-sm font-medium ${view === 'list' || view === 'detail' ? 'border-l-2' : 'border-l-2 border-transparent'}`}
          style={view === 'list' || view === 'detail' ? { borderColor: '#c9a84c', color: '#c9a84c' } : { color: '#9ca3af' }}
        >
          Contacts
        </button>
        <button
          onClick={handleAdd}
          className={`text-left px-5 py-2.5 text-sm font-medium border-l-2 ${view === 'add' || view === 'edit' ? '' : 'border-transparent'}`}
          style={view === 'add' || view === 'edit' ? { borderColor: '#c9a84c', color: '#c9a84c' } : { color: '#9ca3af' }}
        >
          {view === 'edit' ? 'Edit Contact' : 'Add Contact'}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {view === 'list' && (
          <ContactList
            contacts={contacts}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
        {(view === 'add' || view === 'edit') && (
          <ContactForm
            contact={view === 'edit' ? selected : null}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        {view === 'detail' && (
          <ContactDetail
            contact={selected}
            onEdit={handleEdit}
            onBack={() => setView('list')}
          />
        )}
      </div>

      {/* AI Chat Panel — always visible */}
      <ChatPanel contacts={contacts} onContactsChange={setContacts} />
    </div>
  );
}
