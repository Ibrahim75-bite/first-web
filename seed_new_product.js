import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function seedProduct() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const modelCode = 'U0002-PN05-SET';
        const sku = 'U0002-PN05-WHT-GOLD';
        const weight = 3.2; // approx weight for 3 pcs
        const height = 28; // max height of tallest piece

        const nameEn = 'Speckled Gold Donut Vase (3-Piece Set)';
        const nameAr = 'طقم مزهريات سيراميك منقط بلمسة ذهبية (٣ قطع)';
        const materialEn = 'Ceramic';
        const materialAr = 'سيراميك';
        const descEn = 'A beautifully handcrafted 3-piece set of modern ceramic donut vases. Features a stunning speckled gold finish, perfect for minimalist and contemporary spaces.';
        const descAr = 'طقم مكون من ٣ مزهريات دائرية (دونات) بتصميم عصري من السيراميك. يتميز بتشطيب منقط باللون الذهبي الرائع، مثالي للمساحات البسيطة والمعاصرة.';
        const slugEn = 'speckled-gold-donut-vase-set';
        const slugAr = 'speckled-gold-donut-vase-set-ar';

        // 1. Insert or Get Product
        let res = await client.query('SELECT id FROM products WHERE model_code = $1', [modelCode]);
        let productId;
        if (res.rows.length === 0) {
            const insertProd = await client.query(
                'INSERT INTO products (model_code, weight, height) VALUES ($1, $2, $3) RETURNING id',
                [modelCode, weight, height]
            );
            productId = insertProd.rows[0].id;

            // Translations
            await client.query(
                `INSERT INTO product_translations
         (product_id, language_code, name, material, description, slug)
         VALUES
         ($1, 'en', $2, $3, $4, $5),
         ($1, 'ar', $6, $7, $8, $9)`,
                [productId, nameEn, materialEn, descEn, slugEn, nameAr, materialAr, descAr, slugAr]
            );
        } else {
            productId = res.rows[0].id;
            console.log(`Product ${modelCode} already exists, skipping base insertion.`);
        }

        // 2. Insert Variant
        res = await client.query('SELECT id FROM product_variants WHERE sku = $1', [sku]);
        let variantId;
        if (res.rows.length === 0) {
            const insertVar = await client.query(
                `INSERT INTO product_variants (product_id, sku, color_name_en, color_name_ar, color_code, min_order_qty)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [productId, sku, 'Speckled Gold', 'ذهبي منقط', '#d4af37', 1]
            );
            variantId = insertVar.rows[0].id;
        } else {
            variantId = res.rows[0].id;
            console.log(`Variant ${sku} already exists.`);
        }

        // 3. Insert Images (The 2 images as variants of the same sku)
        const images = ['speckled-set-lifestyle.jpg', 'speckled-set-studio.jpg'];
        for (let i = 0; i < images.length; i++) {
            const checkImg = await client.query(
                'SELECT id FROM variant_images WHERE variant_id = $1 AND image_name = $2',
                [variantId, images[i]]
            );
            if (checkImg.rows.length === 0) {
                await client.query(
                    'INSERT INTO variant_images (variant_id, image_name, display_order) VALUES ($1, $2, $3)',
                    [variantId, images[i], i + 1]
                );
            }
        }

        // 4. Insert Tags (assuming 'modern' and 'ceramic' exist, if not we add safely)
        const tags = ['modern', 'ceramic'];
        for (const tag of tags) {
            let tRes = await client.query('SELECT id FROM tags WHERE slug = $1', [tag]);
            let tagId;
            if (tRes.rows.length === 0) {
                let insertTag = await client.query('INSERT INTO tags (slug) VALUES ($1) RETURNING id', [tag]);
                tagId = insertTag.rows[0].id;
            } else {
                tagId = tRes.rows[0].id;
            }

            const checkProductTag = await client.query(
                'SELECT 1 FROM product_tags WHERE product_id = $1 AND tag_id = $2',
                [productId, tagId]
            );
            if (checkProductTag.rows.length === 0) {
                await client.query('INSERT INTO product_tags (product_id, tag_id) VALUES ($1, $2)', [productId, tagId]);
            }
        }

        await client.query('COMMIT');
        console.log('Successfully seeded the new product and variants.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Failed to seed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

seedProduct();
