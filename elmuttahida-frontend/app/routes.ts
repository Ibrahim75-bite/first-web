import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx"),
    route("blog", "routes/blog._index.tsx"),
    route("blog/:slug", "routes/blog.$slug.tsx"),
    route("catalogue", "routes/catalogue.tsx"),
    route("products/vases", "routes/products-vases.tsx"), // alias to catalogue
    route("product/:slug", "routes/product.$slug.tsx"),
    route("cart", "routes/cart.tsx"),
    route("products/custom-finishes", "routes/custom-finishes.tsx"), // Optional placeholder if needed
    // Admin Routes
    layout("routes/admin/_layout.tsx", [
        route("admin", "routes/admin._index.tsx"),
        route("admin/products", "routes/admin.products._index.tsx"),
        route("admin/products/new", "routes/admin.products.new.tsx"),
        route("admin/products/:id", "routes/admin.products.edit.tsx"),
    ]),

    route("*", "routes/catch-all.tsx"),
] satisfies RouteConfig;
