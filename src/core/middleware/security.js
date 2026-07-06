import helmet from "helmet";

export const cookieParamsMiddleware = (req, res, next) => {
    const list = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        cookieHeader.split(";").forEach(cookie => {
            let [name, ...rest] = cookie.split("=");
            name = name.trim();
            if (!name) return;
            const val = rest.join("=").trim();
            try {
                list[name] = decodeURIComponent(val);
            } catch (err) {
                list[name] = val;
            }
        });
    }
    req.cookies = list;
    next();
};

export const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
});

export const securityHeadersMiddleware = (req, res, next) => {
    // Explicit server disclosure cleanup
    res.removeHeader("X-Powered-By");
    res.setHeader("Server", "Webserver");

    // Block browser features (camera, mic, geo) to prevent sensor hijacking
    res.setHeader(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    );

    // Disable caching for api responses to avoid caching sensitive user details
    if (req.path.startsWith("/api/")) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
    }

    next();
};
