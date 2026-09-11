# Meemaw Architecture

```text
Older adult
    │
    │ voice or text
    ▼
React / Vercel
    │
    ▼
Main Meemaw Agent
    │
    ├─ identify contact
    ├─ load user preferences
    └─ route to contact context
          │
          ├─ Sarah context
          ├─ David context
          └─ Mike context
                │
                ├─ Supabase memory
                └─ You.com live web context
                       │
                       ▼
                  grounded answer
                       │
                       ▼
              speech synthesis / UI
```

## Learning loop

```text
Response
  ↓
User correction / feedback
  ↓
Extract preference or relationship fact
  ↓
Supabase user_preferences / contact_memories
  ↓
Use it on the next request
  ↓
 visibly improved response
```

## Self-repair example

```text
You.com tool fails
    ↓
Catch error
    ↓
Use stored profile/memory
    ↓
Tell user live lookup was unavailable
    ↓
Continue instead of crashing
```
