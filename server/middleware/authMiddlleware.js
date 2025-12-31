import jwt from "jsonwebtoken"; // ESM import

export function verifyUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        let token = null;

        if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res
                .status(401)
                .json({ error: "Unauthorized: token missing" });
        }

        const secret =
            process.env.JWT_SECRET || "replace_this_with_a_secure_secret";

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized: invalid token" });
            }
            req.user = decoded;
            next();
        });
    } catch (err) {
        return res
            .status(500)
            .json({ error: "Internal server error" });
    }
}
