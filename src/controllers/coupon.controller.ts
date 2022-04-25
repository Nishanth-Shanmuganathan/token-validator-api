import { validationResult } from "express-validator"
import moment from "moment"
import { DiscountModes } from "../enums/discountModes"
import Coupon from "../models/coupon.model"

const index = async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort({ _id: -1 })
        res.status(200).json({ coupons })
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res
                .status(500)
                .json({ error: errors.array()[0].msg });

        const payload = req.body && req.body["coupon"]
        const data = new Coupon(payload)
        const coupon = await data.save()
        res.status(201).json({ coupon, message: "Coupon created successfully!" })
    } catch (error) {
        next(error)
    }
}

const couponValiditation = async (req, res, next) => {
    try {
        const couponId = req.params.id
        const amount = req.body.amount || 0
        const coupon = await Coupon.findById(couponId)

        if (!coupon) throw new Error("Invalid coupon!")

        if (coupon.minimum_order_value > amount)
            return res.status(200).json({ success: false, message: `Oops! Cart value is too low to avail this coupon` })

        const success = moment(coupon.valid_till) >= moment()
        if (!success) return res.status(200).json({ success, message: `Oops! Coupon expired` })

        const discountAmount = coupon.discount_mode === DiscountModes.PERCENTAGE
            ? (amount * coupon.discount / 100) > coupon.maximum_discount_value
                ? coupon.maximum_discount_value
                : amount * coupon.discount / 100
            : coupon.flat

        const message = `Hurray! Coupon applied!! You can save ₹${Math.floor(discountAmount)} on this order`

        res.status(200).json({ success, message })
    } catch (error) {
        next(error)
    }
}

export default {
    index,
    create,
    couponValiditation,
}