package com.hitanshi.uniflow.repository;

import com.hitanshi.uniflow.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByFacultyUsername(String username);

}