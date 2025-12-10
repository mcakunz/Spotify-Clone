import { Song } from "@/types";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const getSongs = async (): Promise<Song[]> => {
    const cookieStore = await cookies(); 

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                }
            }
        }
    );

    const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) console.log(error);

    return data ?? [];
};

export default getSongs;
