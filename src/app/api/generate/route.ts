import { OpenAI } from "openai"; // Default import for OpenAI SDK v4

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  const { type, length } = await req.json();

  const prompts: Record<string, string> = {
    quebecois: "Generate a Quebecois slang-based lorem ipsum style text full of humorous and creative swears.",
    canadian: "Generate a Canadian slang-based lorem ipsum style text full of humorous and creative swears.",
    romanian: "Generate a Romanian slang-based lorem ipsum style text full of humorous and creative swears.",
  };

  const prompt = prompts[type] || prompts.quebecois;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative generator of slang-based lorem ipsum style texts.",
        },
        {
          role: "user",
          content: `${prompt} The text should contain approximately ${length} sentences or phrases.`,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim() || "No content generated.";
    return new Response(JSON.stringify({ result }), {
      status: 200,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate text." }), {
      status: 500,
    });
  }
}
