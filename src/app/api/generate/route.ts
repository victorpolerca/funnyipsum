import { OpenAI } from "openai"; // Default import for OpenAI SDK v4
import { prompts } from "@/utils/prompts"; // Import prompts

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  const { type, length } = await req.json();

  const prompt = `${prompts[type]} The text should contain exactly ${length} paragraphs, each paragraph should be concise and contain around 100-150 characters.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative generator of slang-based lorem ipsum style texts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim() || "No content generated.";
    const paragraphs = result.split('\n\n').filter(p => p.trim() !== '').slice(0, length).join('\n\n');
    return new Response(JSON.stringify({ result: paragraphs }), {
      status: 200,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate text." }), {
      status: 500,
    });
  }
}
