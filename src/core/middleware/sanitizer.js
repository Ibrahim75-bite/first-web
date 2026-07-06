export const sanitizeMiddleware = (req, res, next) => {
    if (req.body && typeof req.body === "object") {
        const trimStrings = (obj) => {
            for (const key of Object.keys(obj)) {
                if (typeof obj[key] === "string") {
                    obj[key] = obj[key].trim();
                } else if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                    trimStrings(obj[key]);
                }
            }
        };
        trimStrings(req.body);
    }
    next();
};

export default sanitizeMiddleware;
