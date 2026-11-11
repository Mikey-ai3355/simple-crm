package sg.edu.ntu.simple_crm.config;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import sg.edu.ntu.simple_crm.model.Customer;
import sg.edu.ntu.simple_crm.repository.CustomerRepository;

@Component
public class DataLoader {

    private CustomerRepository customerRepository;

    public DataLoader(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @PostConstruct
    public void loadData() {
        // Only seed the demo data when the database is empty, so that real
        // customers survive an app restart (e.g. a Render free-tier cold start).
        if (customerRepository.count() > 0) {
            return;
        }

        customerRepository.save(new Customer("Tony", "Stark"));
        customerRepository.save(new Customer("Bruce", "Banner"));
        customerRepository.save(new Customer("Peter", "Parker"));
        customerRepository.save(new Customer("Stephen", "Strange"));

    }

}
