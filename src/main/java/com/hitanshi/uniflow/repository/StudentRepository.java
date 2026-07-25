package com.hitanshi.uniflow.repository;

import com.hitanshi.uniflow.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
