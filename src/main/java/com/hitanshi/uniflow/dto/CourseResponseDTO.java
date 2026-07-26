package com.hitanshi.uniflow.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CourseResponseDTO {

    private Long id;
    private String courseName;
    private String courseCode;
    private Integer credits;
    private String department;

}