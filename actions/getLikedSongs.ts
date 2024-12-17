import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async(): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: () => cookies(),
    })

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("Error fetching user:", userError?.message || "User not authenticated");
        return [];
    }

    const {data, error} = await supabase
                                    .from('liked_songs')
                                    .select('*, songs(*)')
                                    .eq('user_id', user.id)
                                    .order('created_at', {ascending: false})

    if (error) {
        console.error("Error fetching liked songs:", error.message);
        return [];
    }

    if (!data) {
        return [];
    }

    return data.map((item) =>({
        ...item.songs
    }))
}

export default getLikedSongs;