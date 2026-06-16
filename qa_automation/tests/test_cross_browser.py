import pytest
import json
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from utils.driver_factory import DriverFactory
from pages.login_page import LoginPage
from pages.base_page import BASE_URL

AUTH_DATA = {
    'state': {
        'user': {'name': 'Cross Browser User', 'email': 'xb@test.com', 'id': 321},
        'isAuthenticated': True,
        'hasCompletedOnboarding': True,
        'hasCompletedSetup': True
    },
    'version': 0
}


@pytest.mark.cross_browser
@pytest.mark.parametrize('browser_name', ['chrome', 'firefox', 'edge'])
class TestCrossBrowser:

    @pytest.fixture(autouse=True)
    def setup_browser(self, browser_name):
        self.drv = DriverFactory.get_driver(browser_name, headless=True)
        self.drv.set_window_size(1366, 768)
        yield
        self.drv.quit()

    def _inject(self):
        self.drv.get(BASE_URL)
        WebDriverWait(self.drv, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        self.drv.execute_script(
            f"localStorage.setItem('healthgenie-auth', JSON.stringify({json.dumps(AUTH_DATA)}))"
        )

    def test_TC_XB_001_splash_page_loads(self, browser_name):
        """TC-XB-001: Splash page loads across all browsers."""
        self.drv.get(BASE_URL)
        WebDriverWait(self.drv, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        body = self.drv.find_element(By.TAG_NAME, 'body')
        assert body is not None, f'[{browser_name}] Body element must be present on splash page'
        print(f'[{browser_name}] Splash page loaded successfully')

    def test_TC_XB_002_login_page_renders(self, browser_name):
        """TC-XB-002: Login page renders with email input on all browsers."""
        self.drv.get(BASE_URL + '/#/login')
        WebDriverWait(self.drv, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        email_inputs = self.drv.find_elements(By.CSS_SELECTOR, 'input[type="email"]')
        assert len(email_inputs) > 0, \
            f'[{browser_name}] Login email input must be present, found {len(email_inputs)}'
        print(f'[{browser_name}] Login page with email input confirmed')

    def test_TC_XB_003_dashboard_loads_authenticated(self, browser_name):
        """TC-XB-003: Dashboard loads with glass-card components across all browsers."""
        self._inject()
        self.drv.get(BASE_URL + '/#/dashboard')
        WebDriverWait(self.drv, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        cards = self.drv.find_elements(By.CSS_SELECTOR, '.glass-card')
        assert len(cards) > 0, \
            f'[{browser_name}] Dashboard glass-cards must render, found {len(cards)}'
        print(f'[{browser_name}] Dashboard rendered with {len(cards)} glass-cards')

    def test_TC_XB_004_localstorage_accessible(self, browser_name):
        """TC-XB-004: localStorage is accessible and readable on all browsers."""
        self._inject()
        stored = self.drv.execute_script("return localStorage.getItem('healthgenie-auth')")
        assert stored is not None, \
            f'[{browser_name}] localStorage must be accessible and contain healthgenie-auth'
        parsed = json.loads(stored)
        assert parsed['state']['isAuthenticated'] is True, \
            f'[{browser_name}] isAuthenticated must be true in stored state'
        print(f'[{browser_name}] localStorage accessible and auth state verified')

    def test_TC_XB_005_login_form_accepts_input(self, browser_name):
        """TC-XB-005: Login form inputs accept keyboard input on all browsers."""
        self.drv.get(BASE_URL + '/#/login')
        WebDriverWait(self.drv, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        email_els = self.drv.find_elements(By.CSS_SELECTOR, 'input[type="email"]')
        if email_els:
            email_els[0].send_keys('browser@test.com')
            typed_value = email_els[0].get_attribute('value')
            assert typed_value == 'browser@test.com', \
                f'[{browser_name}] Email input should accept typing, got: {typed_value}'
            print(f'[{browser_name}] Email input typing confirmed: {typed_value}')
        else:
            pytest.skip(f'[{browser_name}] Email input not found — login page may not have loaded')
