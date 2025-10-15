package spring.back.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import spring.back.project.model.Student;
import spring.back.project.model.University;
import spring.back.project.repository.StudentRepository;
import spring.back.project.repository.UniversityRepository;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UniversityRepository universityRepository;
    
    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    // Get student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }
    
    // Create student
    public Student createStudent(Student student) {
        // Validate university exists
        if (student.getUniversity() != null && student.getUniversity().getId() != null) {
            University university = universityRepository.findById(student.getUniversity().getId())
                    .orElseThrow(() -> new RuntimeException("University not found with id: " + student.getUniversity().getId()));
            student.setUniversity(university);
        }
        return studentRepository.save(student);
    }
    
    // Update student
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        
        // Update university if provided
        if (studentDetails.getUniversity() != null && studentDetails.getUniversity().getId() != null) {
            University university = universityRepository.findById(studentDetails.getUniversity().getId())
                    .orElseThrow(() -> new RuntimeException("University not found with id: " + studentDetails.getUniversity().getId()));
            student.setUniversity(university);
        }
        
        return studentRepository.save(student);
    }
    
    // Delete student
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        studentRepository.delete(student);
    }
    
    // Search students by name
    public List<Student> searchByName(String name) {
        return studentRepository.findByNameContaining(name);
    }
    
    // Search students (name or email)
    public List<Student> searchStudents(String search) {
        return studentRepository.searchStudents(search);
    }
    
    // Get students by university
    public List<Student> getStudentsByUniversity(Long universityId) {
        return studentRepository.findByUniversityId(universityId);
    }
    
    // Get student count
    public long getStudentCount() {
        return studentRepository.count();
    }
}
