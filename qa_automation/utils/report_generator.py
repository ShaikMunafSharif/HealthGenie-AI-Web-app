
from datetime import datetime
import os


class ReportGenerator:
    @staticmethod
    def generate_html_report(results: list, output_path: str = 'qa_automation/reports/test_report.html'):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        passed = sum(1 for r in results if r['status'] == 'PASS')
        failed = sum(1 for r in results if r['status'] == 'FAIL')
        skipped = sum(1 for r in results if r['status'] == 'SKIP')
        total = len(results)
        pass_rate = round((passed / total * 100), 1) if total > 0 else 0

        rows = ''
        for r in results:
            color = '#1a3a1a' if r['status'] == 'PASS' else '#3a1a1a' if r['status'] == 'FAIL' else '#2a2a1a'
            badge = '<span style="background:#39FF14;color:#000;padding:2px 10px;border-radius:12px;font-size:0.8rem">PASS</span>' if r['status'] == 'PASS' else '<span style="background:#FF0040;color:#fff;padding:2px 10px;border-radius:12px;font-size:0.8rem">FAIL</span>' if r['status'] == 'FAIL' else '<span style="background:#FFB347;color:#000;padding:2px 10px;border-radius:12px;font-size:0.8rem">SKIP</span>'
            screenshot_cell = f'<a href="../screenshots/{r.get("screenshot","")}">View</a>' if r.get('screenshot') else 'N/A'
            rows += f'<tr style="background:{color}"><td>{r["id"]}</td><td>{r["name"]}</td><td>{r["category"]}</td><td>{r["browser"]}</td><td>{badge}</td><td>{r.get("duration","N/A")}s</td><td>{screenshot_cell}</td></tr>'

        html = f"""<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<title>HealthGenie AI — Selenium Test Report</title>
<style>
body{{font-family:Inter,sans-serif;background:#020510;color:#e0e8f0;margin:0;padding:0}}
.header{{background:linear-gradient(135deg,rgba(0,245,255,0.1),rgba(57,255,20,0.05));border-bottom:1px solid rgba(0,245,255,0.2);padding:32px 40px}}
h1{{font-size:2rem;margin:0;background:linear-gradient(90deg,#00F5FF,#39FF14);-webkit-background-clip:text;-webkit-text-fill-color:transparent}}
.meta{{color:#8a9ab0;margin-top:8px;font-size:0.9rem}}
.dashboard{{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;padding:32px 40px}}
.card{{background:rgba(10,25,60,0.6);border:1px solid rgba(0,245,255,0.15);border-radius:16px;padding:24px;text-align:center}}
.card .num{{font-size:2.5rem;font-weight:700;font-family:monospace}}
.card .label{{color:#8a9ab0;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px}}
.total .num{{color:#00F5FF}}
.passed .num{{color:#39FF14}}
.failed .num{{color:#FF0040}}
.skipped .num{{color:#FFB347}}
.rate .num{{color:#BF5FFF}}
table{{width:calc(100% - 80px);margin:0 40px 40px;border-collapse:collapse;font-size:0.88rem}}
th{{background:rgba(0,245,255,0.08);color:#00F5FF;padding:12px 16px;text-align:left;border-bottom:1px solid rgba(0,245,255,0.2)}}
td{{padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.05)}}
.section-title{{padding:8px 40px 0;color:#8a9ab0;text-transform:uppercase;letter-spacing:0.1em;font-size:0.78rem}}
</style>
</head>
<body>
<div class='header'>
<h1>HealthGenie AI — Selenium E2E Test Report</h1>
<div class='meta'>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} &nbsp;|&nbsp; Tester: QA Automation Suite &nbsp;|&nbsp; Target: https://ShaikMunafSharif.github.io/HealthGenie-AI-Web-app</div>
</div>
<div class='dashboard'>
<div class='card total'><div class='num'>{total}</div><div class='label'>Total Tests</div></div>
<div class='card passed'><div class='num'>{passed}</div><div class='label'>Passed</div></div>
<div class='card failed'><div class='num'>{failed}</div><div class='label'>Failed</div></div>
<div class='card skipped'><div class='num'>{skipped}</div><div class='label'>Skipped</div></div>
<div class='card rate'><div class='num'>{pass_rate}%</div><div class='label'>Pass Rate</div></div>
</div>
<p class='section-title'>Test Results</p>
<table>
<thead><tr><th>Test ID</th><th>Test Name</th><th>Category</th><th>Browser</th><th>Status</th><th>Duration</th><th>Screenshot</th></tr></thead>
<tbody>{rows}</tbody>
</table>
</body>
</html>"""
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        return output_path
