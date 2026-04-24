import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

/**
 * Selenium Java Validation for User Registration Password Constraints.
 */
public class RegistrationValidation {
    public static void main(String[] args) {
        // Setup Chrome Driver (ensure chromedriver is in path)
        System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
        WebDriver driver = new ChromeDriver();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            // Navigate to the registration page
            driver.get("http://localhost:3000/pages/auth/register_enhanced.html");

            // Define test cases for password
            String[] testPasswords = {
                "short",           // Length < 8
                "toolongpassword12345", // Length > 15
                "NoDigit!",        // Missing digit
                "nodigit1!",       // Missing uppercase
                "NODIGIT1!",       // Missing lowercase
                "NoSpecial1",      // Missing special char
                "Has Space 1!",    // Contains whitespace
                "Valid123!"        // Valid
            };

            for (String pwd : testPasswords) {
                System.out.println("Testing password: " + pwd);
                
                WebElement passwordField = driver.findElement(By.id("password"));
                WebElement submitBtn = driver.findElement(By.id("register-submit"));
                
                passwordField.clear();
                passwordField.sendKeys(pwd);
                
                // Fill other mandatory fields to allow submission
                driver.findElement(By.id("username")).clear();
                driver.findElement(By.id("username")).sendKeys("testuser");
                driver.findElement(By.id("name")).clear();
                driver.findElement(By.id("name")).sendKeys("Test User");
                driver.findElement(By.id("email")).clear();
                driver.findElement(By.id("email")).sendKeys("test@example.com");
                driver.findElement(By.id("phone")).clear();
                driver.findElement(By.id("phone")).sendKeys("1234567890");

                submitBtn.click();

                // Check for error message
                WebElement errorMsg = driver.findElement(By.id("validation-errors"));
                
                if (pwd.equals("Valid123!")) {
                    // Expect success or no validation error on screen
                    if (errorMsg.isDisplayed()) {
                        System.out.println("FAILED: Valid password rejected: " + errorMsg.getText());
                    } else {
                        System.out.println("PASSED: Valid password accepted.");
                    }
                } else {
                    // Expect error message
                    wait.until(ExpectedConditions.visibilityOf(errorMsg));
                    System.out.println("PASSED: Invalid password caught. Error: " + errorMsg.getText());
                }
                
                driver.navigate().refresh();
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit();
        }
    }

    /**
     * Logic verification helper (similar to JS implementation)
     */
    public static boolean validatePassword(String password) {
        if (password.length() < 8 || password.length() > 15) return false;
        if (!password.matches(".*\\d.*")) return false;
        if (!password.matches(".*[A-Z].*")) return false;
        if (!password.matches(".*[a-z].*")) return false;
        if (!password.matches(".*[!@#$%&*()\\-+=^].*")) return false;
        if (password.contains(" ")) return false;
        return true;
    }
}
