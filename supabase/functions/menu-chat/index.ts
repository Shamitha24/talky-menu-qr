import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MENU_DATA = `
APPETIZERS:
- Truffle Mushroom Bruschetta ($12) - Wild mushrooms, truffle oil, goat cheese on toasted sourdough
- Crispy Calamari ($14) - Lightly fried, served with spicy aioli and lemon
- Buffalo Mozzarella Caprese ($13) - Fresh tomatoes, basil, balsamic reduction
- Asian Fusion Wings ($11) - Crispy wings with sweet chili glaze

MAIN COURSES:
- Grilled Ribeye Steak ($38) - 12oz prime ribeye, herb butter, seasonal vegetables
- Pan-Seared Salmon ($32) - Atlantic salmon, lemon butter sauce, asparagus, quinoa
- Chicken Parmesan ($26) - Breaded chicken breast, marinara, mozzarella, pasta
- Vegetarian Buddha Bowl ($22) - Quinoa, roasted vegetables, tahini dressing, avocado
- Lobster Linguine ($42) - Fresh lobster, white wine cream sauce, cherry tomatoes

DESSERTS:
- Chocolate Lava Cake ($9) - Warm chocolate cake, vanilla ice cream
- Tiramisu ($8) - Classic Italian dessert, espresso-soaked ladyfingers
- Crème Brûlée ($8) - Vanilla custard, caramelized sugar
- Seasonal Fruit Tart ($7) - Fresh berries, pastry cream

DRINKS:
- House Wine (glass $10, bottle $38)
- Craft Cocktails ($12-15)
- Fresh Squeezed Juices ($6)
- Specialty Coffee & Tea ($4-6)
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing menu chat request");

    // Get AI response
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a friendly, knowledgeable restaurant menu assistant. Your role is to help customers understand our menu, make recommendations, and answer questions about dishes, ingredients, dietary restrictions, and preparation methods.

Here is our complete menu:
${MENU_DATA}

Guidelines:
- Be warm, enthusiastic, and helpful
- Provide detailed descriptions when asked
- Make personalized recommendations based on customer preferences
- Inform about allergens and dietary options
- Keep responses conversational and concise (2-3 sentences usually)
- If asked about items not on the menu, politely say we don't offer that but suggest similar alternatives
- For vague requests like "something good", ask about preferences (meat/vegetarian, spicy/mild, etc.)

IMPORTANT: Always respond with valid JSON in this format:
{
  "message": "your conversational response here",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

After each response, provide 2-3 smart follow-up suggestions that are relevant to the conversation:
- If talking about appetizers: "Tell me about main courses", "Any vegetarian options?", "What's popular?"
- If discussing dietary needs: "Show me the full menu", "Any gluten-free desserts?", "What about drinks?"
- If asked about specific dishes: "What pairs well with this?", "Tell me about desserts", "Any other recommendations?"
- General context: "Chef's recommendation?", "What's your special today?", "Do you have cocktails?"`
          },
          ...messages
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", errorText);
      throw new Error("Failed to get AI response");
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parse JSON response
    let messageText = aiContent;
    let suggestions: string[] = [];
    
    try {
      const parsed = JSON.parse(aiContent);
      messageText = parsed.message;
      suggestions = parsed.suggestions || [];
    } catch (parseError) {
      // If not valid JSON, use as plain text and generate generic suggestions
      console.warn("Failed to parse AI response as JSON, using plain text");
      messageText = aiContent;
      suggestions = ["Tell me more", "What else do you recommend?", "Show me desserts"];
    }

    // Generate speech from text
    const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY") || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: messageText,
        voice: "nova",
        response_format: "mp3",
      }),
    });

    let audioBase64 = null;
    if (ttsResponse.ok) {
      const audioBuffer = await ttsResponse.arrayBuffer();
      const bytes = new Uint8Array(audioBuffer);
      audioBase64 = btoa(String.fromCharCode(...bytes));
    } else {
      console.warn("TTS failed, continuing without audio");
    }

    return new Response(
      JSON.stringify({
        message: messageText,
        audio: audioBase64,
        suggestions,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in menu-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
