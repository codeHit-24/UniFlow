package com.hitanshi.uniflow.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequest {

    private Long studentId;
    private Long courseId;
    private LocalDate enrollmentDate;
}
