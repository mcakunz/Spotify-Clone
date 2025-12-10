import { Song } from "@/types";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const getSongsByUserId = async (): Promise<Song[]> => {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.log(userError?.message || "User not logged in");
    return [];
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  console.log("USER FROM SERVER:", userData?.user);

  return (data as any) || [];
};

export default getSongsByUserId;
