import { AsyncLocalStorage } from "async_hooks";
import crypto from "crypto";

export const requestContextStore = new AsyncLocalStorage();

export const requestContextMiddleware = (req, res, next) => {
    // Generate unique Request ID if not provided
    const requestId = req.headers["x-request-id"] || crypto.randomUUID();
    res.setHeader("X-Request-Id", requestId);

    const context = {
        requestId,
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
        userId: null,
        username: null
    };

    requestContextStore.run(context, () => {
        req.context = context;
        next();
    });
};

export const getRequestContext = () => {
    return requestContextStore.getStore() || {};
};

export const setContextUser = (userId, username) => {
    const store = requestContextStore.getStore();
    if (store) {
        store.userId = userId;
        store.username = username;
    }
};
