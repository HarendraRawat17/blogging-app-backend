import jwt from "jsonwebtoken";
import { customError } from "../Utils/errorClass.js";

// 1. No need to wrap in expressAsyncHandler here; 
// regular middlewares should use try-catch and next(err)
const authCheck = async (req, res, next) => {
  try {
    console.log("--- AuthCheck Middleware Started ---");
    
    // 2. Defensive check for req.cookies (prevents undefined crash)
    const token = req.cookies ? req.cookies.token : null;

    if (!token) {
      console.log("Auth Error: No token found in cookies");
      // 3. Return a clean 401 instead of letting the app crash
      return res.status(401).json({ 
        status: "error", 
        message: "Authentication required. Please login again." 
      });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      throw new customError(401, "Invalid or expired token");
    }

    // Attach user data to request object
    req.user = decoded;
    console.log("Auth Success: User authenticated");
    
    next();
  } catch (error) {
    console.error("AuthCheck Error:", error.message);
    
    // 5. Pass the error to your 4-argument global handler
    if (error.name === "JsonWebTokenError") {
      return next(new customError(401, "Invalid token signature"));
    }
    next(error);
  }
};

export default authCheck;
