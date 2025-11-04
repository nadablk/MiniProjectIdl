package graphql.graphql.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpMethod;

import java.util.Map;

@Component
public class SpringBootClient {
    
    @Value("${backend.spring.url}")
    private String springBootUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Students
    public Object getAllStudents() {
        return restTemplate.getForObject(springBootUrl + "/api/students", Object.class);
    }
    
    public Object getStudent(Long id) {
        return restTemplate.getForObject(springBootUrl + "/api/students/" + id, Object.class);
    }
    
    public Object createStudent(Map<String, Object> student) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(student, headers);
        return restTemplate.postForObject(springBootUrl + "/api/students", request, Object.class);
    }
    
    public Object updateStudent(Long id, Map<String, Object> student) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(student, headers);
        restTemplate.exchange(springBootUrl + "/api/students/" + id, HttpMethod.PUT, request, Object.class);
        return getStudent(id);
    }
    
    public Boolean deleteStudent(Long id) {
        try {
            restTemplate.delete(springBootUrl + "/api/students/" + id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    // Universities
    public Object getAllUniversities() {
        return restTemplate.getForObject(springBootUrl + "/api/universities", Object.class);
    }
    
    public Object getUniversity(Long id) {
        return restTemplate.getForObject(springBootUrl + "/api/universities/" + id, Object.class);
    }
    
    public Object createUniversity(Map<String, Object> university) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(university, headers);
        return restTemplate.postForObject(springBootUrl + "/api/universities", request, Object.class);
    }
    
    public Object updateUniversity(Long id, Map<String, Object> university) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(university, headers);
        restTemplate.exchange(springBootUrl + "/api/universities/" + id, HttpMethod.PUT, request, Object.class);
        return getUniversity(id);
    }
    
    public Boolean deleteUniversity(Long id) {
        try {
            restTemplate.delete(springBootUrl + "/api/universities/" + id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
