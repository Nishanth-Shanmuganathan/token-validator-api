import { DiscountModes } from './../enums/discountModes';
import mongoose from "mongoose";

function flatDiscountValidator() {
    return this.discount_mode === DiscountModes.FLAT
}

function percentageDiscountValidator() {
    return this.discount_mode === DiscountModes.PERCENTAGE
}

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Coupon code is required!"],
        unique: [true, "Coupon code already exists!"],
    },
    title: {
        type: String,
        required: [true, "Coupon title is required!"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    valid_till: {
        type: Date,
        required: [true, "Validity is required!"]
    },
    minimum_order_value: {
        type: Number,
        required: [true, "Minimum order value is required!"]
    },
    discount_mode: {
        type: String,
        required: [true, "Discount mode is required!"]
    },
    flat: {
        required: [flatDiscountValidator, 'Discount is required'],
        type: Number,
    },
    discount: {
        required: [percentageDiscountValidator, 'Discount % is required'],
        type: Number,
    },
    maximum_discount_value: {
        required: [percentageDiscountValidator, 'Maximum discount amount is required'],
        type: Number,
    },
})

const Coupon = mongoose.model("Coupon", couponSchema)

export default Coupon