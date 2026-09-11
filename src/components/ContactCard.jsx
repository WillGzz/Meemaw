export default function ContactCard({ contact, active, onClick }) {
  return (
    <button
      className={`contact-card ${active ? 'contact-card--active' : ''}`}
      onClick={() => onClick(contact)}
      type="button"
    >
      <span className="avatar" aria-hidden="true">{contact.initials || contact.name?.[0]}</span>
      <span className="contact-card__text">
        <strong>{contact.name}</strong>
        <span>{contact.relationship}</span>
      </span>
    </button>
  )
}
