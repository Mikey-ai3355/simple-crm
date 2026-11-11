package sg.edu.ntu.simple_crm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import sg.edu.ntu.simple_crm.security.JwtAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    // Only JwtAuthFilter is injected here.
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // REST APIs using stateless JWT auth do not need CSRF protection.
            // CSRF is designed for browser-based session flows; since we never issue
            // a session cookie, there is nothing for a cross-site request to hijack.
            .csrf(csrf -> csrf.disable())

            // Stateless: Spring Security will not create or use sessions.
            // Every request must carry a valid JWT token.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // /auth/login and /health are public; everything else needs a valid token
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/login", "/health").permitAll()
                .anyRequest().authenticated()
            )

            // Register JWT filter to run before username/password authentication
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Unchanged from Lesson 4.1
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Unchanged from Lesson 4.1
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.builder()
                .username("user")
                .password(passwordEncoder.encode("password"))
                .roles("USER")
                .build();

        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .roles("ADMIN")
                .build();

        UserDetails manager = User.builder()
                .username("manager")
                .password(passwordEncoder.encode("manager123"))
                .roles("MANAGER")
                .build();

        return new InMemoryUserDetailsManager(user, admin, manager);
    }
}

