import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are an AI assistant for a CRM app. You help users manage their contacts.

You have access to the following tools:
- create_contact: Create a new contact
- update_contact: Update an existing contact by name or id
- delete_contact: Delete a contact by name or id
- list_contacts: List contacts, optionally filtered by status

When the user asks you to perform a CRM action, respond with ONLY the JSON tool call first (no introductory text before it), followed by a brief friendly confirmation in plain language. Do not include any text before the JSON.

{"tool": "create_contact", "args": {"name": "...", "email": "...", "phone": "...", "company": "...", "status": "Lead|Active|Closed", "notes": "..."}}
{"tool": "update_contact", "args": {"name": "...", "updates": {"status": "...", "email": "...", ...}}}
{"tool": "delete_contact", "args": {"name": "..."}}
{"tool": "list_contacts", "args": {"status": "Lead|Active|Closed|all"}}

For list_contacts, also provide a human-readable summary after the JSON.
For other tools, confirm what action was taken in plain language after the JSON.
If the user is just chatting, respond normally without a tool call.`;

function parseToolCall(text) {
  // Track brace depth to correctly extract nested JSON objects
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const candidate = text.slice(start, i + 1);
        if (candidate.includes('"tool"')) {
          try {
            return JSON.parse(candidate);
          } catch {
            // not valid JSON, keep looking
          }
        }
        start = -1;
      }
    }
  }
  return null;
}

export default function ChatPanel({ contacts, onContactsChange }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I can create, update, delete, or list your contacts. Just tell me what you need.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function executeTool(toolCall, currentContacts) {
    const { tool, args } = toolCall;

    if (tool === 'create_contact') {
      const newContact = {
        id: crypto.randomUUID(),
        name: args.name || 'Unknown',
        email: args.email || '',
        phone: args.phone || '',
        company: args.company || '',
        status: args.status || 'Lead',
        notes: args.notes || '',
        aiHistory: [],
      };
      return { contacts: [...currentContacts, newContact], message: `Created contact: ${newContact.name}` };
    }

    if (tool === 'update_contact') {
      const lowerName = (args.name || '').toLowerCase();
      const updated = currentContacts.map(c => {
        if (c.name.toLowerCase().includes(lowerName) || c.id === args.id) {
          return { ...c, ...args.updates };
        }
        return c;
      });
      return { contacts: updated, message: `Updated contact: ${args.name}` };
    }

    if (tool === 'delete_contact') {
      const lowerName = (args.name || '').toLowerCase();
      const filtered = currentContacts.filter(
        c => !c.name.toLowerCase().includes(lowerName) && c.id !== args.id
      );
      return { contacts: filtered, message: `Deleted contact: ${args.name}` };
    }

    if (tool === 'list_contacts') {
      const status = args.status;
      const result = status && status !== 'all'
        ? currentContacts.filter(c => c.status === status)
        : currentContacts;
      const names = result.map(c => `${c.name} (${c.status})`).join(', ');
      return { contacts: currentContacts, message: names || 'No contacts found.' };
    }

    return { contacts: currentContacts, message: 'Unknown tool.' };
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const model = import.meta.env.VITE_MODEL || 'anthropic/claude-3-haiku';

      const contactSummary = contacts.length
        ? `Current contacts (${contacts.length}): ${contacts.map(c => `${c.name} [${c.status}]`).join(', ')}`
        : 'No contacts yet.';

      const systemWithContext = `${SYSTEM_PROMPT}\n\n${contactSummary}`;

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemWithContext },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not get a response.';

      const toolCall = parseToolCall(reply);
      let assistantContent = reply;

      if (toolCall) {
        const { contacts: updatedContacts, message } = executeTool(toolCall, contacts);
        onContactsChange(updatedContacts);
        // Strip the raw JSON tool call from the reply, keep only the human-readable part
        let stripped = '';
        let d = 0, inJson = false;
        for (let i = 0; i < reply.length; i++) {
          if (reply[i] === '{') { d++; inJson = true; }
          if (!inJson) stripped += reply[i];
          if (reply[i] === '}' && inJson) { d--; if (d === 0) inJson = false; }
        }
        assistantContent = stripped.trim() || message;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to AI. Check your API key in .env.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className="flex flex-col w-80 shrink-0 border-l"
      style={{ backgroundColor: '#0d1730', borderColor: '#1e2d54', height: '100vh' }}
    >
      <div className="px-4 py-3 border-b font-semibold text-sm" style={{ borderColor: '#1e2d54', color: '#c9a84c' }}>
        AI Assistant
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 py-2 text-sm max-w-[95%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
            style={{
              backgroundColor: msg.role === 'user' ? '#1e2d54' : '#111d3c',
              border: '1px solid #1e2d54',
              color: '#e8e8e8',
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div
            className="self-start rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: '#111d3c', border: '1px solid #1e2d54', color: '#9ca3af' }}
          >
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-3 py-3 border-t" style={{ borderColor: '#1e2d54' }}>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
            placeholder='Try "Add a lead named Maria from Acme"'
            className="flex-1 rounded px-3 py-2 text-sm resize-none outline-none text-gray-200"
            style={{ backgroundColor: '#111d3c', border: '1px solid #1e2d54' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded text-sm font-semibold self-end disabled:opacity-40"
            style={{ backgroundColor: '#c9a84c', color: '#0a1128' }}
          >
            Send
          </button>
        </div>
        <p className="text-xs mt-1" style={{ color: '#4a5568' }}>Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  );
}
