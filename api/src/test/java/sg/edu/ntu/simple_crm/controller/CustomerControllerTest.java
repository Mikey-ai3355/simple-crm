package sg.edu.ntu.simple_crm.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import sg.edu.ntu.simple_crm.model.Customer;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class CustomerControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void getCustomerById_existingId_returnOk() throws Exception {

        // Step 1:Build a GET request to /customers/1
        RequestBuilder request = MockMvcRequestBuilders.get("/customers/1");

        // Step 2: Perform and assert
        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1));

    }

    @Test
    public void createCustomer_validCustomer_returnsCreated() throws Exception {
        // Step 1:
        // create a Customer objectMapper

        Customer newCustomer = Customer.builder()
                .firstName("Clint").lastName("Barton")
                .email("clint@avengers.com").contactNo("12345678")
                .jobTitle("Special Agent").yearOfBirth(1975)
                .build();

        // Step 2: Convert java object to a JSON formatted String:
        String newCustomerAsJSON = objectMapper.writeValueAsString(newCustomer)  ;
        
        // Step 3: Build the POST request
        RequestBuilder request = MockMvcRequestBuilders.post("/customers")
        .contentType(MediaType.APPLICATION_JSON)
        .content(newCustomerAsJSON);

        //Step 4: Perform and Assert
        mockMvc.perform(request)
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.firstName").value("Clint"))
        .andExpect(jsonPath("$.lastName").value("Barton"));

    }

}
