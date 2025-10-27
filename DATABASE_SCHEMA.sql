-- =============================================
-- NODE-BASED AI CHAT SYSTEM - DATABASE SCHEMA
-- =============================================
-- Copy and paste this entire file into your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Notes: Top-level container for chat sessions
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID (string, not UUID)
    title TEXT NOT NULL DEFAULT 'Untitled Note',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Nodes: Individual chat nodes that can branch
CREATE TABLE nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
    title TEXT,
    x FLOAT NOT NULL DEFAULT 0,
    y FLOAT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_not_self_parent CHECK (id != parent_id)
);

-- Messages: Chat messages within each node
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    model TEXT,
    token INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

CREATE INDEX idx_nodes_note_id ON nodes(note_id);
CREATE INDEX idx_nodes_parent_id ON nodes(parent_id);
CREATE INDEX idx_nodes_created_at ON nodes(created_at DESC);

CREATE INDEX idx_messages_node_id ON messages(node_id);
CREATE INDEX idx_messages_created_at ON messages(node_id, created_at);
CREATE INDEX idx_messages_role ON messages(role);
CREATE INDEX idx_messages_metadata ON messages USING GIN (metadata);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Notes RLS Policies (using Clerk JWT)
CREATE POLICY "Users can view their own notes"
    ON notes FOR SELECT
    USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own notes"
    ON notes FOR INSERT
    WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own notes"
    ON notes FOR UPDATE
    USING (auth.jwt() ->> 'sub' = user_id)
    WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete their own notes"
    ON notes FOR DELETE
    USING (auth.jwt() ->> 'sub' = user_id);

-- Nodes RLS Policies (using Clerk JWT)
CREATE POLICY "Users can view nodes from their notes"
    ON nodes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = nodes.note_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can insert nodes to their notes"
    ON nodes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = nodes.note_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can update nodes from their notes"
    ON nodes FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = nodes.note_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = nodes.note_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can delete nodes from their notes"
    ON nodes FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.id = nodes.note_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    );

-- Messages RLS Policies (using Clerk JWT)
CREATE POLICY "Users can view messages from their nodes"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM nodes
            INNER JOIN notes ON notes.id = nodes.note_id
            WHERE nodes.id = messages.node_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can insert messages to their nodes"
    ON messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nodes
            INNER JOIN notes ON notes.id = nodes.note_id
            WHERE nodes.id = messages.node_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can update messages from their nodes"
    ON messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM nodes
            INNER JOIN notes ON notes.id = nodes.note_id
            WHERE nodes.id = messages.node_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nodes
            INNER JOIN notes ON notes.id = nodes.note_id
            WHERE nodes.id = messages.node_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can delete messages from their nodes"
    ON messages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM nodes
            INNER JOIN notes ON notes.id = nodes.note_id
            WHERE nodes.id = messages.node_id
            AND notes.user_id = (auth.jwt() ->> 'sub')
        )
    );

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nodes_updated_at
    BEFORE UPDATE ON nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Get full conversation context by traversing node tree
CREATE OR REPLACE FUNCTION get_node_context(target_node_id UUID)
RETURNS TABLE (
    node_id UUID,
    depth INTEGER,
    message_id UUID,
    role TEXT,
    content TEXT,
    model TEXT,
    created_at TIMESTAMPTZ
) AS $$
WITH RECURSIVE node_path AS (
    -- Base: Start with target node
    SELECT 
        id,
        parent_id,
        0 AS depth
    FROM nodes
    WHERE id = target_node_id
    
    UNION ALL
    
    -- Recursive: Get parent nodes
    SELECT 
        n.id,
        n.parent_id,
        np.depth + 1
    FROM nodes n
    INNER JOIN node_path np ON n.id = np.parent_id
)
SELECT 
    np.id AS node_id,
    np.depth,
    m.id AS message_id,
    m.role,
    m.content,
    m.model,
    m.created_at
FROM node_path np
INNER JOIN messages m ON m.node_id = np.id
ORDER BY np.depth DESC, m.created_at ASC;
$$ LANGUAGE sql STABLE;

-- Count child nodes
CREATE OR REPLACE FUNCTION count_child_nodes(parent_node_id UUID)
RETURNS INTEGER AS $$
    SELECT COUNT(*)::INTEGER
    FROM nodes
    WHERE parent_id = parent_node_id;
$$ LANGUAGE sql STABLE;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE notes IS 'Top-level container for node-based chat sessions';
COMMENT ON TABLE nodes IS 'Individual chat nodes that can branch from parent nodes';
COMMENT ON TABLE messages IS 'Chat messages within each node';
COMMENT ON COLUMN nodes.parent_id IS 'Reference to parent node, NULL for root nodes';
COMMENT ON COLUMN nodes.x IS 'X coordinate for React Flow positioning';
COMMENT ON COLUMN nodes.y IS 'Y coordinate for React Flow positioning';
COMMENT ON COLUMN messages.role IS 'Message role: user, assistant, or system';
COMMENT ON COLUMN messages.token IS 'Token count for the message';
COMMENT ON COLUMN messages.metadata IS 'Flexible JSONB field for additional data';

