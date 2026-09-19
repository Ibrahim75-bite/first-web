import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx"),
    route("terms", "routes/terms.tsx"),
    route("terms-of-service", "routes/terms.tsx", { id: "routes/terms-of-service" }),
    route("about", "routes/about.tsx"),
    route("manufacturing", "routes/manufacturing.tsx"),
    route("sustainability", "routes/sustainability.tsx"),
    route("careers", "routes/careers.tsx"),
    route("contact", "routes/contact.tsx"),
    route("shipping", "routes/shipping.tsx"),
    route("wholesale", "routes/wholesale.tsx"),
    route("faq", "routes/faq.tsx"),
    route("blog", "routes/blog._index.tsx"),
    route("blog/:slug", "routes/blog.$slug.tsx"),
    route("catalogue", "routes/catalogue.tsx"),
    route("products/vases", "routes/products-vases.tsx"), // alias to catalogue
    route("product/:slug", "routes/product.$slug.tsx"),
    route("cart", "routes/cart.tsx"),
    route("products/custom-finishes", "routes/custom-finishes.tsx"),
    // Admin Routes
    layout("routes/admin/_layout.tsx", [
        route("admin", "routes/admin._index.tsx"),
        route("admin/products", "routes/admin.products._index.tsx"),
        route("admin/products/new", "routes/admin.products.new.tsx"),
        route("admin/products/:id", "routes/admin.products.edit.tsx"),
        route("admin/categories", "routes/admin.categories._index.tsx"),
        route("admin/orders", "routes/admin.orders._index.tsx"),
        route("admin/settings", "routes/admin.settings._index.tsx"),
    ]),

    route("*", "routes/catch-all.tsx"),
] satisfies RouteConfig;
