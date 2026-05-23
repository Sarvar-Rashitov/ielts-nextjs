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

  const body = await req.json()
  const essay = body.essay

  try {

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional IELTS examiner."
        },
        {
          role: "user",
          content: `Evaluate this IELTS Writing Task 2 essay.

Score using IELTS band descriptors:

Task Response
Coherence and Cohesion
Lexical Resource
Grammatical Range and Accuracy

Provide:
- band score for each criterion
- overall band score
- detailed feedback
- improvement suggestions

Essay:
${essay}`
        }
      ]
    })

    return Response.json({
      result: response.choices[0].message.content
    })

  } catch (err) {

    return Response.json({
      error: "AI request failed"
    })

  }
}