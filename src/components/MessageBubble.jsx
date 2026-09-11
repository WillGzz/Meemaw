export default function MessageBubble({ role, text, sources = [] }) {
  return (
    <div className={`message message--${role}`}>
      <div className="message__label">{role === 'user' ? 'You' : 'Meemaw'}</div>
      <div>{text}</div>
      {sources.length > 0 && (
        <div className="sources">
          <strong>Sources</strong>
          {sources.slice(0, 3).map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              {source.title || source.url}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
