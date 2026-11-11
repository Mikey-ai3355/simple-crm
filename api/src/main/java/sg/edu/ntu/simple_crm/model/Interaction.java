package sg.edu.ntu.simple_crm.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@Entity 
@Table(name = "interaction")
public class Interaction {

    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name ="id")
    private Long id;

    @Column(name = "remarks")
    private String remarks;

    @Column (name = "interaction_date")
    private LocalDate interactionDate;

    @ManyToOne(optional =false)
    @JoinColumn (name ="customer_id" , referencedColumnName = "id")
    private Customer customer;
    
}
