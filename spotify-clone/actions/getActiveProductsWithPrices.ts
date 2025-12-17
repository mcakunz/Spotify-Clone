import { Song } from "@/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ProductWithPrice } from "@/types";

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
    const cookieStore = await cookies(); 

    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase
        .from("products")
        .select("*, prices(*)")
        .eq('active', true)
        .eq('prices.active', true)
        .order('metadata->index')
        .order("unit_amount", { foreignTable: 'prices' });

    if (error) console.log(error);

    return data ?? [];
};

export default getActiveProductsWithPrices;
