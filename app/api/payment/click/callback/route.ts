import { NextRequest, NextResponse } from "next/server"

// Click.uz Callback Handler
// This endpoint receives payment notifications from Click.uz

// Click action types
const CLICK_ACTION_PREPARE = 0
const CLICK_ACTION_COMPLETE = 1

interface ClickCallback {
  click_trans_id: string
  service_id: string
  click_paydoc_id: string
  merchant_trans_id: string
  amount: number
  action: number
  error: number
  error_note: string
  sign_time: string
  sign_string: string
}

export async function POST(req: NextRequest) {
  try {
    const body: ClickCallback = await req.json()
    const {
      click_trans_id,
      service_id,
      merchant_trans_id,
      amount,
      action,
      error,
      sign_string,
    } = body

    // Verify signature
    const secretKey = process.env.CLICK_SECRET_KEY
    const merchantId = process.env.CLICK_MERCHANT_ID

    if (!secretKey || !merchantId) {
      return NextResponse.json({
        error: -1,
        error_note: "Server configuration error",
      })
    }

    // Verify sign_string (Click's signature validation)
    // sign_string = md5(click_trans_id + service_id + secret_key + merchant_trans_id + (action == 1 ? amount : ""))
    // You should validate this signature in production

    // Find transaction in database
    // const { data: transaction } = await supabase
    //   .from("transactions")
    //   .select("*")
    //   .eq("id", merchant_trans_id)
    //   .single()

    // if (!transaction) {
    //   return NextResponse.json({
    //     error: -5,
    //     error_note: "Transaction not found",
    //   })
    // }

    if (action === CLICK_ACTION_PREPARE) {
      // Prepare action - verify transaction can be processed
      return NextResponse.json({
        click_trans_id,
        merchant_trans_id,
        merchant_prepare_id: Date.now(),
        error: 0,
        error_note: "Success",
      })
    }

    if (action === CLICK_ACTION_COMPLETE) {
      // Complete action - finalize the payment
      
      // Update transaction status
      // await supabase
      //   .from("transactions")
      //   .update({
      //     status: "completed",
      //     click_trans_id,
      //     completed_at: new Date().toISOString(),
      //   })
      //   .eq("id", merchant_trans_id)

      // Update user plan
      // await supabase
      //   .from("users")
      //   .update({ plan: transaction.plan, plan_duration: transaction.duration })
      //   .eq("id", transaction.user_id)

      return NextResponse.json({
        click_trans_id,
        merchant_trans_id,
        merchant_confirm_id: Date.now(),
        error: 0,
        error_note: "Success",
      })
    }

    return NextResponse.json({
      error: -3,
      error_note: "Invalid action",
    })
  } catch (error) {
    console.error("Click callback error:", error)
    return NextResponse.json({
      error: -1,
      error_note: "Internal server error",
    })
  }
}
