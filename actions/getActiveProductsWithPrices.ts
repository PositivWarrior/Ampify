import { ProductWithPrice } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
    try {
        const supabase = createServerComponentClient({ cookies });

        const { data, error } = await supabase
            .from('products')
            .select('*, prices(*)')
            .eq('active', true)
            .eq('prices.active', true)
            .order('metadata->index') // Ensure metadata consistency
            .order('unit_amount', { foreignTable: 'prices' });

        if (error) {
            console.error('Supabase query failed:', {
                message: error.message,
                hint: error.hint,
                details: error.details,
            });
            throw new Error(`Supabase query failed: ${error.message}`);
        }

        if (!Array.isArray(data)) {
            console.error('Unexpected response format:', data);
            return [];
        }

        return data;
    } catch (error: any) {
        console.error('Error fetching products with prices:', error.message);
        return [];
    }
};

export default getActiveProductsWithPrices;
