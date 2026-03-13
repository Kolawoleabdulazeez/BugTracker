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



export enum Store {
  ACCESS_TOKEN = "a15e952b-cf46-4bf9-8524-38542acffc5a"
}

export const projectsData = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete overhaul of company website with modern UI/UX",
    status: "In Progress",
    statusColor: "bg-blue-500",
    priority: "High",
    priorityColor: "bg-red-500",
    progress: 75,
    dueDate: "Oct 25, 2025",
    startDate: "Sep 1, 2025",
    teamSize: 3,
    completedTasks: 12,
    totalTasks: 16,
    daysLeft: 18,
    teamMembers: [
      { id: 1, name: "John Doe", role: "Project Lead", avatar: "👨‍💼", color: "bg-blue-500" },
      { id: 2, name: "Jane Smith", role: "Frontend Developer", avatar: "👨‍💻", color: "bg-orange-500" },
      { id: 3, name: "Mary James", role: "UI Designer", avatar: "👩‍💼", color: "bg-purple-500" },
    ],
    tasks: [
      { id: 1, title: "Design Homepage Mockup", status: "completed", assignee: "Mary James", dueDate: "Oct 10" },
      { id: 2, title: "Implement Navigation", status: "completed", assignee: "Jane Smith", dueDate: "Oct 12" },
      { id: 3, title: "Set up Database", status: "in-progress", assignee: "John Doe", dueDate: "Oct 18" },
      { id: 4, title: "API Integration", status: "in-progress", assignee: "John Doe", dueDate: "Oct 20" },
      { id: 5, title: "Testing & QA", status: "pending", assignee: "Jane Smith", dueDate: "Oct 24" },
    ],
    activity: [
      { id: 1, user: "Jane Smith", action: "completed task", target: "Implement Navigation", time: "2 hours ago" },
      { id: 2, user: "Mary James", action: "uploaded", target: "design-mockup-v2.fig", time: "5 hours ago" },
      { id: 3, user: "John Doe", action: "commented on", target: "API Integration", time: "1 day ago" },
    ],
    files: [
      { id: 1, name: "requirements.pdf", size: "1.1 MB" },
      { id: 2, name: "design-mockup.fig", size: "2.4 MB" },
    ],
  },
  {
    id: 2,
    title: "Mobile App Launch",
    description: "Native iOS and Android app development",
    status: "In Progress",
    statusColor: "bg-blue-500",
    priority: "High",
    priorityColor: "bg-red-500",
    progress: 45,
    dueDate: "Nov 15, 2025",
    startDate: "Sep 20, 2025",
    teamSize: 2,
    completedTasks: 9,
    totalTasks: 20,
    daysLeft: 39,
    teamMembers: [
      { id: 1, name: "Chris Evans", role: "Mobile Engineer", avatar: "👨", color: "bg-green-500" },
      { id: 2, name: "Lisa Ray", role: "Product Manager", avatar: "👩", color: "bg-pink-500" },
    ],
    tasks: [
      { id: 1, title: "Create app wireframes", status: "completed", assignee: "Lisa Ray", dueDate: "Oct 1" },
      { id: 2, title: "Build authentication flow", status: "in-progress", assignee: "Chris Evans", dueDate: "Oct 15" },
      { id: 3, title: "Push notifications setup", status: "pending", assignee: "Chris Evans", dueDate: "Oct 28" },
    ],
    activity: [
      { id: 1, user: "Chris Evans", action: "updated", target: "authentication flow", time: "3 hours ago" },
      { id: 2, user: "Lisa Ray", action: "reviewed", target: "app wireframes", time: "1 day ago" },
    ],
    files: [
      { id: 1, name: "mobile-specs.pdf", size: "900 KB" },
    ],
  },
  {
    id: 3,
    title: "Marketing Campaign",
    description: "Q4 digital marketing strategy and execution",
    status: "Review",
    statusColor: "bg-yellow-500",
    priority: "Medium",
    priorityColor: "bg-yellow-500",
    progress: 90,
    dueDate: "Oct 20, 2025",
    startDate: "Aug 15, 2025",
    teamSize: 3,
    completedTasks: 18,
    totalTasks: 20,
    daysLeft: 13,
    teamMembers: [
      { id: 1, name: "David Cole", role: "Marketing Lead", avatar: "👦", color: "bg-blue-500" },
      { id: 2, name: "Sophia King", role: "Content Strategist", avatar: "👩", color: "bg-pink-500" },
      { id: 3, name: "Daniel Lee", role: "Ads Specialist", avatar: "👨", color: "bg-yellow-500" },
    ],
    tasks: [
      { id: 1, title: "Draft Q4 campaign", status: "completed", assignee: "David Cole", dueDate: "Sep 10" },
      { id: 2, title: "Launch paid ads", status: "in-progress", assignee: "Daniel Lee", dueDate: "Oct 12" },
      { id: 3, title: "Approve final creatives", status: "pending", assignee: "Sophia King", dueDate: "Oct 18" },
    ],
    activity: [
      { id: 1, user: "Sophia King", action: "uploaded", target: "campaign copy", time: "6 hours ago" },
      { id: 2, user: "Daniel Lee", action: "optimized", target: "paid ads", time: "1 day ago" },
    ],
    files: [
      { id: 1, name: "campaign-plan.pdf", size: "1.3 MB" },
    ],
  },
  {
    id: 4,
    title: "E-commerce Platform",
    description: "Build scalable online shopping platform",
    status: "In Progress",
    statusColor: "bg-blue-500",
    priority: "High",
    priorityColor: "bg-red-500",
    progress: 60,
    dueDate: "Dec 10, 2025",
    startDate: "Sep 5, 2025",
    teamSize: 4,
    completedTasks: 15,
    totalTasks: 25,
    daysLeft: 64,
    teamMembers: [
      { id: 1, name: "Amara Jones", role: "Project Manager", avatar: "👨‍💼", color: "bg-purple-500" },
      { id: 2, name: "Tina Ford", role: "Backend Engineer", avatar: "👩‍💻", color: "bg-green-500" },
      { id: 3, name: "Michael Scott", role: "Frontend Engineer", avatar: "👨", color: "bg-blue-500" },
      { id: 4, name: "Sandra Dee", role: "QA Engineer", avatar: "👩", color: "bg-pink-500" },
    ],
    tasks: [
      { id: 1, title: "Set up product catalog", status: "completed", assignee: "Michael Scott", dueDate: "Sep 25" },
      { id: 2, title: "Implement checkout", status: "in-progress", assignee: "Tina Ford", dueDate: "Oct 30" },
      { id: 3, title: "Payment gateway testing", status: "pending", assignee: "Sandra Dee", dueDate: "Nov 8" },
    ],
    activity: [
      { id: 1, user: "Tina Ford", action: "integrated", target: "payment gateway", time: "4 hours ago" },
    ],
    files: [
      { id: 1, name: "architecture.pdf", size: "2.0 MB" },
    ],
  },
  {
    id: 5,
    title: "Brand Identity Design",
    description: "Complete brand refresh and style guide",
    status: "Review",
    statusColor: "bg-yellow-500",
    priority: "Medium",
    priorityColor: "bg-yellow-500",
    progress: 85,
    dueDate: "Oct 30, 2025",
    startDate: "Sep 12, 2025",
    teamSize: 2,
    completedTasks: 17,
    totalTasks: 20,
    daysLeft: 23,
    teamMembers: [
      { id: 1, name: "Luke Hart", role: "Brand Designer", avatar: "👨‍🎨", color: "bg-indigo-500" },
      { id: 2, name: "Ella Rose", role: "Creative Director", avatar: "👩‍🎨", color: "bg-red-500" },
    ],
    tasks: [
      { id: 1, title: "Create logo concepts", status: "completed", assignee: "Luke Hart", dueDate: "Sep 20" },
      { id: 2, title: "Finalize color palette", status: "in-progress", assignee: "Ella Rose", dueDate: "Oct 14" },
    ],
    activity: [
      { id: 1, user: "Luke Hart", action: "uploaded", target: "brand assets", time: "8 hours ago" },
    ],
    files: [
      { id: 1, name: "brand-guide.pdf", size: "1.8 MB" },
    ],
  },
  {
    id: 6,
    title: "API Integration",
    description: "Third-party API connections and webhooks",
    status: "In Progress",
    statusColor: "bg-blue-500",
    priority: "Low",
    priorityColor: "bg-green-500",
    progress: 30,
    dueDate: "Nov 25, 2025",
    startDate: "Oct 1, 2025",
    teamSize: 3,
    completedTasks: 6,
    totalTasks: 20,
    daysLeft: 49,
    teamMembers: [
      { id: 1, name: "Ryan Cole", role: "Integration Engineer", avatar: "👨‍💻", color: "bg-cyan-500" },
      { id: 2, name: "Nina West", role: "Backend Engineer", avatar: "👩‍💻", color: "bg-teal-500" },
      { id: 3, name: "Paul Kim", role: "DevOps Engineer", avatar: "👨", color: "bg-green-500" },
    ],
    tasks: [
      { id: 1, title: "Webhook setup", status: "in-progress", assignee: "Ryan Cole", dueDate: "Oct 19" },
      { id: 2, title: "OAuth flow", status: "pending", assignee: "Nina West", dueDate: "Oct 28" },
    ],
    activity: [
      { id: 1, user: "Paul Kim", action: "deployed", target: "staging environment", time: "10 hours ago" },
    ],
    files: [
      { id: 1, name: "api-docs.pdf", size: "750 KB" },
    ],
  },
  {
    id: 7,
    title: "Customer Portal",
    description: "Self-service dashboard for clients",
    status: "Completed",
    statusColor: "bg-green-500",
    priority: "High",
    priorityColor: "bg-red-500",
    progress: 100,
    dueDate: "Oct 15, 2025",
    startDate: "Jul 10, 2025",
    teamSize: 5,
    completedTasks: 24,
    totalTasks: 24,
    daysLeft: 0,
    teamMembers: [
      { id: 1, name: "James Bond", role: "Project Lead", avatar: "👨‍💼", color: "bg-blue-500" },
      { id: 2, name: "Diana Prince", role: "UX Designer", avatar: "👩‍💼", color: "bg-purple-500" },
      { id: 3, name: "Tom Wayne", role: "Developer", avatar: "👨", color: "bg-orange-500" },
      { id: 4, name: "Lucy Hale", role: "QA Tester", avatar: "👩", color: "bg-pink-500" },
      { id: 5, name: "Chris Wood", role: "Support Engineer", avatar: "👨‍💻", color: "bg-green-500" },
    ],
    tasks: [
      { id: 1, title: "Portal dashboard", status: "completed", assignee: "Tom Wayne", dueDate: "Sep 12" },
      { id: 2, title: "Client onboarding flow", status: "completed", assignee: "James Bond", dueDate: "Sep 25" },
    ],
    activity: [
      { id: 1, user: "Lucy Hale", action: "completed", target: "final QA pass", time: "2 days ago" },
    ],
    files: [
      { id: 1, name: "client-portal.pdf", size: "1.5 MB" },
    ],
  },
  {
    id: 8,
    title: "Data Analytics Dashboard",
    description: "Real-time analytics and reporting system",
    status: "In Progress",
    statusColor: "bg-blue-500",
    priority: "Medium",
    priorityColor: "bg-yellow-500",
    progress: 55,
    dueDate: "Nov 30, 2025",
    startDate: "Sep 18, 2025",
    teamSize: 3,
    completedTasks: 11,
    totalTasks: 20,
    daysLeft: 54,
    teamMembers: [
      { id: 1, name: "Victor Cole", role: "Data Engineer", avatar: "👨‍💻", color: "bg-violet-500" },
      { id: 2, name: "Anna Bell", role: "BI Analyst", avatar: "👩‍💻", color: "bg-fuchsia-500" },
      { id: 3, name: "Sam Ford", role: "Frontend Developer", avatar: "👨", color: "bg-sky-500" },
    ],
    tasks: [
      { id: 1, title: "Connect data sources", status: "completed", assignee: "Victor Cole", dueDate: "Oct 2" },
      { id: 2, title: "Build charts", status: "in-progress", assignee: "Sam Ford", dueDate: "Oct 22" },
    ],
    activity: [
      { id: 1, user: "Anna Bell", action: "updated", target: "report filters", time: "12 hours ago" },
    ],
    files: [
      { id: 1, name: "dashboard-spec.pdf", size: "1.0 MB" },
    ],
  },
  {
    id: 9,
    title: "Security Audit",
    description: "Comprehensive security review and fixes",
    status: "Review",
    statusColor: "bg-yellow-500",
    priority: "High",
    priorityColor: "bg-red-500",
    progress: 95,
    dueDate: "Oct 18, 2025",
    startDate: "Aug 20, 2025",
    teamSize: 2,
    completedTasks: 19,
    totalTasks: 20,
    daysLeft: 11,
    teamMembers: [
      { id: 1, name: "Robert Kane", role: "Security Lead", avatar: "👨‍💼", color: "bg-red-500" },
      { id: 2, name: "Grace Hill", role: "Compliance Officer", avatar: "👩‍💼", color: "bg-orange-500" },
    ],
    tasks: [
      { id: 1, title: "Run vulnerability scan", status: "completed", assignee: "Robert Kane", dueDate: "Sep 12" },
      { id: 2, title: "Review remediation plan", status: "in-progress", assignee: "Grace Hill", dueDate: "Oct 16" },
    ],
    activity: [
      { id: 1, user: "Robert Kane", action: "submitted", target: "audit summary", time: "1 day ago" },
    ],
    files: [
      { id: 1, name: "security-report.pdf", size: "2.2 MB" },
    ],
  },
];
