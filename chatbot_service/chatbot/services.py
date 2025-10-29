from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

class AIService:
    """
    Service class to handle AI operations using Hugging Face Transformers
    """
    
    def __init__(self):
        self.translator = None
        self.summarizer = None
        
    def get_translator(self):
        """Lazy load translator model"""
        if self.translator is None:
            try:
                # Using Helsinki-NLP translation model (English to French as example)
                # You can change the model based on language needs
                self.translator = pipeline(
                    "translation_en_to_fr", 
                    model="Helsinki-NLP/opus-mt-en-fr"
                )
                logger.info("Translator model loaded successfully")
            except Exception as e:
                logger.error(f"Error loading translator: {str(e)}")
                raise
        return self.translator
    
    def get_summarizer(self):
        """Lazy load summarizer model"""
        if self.summarizer is None:
            try:
                # Using Facebook's BART model for summarization
                self.summarizer = pipeline(
                    "summarization", 
                    model="facebook/bart-large-cnn"
                )
                logger.info("Summarizer model loaded successfully")
            except Exception as e:
                logger.error(f"Error loading summarizer: {str(e)}")
                raise
        return self.summarizer
    
    def translate_text(self, text, source_lang="en", target_lang="fr"):
        """
        Translate text from source language to target language
        
        Args:
            text (str): Text to translate
            source_lang (str): Source language code
            target_lang (str): Target language code
            
        Returns:
            str: Translated text
        """
        try:
            translator = self.get_translator()
            result = translator(text, max_length=512)
            return result[0]['translation_text']
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            raise Exception(f"Translation failed: {str(e)}")
    
    def summarize_text(self, text, max_length=130, min_length=30):
        """
        Summarize the given text
        
        Args:
            text (str): Text to summarize
            max_length (int): Maximum length of summary
            min_length (int): Minimum length of summary
            
        Returns:
            str: Summarized text
        """
        try:
            summarizer = self.get_summarizer()
            
            # Ensure text is long enough to summarize
            if len(text.split()) < min_length:
                return text
            
            result = summarizer(
                text, 
                max_length=max_length, 
                min_length=min_length, 
                do_sample=False
            )
            return result[0]['summary_text']
        except Exception as e:
            logger.error(f"Summarization error: {str(e)}")
            raise Exception(f"Summarization failed: {str(e)}")

# Singleton instance
ai_service = AIService()