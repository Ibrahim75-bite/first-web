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
    route("*", "routes/catch-all.tsx"),
] satisfies RouteConfig;
