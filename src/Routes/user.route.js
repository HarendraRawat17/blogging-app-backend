import express from "express";
import {registerUserController, otpVerificationController, loginController, postBlogController, getUserDetailsController, getSingleBlogController, updateBlogController, getAllBlogsController, deletBlogController} from "../Controllers/user.controller.js";
import expressAsyncHandler from "express-async-handler";
import authCheck from "../Middlewares/authcheck.js";
import { roleCheck } from "../Middlewares/roleCheck.js";
// import { limiter } from "../Services/ratelimiter.js";




export const userRoute = express.Router()


userRoute.post("/register",expressAsyncHandler( registerUserController));
// userRoute.get("/login", loginUserController) 

userRoute.post("/otp-verify", expressAsyncHandler(otpVerificationController));

userRoute.post("/login", expressAsyncHandler(loginController));


userRoute.get("/get-details/:userId", authCheck,roleCheck("admin","user"), expressAsyncHandler(getUserDetailsController));



userRoute.post("/post-blog/:userId", authCheck, roleCheck("admin","user"), expressAsyncHandler(postBlogController));  



userRoute.get("/get-blog/:id", expressAsyncHandler(getSingleBlogController));
userRoute.put("/update-blog/:id", expressAsyncHandler(updateBlogController));
userRoute.delete("/delete-blog/:id", expressAsyncHandler(deletBlogController));




userRoute.get("/all-blogs", expressAsyncHandler(getAllBlogsController));




// test api for file upload
import multer from "multer";
import { upload } from "../Services/upload.js";


userRoute.post("/upload", upload.single("profile"), async(req, res)=> {
console.log("upload api")
try {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "Image uploaded successfully",
    imageUrl: req.file.path, // This is Your cloudinary URL
    public_id: req.file.filename, // useful for delete later
  })
} catch (error) {
  res.status(500).json({ error: error.message })
}
});