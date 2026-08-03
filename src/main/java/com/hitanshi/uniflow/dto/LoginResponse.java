package com.hitanshi.uniflow.dto;

import com.hitanshi.uniflow.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;

public class LoginResponse {

    private String token;

    @Autowired
    private JwtService jwtService;

    public String getToken() {
        return token;
    }

    public void setToken(String message) {
        this.token = message;
    }


}
