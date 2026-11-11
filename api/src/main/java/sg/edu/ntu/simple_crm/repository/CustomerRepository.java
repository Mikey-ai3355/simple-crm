package sg.edu.ntu.simple_crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sg.edu.ntu.simple_crm.model.Customer;
import java.util.List;


public interface CustomerRepository extends JpaRepository<Customer, Long>{

    // find all customers by firstName
    List<Customer> findByFirstName(String firstName);
    
    // JPQL- 
    @Query ("SELECT c FROM Customer c where c.jobTitle = :jobTitle")
    List<Customer> findByJobTitleJPQL(@Param("jobTitle") String jobTitle);
}
