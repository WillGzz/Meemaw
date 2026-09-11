function localFallback(message, contact) {
  const person = contact?.name ?? 'your loved one'
  return {
    text: contact
      ? `I understand you're asking about ${person}. The live agent API is not connected in this local Vite session yet, but I found the right contact profile.`
      : `I heard you. I couldn't confidently tell which contact you meant yet. Try mentioning Sarah, David, or Mike.`,
    contact,
    sources: [],
    learned: null,
    mode: 'local-fallback',
  }
}

export async function askMeemaw({ message, contact, contacts }) {
  try {
    const response = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, contact, contacts }),
    })

    if (!response.ok) throw new Error(`Agent API returned ${response.status}`)
    return await response.json()
  } catch (error) {
    console.warn('Using local fallback because /api/agent is unavailable.', error)
    return localFallback(message, contact)
  }
}
