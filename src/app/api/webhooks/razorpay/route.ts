import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import prismaDb from "@/lib/prisma";
import { sendCreditsEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature")

        const expectedSignatures = crypto.
        createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest("hex");

        if(expectedSignatures !== signature) {
            return NextResponse.json({
                error: "Invalid signature"
            }, {status: 400});
        }

        const event = JSON.parse(body);
        // console.log(event)
        if(event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            // console.log(payment)

            const userId = payment.notes?.userId
            const credits = parseInt(payment.notes?.credits || "0", 10)

            if(!userId || isNaN(credits)){
                return NextResponse.json({
                    error: "Invalid payment data"
                }, { status: 400 });
            }

            await prismaDb.transaction.create({
                data: {
                    userId,
                    credits,
                }
            });

            const user = await prismaDb.user.findUnique({
            where: { id: userId },
            });

            if (user?.email && user?.firstName) {
                await sendCreditsEmail(user.email, user.firstName, credits);
            }

            return NextResponse.json({
                success: true
            }, { status: 200 }); 
        }

        return NextResponse.json({message: "Unhandled event type"}, {status: 200});

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}