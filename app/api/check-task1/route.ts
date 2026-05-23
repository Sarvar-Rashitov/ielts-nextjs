import OpenAI from "openai"

export async function POST(req: Request) {

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      error: "OPENAI_API_KEY not configured"
    })
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  try {

    const body = await req.json()

    const essay = body.essay
    const image = body.image

    const response = await openai.chat.completions.create({

      model: "gpt-4o",

      messages: [

        {
          role: "system",
          content: "You are a professional IELTS examiner."
        },

        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Evaluate this IELTS Writing Task 1 essay.

Score using IELTS band descriptors:

Task Achievement
Coherence and Cohesion
Lexical Resource
Grammatical Range and Accuracy

Provide band scores and detailed feedback.

Essay:
${essay}`
            },

            {
              type: "image_url",
              image_url: { url: image }
            }

          ]
        }

      ]

    })

    return Response.json({
      result: response.choices[0].message.content
    })

  } catch (error) {

    return Response.json({
      error: "AI request failed"
    })

  }

}