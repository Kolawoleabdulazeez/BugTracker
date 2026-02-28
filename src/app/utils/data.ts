// ─── Data ────────────────────────────────────────────────────────────────────
 
// ─── Types ───────────────────────────────────────────────────────────────────
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Status   = "Open" | "In Progress" | "Resolved" | "Closed";
export type PassFail = "Pass" | "Fail" | "Pending" | "Blocked";

interface Bug       { id: string; title: string; severity: Severity; status: Status; reporter: string; date: string }
interface TestCase  { id: string; title: string; result: PassFail; assignee: string; duration: string }
interface Member    { name: string; role: string; avatar: string; bugs: number; resolved: number }
interface SectionData {
  title: string;
  accent: string;
  icon: string;
  description: string;
  stats: { label: string; value: string | number; delta?: string }[];
  bugs: Bug[];
  tests: TestCase[];
  members: Member[];
}

export const DATA: Record<string, SectionData> = {
  Android: {
    title: "Android", accent: "#22c55e", icon: "🤖", description: "Native Android app — React Native + Kotlin modules",
    stats: [
      { label: "Open Bugs",      value: 14, delta: "+2 this week" },
      { label: "Crash Rate",     value: "0.8%", delta: "↓ 0.3%" },
      { label: "Test Coverage",  value: "74%", delta: "↑ 6%" },
      { label: "Avg Fix Time",   value: "2.1d" },
    ],
    bugs: [
      { id: "AND-041", title: "App crashes on Android 14 cold start",      severity: "Critical", status: "In Progress", reporter: "Tolu A.",  date: "Feb 24" },
      { id: "AND-039", title: "Push notifications not delivered on MIUI",  severity: "High",     status: "Open",        reporter: "James K.", date: "Feb 22" },
      { id: "AND-035", title: "Dark mode flicker on navigation drawer",    severity: "Medium",   status: "Open",        reporter: "Sade O.",  date: "Feb 20" },
      { id: "AND-031", title: "Back gesture conflict with bottom sheet",    severity: "Low",      status: "Resolved",    reporter: "Kola B.",  date: "Feb 18" },
    ],
    tests: [
      { id: "TC-A01", title: "Login flow on Android 13+",       result: "Pass",    assignee: "Tolu A.",  duration: "1m 12s" },
      { id: "TC-A02", title: "Biometric authentication",        result: "Pass",    assignee: "Sade O.",  duration: "0m 48s" },
      { id: "TC-A03", title: "Offline mode data sync",          result: "Fail",    assignee: "James K.", duration: "3m 05s" },
      { id: "TC-A04", title: "Deep link handling",              result: "Pending", assignee: "Kola B.",  duration: "—" },
      { id: "TC-A05", title: "Background location permission",  result: "Blocked", assignee: "Tolu A.",  duration: "—" },
    ],
    members: [
      { name: "Tolu Adesanya",  role: "QA Engineer",    avatar: "TA", bugs: 6,  resolved: 4 },
      { name: "James Kwame",    role: "Mobile Dev",     avatar: "JK", bugs: 4,  resolved: 2 },
      { name: "Sade Okafor",    role: "QA Analyst",     avatar: "SO", bugs: 3,  resolved: 3 },
      { name: "Kola Babatunde", role: "Tech Lead",      avatar: "KB", bugs: 1,  resolved: 1 },
    ],
  },
  IOS: {
    title: "iOS", accent: "#f97316", icon: "🍎", description: "Native iOS app — Swift + SwiftUI components",
    stats: [
      { label: "Open Bugs",     value: 9,     delta: "-1 this week" },
      { label: "Crash Rate",    value: "0.3%", delta: "↓ 0.1%" },
      { label: "Test Coverage", value: "81%", delta: "↑ 3%" },
      { label: "Avg Fix Time",  value: "1.7d" },
    ],
    bugs: [
      { id: "IOS-022", title: "Keyboard overlaps input on iPhone SE",      severity: "High",     status: "Open",        reporter: "Amara L.", date: "Feb 25" },
      { id: "IOS-019", title: "Face ID fails after app backgrounding",     severity: "Critical", status: "In Progress", reporter: "Nkem E.",  date: "Feb 23" },
      { id: "IOS-016", title: "Share sheet missing PDF option",            severity: "Medium",   status: "Resolved",    reporter: "Emeka C.", date: "Feb 19" },
      { id: "IOS-013", title: "Dynamic type breaks nav bar layout",        severity: "Low",      status: "Closed",      reporter: "Amara L.", date: "Feb 15" },
    ],
    tests: [
      { id: "TC-I01", title: "App launch time < 2s",             result: "Pass",    assignee: "Nkem E.",  duration: "1m 55s" },
      { id: "TC-I02", title: "Face ID / Touch ID auth",          result: "Fail",    assignee: "Amara L.", duration: "2m 10s" },
      { id: "TC-I03", title: "iCloud sync on sign-in",           result: "Pass",    assignee: "Emeka C.", duration: "4m 30s" },
      { id: "TC-I04", title: "AirDrop file sharing",             result: "Pending", assignee: "Nkem E.",  duration: "—" },
    ],
    members: [
      { name: "Amara Linus",  role: "iOS QA Lead",   avatar: "AL", bugs: 5, resolved: 4 },
      { name: "Nkem Ezeh",    role: "iOS Developer", avatar: "NE", bugs: 3, resolved: 2 },
      { name: "Emeka Chukwu", role: "QA Analyst",    avatar: "EC", bugs: 1, resolved: 1 },
    ],
  },
  Website: {
    title: "Website", accent: "#ef4444", icon: "🌐", description: "Marketing site + customer portal — Next.js 14",
    stats: [
      { label: "Open Bugs",      value: 21, delta: "+5 this week" },
      { label: "Lighthouse Score", value: "88", delta: "↑ 4pts" },
      { label: "Test Coverage",  value: "69%", delta: "↑ 2%" },
      { label: "Avg Fix Time",   value: "3.4d" },
    ],
    bugs: [
      { id: "WEB-067", title: "Contact form 500 error on Safari 17",         severity: "Critical", status: "Open",        reporter: "Demi A.",  date: "Feb 26" },
      { id: "WEB-063", title: "CLS issue on hero section load",              severity: "High",     status: "In Progress", reporter: "Fola M.",  date: "Feb 24" },
      { id: "WEB-059", title: "Cookie consent banner overlaps CTA",         severity: "Medium",   status: "Open",        reporter: "Bisi T.",  date: "Feb 21" },
      { id: "WEB-055", title: "404 on /pricing after locale redirect",       severity: "High",     status: "Resolved",    reporter: "Demi A.",  date: "Feb 18" },
    ],
    tests: [
      { id: "TC-W01", title: "Homepage loads < 3s on 3G",        result: "Fail",    assignee: "Fola M.", duration: "5m 20s" },
      { id: "TC-W02", title: "Form submission end-to-end",        result: "Fail",    assignee: "Bisi T.", duration: "2m 44s" },
      { id: "TC-W03", title: "Responsive layout — all breakpoints", result: "Pass", assignee: "Demi A.", duration: "3m 10s" },
      { id: "TC-W04", title: "SEO meta tags validation",          result: "Pass",    assignee: "Fola M.", duration: "1m 05s" },
      { id: "TC-W05", title: "Dark mode persistence",             result: "Pending", assignee: "Bisi T.", duration: "—" },
    ],
    members: [
      { name: "Demi Adeyemi", role: "Frontend QA",   avatar: "DA", bugs: 9,  resolved: 6 },
      { name: "Fola Martins", role: "Web Developer", avatar: "FM", bugs: 7,  resolved: 4 },
      { name: "Bisi Taiwo",   role: "QA Analyst",    avatar: "BT", bugs: 5,  resolved: 3 },
    ],
  },
  Suggestions: {
    title: "Suggestions", accent: "#3b82f6", icon: "💡", description: "Feature requests and UX improvement ideas from users",
    stats: [
      { label: "Total Suggestions", value: 38 },
      { label: "Under Review",      value: 12 },
      { label: "Approved",          value: 9, delta: "+3 this sprint" },
      { label: "Declined",          value: 17 },
    ],
    bugs: [
      { id: "SUG-014", title: "Add dark mode toggle to settings",         severity: "High",   status: "In Progress", reporter: "User #2291", date: "Feb 25" },
      { id: "SUG-011", title: "Export tickets as CSV",                    severity: "Medium", status: "Open",        reporter: "User #1803", date: "Feb 22" },
      { id: "SUG-009", title: "Bulk-close resolved tickets",              severity: "Medium", status: "Open",        reporter: "User #3104", date: "Feb 20" },
      { id: "SUG-007", title: "Email digest — weekly summary",            severity: "Low",    status: "Resolved",    reporter: "User #0987", date: "Feb 17" },
    ],
    tests: [
      { id: "TC-S01", title: "Dark mode toggle — all screens",    result: "Pending", assignee: "Kola B.",  duration: "—" },
      { id: "TC-S02", title: "CSV export accuracy",               result: "Pending", assignee: "Tolu A.",  duration: "—" },
      { id: "TC-S03", title: "Bulk action — undo support",        result: "Pending", assignee: "Sade O.",  duration: "—" },
    ],
    members: [
      { name: "Kola Babatunde", role: "Product Owner", avatar: "KB", bugs: 14, resolved: 9 },
      { name: "Tolu Adesanya",  role: "QA Engineer",   avatar: "TA", bugs: 8,  resolved: 4 },
      { name: "Sade Okafor",    role: "UX Researcher", avatar: "SO", bugs: 5,  resolved: 3 },
    ],
  },
  "Client Feedback": {
    title: "Client Feedback", accent: "#1e3a5f", icon: "📬", description: "Issues and feedback reported directly by clients",
    stats: [
      { label: "Feedback Items", value: 27 },
      { label: "Critical Issues", value: 4, delta: "Needs immediate action" },
      { label: "Resolved",        value: 18, delta: "↑ 5 this week" },
      { label: "Avg Response",    value: "6h" },
    ],
    bugs: [
      { id: "CF-008", title: "Client portal login broken for SSO users",    severity: "Critical", status: "In Progress", reporter: "Acme Corp",    date: "Feb 26" },
      { id: "CF-006", title: "Invoice PDF shows wrong currency symbol",     severity: "High",     status: "Open",        reporter: "BrightTech",   date: "Feb 24" },
      { id: "CF-004", title: "Report exports time out on large datasets",   severity: "High",     status: "Open",        reporter: "Nova Ltd",     date: "Feb 22" },
      { id: "CF-002", title: "Dashboard chart labels cut off on 1080p",     severity: "Medium",   status: "Resolved",    reporter: "Zenith Group", date: "Feb 19" },
    ],
    tests: [
      { id: "TC-C01", title: "SSO login — all providers",          result: "Fail",    assignee: "Demi A.",  duration: "3m 22s" },
      { id: "TC-C02", title: "Invoice PDF generation",             result: "Fail",    assignee: "Fola M.",  duration: "1m 50s" },
      { id: "TC-C03", title: "Export — 10k row dataset",           result: "Pending", assignee: "Bisi T.",  duration: "—" },
      { id: "TC-C04", title: "Chart rendering at 1080p/4K",        result: "Pass",    assignee: "Demi A.",  duration: "0m 55s" },
    ],
    members: [
      { name: "Demi Adeyemi", role: "Client Liaison QA", avatar: "DA", bugs: 10, resolved: 7 },
      { name: "Fola Martins", role: "Backend Dev",       avatar: "FM", bugs: 8,  resolved: 5 },
      { name: "Bisi Taiwo",   role: "QA Analyst",        avatar: "BT", bugs: 9,  resolved: 6 },
    ],
  },
  "Mobile App": {
    title: "Mobile App", accent: "#22c55e", icon: "📱", description: "Cross-platform mobile test suite — iOS & Android",
    stats: [
      { label: "Total Cases",  value: 142 },
      { label: "Passing",      value: 109, delta: "76.8%" },
      { label: "Failing",      value: 18,  delta: "12.7%" },
      { label: "Pending",      value: 15,  delta: "10.5%" },
    ],
    bugs: [
      { id: "MA-033", title: "Session expires mid-checkout flow",           severity: "Critical", status: "Open",        reporter: "Nkem E.",  date: "Feb 25" },
      { id: "MA-029", title: "Camera permission prompt shows twice",        severity: "High",     status: "In Progress", reporter: "Amara L.", date: "Feb 23" },
      { id: "MA-025", title: "Scroll jumps when keyboard dismisses",        severity: "Medium",   status: "Resolved",    reporter: "Emeka C.", date: "Feb 20" },
      { id: "MA-021", title: "Haptic feedback missing on toggle switches",  severity: "Low",      status: "Closed",      reporter: "Nkem E.",  date: "Feb 16" },
    ],
    tests: [
      { id: "TC-M01", title: "Checkout flow — full end-to-end",      result: "Fail",    assignee: "Nkem E.",  duration: "6m 15s" },
      { id: "TC-M02", title: "Camera & media permissions",           result: "Fail",    assignee: "Amara L.", duration: "2m 30s" },
      { id: "TC-M03", title: "Keyboard interaction suite",           result: "Pass",    assignee: "Emeka C.", duration: "3m 48s" },
      { id: "TC-M04", title: "Haptics & vibration patterns",         result: "Pass",    assignee: "Nkem E.",  duration: "1m 22s" },
      { id: "TC-M05", title: "Accessibility — VoiceOver / TalkBack", result: "Pending", assignee: "Amara L.", duration: "—" },
    ],
    members: [
      { name: "Nkem Ezeh",    role: "Mobile QA Lead",  avatar: "NE", bugs: 7,  resolved: 5 },
      { name: "Amara Linus",  role: "iOS QA",          avatar: "AL", bugs: 6,  resolved: 3 },
      { name: "Emeka Chukwu", role: "Android QA",      avatar: "EC", bugs: 5,  resolved: 4 },
    ],
  },
  "Web Dashboard": {
    title: "Web Dashboard", accent: "#ef4444", icon: "🖥️", description: "Admin & analytics dashboard test suite",
    stats: [
      { label: "Total Cases",  value: 98  },
      { label: "Passing",      value: 71, delta: "72.4%" },
      { label: "Failing",      value: 15, delta: "15.3%" },
      { label: "Pending",      value: 12, delta: "12.3%" },
    ],
    bugs: [
      { id: "WD-044", title: "Charts don't render on Firefox 121",      severity: "High",   status: "Open",        reporter: "Bisi T.",  date: "Feb 26" },
      { id: "WD-041", title: "Date range picker resets on tab switch",  severity: "Medium", status: "In Progress", reporter: "Demi A.",  date: "Feb 24" },
      { id: "WD-038", title: "CSV export truncates at 500 rows",        severity: "High",   status: "Open",        reporter: "Fola M.",  date: "Feb 22" },
      { id: "WD-035", title: "Sidebar collapses on 1280px viewport",   severity: "Low",    status: "Resolved",    reporter: "Bisi T.",  date: "Feb 19" },
    ],
    tests: [
      { id: "TC-WD01", title: "Chart rendering — all browsers",    result: "Fail",    assignee: "Bisi T.", duration: "4m 10s" },
      { id: "TC-WD02", title: "Date picker component suite",       result: "Fail",    assignee: "Demi A.", duration: "2m 55s" },
      { id: "TC-WD03", title: "Table pagination — 10k rows",       result: "Pass",    assignee: "Fola M.", duration: "3m 40s" },
      { id: "TC-WD04", title: "Responsive — 1280px to 4K",         result: "Pass",    assignee: "Bisi T.", duration: "2m 00s" },
      { id: "TC-WD05", title: "Role-based view restrictions",      result: "Pending", assignee: "Demi A.", duration: "—" },
    ],
    members: [
      { name: "Bisi Taiwo",   role: "Frontend QA",   avatar: "BT", bugs: 8,  resolved: 5 },
      { name: "Demi Adeyemi", role: "QA Lead",        avatar: "DA", bugs: 7,  resolved: 4 },
      { name: "Fola Martins", role: "Web Developer",  avatar: "FM", bugs: 6,  resolved: 3 },
    ],
  },
  "User Onboarding": {
    title: "User Onboarding", accent: "#3b82f6", icon: "🚀", description: "New user registration, setup wizard & first-run experience",
    stats: [
      { label: "Total Cases",      value: 56  },
      { label: "Passing",          value: 44, delta: "78.6%" },
      { label: "Completion Rate",  value: "67%", delta: "↑ 5%" },
      { label: "Avg Onboard Time", value: "4m 12s" },
    ],
    bugs: [
      { id: "UO-018", title: "Step 3 of wizard skips on fast tap",           severity: "High",   status: "Open",        reporter: "Tolu A.", date: "Feb 25" },
      { id: "UO-015", title: "Avatar upload fails for PNGs > 2MB",           severity: "High",   status: "In Progress", reporter: "Sade O.", date: "Feb 23" },
      { id: "UO-012", title: "Welcome email arrives 10+ min late",           severity: "Medium", status: "Open",        reporter: "Kola B.", date: "Feb 21" },
      { id: "UO-009", title: "Progress bar shows 100% before final step",    severity: "Low",    status: "Resolved",    reporter: "Tolu A.", date: "Feb 18" },
    ],
    tests: [
      { id: "TC-UO01", title: "Full signup wizard — happy path",    result: "Pass",    assignee: "Tolu A.", duration: "5m 30s" },
      { id: "TC-UO02", title: "Avatar upload — all formats",        result: "Fail",    assignee: "Sade O.", duration: "2m 15s" },
      { id: "TC-UO03", title: "Email verification flow",            result: "Pass",    assignee: "Kola B.", duration: "3m 00s" },
      { id: "TC-UO04", title: "Social sign-in (Google/Apple)",      result: "Pass",    assignee: "Tolu A.", duration: "2m 45s" },
      { id: "TC-UO05", title: "Accessibility — screen reader flow", result: "Pending", assignee: "Sade O.", duration: "—" },
    ],
    members: [
      { name: "Tolu Adesanya",  role: "QA Engineer",   avatar: "TA", bugs: 6, resolved: 5 },
      { name: "Sade Okafor",    role: "UX QA",         avatar: "SO", bugs: 5, resolved: 3 },
      { name: "Kola Babatunde", role: "Product Owner",  avatar: "KB", bugs: 3, resolved: 2 },
    ],
  },
  "Super Admin": {
    title: "Super Admin", accent: "#f97316", icon: "🛡️", description: "Admin panel — user management, roles, system config",
    stats: [
      { label: "Total Cases",    value: 74  },
      { label: "Passing",        value: 58, delta: "78.4%" },
      { label: "Critical Fails", value: 5,  delta: "⚠ Needs attention" },
      { label: "Pending",        value: 11  },
    ],
    bugs: [
      { id: "SA-031", title: "Deleting admin role affects own session",        severity: "Critical", status: "Open",        reporter: "James K.", date: "Feb 26" },
      { id: "SA-028", title: "Audit log pagination broken past page 10",      severity: "High",     status: "In Progress", reporter: "Kola B.",  date: "Feb 24" },
      { id: "SA-025", title: "Role editor doesn't save custom permissions",   severity: "High",     status: "Open",        reporter: "James K.", date: "Feb 22" },
      { id: "SA-022", title: "System config resets after server restart",     severity: "Critical", status: "In Progress", reporter: "Tolu A.",  date: "Feb 20" },
    ],
    tests: [
      { id: "TC-SA01", title: "Role creation & permission assignment",  result: "Fail",    assignee: "James K.", duration: "4m 50s" },
      { id: "TC-SA02", title: "Audit log — full CRUD actions",          result: "Fail",    assignee: "Kola B.",  duration: "3m 20s" },
      { id: "TC-SA03", title: "User impersonation flow",                result: "Pass",    assignee: "Tolu A.",  duration: "2m 10s" },
      { id: "TC-SA04", title: "System settings persistence",            result: "Fail",    assignee: "James K.", duration: "1m 55s" },
      { id: "TC-SA05", title: "2FA enforcement for admin accounts",     result: "Pass",    assignee: "Kola B.",  duration: "3m 00s" },
    ],
    members: [
      { name: "James Kwame",    role: "Security QA",   avatar: "JK", bugs: 9,  resolved: 4 },
      { name: "Kola Babatunde", role: "Tech Lead",      avatar: "KB", bugs: 7,  resolved: 5 },
      { name: "Tolu Adesanya",  role: "QA Engineer",   avatar: "TA", bugs: 5,  resolved: 4 },
    ],
  },
  "Control Panel": {
    title: "Control Panel", accent: "#6b7280", icon: "⚙️", description: "System health monitoring, feature flags & deployment controls",
    stats: [
      { label: "Total Cases",   value: 61  },
      { label: "Passing",       value: 49, delta: "80.3%" },
      { label: "Failing",       value: 7,  delta: "11.5%" },
      { label: "Feature Flags", value: 24, delta: "6 active" },
    ],
    bugs: [
      { id: "CP-019", title: "Feature flag toggle has 30s delay in prod",   severity: "High",   status: "Open",        reporter: "Fola M.", date: "Feb 25" },
      { id: "CP-016", title: "Health check falsely reports DB as down",     severity: "Critical", status: "In Progress", reporter: "Bisi T.", date: "Feb 23" },
      { id: "CP-013", title: "Deployment rollback hangs at 80%",            severity: "High",   status: "Open",        reporter: "Demi A.", date: "Feb 21" },
      { id: "CP-010", title: "CPU metrics graph shows flat line after 24h", severity: "Medium", status: "Resolved",    reporter: "Fola M.", date: "Feb 18" },
    ],
    tests: [
      { id: "TC-CP01", title: "Feature flag — real-time toggle",      result: "Fail",    assignee: "Fola M.", duration: "2m 40s" },
      { id: "TC-CP02", title: "Health check — all services",          result: "Fail",    assignee: "Bisi T.", duration: "3m 15s" },
      { id: "TC-CP03", title: "Deployment pipeline — full run",       result: "Pass",    assignee: "Demi A.", duration: "8m 00s" },
      { id: "TC-CP04", title: "Metrics dashboard — 30d data range",   result: "Pass",    assignee: "Fola M.", duration: "1m 30s" },
      { id: "TC-CP05", title: "Rollback under load test",             result: "Pending", assignee: "Bisi T.", duration: "—" },
    ],
    members: [
      { name: "Fola Martins", role: "DevOps QA",     avatar: "FM", bugs: 7, resolved: 5 },
      { name: "Bisi Taiwo",   role: "SRE QA",         avatar: "BT", bugs: 6, resolved: 3 },
      { name: "Demi Adeyemi", role: "Platform QA",    avatar: "DA", bugs: 5, resolved: 4 },
    ],
  },
};