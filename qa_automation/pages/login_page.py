from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from pages.base_page import BasePage, BASE_URL


class LoginPage(BasePage):
    URL = BASE_URL + '/#/login'

    # Locators — based on actual rendered HTML from GlassInput/GlassButton components
    EMAIL_INPUT = (By.CSS_SELECTOR, 'input[type="email"]')
    PASSWORD_INPUT = (By.CSS_SELECTOR, 'input[type="password"]')
    SUBMIT_BUTTON = (By.CSS_SELECTOR, 'button[type="submit"]')
    FORGOT_PASSWORD_LINK = (By.CSS_SELECTOR, "a[href*='forgot-password']")
    SIGNUP_LINK = (By.CSS_SELECTOR, "a[href*='signup']")
    FORM = (By.TAG_NAME, 'form')
    ERROR_MESSAGE = (By.CSS_SELECTOR, '.error-text, [data-error], p[style*="color"]')
    SPINNER = (By.CSS_SELECTOR, 'div[style*="border-radius: 50%"][style*="border"]')
    PAGE_HEADING = (By.CSS_SELECTOR, 'h1.font-display')
    PASSWORD_TOGGLE = (By.CSS_SELECTOR, 'button[type="button"]')

    def load(self):
        self.navigate_to(self.URL)
        return self

    def is_loaded(self) -> bool:
        return self.is_element_present(*self.EMAIL_INPUT, timeout=10)

    def enter_email(self, email: str):
        self.type_text(*self.EMAIL_INPUT, email)

    def enter_password(self, password: str):
        self.type_text(*self.PASSWORD_INPUT, password)

    def click_submit(self):
        self.click(*self.SUBMIT_BUTTON)

    def login(self, email: str, password: str):
        self.enter_email(email)
        self.enter_password(password)
        self.click_submit()

    def get_email_value(self) -> str:
        return self.get_element_attribute(*self.EMAIL_INPUT, 'value')

    def get_password_value(self) -> str:
        return self.get_element_attribute(*self.PASSWORD_INPUT, 'value')

    def is_submit_disabled(self) -> bool:
        btn = self.find_element(*self.SUBMIT_BUTTON)
        return btn.get_attribute('disabled') is not None or btn.get_attribute('aria-disabled') == 'true'

    def click_forgot_password(self):
        self.click(*self.FORGOT_PASSWORD_LINK)

    def click_signup_link(self):
        self.click(*self.SIGNUP_LINK)

    def get_email_validation_message(self) -> str:
        el = self.find_element(*self.EMAIL_INPUT)
        return el.get_attribute('validationMessage') or ''

    def get_password_validation_message(self) -> str:
        el = self.find_element(*self.PASSWORD_INPUT)
        return el.get_attribute('validationMessage') or ''

    def toggle_password_visibility(self):
        if self.is_element_present(*self.PASSWORD_TOGGLE, timeout=3):
            self.click(*self.PASSWORD_TOGGLE)

    def wait_for_redirect_to_dashboard(self, timeout=10) -> bool:
        try:
            self.wait_for_url_contains('dashboard', timeout)
            return True
        except Exception:
            return False

    def is_redirected_to_dashboard(self) -> bool:
        return 'dashboard' in self.get_current_url()

    def submit_with_enter(self):
        pw_input = self.find_element(*self.PASSWORD_INPUT)
        pw_input.send_keys(Keys.RETURN)
