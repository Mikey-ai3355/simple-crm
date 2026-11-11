package sg.edu.ntu.simple_crm.service;

import java.util.List;

import org.springframework.stereotype.Service;

import sg.edu.ntu.simple_crm.exceptions.CustomerNotFoundException;
import sg.edu.ntu.simple_crm.model.Customer;
import sg.edu.ntu.simple_crm.model.Interaction;
import sg.edu.ntu.simple_crm.repository.CustomerRepository;
import sg.edu.ntu.simple_crm.repository.InteractionRepository;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final InteractionRepository interactionRepository;
    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, InteractionRepository interactionRepository) {
        this.customerRepository = customerRepository;
        this.interactionRepository = interactionRepository;
    }

    // Create
    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Get one customer
    @Override
    public Customer getCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
    }

    // Get All Customer
    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // updateCustomer
    @Override
    public Customer updateCustomer(Long id, Customer customer) {
        // Retrieve customer to be updated
        Customer customerToUpdate = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        // Update the fileds
        customerToUpdate.setFirstName(customer.getFirstName());
        customerToUpdate.setLastName(customer.getLastName());
        customerToUpdate.setEmail(customer.getEmail());
        customerToUpdate.setContactNo(customer.getContactNo());
        customerToUpdate.setJobTitle(customer.getJobTitle());
        customerToUpdate.setYearOfBirth(customer.getYearOfBirth());

        // save and return the updated customer
        return customerRepository.save(customerToUpdate);
    }

    // delete
    @Override
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    @Override
    public Interaction addInteractionToCustomer(Long id, Interaction interaction) {

        // Step 1: find the customer
        Customer selectedCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));

        // Step 2: Link the customer to interaction
        interaction.setCustomer(selectedCustomer);

        // Step 3: Save and return the interaction
        return interactionRepository.save(interaction);
    }

    @Override
    public List<Customer> searchCustomers(String firstName) {

        return customerRepository.findByFirstName(firstName);
    }

    @Override
    public List<Customer> searchCustomersByJobTitle(String jobTitle) {
        return customerRepository.findByJobTitleJPQL(jobTitle);
    }

    // Read all interactions for a customer (newest first)
    @Override
    public List<Interaction> getAllInteractionsForCustomer(Long id) {
        Customer selectedCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
        return interactionRepository.findByCustomerOrderByInteractionDateDesc(selectedCustomer);
    }

    // Stats
    @Override
    public long getTotalCustomers() {
        return customerRepository.count();
    }

    @Override
    public long getTotalInteractions() {
        return interactionRepository.count();
    }

    @Override
    public long getCustomersWithInteractions() {
        List<Interaction> all = interactionRepository.findAll();
        return all.stream().map(Interaction::getCustomer).filter(java.util.Objects::nonNull)
                .map(Customer::getId).distinct().count();
    }

}
