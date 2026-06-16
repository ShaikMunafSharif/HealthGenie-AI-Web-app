
import pytest
import os
import json
from datetime import datetime
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils.driver_factory import DriverFactory
from utils.screenshot_handler import ScreenshotHandler

BASE_URL = 'https://ShaikMunafSharif.github.io/HealthGenie-AI-Web-app'

def pytest_addoption(parser):
    parser.addoption('--browser', action='store', default='chrome',
                     help='Browser to run tests: chrome, firefox, edge')
    parser.addoption('--headless', action='store_true', default=True,
                     help='Run browser in headless mode')
    parser.addoption('--base-url', action='store', default=BASE_URL,
                     help='Base URL of the application under test')

@pytest.fixture(scope='session')
def base_url(request):
    return request.config.getoption('--base-url')

@pytest.fixture(scope='function')
def browser(request):
    return request.config.getoption('--browser')

@pytest.fixture(scope='function')
def driver(request, browser):
    headless = request.config.getoption('--headless')
    drv = DriverFactory.get_driver(browser, headless=headless)
    drv.set_window_size(1366, 768)
    yield drv
    drv.quit()

@pytest.fixture(scope='function')
def authenticated_driver(driver, base_url):
    """Fixture that provides a driver pre-authenticated by injecting localStorage."""
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        lambda d: d.execute_script('return document.readyState') == 'complete'
    )
    auth_state = {
        'state': {
            'user': {
                'name': 'Test User',
                'email': 'testuser@healthgenie.com',
                'age': '25',
                'gender': 'male',
                'height': '175',
                'weight': '70',
                'id': 1718522400000
            },
            'isAuthenticated': True,
            'hasCompletedOnboarding': True,
            'hasCompletedSetup': True
        },
        'version': 0
    }
    driver.execute_script(
        f"localStorage.setItem('healthgenie-auth', JSON.stringify({json.dumps(auth_state)}))"
    )
    driver.get(base_url + '/#/dashboard')
    WebDriverWait(driver, 15).until(
        lambda d: d.execute_script('return document.readyState') == 'complete'
    )
    return driver

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    if rep.when == 'call' and rep.failed:
        driver = item.funcargs.get('driver') or item.funcargs.get('authenticated_driver')
        if driver:
            os.makedirs('qa_automation/screenshots', exist_ok=True)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            safe_name = item.name.replace('/', '_').replace('[', '_').replace(']', '_')
            path = f'qa_automation/screenshots/FAIL_{safe_name}_{timestamp}.png'
            driver.save_screenshot(path)
            print(f'\nScreenshot saved: {path}')
