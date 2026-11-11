package sg.edu.ntu.simple_crm.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

public class DemoServiceTest {

    DemoService demoService;

    @BeforeEach
    public void init() {
        demoService = new DemoService();
    }

    @Test
    public void calculateAge_validYear_returnsCorrectAge() {
        // 1: Arrange
        int expectedAge = 35;

        // 2 ACT
        int actualAge = demoService.calculateAge(1990, 2025);

        // 3 ASSERT
        assertEquals(expectedAge, actualAge, "Age should be current year minus year of birth");

    }

    @ParameterizedTest
    @CsvSource({
            "1990, 2025, 35",
            "1965, 2025, 60",
            "2000, 2025, 25",
            "2025, 2025, 0"
    })
    public void calculateAge_variousYears_returnsCorrectAge(int yearOfBirth, int currentYear, int expectedAge) {
        // 1 ACT

        int actualAge = demoService.calculateAge(yearOfBirth, currentYear);

        // 2: Assert
        assertEquals(expectedAge, actualAge);

    }

    @Test 

    public void formatFullName_validNames_returnsFullNames()
    {
       //1: ARRANGE
       String expectedFullName ="Clint Barton";

       //2. ACT
       String actualFullName = demoService.formatFullName("Clint", "Barton");

       //3. Assert
       assertEquals(expectedFullName, actualFullName, " Full name should be first and last name joined by a space");

    }
}
