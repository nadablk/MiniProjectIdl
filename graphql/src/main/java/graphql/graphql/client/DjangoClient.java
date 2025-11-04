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
public class DjangoClient {
    
    @Value("${backend.django.url}")
    private String djangoUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Courses
    public Object getAllCourses() {
        return restTemplate.getForObject(djangoUrl + "/api/courses", Object.class);
    }
    
    public Object getCourse(Long id) {
        return restTemplate.getForObject(djangoUrl + "/api/courses/" + id, Object.class);
    }
    
    public Object createCourse(Map<String, Object> course) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(course, headers);
        return restTemplate.postForObject(djangoUrl + "/api/courses", request, Object.class);
    }
    
    public Object updateCourse(Long id, Map<String, Object> course) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(course, headers);
        restTemplate.exchange(djangoUrl + "/api/courses/" + id, HttpMethod.PUT, request, Object.class);
        return getCourse(id);
    }
    
    public Boolean deleteCourse(Long id) {
        try {
            restTemplate.delete(djangoUrl + "/api/courses/" + id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    // Enrollments
    public Object getAllEnrollments() {
        return restTemplate.getForObject(djangoUrl + "/api/enrollments", Object.class);
    }
    
    public Object getEnrollmentsByCourse(Integer courseId) {
        return restTemplate.getForObject(djangoUrl + "/api/enrollments?course_id=" + courseId, Object.class);
    }
    
    public Object getEnrollmentsByStudent(Integer studentId) {
        return restTemplate.getForObject(djangoUrl + "/api/enrollments?student_id=" + studentId, Object.class);
    }
    
    public Object addStudentToCourse(Map<String, Object> enrollment) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(enrollment, headers);
        return restTemplate.postForObject(djangoUrl + "/api/enrollments", request, Object.class);
    }
    
    public Boolean removeStudentFromCourse(Integer studentId, Integer courseId) {
        try {
            restTemplate.delete(djangoUrl + "/api/enrollments?student_id=" + studentId + "&course_id=" + courseId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
