import { useEffect, useMemo, useState } from 'react'
import ContactCard from './components/ContactCard'
import MessageBubble from './components/MessageBubble'
import VoiceButton from './components/VoiceButton'
import { demoUser } from './data/demoContacts'
import { askMeemaw } from './services/agentClient'
import { getContacts } from './services/contacts'

function findContact(message, contacts) {
  const normalized = message.toLowerCase()
  return contacts.find((contact) =>
    (contact.aliases || [contact.name]).some((alias) => normalized.includes(alias.toLowerCase())),
  )
}

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.95
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

export default function App() {
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hi ${demoUser.name}. I'm Meemaw. Ask me about Sarah, David, or Mike — or press the microphone and talk to me.`,
    },
  ])

  useEffect(() => {
    getContacts().then(setContacts)
  }, [])

  const selectedLabel = useMemo(
    () => selectedContact ? `${selectedContact.name} · ${selectedContact.relationship}` : 'I’ll figure out who you mean',
    [selectedContact],
  )

  async function sendMessage(rawMessage) {
    const message = rawMessage.trim()
    if (!message || loading) return

    const inferredContact = selectedContact || findContact(message, contacts)
    if (!selectedContact && inferredContact) setSelectedContact(inferredContact)

    setMessages((current) => [...current, { role: 'user', text: message }])
    setInput('')
    setLoading(true)

    const result = await askMeemaw({
      message,
      contact: inferredContact,
      contacts,
    })

    setMessages((current) => [
      ...current,
      { role: 'assistant', text: result.text, sources: result.sources || [] },
    ])
    setLoading(false)

    if (demoUser.preferences.voiceEnabled) speak(result.text)
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">Meemaw</div>
          <p className="tagline">Stay close, without fighting the technology.</p>
        </div>
        <span className="status-pill">Hackathon prototype</span>
      </header>

      <div className="layout">
        <aside className="contacts-panel">
          <div className="section-heading">
            <span>People you care about</span>
            <small>{contacts.length} contacts</small>
          </div>

          <div className="contact-list">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                active={selectedContact?.id === contact.id}
                onClick={setSelectedContact}
              />
            ))}
          </div>

          {selectedContact && (
            <button className="clear-button" type="button" onClick={() => setSelectedContact(null)}>
              Clear selected person
            </button>
          )}
        </aside>

        <section className="conversation-panel">
          <div className="conversation-header">
            <div>
              <span className="eyebrow">Talking about</span>
              <h1>{selectedLabel}</h1>
            </div>
          </div>

          <div className="messages" aria-live="polite">
            {messages.map((message, index) => (
              <MessageBubble
                key={`${message.role}-${index}`}
                role={message.role}
                text={message.text}
                sources={message.sources}
              />
            ))}
            {loading && <div className="thinking">Meemaw is thinking…</div>}
          </div>

          <div className="composer-area">
            <VoiceButton onTranscript={sendMessage} disabled={loading} />

            <form className="composer" onSubmit={handleSubmit}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Or type something like: What’s Sarah been up to?"
                aria-label="Message Meemaw"
              />
              <button type="submit" disabled={loading || !input.trim()}>Send</button>
            </form>

            <p className="privacy-note">
              Meemaw should only use information the family has connected or information that is publicly available and appropriate to use.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
