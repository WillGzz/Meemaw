import { useRef, useState } from 'react'

export default function VoiceButton({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const supported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  function startListening() {
    if (!supported || disabled) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim()
      if (transcript) onTranscript(transcript)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  return (
    <button
      className={`voice-button ${listening ? 'voice-button--active' : ''}`}
      type="button"
      onClick={startListening}
      disabled={disabled || !supported}
      title={supported ? 'Speak to Meemaw' : 'Voice recognition is not supported in this browser'}
    >
      <span className="voice-button__icon" aria-hidden="true">{listening ? '●' : '🎙'}</span>
      <span>{listening ? 'Listening…' : 'Talk to Meemaw'}</span>
    </button>
  )
}
