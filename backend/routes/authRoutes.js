import express from "express";
import {protectRoute} from "../middelware/auth.middleware.js";
import {signup,login,logout} from "../controllers/auth.controller.js";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

//router.get("/user", (req, res) => {
//  if (req.user) {
//    return res.json(req.user);
//  }
//  res.status(401).json({ message: "Not authenticated" });
//});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    //res.json(req.user);
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // or 'none' + secure:true when needed
      maxAge: 7*24*60*60*1000
    });
    res.redirect("http://localhost:5173/login?oauth=google")
   }
);

router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
      return res.status(500).json({message:"Logout Failed"})
    }

    req.session.destroy(()=>{
      res.clearCookie("connect.sid");
      res.redirect(process.env.CLIENT_URL);
    });
  });
});


//check if user is logged in or not
router.get("/me", protectRoute, (req,res) => {
  res.status(200).json({success: true, user: req.user, token: req.token});
});

export default router;