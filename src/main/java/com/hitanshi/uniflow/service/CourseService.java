package com.hitanshi.uniflow.service;

import com.hitanshi.uniflow.dto.CourseResponseDTO;
import com.hitanshi.uniflow.entity.Course;
import com.hitanshi.uniflow.entity.Student;
import com.hitanshi.uniflow.exception.ResourceNotFoundException;
import com.hitanshi.uniflow.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course saveCourse(Course course){
        return courseRepository.save(course);
    }

    public List<CourseResponseDTO> getCourses(){
        return courseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public Course getCourseById(Long id){
        return courseRepository.findById(id).orElse(null);
    }

    public boolean deleteCourseById(Long id){
        boolean status = false;
        try{
            courseRepository.deleteById(id);
            status = true;
        }
        catch (Exception e){
            e.printStackTrace();
            status = false;
        }
        return status;
    }

    private CourseResponseDTO convertToDTO(Course course){

        return new CourseResponseDTO(
                course.getId(),
                course.getCourseName(),
                course.getCourseCode(),
                course.getCredits(),
                course.getDepartment()
        );
    }

    public Course updateCourse(Long id, Course updatedCourse){

        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course with id "
                                        + id
                                        + " not found"
                        )
                );


        existingCourse.setCourseName(
                updatedCourse.getCourseName()
        );

        existingCourse.setCourseCode(
                updatedCourse.getCourseCode()
        );

        existingCourse.setDepartment(
                updatedCourse.getDepartment()
        );

        existingCourse.setCredits(
                updatedCourse.getCredits()
        );

        existingCourse.setFaculty(
                updatedCourse.getFaculty()
        );

        return courseRepository.save(existingCourse);
    }

    public List<CourseResponseDTO> getCoursesForFaculty(String username) {

        return courseRepository.findByFacultyUsername(username)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }
}
