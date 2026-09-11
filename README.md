# Meemaw

Voice-first relationship assistant for older adults. The hackathon prototype keeps the UI simple, identifies which family member/friend the user means, loads that person's profile/context, and can use You.com Search for fresh public context.

## Included

- React + Vite frontend
- Elderly-friendly large voice button and chat UI
- Browser speech-to-text (Chrome/Web Speech API)
- Browser text-to-speech
- Three seeded demo contacts: Sarah, David, Mike
- Supabase client with automatic demo-data fallback
- Supabase SQL schema + Row Level Security policies
- Vercel `/api/agent` serverless function
- You.com Search API integration when `YDC_API_KEY` is configured
- Graceful fallback when You.com or the backend is unavailable

## 1. Install and run

```bash
npm install
npm run dev
```

The Vite UI runs locally. Because `/api/agent` is a Vercel Function, plain `npm run dev` will use the built-in frontend fallback. For the full frontend + API locally, use the Vercel CLI after linking the project:

```bash
npx vercel dev
```

## 2. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
YDC_API_KEY=...
```

`VITE_SUPABASE_*` values are browser-visible by design. `YDC_API_KEY` must stay server-side and should be configured in Vercel Project > Settings > Environment Variables.

## 3. Supabase

Create a Supabase project, open SQL Editor, and run:

`supabase/schema.sql`

The frontend works without Supabase while you are prototyping. Once auth is added and a user is logged in, `src/services/contacts.js` will query the `contacts` table.

Recommended first database workflow:

1. Add Supabase Auth.
2. Create the user's `profiles` row.
3. Add contacts in `contacts`.
4. Store corrections/learned facts in `contact_memories` and `user_preferences`.
5. Store messages and feedback in `conversations` / `feedback`.

## 4. Deploy to Vercel

Push the folder to GitHub and import the repository into Vercel.

Build settings should auto-detect Vite:

- Build command: `npm run build`
- Output directory: `dist`

Add these environment variables to Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `YDC_API_KEY`

Vercel will deploy the React frontend and the files inside `/api` as serverless functions.

After deployment, test:

- `/api/health`
- Ask Meemaw: `What's Sarah been up to?`

## 5. Current agent flow

```text
Grandparent speaks/types
        ↓
React UI
        ↓
Identify contact
        ↓
POST /api/agent
        ↓
Contact profile/context
        ↓
You.com Search (when configured)
        ↓
Grounded response + sources
        ↓
Browser text-to-speech
```

## 6. Next hackathon steps

### A. Add actual learning

When the user says something like:

> Keep your answers shorter.

Store a preference:

```json
{
  "preference_key": "response_length",
  "preference_value": "short"
}
```

Then make the next response visibly shorter. That gives you an easy before/after demonstration of a self-improving agent.

### B. Add relationship memory

If the user corrects:

> When I say my granddaughter, I mean Sarah.

Store it in `contact_memories` or `user_preferences`, then use it during future contact routing.

### C. Add a real LLM/agent loop

The current `/api/agent.js` deliberately keeps reasoning minimal so the project boots quickly. The next layer can use Vercel AI SDK/CrewAI/another framework to give the model tools such as:

- `getContact`
- `getMemories`
- `searchYouCom`
- `savePreference`
- `saveMemory`

You.com Search is already wired as the first live-data tool.

### D. Use You.com MCP

Once the basic request path works, expose You.com capabilities through MCP if that is part of the hackathon scoring/demo. Keep the direct Search API integration available as a reliable fallback.

## Privacy / trust rule

Meemaw should not impersonate a real child, grandchild, or friend. A contact agent represents context *about* that relationship and helps the older adult communicate. If a response is simulated, label it as simulated rather than presenting it as something the real person said.

Only use information the user/family intentionally connected or information that is legitimately public and appropriate to process.
