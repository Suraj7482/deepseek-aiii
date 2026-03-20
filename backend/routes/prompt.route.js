import express from 'express'
import { sendPrompt } from '../controller/prompt.controller.js'
import { verifyToken } from '../model/verifyToken.js'

const router=express.Router()

router.post("/prompt", verifyToken, sendPrompt)



export default router; 