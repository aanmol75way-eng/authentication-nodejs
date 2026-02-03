import express from "express"
import { userLogin, userRegister, verifyEmail} from "./userAuthControllers"
let userAuthRoute=express.Router()

userAuthRoute.post('/register',userRegister) 
userAuthRoute.get('/verify-email/:token',verifyEmail)
userAuthRoute.post('/login',userLogin)
export default userAuthRoute