const demoContacts = [
  {
    id: 'sarah-demo',
    name: 'Sarah',
    relationship: 'Granddaughter',
    aliases: ['sarah', 'my granddaughter', 'granddaughter'],
    interests: ['photography', 'college', 'music'],
    publicSearchQuery: 'Boston photography events college students latest',
  },
  {
    id: 'david-demo',
    name: 'David',
    relationship: 'Son',
    aliases: ['david', 'my son', 'son'],
    interests: ['technology', 'AI', 'startups'],
    publicSearchQuery: 'latest artificial intelligence startup news New York',
  },
  {
    id: 'mike-demo',
    name: 'Mike',
    relationship: 'Friend',
    aliases: ['mike', 'michael', 'my friend', 'friend'],
    interests: ['baseball', 'New York sports'],
    publicSearchQuery: 'latest New York baseball news',
  },
]

function inferContact(message, contacts) {
  const normalized = String(message || '').toLowerCase()
  return contacts.find((contact) =>
    (contact.aliases || [contact.name]).some((alias) => normalized.includes(String(alias).toLowerCase())),
  )
}

async function youSearch(query) {
  if (!process.env.YDC_API_KEY) return null

  const response = await fetch('https://ydc-index.io/v1/search', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.YDC_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      count: 5,
      safesearch: 'strict',
      extraction: { extraction_mode: 'highlights' },
    }),
  })

  if (!response.ok) {
    throw new Error(`You.com Search failed with ${response.status}`)
  }

  return response.json()
}

function simplifySources(searchResult) {
  const web = searchResult?.results?.web || []
  return web.slice(0, 3).map((result) => ({
    title: result.title,
    url: result.url,
    description: result.description,
    highlight: result.contents?.highlights?.[0] || result.snippets?.[0] || '',
  }))
}

function buildGroundedReply(contact, sources) {
  if (!sources.length) {
    return `I found ${contact.name}, your ${contact.relationship.toLowerCase()}, but I don't have live web context connected yet. You can still ask me about ${contact.name}, and I'll use the profile and relationship memory we have saved.`
  }

  const top = sources[0]
  const evidence = top.highlight || top.description
  return `I found a recent update related to ${contact.name}'s interests. ${evidence || `One useful source is ${top.title}.`} I can use this as conversation context without pretending that ${contact.name} personally said it.`
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, contact, contacts } = request.body || {}
    if (!message || typeof message !== 'string') {
      return response.status(400).json({ error: 'message is required' })
    }

    const availableContacts = Array.isArray(contacts) && contacts.length ? contacts : demoContacts
    const activeContact = contact || inferContact(message, availableContacts)

    if (!activeContact) {
      return response.status(200).json({
        text: "I'm not sure who you mean yet. Tell me the person's name or relationship, and I'll remember the context for the conversation.",
        contact: null,
        sources: [],
        mode: 'clarify-contact',
      })
    }

    const query = activeContact.publicSearchQuery || `${activeContact.name} ${activeContact.interests?.join(' ') || ''}`
    let sources = []
    let mode = 'profile-only'

    if (process.env.YDC_API_KEY && query) {
      const searchResult = await youSearch(query)
      sources = simplifySources(searchResult)
      mode = 'you-search'
    }

    return response.status(200).json({
      text: buildGroundedReply(activeContact, sources),
      contact: activeContact,
      sources,
      mode,
      learned: null,
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      error: 'Agent request failed',
      text: "I hit a problem while checking that. I can still keep the conversation going using the contact profile we already have.",
      sources: [],
      mode: 'recovered',
    })
  }
}
