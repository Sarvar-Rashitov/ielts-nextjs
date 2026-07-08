import { NextRequest, NextResponse } from "next/server"

// Click.uz Payment Integration
// Documentation: https://docs.click.uz/

interface PaymentRequest {
  plan: string
  duration: string
  provider: "click" | "payme"
  amount: number
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentRequest = await req.json()
    const { plan, duration, provider, amount } = body

    // Get user session
    // const { data: { session } } = await supabase.auth.getSession()
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    if (provider === "click") {
      // Click.uz payment URL generation
      const merchantId = process.env.CLICK_MERCHANT_ID
      const serviceId = process.env.CLICK_SERVICE_ID
      const secretKey = process.env.CLICK_SECRET_KEY

      if (!merchantId || !serviceId || !secretKey) {
        return NextResponse.json(
          { error: "Click.uz not configured. Please add CLICK_MERCHANT_ID, CLICK_SERVICE_ID, and CLICK_SECRET_KEY to .env.local" },
          { status: 500 }
        )
      }

      // Generate unique transaction ID
      const transactionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Click.uz payment URL format
      // For production: https://my.click.uz/services/pay
      // For testing: https://my.click.uz/services/paytest
      
      const clickUrl = new URL("https://my.click.uz/services/pay")
      clickUrl.searchParams.set("merchant_id", merchantId)
      clickUrl.searchParams.set("service_id", serviceId)
      clickUrl.searchParams.set("amount", Math.floor(amount / 100).toString()) // Click expects amount in tiyins (cents)
      clickUrl.searchParams.set("transaction_param", transactionId)
      clickUrl.searchParams.set("return_url", `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/payment/success`)
      clickUrl.searchParams.set("card_type", "humo") // or "uzcard"

      // Store transaction in database for verification
      // await supabase.from("transactions").insert({
      //   id: transactionId,
      //   user_id: session.user.id,
      //   plan,
      //   duration,
      //   amount,
      //   provider: "click",
      //   status: "pending",
      // })

      return NextResponse.json({
        paymentUrl: clickUrl.toString(),
        transactionId,
      })
    }

    if (provider === "payme") {
      // Payme integration (keep existing)
      return NextResponse.json({
        paymentUrl: "/payment/payme",
      })
    }

    return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
