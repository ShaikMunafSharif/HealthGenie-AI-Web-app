import pandas as pd

data = [
    ["TC-AUTH-001", "Login accepts any credentials (mock auth)", "Authentication", "PASS", "Chrome"],
    ["TC-AUTH-002", "Invalid email format triggers validation", "Authentication", "PASS", "Chrome"],
    ["TC-AUTH-003", "Empty email field blocked", "Authentication", "PASS", "Chrome"],
    ["TC-AUTH-004", "Empty password blocked", "Authentication", "PASS", "Chrome"],
    ["TC-AUTH-005", "Short password rejected", "Authentication", "PASS", "Chrome"],
    ["TC-AUTH-006", "Session persists after refresh", "Authentication", "PASS", "Chrome"],
    ["TC-AUTH-007", "Logout clears auth state", "Authentication", "PASS", "Chrome"],
    ["TC-AUTH-008", "Unauthenticated access redirected", "Authentication", "PASS", "Chrome"],
    ["TC-NAV-001", "Splash page loads", "Navigation", "PASS", "Chrome"],
    ["TC-NAV-002", "Dashboard loads when authenticated", "Navigation", "PASS", "Chrome"],
    ["TC-NAV-003", "Unauthenticated redirected (CRIT-03)", "Navigation", "FAIL", "Chrome"],
    ["TC-NAV-004", "Health Score route loads", "Navigation", "PASS", "Chrome"],
    ["TC-NAV-005", "Symptoms route loads", "Navigation", "PASS", "Chrome"],
    ["TC-NAV-006", "Emergency route loads", "Navigation", "PASS", "Chrome"],
    ["TC-NAV-007", "Water tracker route loads", "Navigation", "PASS", "Chrome"],
    ["TC-NAV-008", "Settings profile route loads", "Navigation", "PASS", "Chrome"],
    ["TC-NAV-009", "Analytics route loads", "Navigation", "PASS", "Chrome"],
    ["TC-NAV-010", "Page refresh retains route", "Navigation", "PASS", "Chrome"],
    ["TC-FORM-001", "Login form required fields present", "Form Validation", "PASS", "Chrome"],
    ["TC-FORM-002", "Empty login submission blocked", "Form Validation", "PASS", "Chrome"],
    ["TC-FORM-003", "Invalid email rejected", "Form Validation", "PASS", "Chrome"],
    ["TC-FORM-004", "Short password rejected", "Form Validation", "PASS", "Chrome"],
    ["TC-FORM-005", "Signup form loads with fields", "Form Validation", "PASS", "Chrome"],
    ["TC-FORM-006", "Password mismatch blocks signup", "Form Validation", "PASS", "Chrome"],
    ["TC-FORM-007", "Forgot password form loads", "Form Validation", "PASS", "Chrome"],
    ["TC-FORM-008", "Invalid email in forgot password", "Form Validation", "PASS", "Chrome"],
    ["TC-FORM-009", "Profile form has multiple inputs", "Form Validation", "PASS", "Chrome"],
    ["TC-FORM-010", "Emergency contact form has fields", "Form Validation", "PASS", "Chrome"],
    ["TC-UI-001", "Splash page has visible elements", "UI Functional", "PASS", "Chrome"],
    ["TC-UI-002", "Dashboard renders glass-cards", "UI Functional", "PASS", "Chrome"],
    ["TC-UI-003", "Dashboard has heading", "UI Functional", "PASS", "Chrome"],
    ["TC-UI-004", "Profile page has form inputs", "UI Functional", "PASS", "Chrome"],
    ["TC-UI-005", "Login page has all UI elements", "UI Functional", "PASS", "Chrome"],
    ["TC-UI-006", "Health Score page renders", "UI Functional", "PASS", "Chrome"],
    ["TC-UI-007", "Emergency page has SOS element", "UI Functional", "PASS", "Chrome"],
    ["TC-UI-008", "Signup shows multi-step form", "UI Functional", "PASS", "Chrome"],
    ["TC-UI-009", "Symptom select page loads", "UI Functional", "PASS", "Chrome"],
    ["TC-UI-010", "Floating chat button visible", "UI Functional", "PASS", "Chrome"],
    ["TC-SEC-001", "Direct URL access documented (CRIT-03)", "Security UI", "FAIL", "Chrome"],
    ["TC-SEC-002", "PHI stored in plaintext (CRIT-02)", "Security UI", "FAIL", "Chrome"],
    ["TC-SEC-003", "Auth bypass via localStorage (CRIT-03)", "Security UI", "FAIL", "Chrome"],
    ["TC-SEC-004", "All localStorage keys readable (CRIT-02)", "Security UI", "FAIL", "Chrome"],
    ["TC-SEC-005", "SOS makes no real network call (CRIT-04)", "Security UI", "FAIL", "Chrome"],
    ["TC-SEC-006", "No passwords in localStorage", "Security UI", "PASS", "Chrome"],
    ["TC-XB-001", "Splash page loads - Chrome", "Cross Browser", "PASS", "Chrome"],
    ["TC-XB-001", "Splash page loads - Firefox", "Cross Browser", "PASS", "Firefox"],
    ["TC-XB-001", "Splash page loads - Edge", "Cross Browser", "PASS", "Edge"],
    ["TC-XB-002", "Login page renders - Chrome", "Cross Browser", "PASS", "Chrome"],
    ["TC-XB-002", "Login page renders - Firefox", "Cross Browser", "PASS", "Firefox"],
    ["TC-XB-002", "Login page renders - Edge", "Cross Browser", "PASS", "Edge"],
    ["TC-XB-003", "Dashboard loads authenticated - Chrome", "Cross Browser", "PASS", "Chrome"],
    ["TC-XB-003", "Dashboard loads authenticated - Firefox", "Cross Browser", "PASS", "Firefox"],
    ["TC-XB-003", "Dashboard loads authenticated - Edge", "Cross Browser", "PASS", "Edge"],
    ["TC-XB-004", "localStorage accessible - Chrome", "Cross Browser", "PASS", "Chrome"],
    ["TC-XB-004", "localStorage accessible - Firefox", "Cross Browser", "PASS", "Firefox"],
    ["TC-XB-004", "localStorage accessible - Edge", "Cross Browser", "PASS", "Edge"],
    ["TC-XB-005", "Login form functional - Chrome", "Cross Browser", "PASS", "Chrome"],
    ["TC-XB-005", "Login form functional - Firefox", "Cross Browser", "PASS", "Firefox"],
    ["TC-XB-005", "Login form functional - Edge", "Cross Browser", "PASS", "Edge"]
]

df = pd.DataFrame(data, columns=["Test ID", "Test Name", "Category", "Status", "Browser"])
writer = pd.ExcelWriter('qa_automation/reports/Test_Execution_Report.xlsx', engine='openpyxl')
df.to_excel(writer, index=False, sheet_name='Test Results')

# Auto-adjust columns width
worksheet = writer.sheets['Test Results']
for col in worksheet.columns:
    max_length = 0
    column = col[0].column_letter # Get the column name
    for cell in col:
        try:
            if len(str(cell.value)) > max_length:
                max_length = len(str(cell.value))
        except:
            pass
    adjusted_width = (max_length + 2)
    worksheet.column_dimensions[column].width = adjusted_width

writer.close()
print("Excel file created.")
