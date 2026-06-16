from selenium.webdriver.common.by import By
from pages.base_page import BasePage, BASE_URL


class HomePage(BasePage):
    URL = BASE_URL
    SPLASH_URL = BASE_URL + '/#/splash'

    # Locators
    APP_TITLE = (By.CSS_SELECTOR, 'h1.font-display, h2.font-display')
    GET_STARTED_BTN = (By.CSS_SELECTOR, 'button.glass-btn-primary')
    LOGIN_LINK = (By.CSS_SELECTOR, "a[href*='login']")
    SIGN_UP_LINK = (By.CSS_SELECTOR, "a[href*='signup']")
    BODY = (By.TAG_NAME, 'body')
    ANY_HEADING = (By.CSS_SELECTOR, 'h1, h2, h3')

    def load(self):
        self.navigate_to(self.URL)
        return self

    def load_splash(self):
        self.navigate_to(self.SPLASH_URL)
        return self

    def is_loaded(self) -> bool:
        return self.is_element_present(*self.BODY, timeout=10)

    def has_any_heading(self) -> bool:
        return self.is_element_present(*self.ANY_HEADING, timeout=10)

    def click_get_started(self):
        if self.is_element_present(*self.GET_STARTED_BTN, timeout=5):
            self.click(*self.GET_STARTED_BTN)
        else:
            self.navigate_to(BASE_URL + '/#/login')

    def click_login_link(self):
        if self.is_element_present(*self.LOGIN_LINK, timeout=5):
            self.click(*self.LOGIN_LINK)
        else:
            self.navigate_to(BASE_URL + '/#/login')

    def get_page_heading_text(self) -> str:
        if self.is_element_present(*self.ANY_HEADING, timeout=5):
            return self.get_text(*self.ANY_HEADING)
        return ''
