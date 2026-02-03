import express from 'express'
import userAuthRoute from './userauth/userAuthRoutes'
let webRoutes=express.Router()


webRoutes.use('/userauth',userAuthRoute)

export default  webRoutes