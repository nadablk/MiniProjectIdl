package main.java.graphql.graphql.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Map;
import java.util.HashMap;

@Component
public class ChatbotClient {
    
    @Value("${backend.chatbot.url}")
    private String chatbotUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    public Map<String, Object> translate(String text, String sourceLang, String targetLang) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("text", text);
            requestBody.put("source_lang", sourceLang);
            requestBody.put("target_lang", targetLang);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            Map<String, Object> response = restTemplate.postForObject(
                chatbotUrl + "/api/translate/", 
                request, 
                Map.class
            );
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("originalText", response.get("original_text"));
            result.put("translatedText", response.get("translated_text"));
            result.put("sourceLang", response.get("source_lang"));
            result.put("targetLang", response.get("target_lang"));
            return result;
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return error;
        }
    }
    
    public Map<String, Object> summarize(String text, Integer maxLength, Integer minLength) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("text", text);
            if (maxLength != null) requestBody.put("max_length", maxLength);
            if (minLength != null) requestBody.put("min_length", minLength);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            Map<String, Object> response = restTemplate.postForObject(
                chatbotUrl + "/api/summarize/", 
                request, 
                Map.class
            );
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("originalText", response.get("original_text"));
            result.put("summary", response.get("summary"));
            result.put("originalLength", response.get("original_length"));
            result.put("summaryLength", response.get("summary_length"));
            return result;
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return error;
        }
    }
    
    public Map<String, Object> healthCheck() {
        try {
            Map<String, Object> response = restTemplate.getForObject(
                chatbotUrl + "/api/health/", 
                Map.class
            );
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("status", response.get("status"));
            result.put("service", response.get("service"));
            result.put("version", response.get("version"));
            return result;
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("status", "error");
            return error;
        }
    }
}
