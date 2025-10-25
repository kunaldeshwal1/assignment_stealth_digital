import Groq from "groq-sdk";

// Initialize Groq client with API key from environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

/**
 * Generate an AI-powered follow-up message for a lead
 * @param leadName - Name of the lead
 * @param leadEmail - Email of the lead
 * @param status - Current status of the lead (new, contacted, qualified, lost)
 * @returns Promise<string> - Generated follow-up message
 */
export async function generateFollowUpMessage(
  leadName: string,
  leadEmail: string,
  status: string
): Promise<string> {
  try {
    // Check if API key is available
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY not found, using fallback message");
      return getFallbackMessage(leadName, status);
    }

    // Create chat completion using Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional sales assistant. Your task is to generate brief, friendly, and personalized follow-up messages for leads. 
          
Guidelines:
- Keep messages under 100 words
- Be warm but professional
- Personalize based on the lead's current status
- Include a clear call-to-action
- Use a conversational tone
- Avoid being pushy or aggressive`,
        },
        {
          role: "user",
          content: `Generate a follow-up message for a lead named ${leadName} (email: ${leadEmail}). 
          
Lead Status: ${status}
          
Please create a personalized follow-up message that:
1. Addresses the lead by name
2. References their current status appropriately
3. Includes a call-to-action
4. Stays under 100 words

Generate only the message text, no additional commentary.`,
        },
      ],
      model: "llama3-8b-8192", // Fast and free Groq model
      temperature: 0.7, // Balance between creativity and consistency
      max_tokens: 200, // Limit response length
      top_p: 0.9, // Nucleus sampling for diverse outputs
      stream: false,
    });

    // Extract the generated message
    const generatedMessage = completion.choices[0]?.message?.content?.trim();

    // Return generated message or fallback
    if (generatedMessage) {
      return generatedMessage;
    } else {
      console.warn("No message generated, using fallback");
      return getFallbackMessage(leadName, status);
    }
  } catch (error: any) {
    console.error("Groq API Error:", error);

    // Log specific error details
    if (error.response) {
      console.error("Error Response:", error.response.data);
    }

    // Return fallback message on error
    return getFallbackMessage(leadName, status);
  }
}

/**
 * Generate a fallback message when AI is unavailable
 * @param leadName - Name of the lead
 * @param status - Current status of the lead
 * @returns string - Fallback follow-up message
 */
function getFallbackMessage(leadName: string, status: string): string {
  // Status-specific message templates
  const messages: Record<string, string[]> = {
    new: [
      `Hi ${leadName}, thank you for your interest! I'd love to learn more about your needs and discuss how we can help. When would be a good time for a quick 15-minute call this week?`,
      `Hello ${leadName}, thanks for reaching out to us! I'm excited to explore how we can work together. What's the best way to continue our conversation?`,
      `Hi ${leadName}, great to connect with you! I'd love to understand your goals better and see if we're a good fit. Could we schedule a brief chat?`,
    ],
    contacted: [
      `Hi ${leadName}, just following up on our previous conversation. Do you have any questions I can help answer? I'm here to support you in making the best decision.`,
      `Hello ${leadName}, wanted to check if you've had a chance to review our discussion. I'd be happy to dive deeper into any specific areas of interest!`,
      `Hi ${leadName}, circling back on our recent chat. Is there anything specific you'd like to explore further? I'm here to help!`,
    ],
    qualified: [
      `Hi ${leadName}, I'm excited to move forward with you! Let's schedule a time to discuss the next steps and get started. What works best for your calendar this week?`,
      `Hello ${leadName}, great news! I'd love to kick off your project and align on all the details. When can we set up a planning call?`,
      `Hi ${leadName}, looking forward to working together! Shall we schedule a kickoff meeting to get things rolling? I'm available most of this week.`,
    ],
    lost: [
      `Hi ${leadName}, I wanted to check in one last time. While I understand the timing might not be right, I'd love to stay connected. Feel free to reach out if circumstances change!`,
      `Hello ${leadName}, just touching base to say thank you for considering us. If the timing wasn't ideal, we're here whenever you're ready to reconnect!`,
      `Hi ${leadName}, I appreciate you exploring this opportunity with us. If you'd like to revisit this conversation in the future, I'm just an email away!`,
    ],
  };

  // Get messages for the given status, or default to 'new'
  const statusMessages = messages[status] || messages.new;

  // Randomly select a template for variety
  const randomIndex = Math.floor(Math.random() * statusMessages.length);
  return statusMessages[randomIndex];
}

/**
 * Generate multiple AI suggestions for A/B testing or variety
 * @param leadName - Name of the lead
 * @param leadEmail - Email of the lead
 * @param status - Current status of the lead
 * @param count - Number of variations to generate
 * @returns Promise<string[]> - Array of generated messages
 */
export async function generateMultipleMessages(
  leadName: string,
  leadEmail: string,
  status: string,
  count: number = 3
): Promise<string[]> {
  const promises = Array.from({ length: count }, () =>
    generateFollowUpMessage(leadName, leadEmail, status)
  );

  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error generating multiple messages:", error);
    // Return fallback messages
    return Array.from({ length: count }, () =>
      getFallbackMessage(leadName, status)
    );
  }
}

/**
 * Check if Groq API is configured and working
 * @returns Promise<boolean> - True if API is working
 */
export async function testGroqConnection(): Promise<boolean> {
  try {
    if (!process.env.GROQ_API_KEY) {
      return false;
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: 'Say "OK" if you can read this.',
        },
      ],
      model: "llama3-8b-8192",
      max_tokens: 10,
    });

    return completion.choices[0]?.message?.content?.includes("OK") || false;
  } catch (error) {
    console.error("Groq connection test failed:", error);
    return false;
  }
}
