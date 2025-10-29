from rest_framework import serializers

class TranslationRequestSerializer(serializers.Serializer):
    text = serializers.CharField(required=True, max_length=5000)
    source_lang = serializers.CharField(required=False, default="en", max_length=10)
    target_lang = serializers.CharField(required=False, default="fr", max_length=10)
    
    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("Text cannot be empty")
        return value

class TranslationResponseSerializer(serializers.Serializer):
    original_text = serializers.CharField()
    translated_text = serializers.CharField()
    source_lang = serializers.CharField()
    target_lang = serializers.CharField()

class SummarizationRequestSerializer(serializers.Serializer):
    text = serializers.CharField(required=True, max_length=10000)
    max_length = serializers.IntegerField(required=False, default=130, min_value=30, max_value=500)
    min_length = serializers.IntegerField(required=False, default=30, min_value=10, max_value=200)
    
    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("Text cannot be empty")
        if len(value.split()) < 10:
            raise serializers.ValidationError("Text is too short to summarize")
        return value
    
    def validate(self, data):
        if data.get('min_length', 30) >= data.get('max_length', 130):
            raise serializers.ValidationError(
                "max_length must be greater than min_length"
            )
        return data

class SummarizationResponseSerializer(serializers.Serializer):
    original_text = serializers.CharField()
    summary = serializers.CharField()
    original_length = serializers.IntegerField()
    summary_length = serializers.IntegerField()