package graphql.graphql.resolver;

import graphql.graphql.client.ChatbotClient;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ChatbotResolver {
    
    private final ChatbotClient chatbotClient;
    
    public ChatbotResolver(ChatbotClient chatbotClient) {
        this.chatbotClient = chatbotClient;
    }
    
    // ===================================================================
    // CHATBOT QUERIES
    // ===================================================================
    
    @QueryMapping
    public Map<String, Object> chatbotHealth() {
        return chatbotClient.healthCheck();
    }
    
    // ===================================================================
    // CHATBOT MUTATIONS
    // ===================================================================
    
    @MutationMapping
    public Map<String, Object> translate(
            @Argument String text, 
            @Argument String sourceLang, 
            @Argument String targetLang) {
        return chatbotClient.translate(text, sourceLang, targetLang);
    }
    
    @MutationMapping
    public Map<String, Object> summarize(
            @Argument String text, 
            @Argument Integer maxLength, 
            @Argument Integer minLength) {
        return chatbotClient.summarize(text, maxLength, minLength);
    }
}
