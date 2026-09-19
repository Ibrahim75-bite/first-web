// Supabase client and query helpers for El-Muttahida Storefront

export const SUPABASE_URL = "https://etcixbbaxufikmixboej.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Y2l4YmJheHVmaWttaXhib2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MzgyMzIsImV4cCI6MjEwNTExNDIzMn0.l7c-HYRf101WEfOY48WKiZRZWqw18uhMLh55ecAMZjY";

export interface BundlePiece {
    piece_number: number;
    name_en: string;
    name_ar: string;
    dimensions_cm: string | null;
    weight_kg: number | null;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    product_code: string;
    sku: string;
    material_code: string;
    color_code: string;
    color_en: string;
    color_ar: string;
    weight_kg: number | null;
    length_cm: number | null;
    width_cm: number | null;
    height_cm: number | null;
    price: number;
    image_url: string;
}

export interface SupabaseProduct {
    id: string;
    product_code: string;
    handle: string;
    name_en: string;
    name_ar: string;
    short_desc_en: string | null;
    short_desc_ar: string | null;
    long_desc_en: string | null;
    long_desc_ar: string | null;
    is_bundle: boolean;
    bundle_pieces: BundlePiece[];
    primary_image: string;
    images: string[];
    base_price: number;
    status: string;
    category: string;
    tags: string[];
    material_code: string;
    product_variants?: ProductVariant[];
    created_at: string;
    updated_at: string;
}

const defaultHeaders = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
};

/**
 * Fetch a paginated list of products from Supabase with optional search and filters
 */
export async function fetchProducts(options: {
    search?: string;
    category?: string;
    tag?: string;
    page?: number;
    limit?: number;
} = {}): Promise<{ data: SupabaseProduct[]; total: number; totalPages: number }> {
    const page = options.page || 1;
    const limit = options.limit || 24;
    const offset = (page - 1) * limit;

    let url = `${SUPABASE_URL}/rest/v1/products?select=*,product_variants(*)&order=product_code.asc&limit=${limit}&offset=${offset}`;

    if (options.search && options.search.trim()) {
        const q = options.search.trim().replace(/[*%]/g, "");
        url += `&or=(product_code.ilike.*${encodeURIComponent(q)}*,name_en.ilike.*${encodeURIComponent(q)}*,name_ar.ilike.*${encodeURIComponent(q)}*)`;
    }

    if (options.category && options.category.trim() && options.category !== "All") {
        url += `&category=eq.${encodeURIComponent(options.category.trim())}`;
    }

    if (options.tag && options.tag.trim()) {
        url += `&tags=cs.{${encodeURIComponent(options.tag.trim())}}`;
    }

    try {
        const res = await fetch(url, {
            headers: {
                ...defaultHeaders,
                "Prefer": "count=exact",
            },
        });

        if (!res.ok) {
            console.error("Supabase fetchProducts failed:", res.status, await res.text());
            return { data: [], total: 0, totalPages: 1 };
        }

        const data: SupabaseProduct[] = await res.json();
        const contentRange = res.headers.get("content-range");
        let total = data.length;
        if (contentRange) {
            const parts = contentRange.split("/");
            if (parts.length === 2 && !isNaN(Number(parts[1]))) {
                total = parseInt(parts[1], 10);
            }
        }

        const totalPages = Math.max(1, Math.ceil(total / limit));
        return { data, total, totalPages };
    } catch (err) {
        console.error("Error fetching products from Supabase:", err);
        return { data: [], total: 0, totalPages: 1 };
    }
}

/**
 * Fetch a single product by handle, slug, or product code
 */
export async function fetchProductBySlug(slugOrCode: string): Promise<{
    product: SupabaseProduct | null;
    variants: ProductVariant[];
    recommended: SupabaseProduct[];
}> {
    const cleanParam = decodeURIComponent(slugOrCode || "").trim();
    if (!cleanParam) {
        return { product: null, variants: [], recommended: [] };
    }

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanParam);
    let url = isUUID
        ? `${SUPABASE_URL}/rest/v1/products?id=eq.${cleanParam}&select=*,product_variants(*)&limit=1`
        : `${SUPABASE_URL}/rest/v1/products?or=(handle.eq.${encodeURIComponent(cleanParam)},product_code.eq.${encodeURIComponent(cleanParam.toUpperCase())},product_code.eq.${encodeURIComponent(cleanParam)})&select=*,product_variants(*)&limit=1`;

    try {
        const res = await fetch(url, { headers: defaultHeaders });
        if (!res.ok) {
            return { product: null, variants: [], recommended: [] };
        }

        const list: SupabaseProduct[] = await res.json();
        const product = list[0] || null;

        if (!product) {
            return { product: null, variants: [], recommended: [] };
        }

        const variants = product.product_variants || [];

        // Fetch 3 recommended products from same category or general collection
        let recommendedUrl = `${SUPABASE_URL}/rest/v1/products?id=neq.${product.id}&select=*,product_variants(*)&limit=3`;
        if (product.category) {
            recommendedUrl += `&category=eq.${encodeURIComponent(product.category)}`;
        }

        let recommended: SupabaseProduct[] = [];
        try {
            const recRes = await fetch(recommendedUrl, { headers: defaultHeaders });
            if (recRes.ok) {
                recommended = await recRes.json();
            }
        } catch {
            // ignore recommended fetch failure
        }

        // If category recommendation returned fewer than 3, fetch any other products
        if (recommended.length < 3) {
            try {
                const fallbackUrl = `${SUPABASE_URL}/rest/v1/products?id=neq.${product.id}&select=*,product_variants(*)&limit=3`;
                const fbRes = await fetch(fallbackUrl, { headers: defaultHeaders });
                if (fbRes.ok) {
                    recommended = await fbRes.json();
                }
            } catch {
                // ignore
            }
        }

        return { product, variants, recommended };
    } catch (err) {
        console.error("Error fetching product by slug from Supabase:", err);
        return { product: null, variants: [], recommended: [] };
    }
}

/**
 * Fetch all products for Admin Dashboard
 */
export async function fetchAllProductsAdmin(): Promise<SupabaseProduct[]> {
    const url = `${SUPABASE_URL}/rest/v1/products?select=*,product_variants(*)&order=product_code.asc&limit=100`;
    try {
        const res = await fetch(url, { headers: defaultHeaders });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("Error fetching admin products from Supabase:", err);
        return [];
    }
}

/**
 * Update a product in Supabase
 */
export async function updateProduct(id: string, updates: Partial<SupabaseProduct>): Promise<boolean> {
    const url = `${SUPABASE_URL}/rest/v1/products?id=eq.${id}`;
    try {
        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                ...defaultHeaders,
                "Prefer": "return=minimal",
            },
            body: JSON.stringify({
                ...updates,
                updated_at: new Date().toISOString(),
            }),
        });
        return res.ok;
    } catch (err) {
        console.error("Error updating product in Supabase:", err);
        return false;
    }
}
