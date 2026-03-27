const statusColors = {
  Lead: 'bg-blue-900 text-blue-200',
  Active: 'bg-green-900 text-green-200',
  Closed: 'bg-gray-700 text-gray-300',
};

export default function ContactDetail({ contact, onEdit, onBack }) {
  if (!contact) return null;

  const history = contact.aiHistory || [];

  return (
    <div className="flex-1 p-6 max-w-2xl">
      <button
        onClick={onBack}
        className="text-sm mb-6 flex items-center gap-1"
        style={{ color: '#c9a84c' }}
      >
        ← Back to Contacts
      </button>

      <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: '#111d3c', border: '1px solid #1e2d54' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{contact.name}</h1>
            {contact.company && (
              <p className="text-gray-400 text-sm">{contact.company}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[contact.status] || statusColors.Lead}`}>
              {contact.status}
            </span>
            <button
              onClick={() => onEdit(contact)}
              className="px-4 py-1.5 rounded text-sm font-semibold border"
              style={{ borderColor: '#c9a84c', color: '#c9a84c' }}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {contact.email && (
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Email</p>
              <p className="text-gray-200">{contact.email}</p>
            </div>
          )}
          {contact.phone && (
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Phone</p>
              <p className="text-gray-200">{contact.phone}</p>
            </div>
          )}
        </div>

        {contact.notes && (
          <div className="mt-4">
            <p className="text-gray-500 text-xs mb-1">Notes</p>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{contact.notes}</p>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#c9a84c' }}>
            AI Conversation History
          </h2>
          <div className="flex flex-col gap-3">
            {history.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg px-4 py-3 text-sm max-w-lg ${
                  msg.role === 'user' ? 'self-end' : 'self-start'
                }`}
                style={{
                  backgroundColor: msg.role === 'user' ? '#1e2d54' : '#111d3c',
                  border: '1px solid #1e2d54',
                }}
              >
                <p className="text-xs mb-1" style={{ color: '#c9a84c' }}>
                  {msg.role === 'user' ? 'You' : 'AI'}
                </p>
                <p className="text-gray-200">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
