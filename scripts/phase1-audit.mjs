import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

const onclickRegex = /onclick\s*=\s*["']\s*([a-zA-Z_$][\w$]*)\s*\(/g;

const functionPatterns = [
  /function\s+([a-zA-Z_$][\w$]*)\s*\(/g,
  /async\s+function\s+([a-zA-Z_$][\w$]*)\s*\(/g,
  /(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g
];

const onclickFunctions = new Set();
for (const m of html.matchAll(onclickRegex)) onclickFunctions.add(m[1]);

const implementedFunctions = new Set();
for (const regex of functionPatterns) {
  for (const m of js.matchAll(regex)) implementedFunctions.add(m[1]);
}

const missingHandlers = [...onclickFunctions].filter((fn) => !implementedFunctions.has(fn)).sort();

const attendanceDomIds = ['attendanceVideo', 'attendanceCanvas', 'btnStartAttendance', 'btnStopAttendance'];
const missingDomIds = attendanceDomIds.filter((id) => !html.includes(`id="${id}"`));

const attendanceFunctions = ['startAttendanceScanner', 'stopAttendanceScanner', 'testFaceVerification'];
const missingAttendanceFunctions = attendanceFunctions.filter((fn) => !implementedFunctions.has(fn));

const report = {
  timestamp: new Date().toISOString(),
  checks: {
    onclick_handler_coverage: {
      totalHandlers: onclickFunctions.size,
      totalImplementedFunctions: implementedFunctions.size,
      missingHandlers,
      status: missingHandlers.length === 0 ? 'pass' : 'fail'
    },
    attendance_dom_presence: {
      checkedIds: attendanceDomIds,
      missingDomIds,
      status: missingDomIds.length === 0 ? 'pass' : 'fail'
    },
    attendance_function_presence: {
      checkedFunctions: attendanceFunctions,
      missingAttendanceFunctions,
      status: missingAttendanceFunctions.length === 0 ? 'pass' : 'fail'
    }
  }
};

fs.writeFileSync('phase1-audit-report.json', JSON.stringify(report, null, 2));

const failed = Object.values(report.checks).some((c) => c.status === 'fail');
console.log(`Phase 1 audit complete. Report: phase1-audit-report.json`);
for (const [name, check] of Object.entries(report.checks)) {
  console.log(`- ${name}: ${check.status.toUpperCase()}`);
}

process.exit(failed ? 1 : 0);
