import { Song } from "@/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

const getSongsByUserId = async (): Promise<Song[]> => {


  const supabase = createServerComponentClient({
      cookies: cookies
  });

  
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

  return (data as any) || [];
};

export default getSongsByUserId;
