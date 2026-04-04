import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, Phone, MapPin } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { LoadingSpinner } from '../components/Loading';

function Messages() {
  const { success, error } = useToast();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockConversations = [
        {
          id: 1,
          participant: {
            id: 101,
            name: 'John Smith',
            role: 'customer',
            avatar: 'J',
            profession: 'Home Owner',
            lastMessage: 'Thank you for the excellent service!',
            timestamp: '2024-01-15T10:30:00Z',
            unread: 2,
          },
        },
        {
          id: 2,
          participant: {
            id: 102,
            name: 'Sarah Johnson',
            role: 'customer',
            avatar: 'S',
            profession: 'Business Owner',
            lastMessage: 'When can you start the project?',
            timestamp: '2024-01-14T15:45:00Z',
            unread: 0,
          },
        },
        {
          id: 3,
          participant: {
            id: 103,
            name: 'Mike Davis',
            role: 'worker',
            avatar: 'M',
            profession: 'Electrician',
            lastMessage: 'I can help with your wiring issue',
            timestamp: '2024-01-13T09:20:00Z',
            unread: 1,
          },
        },
      ];

      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0]);
      }
    } catch (err) {
      error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // Mock messages - in real app, fetch from API
      const mockMessages = [
        {
          id: 1,
          senderId: 101,
          senderName: 'John Smith',
          content: 'Hi! I need help with plumbing in my kitchen.',
          timestamp: '2024-01-15T09:00:00Z',
          isOwn: false,
        },
        {
          id: 2,
          senderId: 'currentUser',
          senderName: 'You',
          content: 'Hello John! I can help you with that. When would be a good time?',
          timestamp: '2024-01-15T09:05:00Z',
          isOwn: true,
        },
        {
          id: 3,
          senderId: 101,
          senderName: 'John Smith',
          content: 'Tomorrow afternoon would be great. Around 2 PM?',
          timestamp: '2024-01-15T09:10:00Z',
          isOwn: false,
        },
        {
          id: 4,
          senderId: 'currentUser',
          senderName: 'You',
          content: 'Perfect! I\'ll be there at 2 PM. Please confirm your address.',
          timestamp: '2024-01-15T09:15:00Z',
          isOwn: true,
        },
        {
          id: 5,
          senderId: 101,
          senderName: 'John Smith',
          content: 'Thank you for the excellent service! You did a great job fixing the leak.',
          timestamp: '2024-01-15T10:30:00Z',
          isOwn: false,
        },
      ];

      setMessages(mockMessages);
    } catch (err) {
      error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      // Mock sending - in real app, send to API
      const newMsg = {
        id: Date.now(),
        senderId: 'currentUser',
        senderName: 'You',
        content: newMessage,
        timestamp: new Date().toISOString(),
        isOwn: true,
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');

      // Update conversation's last message
      setConversations(prev => prev.map(conv =>
        conv.id === activeConversation.id
          ? { ...conv, participant: { ...conv.participant, lastMessage: newMessage, timestamp: new Date().toISOString() } }
          : conv
      ));

      success('Message sent!');
    } catch (err) {
      error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600 mt-1">Communicate with customers and workers</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation)}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      activeConversation?.id === conversation.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {conversation.participant.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {conversation.participant.name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.participant.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">
                          {conversation.participant.profession}
                        </p>
                        <p className="text-sm text-gray-700 truncate">
                          {conversation.participant.lastMessage}
                        </p>
                        {conversation.participant.unread > 0 && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {conversation.participant.unread} new
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {activeConversation.participant.avatar}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {activeConversation.participant.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {activeConversation.participant.profession}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Phone size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MapPin size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-white">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {sending ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Send size={18} />
                        )}
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
                    <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;