import time
import random
import string
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoAlertPresentException

def generate_random_email():
    """Generates a random email for unique registration."""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"testuser_{random_str}@example.com"

# --- Configuration ---
BASE_URL = "http://127.0.0.1:3005"
WAIT_TIME = 10  # Seconds for explicit waits

print("--- Starting Gym Discovery Automation Test ---")
print(f"Target URL: {BASE_URL}")

# Initialize Driver
try:
    driver = webdriver.Chrome()
    driver.maximize_window()
    wait = WebDriverWait(driver, WAIT_TIME)
except Exception as e:
    print(f"Error initializing ChromeDriver: {e}")
    exit(1)

try:
    # ---------------------------------------------------------
    # TEST CASE 1: Registration
    # ---------------------------------------------------------
    print("\n[TEST 1] Testing Registration...")
    
    driver.get(f"{BASE_URL}/pages/auth/register.html")
    
    # Generate unique credentials
    email = generate_random_email()
    password = "password123"
    name = "Automation User"
    phone = "9876543210"
    
    print(f"   -> Registering with Email: {email}")

    # Fill Form
    wait.until(EC.visibility_of_element_located((By.ID, "register-name"))).send_keys(name)
    driver.find_element(By.ID, "register-email").send_keys(email)
    driver.find_element(By.ID, "register-password").send_keys(password)
    driver.find_element(By.ID, "register-phone").send_keys(phone)
    
    # Submit
    submit_btn = driver.find_element(By.ID, "register-submit")
    submit_btn.click()
    
    # Handle possible alert (some implementations alert before redirect)
    try:
        WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        print(f"   -> Alert Text: {alert.text}")
        alert.accept()
    except TimeoutException:
        pass # No alert, might have redirected directly

    # Verify Redirect to Login
    try:
        wait.until(EC.url_contains("login.html"))
        print("   -> SUCCESS: Redirected to Login Page after registration.")
    except TimeoutException:
        print("   -> FAILURE: Did not redirect to Login Page.")
        raise Exception("Registration Verification Failed")


    # ---------------------------------------------------------
    # TEST CASE 2: Login
    # ---------------------------------------------------------
    print("\n[TEST 2] Testing Login...")
    
    # Ensure we are on login page
    if "login.html" not in driver.current_url:
        driver.get(f"{BASE_URL}/pages/auth/login.html")

    # Fill Login Form
    wait.until(EC.visibility_of_element_located((By.ID, "login-email"))).send_keys(email)
    driver.find_element(By.ID, "login-password").send_keys(password)
    
    # Submit
    driver.find_element(By.ID, "login-submit").click()
    
    # Verify Redirect to Dashboard (or Index depending on role)
    # Role 'user' -> user/dashboard.html
    try:
        wait.until(EC.url_contains("dashboard.html"))
        print("   -> SUCCESS: Logged in and redirected to Dashboard.")
    except TimeoutException:
         print(f"   -> FAILURE: Login did not redirect to dashboard. Current URL: {driver.current_url}")
         raise Exception("Login Verification Failed")


    # ---------------------------------------------------------
    # TEST CASE 3: Verify Home Page
    # ---------------------------------------------------------
    print("\n[TEST 3] Verifying Home Page Load...")
    
    driver.get(f"{BASE_URL}/index.html")
    
    # Check for specific IDs
    try:
        heading = wait.until(EC.visibility_of_element_located((By.ID, "home-heading")))
        print(f"   -> Found ID 'home-heading'. Text: {heading.text}")
        
        driver.find_element(By.ID, "navbar")
        print("   -> Found ID 'navbar'.")
        print("   -> SUCCESS: Home Page verified.")
    except Exception as e:
        print(f"   -> FAILURE: Home Page elements not found. {e}")
        raise


    # ---------------------------------------------------------
    # TEST CASE 4: Gym Search
    # ---------------------------------------------------------
    print("\n[TEST 4] Testing Gym Search (Patiala)...")
    
    driver.get(f"{BASE_URL}/pages/public/search-gyms.html")
    
    search_city = "Patiala"
    
    # Enter City
    city_input = wait.until(EC.visibility_of_element_located((By.ID, "city-input")))
    city_input.clear()
    city_input.send_keys(search_city)
    
    # Click Search
    search_btn = driver.find_element(By.ID, "search-button")
    search_btn.click()
    print(f"   -> Searching for '{search_city}'...")
    
    # Wait for results
    # The button text changes to "Searching..." then back to "Search Gyms"
    # We wait for it to be clickable again (or text change back)
    wait.until(EC.text_to_be_present_in_element((By.ID, "search-button"), "Search Gyms"))
    
    # Verify results container exists and has content
    results_container = driver.find_element(By.ID, "gym-results")
    
    # Allow a moment for DOM update if animation exists
    time.sleep(1) 
    
    results_text = results_container.text
    print(f"   -> Results Container Text: {results_text[:100]}...")
    
    if "No gyms found" in results_text or "No active gyms" in results_text:
        print("   -> SUCCESS: Search executed (No data found for Patiala, but handled correctly).")
    elif len(results_container.find_elements(By.CLASS_NAME, "card")) > 0:
        print("   -> SUCCESS: Search executed and Gym Cards found.")
    else:
        print("   -> WARNING: Search executed but results unclear.")

    print("\n-------------------------------------------")
    print("ALL TESTS COMPLETED SUCCESSFULLY")
    print("-------------------------------------------")

except Exception as e:
    print(f"\n[ERROR] Test Failed: {e}")
    driver.save_screenshot("error_screenshot.png")
    print("Screenshot saved as 'error_screenshot.png'")

finally:
    print("\nClosing browser in 3 seconds...")
    time.sleep(3)
    driver.quit()
