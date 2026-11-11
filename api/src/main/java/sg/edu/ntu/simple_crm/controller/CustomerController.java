package sg.edu.ntu.simple_crm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import sg.edu.ntu.simple_crm.model.Customer;
import sg.edu.ntu.simple_crm.model.Interaction;
import sg.edu.ntu.simple_crm.service.CustomerServiceImpl;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerServiceImpl customerService;

    public CustomerController(CustomerServiceImpl customerService) {
        this.customerService = customerService;
    }

    // Create
    @PostMapping()
    public ResponseEntity<Customer> createCustomer(@RequestBody @Valid Customer customer) {
        Customer newCustomer = customerService.createCustomer(customer);
        return new ResponseEntity<>(newCustomer, HttpStatus.OK);
    }

    // Read (Get All)
    @GetMapping()
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> allCustomers = customerService.getAllCustomers();
        return new ResponseEntity<>(allCustomers, HttpStatus.OK);
    }

    // get customer by id
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        
            Customer foundCustomer = customerService.getCustomer(id);
            return new ResponseEntity<>(foundCustomer, HttpStatus.OK);

       

    }

    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam String firstName) {
        List<Customer> foundCustomers = customerService.searchCustomers(firstName);
        return new ResponseEntity<>(foundCustomers, HttpStatus.OK);

    }

    @GetMapping("/search/job")
    public ResponseEntity<List<Customer>>searchCustomerByJobTitle(@RequestParam String jobTitle) {
        List<Customer> foundCustomers = customerService.searchCustomersByJobTitle(jobTitle);
        return new ResponseEntity<>(foundCustomers, HttpStatus.OK);
    }
    

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        
            Customer updatedCustomer = customerService.updateCustomer(id, customer);
            return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
        
    }

    // delete
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCustomer(@PathVariable Long id) {
        
            customerService.deleteCustomer(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
       
    }

    @PostMapping("/{id}/interactions")
    public ResponseEntity<Interaction> addInteractionToCustomer(@PathVariable Long id,
            @RequestBody Interaction interaction) {

        Interaction newInteraction = customerService.addInteractionToCustomer(id, interaction);
        return new ResponseEntity<>(newInteraction, HttpStatus.CREATED);
    }

    // Read all interactions for a customer (newest first)
    @GetMapping("/{id}/interactions")
    public ResponseEntity<List<Interaction>> getCustomerInteractions(@PathVariable Long id) {
        List<Interaction> interactions = customerService.getAllInteractionsForCustomer(id);
        return new ResponseEntity<>(interactions, HttpStatus.OK);
    }

    // Workspace stats for the dashboard
    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Long>> getStats() {
        java.util.Map<String, Long> stats = new java.util.LinkedHashMap<>();
        stats.put("totalCustomers", customerService.getTotalCustomers());
        stats.put("totalInteractions", customerService.getTotalInteractions());
        stats.put("customersWithInteractions", customerService.getCustomersWithInteractions());
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

}
