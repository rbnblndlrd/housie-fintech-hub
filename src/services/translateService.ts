
import { supabase } from '@/integrations/supabase/client';

export interface TranslationResponse {
  translatedText: string;
  originalText: string;
  sourceLang: string;
  targetLang: string;
}

export interface TranslationError {
  error: string;
  originalText?: string;
}

export class TranslateService {
  private static readonly CACHE_PREFIX = 'housie_translation_';
  private static readonly CACHE_EXPIRY_DAYS = 30;

  static async translateText(
    text: string, 
    targetLang: string = 'fr', 
    sourceLang: string = 'en'
  ): Promise<string> {
    if (!text || text.trim() === '') {
      return text;
    }

    // Check cache first
    const cachedTranslation = this.getCachedTranslation(text, targetLang);
    if (cachedTranslation) {
      return cachedTranslation;
    }

    try {
      const { data, error } = await supabase.functions.invoke('google-translate', {
        body: { text, targetLang, sourceLang }
      });

      if (error) {
        console.error('Translation service error:', error);
        return text; // Fallback to original text
      }

      const translatedText = data?.translatedText || text;
      
      // Cache the translation
      this.setCachedTranslation(text, targetLang, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  }

  static async translateBatch(
    texts: string[], 
    targetLang: string = 'fr', 
    sourceLang: string = 'en'
  ): Promise<string[]> {
    const translations = await Promise.all(
      texts.map(text => this.translateText(text, targetLang, sourceLang))
    );
    return translations;
  }

  private static getCacheKey(text: string, targetLang: string): string {
    const hash = this.simpleHash(text);
    return `${this.CACHE_PREFIX}${hash}_${targetLang}`;
  }

  private static getCachedTranslation(text: string, targetLang: string): string | null {
    try {
      const cacheKey = this.getCacheKey(text, targetLang);
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;

      const { translation, timestamp } = JSON.parse(cached);
      const now = Date.now();
      const expiryTime = this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

      if (now - timestamp > expiryTime) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return translation;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  private static setCachedTranslation(text: string, targetLang: string, translation: string): void {
    try {
      const cacheKey = this.getCacheKey(text, targetLang);
      const cacheData = {
        translation,
        timestamp: Date.now(),
        originalText: text
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  static clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Cache clearing error:', error);
    }
  }
}
