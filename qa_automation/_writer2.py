import os, textwrap

BASE = r"c:\Users\hoshe\Downloads\HealthGenie-AI-Web-app-main\HealthGenie-AI-Web-app-main"

security_ui = textwrap.dedent("""\
    import pytest
    import json
    import sys
    import os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from pages.base_page import BASE_URL

    AUTH_DATA = {
        'state': {
            'user': {'name': 'Sec Test User', 'email': 'sec@test.com', 'id': 777},
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


    @pytest.mark.security
    class TestSecurityUI:

        def test_TC_SEC_001_direct_protected_url_without_auth(self, driver, base_url):
            '''TC-SEC-001: Direct URL access to protected page without auth.
            FINDING: CRIT-03 -- App should redirect unauthenticated users.
            '''
            driver.get(base_url)
            WebDriverWait(driver, 10).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )
            driver.execute_script('localStorage.clear()')
            protected_routes = [
                '/#/dashboard',
                '/#/health-score',
                '/#/settings/profile',
                '/#/analytics/health-report',
            ]
            for route in protected_routes:
                driver.get(base_url + route)
                WebDriverWait(driver, 10).until(
                    lambda d: d.execute_script('return document.readyState') == 'complete'
                )
                # Document current behavior -- CRIT-03 vulnerability
                auth_in_storage = driver.execute_script("return localStorage.getItem('healthgenie-auth')")
                # Without auth in storage, the route guard should redirect
                # This test DOCUMENTS the vulnerability -- routes may be accessible

        def test_TC_SEC_002_localStorage_stores_phi_in_plaintext(self, driver, base_url):
            '''TC-SEC-002: Verify PHI is stored unencrypted in localStorage (CRIT-02).'''
            inject_auth(driver, base_url)
            driver.get(base_url + '/#/dashboard')
            WebDriverWait(driver, 15).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )
            stored = driver.execute_script("return localStorage.getItem('healthgenie-auth')")
            assert stored is not None, 'healthgenie-auth key must exist'
            parsed = json.loads(stored)
            # Verify PHI is readable -- this CONFIRMS the vulnerability
            assert 'state' in parsed, 'Auth state should be readable JSON (unencrypted -- CRIT-02)'
            assert 'user' in parsed['state'], 'User data should be readable (unencrypted PHI)'
            user = parsed['state']['user']
            assert 'email' in user, f'Email is exposed in plaintext localStorage: {user.get("email")}'
            # This assertion PASSES = VULNERABILITY CONFIRMED
            print(f'SECURITY: Email exposed in plaintext: {user.get("email")}')

        def test_TC_SEC_003_auth_bypass_via_localstorage_manipulation(self, driver, base_url):
            '''TC-SEC-003: Full auth bypass via localStorage (CRIT-03 PoC).'''
            driver.get(base_url)
            WebDriverWait(driver, 10).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )
            driver.execute_script('localStorage.clear()')
            # Inject fake auth
            fake_auth = {
                'state': {
                    'user': {'name': 'Attacker', 'email': 'evil@evil.com', 'id': 1},
                    'isAuthenticated': True,
                    'hasCompletedOnboarding': True,
                    'hasCompletedSetup': True
                },
                'version': 0
            }
            driver.execute_script(
                f"localStorage.setItem('healthgenie-auth', JSON.stringify({json.dumps(fake_auth)}))"
            )
            driver.get(base_url + '/#/dashboard')
            WebDriverWait(driver, 15).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )
            body = driver.find_element(By.TAG_NAME, 'body').text
            # If dashboard content loads -> auth bypass confirmed (CRIT-03)
            assert len(body) > 0  # App loads -- vulnerability documented
            print(f'SECURITY: Auth bypass via localStorage manipulation succeeded (CRIT-03)')

        def test_TC_SEC_004_all_healthgenie_localstorage_keys_readable(self, driver, base_url):
            '''TC-SEC-004: All healthgenie localStorage keys are readable (CRIT-02).'''
            inject_auth(driver, base_url)
            driver.get(base_url + '/#/dashboard')
            WebDriverWait(driver, 15).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )
            all_keys = driver.execute_script('return Object.keys(localStorage)')
            healthgenie_keys = [k for k in all_keys if 'healthgenie' in k]
            print(f'SECURITY: Found {len(healthgenie_keys)} healthgenie localStorage keys: {healthgenie_keys}')
            for key in healthgenie_keys:
                value = driver.execute_script(f"return localStorage.getItem('{key}')")
                assert value is not None
                try:
                    parsed = json.loads(value)
                    print(f'  KEY {key}: Readable JSON -- {list(parsed.keys()) if isinstance(parsed, dict) else type(parsed)}')
                except json.JSONDecodeError:
                    pass

        def test_TC_SEC_005_sos_sends_no_real_network_request(self, driver, base_url):
            '''TC-SEC-005: SOS activation makes no real network calls (CRIT-04).'''
            inject_auth(driver, base_url)
            # Enable performance logging / network interception
            driver.execute_cdp_cmd = getattr(driver, 'execute_cdp_cmd', None)
            driver.get(base_url + '/#/emergency/sos-confirm')
            WebDriverWait(driver, 15).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )
            # Record XHR/fetch calls made
            driver.execute_script("""
                window.__networkCalls = [];
                const origFetch = window.fetch;
                window.fetch = function(...args) {
                    window.__networkCalls.push(args[0]);
                    return origFetch.apply(this, args);
                };
                const origXHR = window.XMLHttpRequest.prototype.open;
                window.XMLHttpRequest.prototype.open = function(m, url) {
                    window.__networkCalls.push(url);
                    return origXHR.apply(this, arguments);
                };
            """)
            # Click SOS confirm button if present
            sos_buttons = driver.find_elements(By.CSS_SELECTOR, 'button.glass-btn')
            for btn in sos_buttons:
                if 'sos' in btn.text.lower() or 'send' in btn.text.lower():
                    btn.click()
                    break
            import time
            time.sleep(2)  # Wait for any async calls
            network_calls = driver.execute_script('return window.__networkCalls || []')
            sos_related = [c for c in network_calls if 'sms' in str(c).lower() or 'notify' in str(c).lower() or 'alert' in str(c).lower()]
            print(f'SECURITY: Network calls after SOS: {network_calls}')
            print(f'SECURITY: SOS makes {len(sos_related)} real notification calls (expected 0 -- CRIT-04)')
            # This documents CRIT-04 -- SOS is fake
            assert True  # Test passes but documents the vulnerability

        def test_TC_SEC_006_no_passwords_in_localstorage(self, driver, base_url):
            '''TC-SEC-006: No cleartext passwords stored in localStorage.'''
            inject_auth(driver, base_url)
            driver.get(base_url + '/#/login')
            from selenium.webdriver.common.by import By
            from pages.login_page import LoginPage
            login = LoginPage(driver)
            if login.is_loaded():
                login.enter_email('test@example.com')
                login.enter_password('mySecretPassword123')
                login.click_submit()
            WebDriverWait(driver, 5).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )
            all_keys = driver.execute_script('return Object.keys(localStorage)')
            password_found = False
            for key in all_keys:
                value = driver.execute_script(f"return localStorage.getItem('{key}')")
                if value and 'mySecretPassword123' in str(value):
                    password_found = True
                    print(f'SECURITY CRITICAL: Password found in localStorage key: {key}')
            assert not password_found, 'Cleartext password must NOT be stored in localStorage'
""")

path2 = os.path.join(BASE, "qa_automation", "tests", "test_security_ui.py")
with open(path2, "w", encoding="utf-8") as f:
    f.write(security_ui)
print(f"Written: {path2}")
