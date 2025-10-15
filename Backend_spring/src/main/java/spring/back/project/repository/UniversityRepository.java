package spring.back.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spring.back.project.model.University;

import java.util.List;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    
    List<University> findByNameContainingIgnoreCase(String name);
    
    List<University> findByLocation(String location);
}
