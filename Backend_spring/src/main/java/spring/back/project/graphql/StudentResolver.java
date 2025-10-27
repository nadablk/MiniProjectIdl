package spring.back.project.graphql;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import spring.back.project.model.Student;
import spring.back.project.model.University;
import spring.back.project.service.StudentService;
import spring.back.project.service.UniversityService;

import java.util.List;
import java.util.Map;

@Controller
public class StudentResolver {
    
    private final StudentService studentService;
    private final UniversityService universityService;
    
    public StudentResolver(StudentService studentService, UniversityService universityService) {
        this.studentService = studentService;
        this.universityService = universityService;
    }
    
    // ==================== QUERIES ====================
    
    @QueryMapping
    public List<Student> students() {
        return studentService.getAllStudents();
    }
    
    @QueryMapping
    public Student student(@Argument Long id) {
        return studentService.getStudentById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }
    
    @QueryMapping
    public List<Student> studentsByUniversity(@Argument Long universityId) {
        return studentService.getStudentsByUniversity(universityId);
    }
    
    @QueryMapping
    public List<Student> searchStudents(@Argument String query) {
        return studentService.searchStudents(query);
    }
    
    @QueryMapping
    public Map<String, Object> studentStats() {
        long totalStudents = studentService.getStudentCount();
        return Map.of("totalStudents", totalStudents);
    }
    
    // ==================== MUTATIONS ====================
    
    @MutationMapping
    public Student createStudent(@Argument Map<String, Object> input) {
        Student student = new Student();
        student.setFirstName((String) input.get("firstName"));
        student.setLastName((String) input.get("lastName"));
        student.setEmail((String) input.get("email"));
        
        // Set university if provided
        if (input.containsKey("universityId")) {
            Long universityId = Long.valueOf(input.get("universityId").toString());
            University university = universityService.getUniversityById(universityId)
                    .orElseThrow(() -> new RuntimeException("University not found with id: " + universityId));
            student.setUniversity(university);
        }
        
        return studentService.createStudent(student);
    }
    
    @MutationMapping
    public Student updateStudent(@Argument Long id, @Argument Map<String, Object> input) {
        Student student = studentService.getStudentById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        
        if (input.containsKey("firstName")) {
            student.setFirstName((String) input.get("firstName"));
        }
        if (input.containsKey("lastName")) {
            student.setLastName((String) input.get("lastName"));
        }
        if (input.containsKey("email")) {
            student.setEmail((String) input.get("email"));
        }
        if (input.containsKey("universityId")) {
            Long universityId = Long.valueOf(input.get("universityId").toString());
            University university = universityService.getUniversityById(universityId)
                    .orElseThrow(() -> new RuntimeException("University not found with id: " + universityId));
            student.setUniversity(university);
        }
        
        return studentService.updateStudent(id, student);
    }
    
    @MutationMapping
    public Boolean deleteStudent(@Argument Long id) {
        try {
            studentService.deleteStudent(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
