package com.hitanshi.uniflow.repository;

import com.hitanshi.uniflow.dto.EnrollmentRequest;
import com.hitanshi.uniflow.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
}
