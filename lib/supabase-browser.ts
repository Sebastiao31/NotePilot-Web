import { createClient } from "@supabase/supabase-js";

export const createSupabaseClientBrowser = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};

// Client-side Supabase client with Clerk JWT for RLS and Realtime
export const createSupabaseClientBrowserAuthed = (token: string) => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            realtime: {
                params: {
                    eventsPerSecond: 5,
                },
            },
        }
    );
};


