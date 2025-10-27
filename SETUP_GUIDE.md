# Node-Based AI Chat System - Setup Guide

## Overview

This project implements a node-based AI chat system using React Flow, where users can branch conversations without losing context. Each node represents a chat session that inherits the full conversation history from its parent nodes.

## Architecture

### Database Schema

```
Notes (Top-level container)
  ├── id
  ├── user_id
  ├── title
  ├── created_at
  └── updated_at

Nodes (Individual chat nodes that can branch)
  ├── id
  ├── note_id (FK to Notes)
  ├── parent_id (FK to Nodes, NULL for root)
  ├── title
  ├── x (React Flow position)
  ├── y (React Flow position)
  ├── created_at
  └── updated_at

Messages (Chat messages within each node)
  ├── id
  ├── node_id (FK to Nodes)
  ├── role (user, assistant, system)
  ├── content
  ├── model
  ├── token
  ├── metadata (JSONB)
  └── created_at
```

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **Flow Diagram**: React Flow
- **UI**: Tailwind CSS + Radix UI

## Setup Instructions

### 1. Database Setup

1. Go to your Supabase SQL Editor
2. Copy and paste the entire SQL code from the database schema (provided separately)
3. Execute the SQL to create:
   - Tables (notes, nodes, messages)
   - Indexes for performance
   - Row Level Security (RLS) policies
   - Helper functions (get_node_context, count_child_nodes)
   - Triggers for auto-updating timestamps

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### 3. Clerk JWT Template Setup

**Important:** You need to configure Clerk to issue Supabase-compatible JWTs.

1. Go to Clerk Dashboard → JWT Templates
2. Create a new template called "supabase"
3. Add the following claims:

```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "user_metadata": {
    "clerk_id": "{{user.id}}"
  }
}
```

4. Set the token lifetime to match your needs (default: 60 seconds)

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

## How It Works

### User Flow

1. **Create Note**: User types a message on `/notes` page
2. **Auto-redirect**: Automatically redirected to `/notes/[id]` 
3. **AI Processing**: Initial AI response is generated automatically
4. **Branch Conversations**: Click the branch button on any node to create a child node
5. **Context Inheritance**: Child nodes inherit full conversation history from parent chain

### Key Features

#### 1. Seamless Note Creation
- User types in main input
- Loading state with spinner
- Instant redirect to new note
- AI starts processing immediately

#### 2. React Flow Canvas
- Visual representation of conversation tree
- Drag nodes to organize
- Animated edges between parent/child
- Mini-map for navigation
- Zoom controls

#### 3. Chat Nodes
- Each node is a self-contained chat
- Scroll through message history
- Send new messages
- Branch to explore alternatives
- Real-time AI responses

#### 4. Context Management
- PostgreSQL recursive function `get_node_context()`
- Traverses tree from current node to root
- Combines all messages in order
- Sends full context to AI

#### 5. Branching
- Click branch button on any node
- Creates child node positioned below parent
- Inherits parent's context automatically
- Explore different conversation paths

## File Structure

```
app/
├── (app)/
│   ├── notes/
│   │   ├── page.tsx              # Main notes landing page
│   │   └── [id]/
│   │       └── page.tsx          # React Flow canvas page
│
components/
├── main-input.tsx                # Main input component
├── chat-node.tsx                 # Custom React Flow node
└── flow-canvas.tsx               # React Flow orchestration
│
lib/
├── actions/
│   ├── notes.ts                  # Note/Node/Message CRUD
│   └── ai.ts                     # OpenAI integration
├── supabase.ts                   # Supabase client
└── types.ts                      # TypeScript types
```

## API Functions

### Server Actions (lib/actions/notes.ts)

- `createNoteWithMessage(message)` - Create note + root node + initial message
- `getNoteById(noteId)` - Fetch note
- `getNodesByNoteId(noteId)` - Get all nodes for a note
- `getMessagesByNodeId(nodeId)` - Get messages for a node
- `createChildNode(noteId, parentId, x, y)` - Branch conversation
- `createMessage(nodeId, role, content)` - Add message
- `updateNodePosition(nodeId, x, y)` - Update position on drag
- `getNodeContext(nodeId)` - Get full context for AI

### AI Functions (lib/actions/ai.ts)

- `processAIMessage(nodeId)` - Generate AI response
- `streamAIMessage(nodeId)` - Stream AI response (future enhancement)

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own notes
- Users can only access nodes belonging to their notes
- Users can only access messages from their nodes
- All operations (SELECT, INSERT, UPDATE, DELETE) are protected

### Authentication Flow

1. Clerk authenticates user
2. Clerk issues JWT with custom Supabase template
3. JWT passed to Supabase in Authorization header
4. Supabase validates JWT and enforces RLS
5. `auth.uid()` in policies checks user ownership

## Troubleshooting

### TypeScript Errors

If you see "Cannot find module" errors after creating files:
```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Supabase Connection Issues

- Verify environment variables are set
- Check Clerk JWT template is named "supabase"
- Ensure Supabase RLS policies are created
- Check browser console for auth errors

### AI Not Responding

- Verify OpenAI API key is valid
- Check console for API errors
- Ensure `OPENAI_API_KEY` is in `.env.local`
- Verify you have OpenAI credits

### Nodes Not Saving Position

- Check browser console for errors
- Verify `updateNodePosition` server action is working
- Check Supabase logs for permission errors

## Future Enhancements

- [ ] Real-time streaming AI responses
- [ ] Export conversation branches
- [ ] Share public note links
- [ ] Collaborative editing
- [ ] Different AI models per node
- [ ] System prompts per node
- [ ] Rich text formatting in messages
- [ ] Image/file attachments
- [ ] Search across all notes
- [ ] Node templates

## Performance Considerations

- Messages are loaded per-node (not all at once)
- Indexes on foreign keys for fast queries
- RLS policies use efficient JOIN queries
- React Flow virtualization for many nodes
- Optimistic UI updates for instant feedback

## License

MIT

