package sg.edu.ntu.simple_crm.auth;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginRequest {
    private String username;
    private String password;
}
