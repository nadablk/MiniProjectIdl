package graphql.graphql.resolver;

import graphql.graphql.client.DjangoClient;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class CourseEnrollmentResolver {
    
    private final DjangoClient djangoClient;
    
    public CourseEnrollmentResolver(DjangoClient djangoClient) {
        this.djangoClient = djangoClient;
    }
    
    // ===================================================================
    // COURSE QUERIES
    // ===================================================================
    
    @QueryMapping
    public Object allCourses() {
        return djangoClient.getAllCourses();
    }
    
    @QueryMapping
    public Object course(@Argument Long id) {
        return djangoClient.getCourse(id);
    }
    
    @QueryMapping
    public Object courseByName(@Argument String name) {
        // This would require a search endpoint on Django
        // For now, returning null - implement search on Django side
        return null;
    }
    
    // ===================================================================
    // ENROLLMENT QUERIES
    // ===================================================================
    
    @QueryMapping
    public Object allEnrollments() {
        return djangoClient.getAllEnrollments();
    }
    
    @QueryMapping
    public Object enrollmentsByCourse(@Argument Integer courseId) {
        return djangoClient.getEnrollmentsByCourse(courseId);
    }
    
    @QueryMapping
    public Object enrollmentsByStudent(@Argument Integer studentId) {
        return djangoClient.getEnrollmentsByStudent(studentId);
    }
    
    // ===================================================================
    // COURSE MUTATIONS
    // ===================================================================
    
    @MutationMapping
    public Object createCourse(
            @Argument String name, 
            @Argument String description) {
        Map<String, Object> course = new HashMap<>();
        course.put("name", name);
        if (description != null) {
            course.put("description", description);
        }
        return djangoClient.createCourse(course);
    }
    
    @MutationMapping
    public Object updateCourse(
            @Argument Long id, 
            @Argument String name, 
            @Argument String description) {
        Map<String, Object> course = new HashMap<>();
        if (name != null) course.put("name", name);
        if (description != null) course.put("description", description);
        return djangoClient.updateCourse(id, course);
    }
    
    @MutationMapping
    public Boolean deleteCourse(@Argument Long id) {
        return djangoClient.deleteCourse(id);
    }
    
    // ===================================================================
    // ENROLLMENT MUTATIONS
    // ===================================================================
    
    @MutationMapping
    public Object addStudentToCourse(
            @Argument Integer studentId, 
            @Argument Integer courseId) {
        Map<String, Object> enrollment = new HashMap<>();
        enrollment.put("student_id", studentId);
        enrollment.put("course_id", courseId);
        return djangoClient.addStudentToCourse(enrollment);
    }
    
    @MutationMapping
    public Boolean removeStudentFromCourse(
            @Argument Integer studentId, 
            @Argument Integer courseId) {
        return djangoClient.removeStudentFromCourse(studentId, courseId);
    }
}
