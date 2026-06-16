
import os
from datetime import datetime


class ScreenshotHandler:
    SCREENSHOT_DIR = 'qa_automation/screenshots'

    @classmethod
    def ensure_dir(cls):
        os.makedirs(cls.SCREENSHOT_DIR, exist_ok=True)

    @classmethod
    def take_screenshot(cls, driver, name: str) -> str:
        cls.ensure_dir()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'{name}_{timestamp}.png'
        path = os.path.join(cls.SCREENSHOT_DIR, filename)
        driver.save_screenshot(path)
        return path

    @classmethod
    def take_failure_screenshot(cls, driver, test_name: str) -> str:
        safe_name = test_name.replace(' ', '_').replace('/', '_')
        return cls.take_screenshot(driver, f'FAIL_{safe_name}')

    @classmethod
    def take_pass_screenshot(cls, driver, test_name: str) -> str:
        safe_name = test_name.replace(' ', '_').replace('/', '_')
        return cls.take_screenshot(driver, f'PASS_{safe_name}')
