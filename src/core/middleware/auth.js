import jwt from "jsonwebtoken";
import config from "../../config/index.js";
import { AuthenticationError } from "../common/error.js";
import { setContextUser } from "../common/context.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn(`Unauthorized attempt: No token provided from IP ${req.ip}`);
        return next(new AuthenticationError("Unauthorized: No token provided"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = decoded;

        // Propagate user details to asynchronous request context for audit trails
        setContextUser(decoded.id, decoded.username);
        
        next();
    } catch (err) {
        console.warn(`Invalid token attempt: ${err.message} from IP ${req.ip}`);
        if (err.name === "TokenExpiredError") {
            return next(new AuthenticationError("Token expired, please login again"));
        }
        return next(new AuthenticationError("Invalid token"));
    }
};

export default authMiddleware;
