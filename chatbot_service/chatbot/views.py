from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    TranslationRequestSerializer,
    TranslationResponseSerializer,
    SummarizationRequestSerializer,
    SummarizationResponseSerializer
)
from .services import ai_service
import logging

logger = logging.getLogger(__name__)

class TranslateView(APIView):
    """
    API endpoint to translate text
    """
    
    def post(self, request):
        """
        POST /api/translate
        {
            "text": "Hello, how are you?",
            "source_lang": "en",
            "target_lang": "fr"
        }
        """
        serializer = TranslationRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                text = serializer.validated_data['text']
                source_lang = serializer.validated_data.get('source_lang', 'en')
                target_lang = serializer.validated_data.get('target_lang', 'fr')
                
                # Perform translation
                translated_text = ai_service.translate_text(
                    text, 
                    source_lang, 
                    target_lang
                )
                
                response_data = {
                    'original_text': text,
                    'translated_text': translated_text,
                    'source_lang': source_lang,
                    'target_lang': target_lang
                }
                
                response_serializer = TranslationResponseSerializer(response_data)
                return Response(
                    response_serializer.data, 
                    status=status.HTTP_200_OK
                )
                
            except Exception as e:
                logger.error(f"Translation error: {str(e)}")
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )

class SummarizeView(APIView):
    """
    API endpoint to summarize text
    """
    
    def post(self, request):
        """
        POST /api/summarize
        {
            "text": "Long text to summarize...",
            "max_length": 130,
            "min_length": 30
        }
        """
        serializer = SummarizationRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                text = serializer.validated_data['text']
                max_length = serializer.validated_data.get('max_length', 130)
                min_length = serializer.validated_data.get('min_length', 30)
                
                # Perform summarization
                summary = ai_service.summarize_text(
                    text, 
                    max_length=max_length, 
                    min_length=min_length
                )
                
                response_data = {
                    'original_text': text,
                    'summary': summary,
                    'original_length': len(text.split()),
                    'summary_length': len(summary.split())
                }
                
                response_serializer = SummarizationResponseSerializer(response_data)
                return Response(
                    response_serializer.data, 
                    status=status.HTTP_200_OK
                )
                
            except Exception as e:
                logger.error(f"Summarization error: {str(e)}")
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )

class HealthCheckView(APIView):
    """
    Health check endpoint
    """
    
    def get(self, request):
        return Response(
            {
                'status': 'healthy',
                'service': 'AI Chatbot Service',
                'version': '1.0.0'
            },
            status=status.HTTP_200_OK
        )