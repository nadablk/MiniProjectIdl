from transformers import pipeline, MarianMTModel, MarianTokenizer
import logging

logger = logging.getLogger(__name__)

class AIService:
    """
    Service class to handle AI operations using Hugging Face Transformers
    """
    
    def __init__(self):
        self.translators = {}  # Cache for different language pair models
        self.summarizer = None
        
        # Language code mapping
        self.lang_codes = {
            'en': 'en', 'english': 'en',
            'fr': 'fr', 'french': 'fr', 'francais': 'fr', 'français': 'fr',
            'es': 'es', 'spanish': 'es', 'espanol': 'es', 'español': 'es',
            'de': 'de', 'german': 'de', 'deutsch': 'de',
            'it': 'it', 'italian': 'it', 'italiano': 'it',
            'pt': 'pt', 'portuguese': 'pt', 'portugues': 'pt', 'português': 'pt',
            'nl': 'nl', 'dutch': 'nl', 'nederlands': 'nl',
            'ru': 'ru', 'russian': 'ru',
            'zh': 'zh', 'chinese': 'zh',
            'ja': 'ja', 'japanese': 'ja',
            'ar': 'ar', 'arabic': 'ar',
        }
        
    def normalize_lang_code(self, lang):
        """Normalize language code to standard format"""
        lang_lower = lang.lower().strip()
        return self.lang_codes.get(lang_lower, lang_lower)
    
    def get_translator(self, source_lang, target_lang):
        """
        Get or create translator for specific language pair
        Uses Helsinki-NLP OPUS-MT models which support many language pairs
        """
        # Normalize language codes
        src = self.normalize_lang_code(source_lang)
        tgt = self.normalize_lang_code(target_lang)
        
        key = f"{src}-{tgt}"
        
        if key not in self.translators:
            try:
                # Try to load the specific language pair model
                model_name = f"Helsinki-NLP/opus-mt-{src}-{tgt}"
                logger.info(f"Loading translator model: {model_name}")
                
                self.translators[key] = pipeline(
                    "translation",
                    model=model_name,
                    max_length=512
                )
                logger.info(f"Translator model loaded successfully: {model_name}")
            except Exception as e:
                logger.warning(f"Could not load {model_name}: {str(e)}")
                
                # Try alternative: translate through English if not direct pair
                if src != 'en' and tgt != 'en':
                    logger.info(f"Attempting translation via English: {src}->en->{tgt}")
                    # This will be handled in translate_text method
                    raise Exception(f"No direct translation model available for {src}->{tgt}. Try translating via English.")
                else:
                    raise Exception(f"Translation model not available for {src}->{tgt}")
                    
        return self.translators[key]
    
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
        Supports multiple language pairs using Helsinki-NLP OPUS-MT models
        
        Args:
            text (str): Text to translate
            source_lang (str): Source language code (e.g., 'en', 'fr', 'es')
            target_lang (str): Target language code (e.g., 'en', 'fr', 'es')
            
        Returns:
            str: Translated text
        """
        try:
            src = self.normalize_lang_code(source_lang)
            tgt = self.normalize_lang_code(target_lang)
            
            # If same language, return original text
            if src == tgt:
                return text
            
            translator = self.get_translator(src, tgt)
            result = translator(text)
            return result[0]['translation_text']
            
        except Exception as e:
            logger.error(f"Translation error ({source_lang}->{target_lang}): {str(e)}")
            
            # Attempt two-step translation via English for unsupported pairs
            if src != 'en' and tgt != 'en':
                try:
                    logger.info(f"Attempting two-step translation: {src}->en->{tgt}")
                    # Step 1: Translate to English
                    translator_to_en = self.get_translator(src, 'en')
                    english_text = translator_to_en(text)[0]['translation_text']
                    
                    # Step 2: Translate from English to target
                    translator_from_en = self.get_translator('en', tgt)
                    final_text = translator_from_en(english_text)[0]['translation_text']
                    
                    logger.info(f"Two-step translation successful: {src}->en->{tgt}")
                    return final_text
                except Exception as e2:
                    logger.error(f"Two-step translation also failed: {str(e2)}")
                    raise Exception(f"Translation failed for {source_lang}->{target_lang}: {str(e)}")
            else:
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