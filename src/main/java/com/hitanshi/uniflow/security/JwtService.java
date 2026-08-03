package com.hitanshi.uniflow.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;

import java.util.Date;

@Service
public class JwtService {

    private static final SecretKey SECRET_KEY =
            Keys.hmacShaKeyFor(
                    "mySuperSecretKeyForUniFlowERPProject2026JWT123456"
                            .getBytes()
            );

    public String generateToken(String username) {

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60)
                )
                .signWith(SECRET_KEY)
                .compact();

    }

    public String extractUsername(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();

    }

    public boolean isTokenValid(String token, String username) {

        return extractUsername(token).equals(username);

    }

}