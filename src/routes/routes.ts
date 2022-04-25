import express from "express";
import couponRouter from "./coupon/coupon.routes";

const appRouter = express.Router()

appRouter.use("/coupon", couponRouter)

export default appRouter