import json
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException

BASE_URL = 'https://ShaikMunafSharif.github.io/HealthGenie-AI-Web-app'


class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 15)
        self.short_wait = WebDriverWait(driver, 5)

    def navigate_to(self, url: str):
        self.driver.get(url)
        self.wait_for_page_load()

    def wait_for_page_load(self):
        self.wait.until(lambda d: d.execute_script('return document.readyState') == 'complete')

    def find_element(self, by, value, timeout=15):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )

    def find_elements(self, by, value, timeout=10):
        WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )
        return self.driver.find_elements(by, value)

    def click(self, by, value, timeout=15):
        el = WebDriverWait(self.driver, timeout).until(
            EC.element_to_be_clickable((by, value))
        )
        el.click()

    def type_text(self, by, value, text: str, clear_first: bool = True):
        el = self.find_element(by, value)
        if clear_first:
            el.clear()
        el.send_keys(text)

    def get_text(self, by, value, timeout=10) -> str:
        el = self.find_element(by, value, timeout)
        return el.text

    def is_element_present(self, by, value, timeout=5) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return True
        except TimeoutException:
            return False

    def is_element_visible(self, by, value, timeout=5) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located((by, value))
            )
            return True
        except TimeoutException:
            return False

    def wait_for_url_contains(self, text: str, timeout=15):
        WebDriverWait(self.driver, timeout).until(
            EC.url_contains(text)
        )

    def wait_for_url_changes_from(self, current_url: str, timeout=15):
        WebDriverWait(self.driver, timeout).until(
            lambda d: d.current_url != current_url
        )

    def get_current_url(self) -> str:
        return self.driver.current_url

    def get_page_title(self) -> str:
        return self.driver.title

    def get_local_storage_item(self, key: str):
        result = self.driver.execute_script(f"return localStorage.getItem('{key}')")
        if result:
            try:
                return json.loads(result)
            except json.JSONDecodeError:
                return result
        return None

    def set_local_storage_item(self, key: str, value):
        json_value = json.dumps(value)
        self.driver.execute_script(f"localStorage.setItem('{key}', JSON.stringify({json_value}))")

    def clear_local_storage(self):
        self.driver.execute_script('localStorage.clear()')

    def get_all_local_storage_keys(self) -> list:
        return self.driver.execute_script('return Object.keys(localStorage)')

    def inject_auth_state(self, user_data: dict = None):
        if user_data is None:
            user_data = {
                'name': 'Test User',
                'email': 'testuser@healthgenie.com',
                'age': '25',
                 'gender': 'male',
                'height': '175',
                'weight': '70',
                'id': 1718522400000
            }
        auth_state = {
            'state': {
                'user': user_data,
                'isAuthenticated': True,
                'hasCompletedOnboarding': True,
                'hasCompletedSetup': True
            },
            'version': 0
        }
        self.driver.execute_script(
            f"localStorage.setItem('healthgenie-auth', JSON.stringify({json.dumps(auth_state)}))"
        )

    def get_console_logs(self) -> list:
        try:
            logs = self.driver.get_log('browser')
            return [log['message'] for log in logs]
        except Exception:
            return []

    def scroll_to_element(self, by, value):
        el = self.find_element(by, value)
        self.driver.execute_script('arguments[0].scrollIntoView(true);', el)
        return el

    def get_element_attribute(self, by, value, attribute: str) -> str:
        el = self.find_element(by, value)
        return el.get_attribute(attribute)

    def wait_for_element_to_disappear(self, by, value, timeout=10):
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.invisibility_of_element_located((by, value))
            )
            return True
        except TimeoutException:
            return False
