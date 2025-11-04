package graphql.graphql.resolver;

import graphql.graphql.client.SpringBootClient;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class StudentUniversityResolver {
    
    private final SpringBootClient springBootClient;
    
    public StudentUniversityResolver(SpringBootClient springBootClient) {
        this.springBootClient = springBootClient;
    }
    
    // ===================================================================
    // STUDENT QUERIES
    // ===================================================================
    
    @QueryMapping
    public Object allStudents() {
        return springBootClient.getAllStudents();
    }
    
    @QueryMapping
    public Object student(@Argument Long id) {
        return springBootClient.getStudent(id);
    }
    
    @QueryMapping
    public Object studentByName(@Argument String name) {
        // This would require a search endpoint on Spring Boot
        // For now, returning null - implement search on Spring Boot side
        return null;
    }
    
    // ===================================================================
    // UNIVERSITY QUERIES
    // ===================================================================
    
    @QueryMapping
    public Object allUniversities() {
        return springBootClient.getAllUniversities();
    }
    
    @QueryMapping
    public Object university(@Argument Long id) {
        return springBootClient.getUniversity(id);
    }
    
    @QueryMapping
    public Object universityByName(@Argument String name) {
        // This would require a search endpoint on Spring Boot
        // For now, returning null - implement search on Spring Boot side
        return null;
    }
    
    // ===================================================================
    // STUDENT MUTATIONS
    // ===================================================================
    
    @MutationMapping
    public Object createStudent(
            @Argument String name, 
            @Argument String email, 
            @Argument Long universityId) {
        Map<String, Object> student = new HashMap<>();
        student.put("name", name);
        student.put("email", email);
        if (universityId != null) {
            student.put("universityId", universityId);
        }
        return springBootClient.createStudent(student);
    }
    
    @MutationMapping
    public Object updateStudent(
            @Argument Long id, 
            @Argument String name, 
            @Argument String email, 
            @Argument Long universityId) {
        Map<String, Object> student = new HashMap<>();
        if (name != null) student.put("name", name);
        if (email != null) student.put("email", email);
        if (universityId != null) student.put("universityId", universityId);
        return springBootClient.updateStudent(id, student);
    }
    
    @MutationMapping
    public Boolean deleteStudent(@Argument Long id) {
        return springBootClient.deleteStudent(id);
    }
    
    // ===================================================================
    // UNIVERSITY MUTATIONS
    // ===================================================================
    
    @MutationMapping
    public Object createUniversity(
            @Argument String name, 
            @Argument String location) {
        Map<String, Object> university = new HashMap<>();
        university.put("name", name);
        if (location != null) {
            university.put("location", location);
        }
        return springBootClient.createUniversity(university);
    }
    
    @MutationMapping
    public Object updateUniversity(
            @Argument Long id, 
            @Argument String name, 
            @Argument String location) {
        Map<String, Object> university = new HashMap<>();
        if (name != null) university.put("name", name);
        if (location != null) university.put("location", location);
        return springBootClient.updateUniversity(id, university);
    }
    
    @MutationMapping
    public Boolean deleteUniversity(@Argument Long id) {
        return springBootClient.deleteUniversity(id);
    }
}
