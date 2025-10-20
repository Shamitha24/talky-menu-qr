import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MENU_DATA = `
# UTD DINING LOCATIONS & INFORMATION

## THE PUB (Main Dining Hall)
Hours: Monday-Friday 7am-8pm, Saturday-Sunday 10am-7pm
Location: Residence Hall West

STATIONS:
- Build Your Own Bowl: Customizable bowls with proteins (chicken, tofu, beef), grains (rice, quinoa), and fresh vegetables
- Pizza & Pasta Bar: Daily fresh pizzas, pasta with various sauces
- Grill Station: Burgers, chicken sandwiches, veggie burgers, hot dogs
- Salad Bar: Fresh greens, 20+ toppings, 8 dressings
- International Station: Rotating daily themes
  * Monday: Mexican (tacos, burritos, quesadillas)
  * Tuesday: Asian (stir fry, fried rice, lo mein)
  * Wednesday: Mediterranean (falafel, hummus, pita)
  * Thursday: Italian (pasta varieties, marinara)
  * Friday: American comfort food

## COMET CAFE (Student Union)
Hours: Monday-Friday 7:30am-6pm (Closed weekends)
Location: Student Union, 2nd Floor

RESTAURANTS:
- Starbucks: Full coffee bar, pastries, breakfast sandwiches
- Chick-fil-A: Chicken sandwiches, nuggets, waffle fries, salads
- Freshens: Smoothies, frozen yogurt, healthy wraps
- Einstein Bros. Bagels: Fresh bagels, cream cheese, breakfast sandwiches

## CONVENIENCE STORES
CV1 (Residence Hall West): Open 24/7
CV2 (Phase 8): Mon-Thu 8am-12am, Fri 8am-8pm, Sat-Sun 12pm-8pm
- Grab-and-go meals, snacks, drinks, basic groceries
- Hot food items, sandwiches, salads
- All Comet Card accepted

## MEAL PLANS
- Unlimited Access: Unlimited dining hall visits
- Block 125: 125 meals per semester
- Block 100: 100 meals per semester
- Block 75: 75 meals per semester
- Declining Balance: Flex dollars for all locations
- All plans include Comet Card dollars

## DIETARY OPTIONS
- Vegetarian & Vegan: Available at all stations
- Gluten-Free: Marked on menus, dedicated prep area
- Halal: Available at international station
- Allergen Info: Available on request or online
- Kosher: Limited options, contact dining services
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
            content: `You are the UTD Dining Assistant, a friendly and helpful guide for students navigating dining options on the UT Dallas campus. Help students find food, understand meal plans, check hours, and discover dietary options.

Here is the complete UTD dining information:
${MENU_DATA}

Guidelines:
- Be enthusiastic, student-friendly, and campus-oriented
- Keep responses concise (2-3 sentences)
- Always mention Comet Card acceptance
- Highlight dietary accommodations when relevant
- Use "we" and "our campus" language
- Reference specific locations and hours
- Suggest meal plan options when appropriate

IMPORTANT: Always respond with valid JSON in this format:
{
  "message": "your helpful response here",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Provide 3 contextual follow-up suggestions (5-7 words each):
- About locations: "What's open late?", "Tell me about meal plans", "Any vegan options?"
- About food: "What's at The Pub today?", "Where can I use my Comet Card?", "Halal options available?"
- About hours: "When does Comet Cafe open?", "Which stores are 24/7?", "Weekend dining hours?"
- General: "Best spots for breakfast?", "Healthiest options on campus?", "How do meal plans work?"`
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
