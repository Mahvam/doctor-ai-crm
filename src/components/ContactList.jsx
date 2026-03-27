export default function ContactList({ contacts, onAdd, onEdit, onDelete, onView }) {
  const statusColors = {
    Lead: 'bg-blue-900 text-blue-200',
    Active: 'bg-green-900 text-green-200',
    Closed: 'bg-gray-700 text-gray-300',
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#c9a84c' }}>
          Contacts
        </h1>
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded font-semibold text-sm"
          style={{ backgroundColor: '#c9a84c', color: '#0a1128' }}
        >
          + Add Contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No contacts yet. Add one or ask the AI to create one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#1e2d54' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#111d3c', color: '#c9a84c' }}>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Phone</th>
                <th className="text-left px-4 py-3 font-semibold">Company</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, i) => (
                <tr
                  key={contact.id}
                  style={{ backgroundColor: i % 2 === 0 ? '#0d1730' : '#0a1128', borderTop: '1px solid #1e2d54' }}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onView(contact)}
                      className="font-medium hover:underline text-left"
                      style={{ color: '#c9a84c' }}
                    >
                      {contact.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{contact.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{contact.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{contact.company || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[contact.status] || statusColors.Lead}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => onEdit(contact)}
                      className="px-3 py-1 rounded text-xs font-semibold border"
                      style={{ borderColor: '#c9a84c', color: '#c9a84c' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(contact.id)}
                      className="px-3 py-1 rounded text-xs font-semibold border border-red-700 text-red-400 hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
