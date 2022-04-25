import { DiscountModes } from './../../enums/discountModes';
import express from "express";
import { check, validationResult } from "express-validator";
import moment from "moment";
import Coupon from "../../models/coupon.model";
import couponController from '../../controllers/coupon.controller';

const couponRouter = express.Router()

const rootKeyCheck = [
    check('coupon', 'Coupon data missing')
        .not()
        .isEmpty()
]
const amountKeyCheck = [
    check('amount', 'Amount is missing')
        .not()
        .isEmpty()
]

couponRouter
    .get("", couponController.index)
    .post("", rootKeyCheck, couponController.create)
    .post("/validity/:id", amountKeyCheck, couponController.couponValiditation)

export default couponRouter