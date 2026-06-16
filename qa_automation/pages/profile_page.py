from selenium.webdriver.common.by import By
from pages.base_page import BasePage, BASE_URL


class ProfilePage(BasePage):
    URL = BASE_URL + '/#/settings/profile'

    # Locators
    PAGE_HEADING = (By.CSS_SELECTOR, 'h1.font-display')
    NAME_INPUT = (By.CSS_SELECTOR, 'input[type="text"]:first-of-type, input.glass-input[placeholder*="name"], input.glass-input[placeholder*="Name"]')
    EMAIL_INPUT = (By.CSS_SELECTOR, 'input[type="email"]')
    AGE_INPUT = (By.CSS_SELECTOR, 'input[type="number"]:first-of-type')
    GENDER_SELECT = (By.CSS_SELECTOR, 'select.glass-select')
    HEIGHT_INPUT = (By.CSS_SELECTOR, 'input[type="number"]:nth-of-type(2)')
    WEIGHT_INPUT = (By.CSS_SELECTOR, 'input[type="number"]:nth-of-type(3)')
    SAVE_BUTTON = (By.CSS_SELECTOR, 'button.glass-btn')
    SUCCESS_INDICATOR = (By.CSS_SELECTOR, 'button.glass-btn')
    ALL_INPUTS = (By.CSS_SELECTOR, 'input.glass-input')
    FORM_CARD = (By.CSS_SELECTOR, '.glass-card')

    def load(self):
        self.navigate_to(self.URL)
        return self

    def is_loaded(self) -> bool:
        return self.is_element_present(*self.FORM_CARD, timeout=10)

    def get_name_value(self) -> str:
        if self.is_element_present(*self.NAME_INPUT, timeout=5):
            return self.get_element_attribute(*self.NAME_INPUT, 'value')
        return ''

    def get_email_value(self) -> str:
        if self.is_element_present(*self.EMAIL_INPUT, timeout=5):
            return self.get_element_attribute(*self.EMAIL_INPUT, 'value')
        return ''

    def set_name(self, name: str):
        if self.is_element_present(*self.NAME_INPUT, timeout=5):
            self.type_text(*self.NAME_INPUT, name)

    def set_email(self, email: str):
        if self.is_element_present(*self.EMAIL_INPUT, timeout=5):
            self.type_text(*self.EMAIL_INPUT, email)

    def click_save(self):
        self.click(*self.SAVE_BUTTON)

    def is_save_button_present(self) -> bool:
        return self.is_element_present(*self.SAVE_BUTTON, timeout=5)

    def get_save_button_text(self) -> str:
        if self.is_element_present(*self.SAVE_BUTTON, timeout=5):
            return self.get_text(*self.SAVE_BUTTON)
        return ''

    def count_inputs(self) -> int:
        if self.is_element_present(*self.ALL_INPUTS, timeout=5):
            return len(self.find_elements(*self.ALL_INPUTS))
        return 0
