package com.hitanshi.uniflow.repository;

import com.hitanshi.uniflow.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentUserUsername(String username);

    List<Enrollment> findByCourseFacultyUsername(String username);

    List<Enrollment> findByCourseId(Long courseId);


    @Query("""
        SELECT COUNT(DISTINCT e.student.id)
        FROM Enrollment e
        WHERE e.course.faculty.username = :username
    """)
    long countDistinctStudentsByFacultyUsername(
            @Param("username") String username
    );
}