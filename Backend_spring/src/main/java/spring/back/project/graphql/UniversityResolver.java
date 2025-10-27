package spring.back.project.graphql;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import spring.back.project.model.University;
import spring.back.project.service.UniversityService;

import java.util.List;
import java.util.Map;

@Controller
public class UniversityResolver {
    
    private final UniversityService universityService;
    
    public UniversityResolver(UniversityService universityService) {
        this.universityService = universityService;
    }
    
    // ==================== QUERIES ====================
    
    @QueryMapping
    public List<University> universities() {
        return universityService.getAllUniversities();
    }
    
    @QueryMapping
    public University university(@Argument Long id) {
        return universityService.getUniversityById(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));
    }
    
    @QueryMapping
    public List<University> searchUniversities(@Argument String name) {
        return universityService.searchByName(name);
    }
    
    // ==================== MUTATIONS ====================
    
    @MutationMapping
    public University createUniversity(@Argument Map<String, Object> input) {
        University university = new University();
        university.setName((String) input.get("name"));
        university.setLocation((String) input.get("location"));
        
        return universityService.createUniversity(university);
    }
    
    @MutationMapping
    public University updateUniversity(@Argument Long id, @Argument Map<String, Object> input) {
        University university = universityService.getUniversityById(id)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + id));
        
        if (input.containsKey("name")) {
            university.setName((String) input.get("name"));
        }
        if (input.containsKey("location")) {
            university.setLocation((String) input.get("location"));
        }
        
        return universityService.updateUniversity(id, university);
    }
    
    @MutationMapping
    public Boolean deleteUniversity(@Argument Long id) {
        try {
            universityService.deleteUniversity(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
