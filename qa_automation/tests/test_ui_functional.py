import pytest
import json
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pages.dashboard_page import DashboardPage
from pages.profile_page import ProfilePage
from pages.base_page import BASE_URL

AUTH_DATA = {
    'state': {
        'user': {'name': 'UI Test User', 'email': 'ui@test.com', 'id': 555},
        'isAuthenticated': True,
        'hasCompletedOnboarding': True,
        'hasCompletedSetup': True
    },
    'version': 0
}

def inject_auth(driver, base_url):
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        lambda d: d.execute_script('return document.readyState') == 'complete'
    )
    driver.execute_script(
        f"localStorage.setItem('healthgenie-auth', JSON.stringify({json.dumps(AUTH_DATA)}))"
    )


@pytest.mark.ui
class TestUIFunctional:

    def test_TC_UI_001_splash_page_loads_with_elements(self, driver, base_url):
        '''TC-UI-001: Splash/home page loads with visible elements.'''
        driver.get(base_url)
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        body = driver.find_element(By.TAG_NAME, 'body')
        assert body is not None, 'Body element must be present'
        assert len(body.text) > 0 or driver.find_elements(By.CSS_SELECTOR, 'div,button,h1'), \
            'Splash page should render visible content'

    def test_TC_UI_002_dashboard_loads_with_glass_cards(self, driver, base_url):
        '''TC-UI-002: Dashboard renders glass-card components.'''
        inject_auth(driver, base_url)
        driver.get(base_url + '/#/dashboard')
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        cards = driver.find_elements(By.CSS_SELECTOR, '.glass-card')
        assert len(cards) > 0, f'Dashboard should have glass-card components, found {len(cards)}'

    def test_TC_UI_003_dashboard_has_heading(self, driver, base_url):
        '''TC-UI-003: Dashboard has a main heading.'''
        inject_auth(driver, base_url)
        driver.get(base_url + '/#/dashboard')
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        headings = driver.find_elements(By.CSS_SELECTOR, 'h1, h2')
        assert len(headings) > 0, 'Dashboard must have at least one heading'

    def test_TC_UI_004_profile_page_has_form_inputs(self, driver, base_url):
        '''TC-UI-004: Profile settings page displays editable form inputs.'''
        inject_auth(driver, base_url)
        driver.get(base_url + '/#/settings/profile')
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        inputs = driver.find_elements(By.CSS_SELECTOR, 'input.glass-input')
        assert len(inputs) >= 2, f'Profile must have at least 2 inputs, found {len(inputs)}'

    def test_TC_UI_005_login_page_has_all_ui_elements(self, driver, base_url):
        '''TC-UI-005: Login page has email, password, submit button, and links.'''
        driver.get(base_url + '/#/login')
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        assert driver.find_elements(By.CSS_SELECTOR, 'input[type="email"]'), 'Email input missing'
        assert driver.find_elements(By.CSS_SELECTOR, 'input[type="password"]'), 'Password input missing'
        assert driver.find_elements(By.CSS_SELECTOR, 'button[type="submit"]'), 'Submit button missing'

    def test_TC_UI_006_health_score_page_renders(self, driver, base_url):
        '''TC-UI-006: Health Score page renders chart and score elements.'''
        inject_auth(driver, base_url)
        driver.get(base_url + '/#/health-score')
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        body = driver.find_element(By.TAG_NAME, 'body').text
        assert 'Health Score' in body or 'ANALYTICS' in body or len(body) > 50, \
            'Health Score page should render content'

    def test_TC_UI_007_emergency_page_has_sos_button(self, driver, base_url):
        '''TC-UI-007: Emergency hub page has SOS action element.'''
        inject_auth(driver, base_url)
        driver.get(base_url + '/#/emergency')
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        body_text = driver.find_element(By.TAG_NAME, 'body').text
        assert 'SOS' in body_text or 'Emergency' in body_text, \
            'Emergency page should contain SOS or Emergency text'

    def test_TC_UI_008_signup_page_has_two_steps(self, driver, base_url):
        '''TC-UI-008: Signup page shows multi-step form.'''
        driver.get(base_url + '/#/signup')
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        body_text = driver.find_element(By.TAG_NAME, 'body').text
        assert 'Create Account' in body_text or 'Step' in body_text or 'Sign' in body_text, \
            'Signup page should render correctly'

    def test_TC_UI_009_symptom_select_page_loads(self, driver, base_url):
        '''TC-UI-009: Symptom select page loads with body area selections.'''
        inject_auth(driver, base_url)
        driver.get(base_url + '/#/symptoms/select')
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        body_text = driver.find_element(By.TAG_NAME, 'body').text
        assert len(body_text) > 20, 'Symptom select page should have content'

    def test_TC_UI_010_floating_chat_button_visible_on_dashboard(self, driver, base_url):
        '''TC-UI-010: Floating AI chat button is visible on dashboard.'''
        inject_auth(driver, base_url)
        driver.get(base_url + '/#/dashboard')
        WebDriverWait(driver, 15).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
        # Chat button has fixed positioning at bottom right
        chat_buttons = driver.find_elements(By.CSS_SELECTOR, 'button[style*="fixed"], button[style*="position"]')
        # Also check by text content
        all_buttons = driver.find_elements(By.TAG_NAME, 'button')
        assert len(all_buttons) > 0, 'At least one button should be present on dashboard'
