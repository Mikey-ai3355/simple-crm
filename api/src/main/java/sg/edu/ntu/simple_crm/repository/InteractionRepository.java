package sg.edu.ntu.simple_crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import sg.edu.ntu.simple_crm.model.Customer;
import sg.edu.ntu.simple_crm.model.Interaction;

import java.util.List;

public interface InteractionRepository extends JpaRepository<Interaction , Long> {

    // All interactions for a given customer, newest first.
    @Query("SELECT i FROM Interaction i WHERE i.customer = :customer ORDER BY i.interactionDate DESC")
    List<Interaction> findByCustomerOrderByInteractionDateDesc(Customer customer);
}
