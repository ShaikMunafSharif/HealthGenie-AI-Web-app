from selenium.webdriver.common.by import By
from pages.base_page import BasePage, BASE_URL


class DashboardPage(BasePage):
    URL = BASE_URL + '/#/dashboard'

    # Locators
    PAGE_HEADING = (By.CSS_SELECTOR, 'h1.font-display')
    HEALTH_SCORE = (By.CSS_SELECTOR, '.font-data')
    SIDEBAR = (By.CSS_SELECTOR, 'aside')
    NAV_LINKS = (By.CSS_SELECTOR, 'aside a, nav a')
    MODULE_CARDS = (By.CSS_SELECTOR, '.glass-card')
    GREETING = (By.CSS_SELECTOR, 'h1.font-display')
    DAILY_STATS = (By.CSS_SELECTOR, '.glass-card .font-data')
    AI_INSIGHTS = (By.CSS_SELECTOR, 'p[style*="color: var(--text-primary)"], p.text-primary')
    STREAK_BADGE = (By.CSS_SELECTOR, '[class*="streak"], .streak-badge')
    TOPBAR = (By.CSS_SELECTOR, 'header, [style*="position: fixed"][style*="top: 0"]')
    FLOATING_CHAT_BTN = (By.CSS_SELECTOR, 'button[style*="bottom"][style*="right"]')
    BODY = (By.TAG_NAME, 'body')
    ANY_HEADING = (By.CSS_SELECTOR, 'h1')

    def load(self):
        self.navigate_to(self.URL)
        return self

    def is_loaded(self) -> bool:
        return self.is_element_present(*self.BODY, timeout=12)

    def has_heading(self) -> bool:
        return self.is_element_present(*self.ANY_HEADING, timeout=10)

    def get_greeting_text(self) -> str:
        if self.is_element_present(*self.GREETING, timeout=5):
            return self.get_text(*self.GREETING)
        return ''

    def get_health_score_text(self) -> str:
        if self.is_element_present(*self.HEALTH_SCORE, timeout=5):
            return self.get_text(*self.HEALTH_SCORE)
        return ''

    def click_nav_item_by_href(self, path: str):
        self.click(By.CSS_SELECTOR, f'a[href*="{path}"]')

    def get_nav_link_count(self) -> int:
        if self.is_element_present(*self.NAV_LINKS, timeout=5):
            return len(self.find_elements(*self.NAV_LINKS))
        return 0

    def get_glass_card_count(self) -> int:
        if self.is_element_present(*self.MODULE_CARDS, timeout=5):
            return len(self.find_elements(*self.MODULE_CARDS))
        return 0

    def is_sidebar_present(self) -> bool:
        return self.is_element_present(*self.SIDEBAR, timeout=5)

    def is_floating_chat_present(self) -> bool:
        return self.is_element_present(*self.FLOATING_CHAT_BTN, timeout=5)

    def click_floating_chat(self):
        self.click(*self.FLOATING_CHAT_BTN)

    def navigate_to_health_score(self):
        self.navigate_to(BASE_URL + '/#/health-score')

    def navigate_to_symptoms(self):
        self.navigate_to(BASE_URL + '/#/symptoms/select')

    def navigate_to_water(self):
        self.navigate_to(BASE_URL + '/#/water')

    def navigate_to_emergency(self):
        self.navigate_to(BASE_URL + '/#/emergency')

    def navigate_to_women(self):
        self.navigate_to(BASE_URL + '/#/women/dashboard')

    def navigate_to_analytics(self):
        self.navigate_to(BASE_URL + '/#/analytics/progress')
