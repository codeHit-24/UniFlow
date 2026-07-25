package com.hitanshi.uniflow.service;

import com.hitanshi.uniflow.dto.EnrollmentRequest;
import com.hitanshi.uniflow.entity.Course;
import com.hitanshi.uniflow.entity.Enrollment;
import com.hitanshi.uniflow.entity.Student;
import com.hitanshi.uniflow.repository.CourseRepository;
import com.hitanshi.uniflow.repository.EnrollmentRepository;
import com.hitanshi.uniflow.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;


    public Enrollment saveEnrollment(EnrollmentRequest request){

        Enrollment enrollment = new Enrollment();
        Student std = studentRepository.findById(request.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(request.getCourseId()).orElseThrow(() -> new RuntimeException("Course not found"));
        enrollment.setEnrollmentDate(request.getEnrollmentDate());
        enrollment.setStudent(std);
        enrollment.setCourse(course);

        return enrollmentRepository.save(enrollment);

    }
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

}
