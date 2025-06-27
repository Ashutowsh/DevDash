'use server'

import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createCheckOutSession(credits:number) {
    const {userId} = await auth()
    if(!userId) {
        throw new Error('Unauthorized')
    }

    const session = await razorpay.orders.create({
        amount: Math.round((credits / 50) * 100),
        currency: "USD",
        receipt: `reciept-${Date.now()}`,
        notes: {
            name: `${credits} Dev Dash Credits`,
            credits,
            userId
        },
    })

    return session
}