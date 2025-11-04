// ===================================================================
// CHATBOT API - AI Translation & Summarization Service
// ===================================================================
// Routes through API Gateway to Chatbot Django service (port 8002)
//
// 🔧 TO CHANGE NETWORK IP: Edit /src/config/apiConfig.js
//
// Routes:
// - /api/chatbot/translate/** → Chatbot Service (localhost:8002/api/translate/)
// - /api/chatbot/summarize/** → Chatbot Service (localhost:8002/api/summarize/)
// - /api/chatbot/health/** → Chatbot Service (localhost:8002/api/health/)
// ===================================================================

import { API_CONFIG } from "../config/apiConfig.js";

const CHATBOT_BASE_URL = `${API_CONFIG.GATEWAY_BASE_URL}/chatbot`;

/**
 * Chatbot API Service
 * Provides AI-powered translation and summarization
 */
export const chatbotAPI = {
  /**
   * Translate text between languages
   * @param {string} text - Text to translate
   * @param {string} sourceLang - Source language code (e.g., 'en', 'fr', 'es')
   * @param {string} targetLang - Target language code
   * @returns {Promise<Object>} Translation result
   */
  translate: async (text, sourceLang = "en", targetLang = "fr") => {
    try {
      const response = await fetch(`${CHATBOT_BASE_URL}/translate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Translation failed");
      }

      const data = await response.json();
      return {
        success: true,
        originalText: data.original_text,
        translatedText: data.translated_text,
        sourceLang: data.source_lang,
        targetLang: data.target_lang,
      };
    } catch (error) {
      console.error("Translation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Summarize long text
   * @param {string} text - Text to summarize
   * @param {number} maxLength - Maximum length of summary (default: 130)
   * @param {number} minLength - Minimum length of summary (default: 30)
   * @returns {Promise<Object>} Summarization result
   */
  summarize: async (text, maxLength = 130, minLength = 30) => {
    try {
      const response = await fetch(`${CHATBOT_BASE_URL}/summarize/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          max_length: maxLength,
          min_length: minLength,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Summarization failed");
      }

      const data = await response.json();
      return {
        success: true,
        originalText: data.original_text,
        summary: data.summary,
        originalLength: data.original_length,
        summaryLength: data.summary_length,
      };
    } catch (error) {
      console.error("Summarization error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Check chatbot service health
   * @returns {Promise<Object>} Health status
   */
  healthCheck: async () => {
    try {
      const response = await fetch(`${CHATBOT_BASE_URL}/health/`);

      if (!response.ok) {
        throw new Error("Health check failed");
      }

      const data = await response.json();
      return {
        success: true,
        status: data.status,
        service: data.service,
        version: data.version,
      };
    } catch (error) {
      console.error("Health check error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default chatbotAPI;
