package com.hitanshi.uniflow.repository;

import com.hitanshi.uniflow.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentUserUsername(String username);

    List<Enrollment> findByCourseFacultyUsername(String username);

    List<Enrollment> findByCourseId(Long courseId);

}