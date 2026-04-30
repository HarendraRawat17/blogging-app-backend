import { customError } from "../Utils/errorClass.js";
import jwt from "jsonwebtoken";


const authCheck = async(req, res, next) => {

  try {
    
    // const token = req.headers.authorization.split(" ")[1];
    // console.log(token)

    const token = req.cookies.token;
    console.log("authchekmiddleware")
    console.log(token)


    if ( !token ) {
      throw new customError(400, "Token not found");
    }

    const decoded = jwt.verify( token, process.env.JWT_SECRET);

    if ( !decoded ){
      throw new customError(400, "Not a valid token");
    }
    // console.log(decoded)
     req.user = decoded;  // Imp line of CODE

    next();

  } catch (error) {
    
    throw new customError(500, error.message)
  }
}

export default authCheck;