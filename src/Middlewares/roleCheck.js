import { customError } from "../Utils/errorClass.js"


export const roleCheck = (...roles)=> {
  
  return (req, res, next)=> {

    if (!req.user) {
      throw new customError(401, "Authentication required")
    }

    if ( !roles.includes(req.user.role)) {
      throw new customError(403, "You are not Authorized")
    }
    // console.log(roles)
    next()
  }
}


// export const roleCheck = (...roles)=> {
  
//   return
//     console.log(roles)
//   }
