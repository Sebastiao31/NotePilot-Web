import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const createSupabaseClient = async () => {
    const session = await auth();
    
    try {
        const token = await session.getToken({ template: "supabase" });

        if (!token) {
            throw new Error(
                'Failed to get Supabase token. Please create a JWT template named "supabase" in your Clerk dashboard.'
            );
        }

        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            }
        );
    } catch (error) {
        console.error("Supabase client error:", error);
        throw new Error(
            '❌ Clerk JWT Template Missing!\n\n' +
            'Create a JWT template in Clerk:\n' +
            '1. Go to: https://dashboard.clerk.com\n' +
            '2. Click "JWT Templates"\n' +
            '3. Click "+ New template"\n' +
            '4. SELECT "Supabase" from template options\n' +
            '5. Name it: "supabase" (lowercase)\n' +
            '6. Save!\n\n' +
            'OR create a blank template named "supabase" with claims:\n' +
            '{ "aud": "authenticated", "role": "authenticated" }'
        );
    }
};


