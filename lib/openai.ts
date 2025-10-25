import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateFollowUpMessage(
  leadName: string,
  leadEmail: string,
  status: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional sales assistant. Generate a brief, friendly follow-up message for a lead.",
        },
        {
          role: "user",
          content: `Generate a follow-up message for ${leadName} (${leadEmail}). Current status: ${status}. Keep it under 100 words, professional but warm.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content || "Unable to generate message"
    );
  } catch (error) {
    console.error("OpenAI Error:", error);
    return (
      "Hi " +
      leadName +
      ", just following up on our previous conversation. Would love to hear your thoughts!"
    );
  }
}
