import { GoogleGenAI, Chat } from "@google/genai";
import { MenuItem, Language } from "../types";

let chat: Chat | null = null;
let chatContextKey: string | null = null;

// Fix: Re-create chat instance if menu or language changes to keep the AI's context up-to-date.
// This prevents issues where the AI provides outdated information after a language switch or menu update.
const getChatInstance = (menu: MenuItem[], t: (key: string) => string, language: Language): Chat => {
  const menuKey = menu.map(item => item.id).join(',');
  const currentContextKey = `${language}:${menuKey}`;

  if (chat && chatContextKey === currentContextKey) {
    return chat;
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const menuString = menu.map(item => 
    `${item.name} (${t(`menu.categories.${item.category}`)}) - ${item.price.toFixed(2)} DZD. ${item.description}${item.promotion ? ` Promotion: ${item.promotion}` : ''}`
  ).join('\n');

  const systemInstruction = `You are a friendly and helpful AI assistant for a fast-food restaurant named "${t('appName')}". Your goal is to help customers with the menu and their orders.

  RULES:
  - Be conversational and cheerful.
  - Your knowledge is limited to the menu provided below. Do not invent items.
  - If asked for recommendations, suggest popular items from the menu.
  - If a user wants to order, guide them to use the "Add to Cart" button on the website. You cannot place orders for them.
  - Answer in the language the user is asking. The menu is in English but you should translate names if asked in French.

  CURRENT MENU:
  ${menuString}
  `;

  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction,
    },
  });
  chatContextKey = currentContextKey;

  return chat;
};


export const getAIAssistantResponse = async (
  message: string,
  menu: MenuItem[],
  t: (key: string) => string,
  language: Language
): Promise<string> => {
  try {
    const chatInstance = getChatInstance(menu, t, language);
    const response = await chatInstance.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.";
  }
};