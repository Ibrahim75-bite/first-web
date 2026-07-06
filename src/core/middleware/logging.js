import morgan from "morgan";

// Morgan request logger configuration
export const morganMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms");

// Correlation / timing injector
export const responseTimerMiddleware = (req, res, next) => {
    req._startTime = Date.now();
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        const elapsed = Date.now() - req._startTime;
        res.set("X-Response-Time", `${elapsed}ms`);
        return originalJson(body);
    };
    next();
};
