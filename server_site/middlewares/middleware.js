import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).send({
        msg: "Invalid authorization header",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          msg: "Auth failed",
          success: false,
        });
      } else {
        req.body.userId = decoded._id;
        next();
      }
    });
  } catch (error) {
    return res.status(401).send({
      msg: "Auth failed",
      success: false,
    });
  }
};
