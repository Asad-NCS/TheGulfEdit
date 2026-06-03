'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminContacts() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/contact`);
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id: string, read: boolean) => {
    try {
      const res = await fetch(`${API}/api/admin/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read })
      });
      if (res.ok) fetchMessages();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Messages</h1>

      <div className="bg-cream border border-sand-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sand border-b border-sand-dark font-body text-xs tracking-wider uppercase text-ink-light">
                <th className="p-4 font-medium w-1/4">From</th>
                <th className="p-4 font-medium w-1/2">Message</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-sand-dark">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center">Loading...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-ink-light">No messages found.</td></tr>
              ) : (
                messages.map((m) => (
                  <tr key={m._id} className={`hover:bg-sand/30 transition-colors ${!m.read ? 'bg-cream' : 'bg-sand/10 opacity-70'}`}>
                    <td className="p-4 align-top">
                      <div className="font-medium text-ink">{m.name}</div>
                      <div className="text-xs text-ink-light mt-1">{m.whatsapp}</div>
                    </td>
                    <td className="p-4 align-top">
                      <p className={`whitespace-pre-wrap ${!m.read ? 'font-medium text-ink' : 'text-ink-light'}`}>{m.message}</p>
                    </td>
                    <td className="p-4 align-top text-xs text-ink-light">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 align-top text-right">
                      <button 
                        onClick={() => markRead(m._id, !m.read)}
                        className={`text-xs px-3 py-1 border transition-colors ${m.read ? 'text-ink-light border-sand-dark hover:border-ink hover:text-ink' : 'bg-ink text-cream border-ink hover:bg-cream hover:text-ink'}`}
                      >
                        {m.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
