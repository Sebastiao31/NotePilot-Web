# 🚀 Quick Start Checklist

Follow these steps in order to get your node-based AI chat running:

## ☑️ Prerequisites
- [ ] Node.js installed
- [ ] npm/pnpm installed
- [ ] Clerk account created
- [ ] Supabase project created
- [ ] OpenAI API key

## 📋 Setup Steps

### 1️⃣ Database Setup (5 minutes)
- [ ] Open Supabase SQL Editor
- [ ] Copy entire contents of `DATABASE_SCHEMA.sql`
- [ ] Paste and execute in SQL Editor
- [ ] Verify tables created: `notes`, `nodes`, `messages`
- [ ] Verify functions created: `get_node_context`, `count_child_nodes`

### 2️⃣ Clerk Configuration (3 minutes)
- [ ] Go to [Clerk Dashboard](https://dashboard.clerk.com)
- [ ] Navigate to: **JWT Templates**
- [ ] Click "New Template"
- [ ] Name it: `supabase` (exactly this name!)
- [ ] Add these claims:
```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "user_metadata": {
    "clerk_id": "{{user.id}}"
  }
}
```
- [ ] Set token lifetime: 60 seconds (or your preference)
- [ ] Click "Apply Changes"

### 3️⃣ Environment Variables (2 minutes)
- [ ] Create `.env.local` in project root
- [ ] Add these variables:

```env
# Clerk (from dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs (these should be correct already)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase (from app.supabase.com → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx

# OpenAI (from platform.openai.com/api-keys)
OPENAI_API_KEY=sk-xxxxx
```

### 4️⃣ Install & Run (1 minute)
- [ ] Open terminal in project root
- [ ] Run: `npm install`
- [ ] Run: `npm run dev`
- [ ] Open browser to: `http://localhost:3000`

### 5️⃣ Test It Out! (1 minute)
- [ ] Navigate to `/notes` page
- [ ] Type a message: "Hello, explain what you can do"
- [ ] Press Enter
- [ ] Watch redirect to `/notes/[id]`
- [ ] See your message appear in the node
- [ ] Wait for AI response
- [ ] Click branch button to create child node
- [ ] Send message in child node
- [ ] Verify it has context from parent

## ✅ Success Indicators

You'll know it's working when:
1. ✅ Input clears after submission
2. ✅ Redirects to notes/[uuid] page
3. ✅ React Flow canvas appears with one node
4. ✅ Your message shows in the node
5. ✅ AI response appears after a few seconds
6. ✅ Branch button creates new connected node
7. ✅ Can drag nodes around
8. ✅ Positions save automatically

## ❌ Common Issues

### "Cannot find module @/components/flow-canvas"
**Solution:** Restart TypeScript server
```
VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### "Unauthorized" errors in Supabase
**Solution:** Check Clerk JWT template
- Must be named exactly "supabase"
- Claims must include user.id
- Verify in Clerk dashboard

### "Failed to create note" error
**Solution:** Check database
- Run DATABASE_SCHEMA.sql again
- Verify RLS policies exist
- Check Supabase logs for errors

### AI not responding
**Solution:** Check OpenAI
- Verify API key is valid
- Check you have credits
- Look at browser console for errors
- Check server logs

### Nodes not appearing
**Solution:** Check browser console
- Look for React Flow errors
- Verify data is loading
- Check network tab for failed requests

## 🆘 Getting Help

### Check These First
1. Browser console (F12)
2. Terminal/server logs
3. Supabase dashboard → Logs
4. Network tab (failed requests)

### Debug Checklist
- [ ] All environment variables set?
- [ ] Database tables created?
- [ ] Clerk JWT template named "supabase"?
- [ ] OpenAI API key valid?
- [ ] Dev server running?
- [ ] No console errors?

### Verify Database
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM notes;
SELECT COUNT(*) FROM nodes;
SELECT COUNT(*) FROM messages;
```

Should return 0 for all (if you haven't created notes yet).

### Verify RLS
```sql
-- Check policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('notes', 'nodes', 'messages');
```

Should return multiple policies.

## 📚 Documentation

- **Full Setup Guide:** `SETUP_GUIDE.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- **Database Schema:** `DATABASE_SCHEMA.sql`

## 🎯 What You Should See

### Notes Landing Page (/notes)
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         ┌────────────────┐          │
│         │ Ask a question │          │
│         │                │          │
│         └────────────────┘          │
│              [📎] [⬆️]              │
│                                     │
└─────────────────────────────────────┘
```

### Note Page (/notes/[id])
```
┌─────────────────────────────────────────────┐
│ Background Grid                             │
│                                             │
│  ┌─────────────────────┐                   │
│  │  Chat Node          │ [Branch]          │
│  ├─────────────────────┤                   │
│  │ 👤 User message     │                   │
│  │ 🤖 AI response      │                   │
│  ├─────────────────────┤                   │
│  │ Type message... [⬆️]│                   │
│  └─────────────────────┘                   │
│           │                                 │
│           ↓ (animated edge)                │
│  ┌─────────────────────┐                   │
│  │  Child Node         │                   │
│  └─────────────────────┘                   │
│                                             │
│ [Mini-map] [Controls]                      │
└─────────────────────────────────────────────┘
```

## 🎉 You're All Set!

Once all checkboxes are ticked, you have a fully functional node-based AI chat system!

**Time to explore branching conversations!** 🌳🤖

