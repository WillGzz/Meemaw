export const demoUser = {
  id: 'demo-user',
  name: 'Robert',
  preferences: {
    responseLength: 'short',
    voiceEnabled: true,
  },
}

export const demoContacts = [
  {
    id: 'sarah-demo',
    name: 'Sarah',
    relationship: 'Granddaughter',
    aliases: ['Sarah', 'my granddaughter', 'granddaughter'],
    initials: 'S',
    bio: 'College student who enjoys photography and live music.',
    interests: ['photography', 'college', 'music'],
    location: 'Boston, MA',
    publicSearchQuery: 'Boston photography events college students latest',
    memory: [
      'Robert likes to ask Sarah about school.',
      'Keep messages to Sarah warm and short.',
    ],
  },
  {
    id: 'david-demo',
    name: 'David',
    relationship: 'Son',
    aliases: ['David', 'my son', 'son'],
    initials: 'D',
    bio: 'Works in technology and follows AI and startup news.',
    interests: ['technology', 'AI', 'startups'],
    location: 'New York, NY',
    publicSearchQuery: 'latest artificial intelligence startup news New York',
    memory: ['Robert prefers direct, practical updates when talking about David.'],
  },
  {
    id: 'mike-demo',
    name: 'Mike',
    relationship: 'Friend',
    aliases: ['Mike', 'Michael', 'my friend', 'friend'],
    initials: 'M',
    bio: 'Long-time friend who follows New York baseball.',
    interests: ['baseball', 'New York sports'],
    location: 'Brooklyn, NY',
    publicSearchQuery: 'latest New York baseball news',
    memory: ['Robert and Mike usually talk casually about sports.'],
  },
]
