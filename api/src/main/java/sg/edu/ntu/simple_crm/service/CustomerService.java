package sg.edu.ntu.simple_crm.service;

import java.util.List;

import sg.edu.ntu.simple_crm.model.Customer;
import sg.edu.ntu.simple_crm.model.Interaction;

public interface CustomerService {
    Customer createCustomer(Customer customer);

    Customer getCustomer(Long id);

    List<Customer> getAllCustomers();

    Customer updateCustomer(Long id, Customer customer);

    void deleteCustomer(Long id);
    Interaction addInteractionToCustomer(Long id, Interaction interaction);
   public List<Customer> searchCustomers(String firstName);

   List<Customer> searchCustomersByJobTitle(String jobTitle);

    List<Interaction> getAllInteractionsForCustomer(Long id);

    long getTotalCustomers();

    long getTotalInteractions();

    long getCustomersWithInteractions();

}
