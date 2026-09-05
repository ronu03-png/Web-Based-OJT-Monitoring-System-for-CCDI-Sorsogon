import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "Password123!";

function hash(password: string) {
  return bcrypt.hash(password, 12);
}

function d(y: number, m: number, day: number, h = 0, min = 0) {
  return new Date(Date.UTC(y, m - 1, day, h, min));
}

async function resetDatabase() {
  console.log("Clearing existing data...");
  await prisma.weeklyReportActivity.deleteMany();
  await prisma.weeklyReport.deleteMany();
  await prisma.dtrRecord.deleteMany();
  await prisma.task.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await resetDatabase();
  console.log("Seeding CCDI Sorsogon OJT Monitoring System...");

  const passwordHash = await hash(DEFAULT_PASSWORD);

  await prisma.systemSetting.createMany({
    data: [
      { key: "school_name", value: "Computer Communication Development Institute - Sorsogon" },
      { key: "system_name", value: "Web-Based OJT Monitoring System" },
      { key: "default_required_hours", value: "500", description: "Default required OJT hours for new students" },
    ],
  });

  // ---------------------------------------------------------------------
  // Admin
  // ---------------------------------------------------------------------
  const admin = await prisma.user.create({
    data: {
      email: "admin@ccdi.edu.ph",
      username: "admin",
      passwordHash,
      role: "ADMIN",
      firstName: "System",
      lastName: "Administrator",
    },
  });


  // ---------------------------------------------------------------------
  // Students
  // ---------------------------------------------------------------------
  const juanUser = await prisma.user.create({
    data: {
      email: "juan.delacruz@ccdi.edu.ph",
      username: "2026-001",
      passwordHash,
      role: "STUDENT",
      firstName: "Juan",
      lastName: "Dela Cruz",
      phone: "0917-200-3001",
      student: {
        create: {
          studentId: "2026-001",
          firstName: "Juan",
          lastName: "Dela Cruz",
          course: "BSIS",
          yearLevel: 4,
          section: "A",
          contactNumber: "0917-200-3001",
          address: "Brgy. Bibincahan, Sorsogon City",
          companyName: "ABC Technologies",
          companyAddress: "Rizal Street, Sorsogon City, Sorsogon",
          designation: "IT Support Intern",
          requiredHours: 500,
          completedHours: 312,
          startDate: d(2026, 7, 6),
          expectedEndDate: d(2026, 10, 5),
          status: "ONGOING",
        },
      },
    },
    include: { student: true },
  });
  const juan = juanUser.student!;

  const mariaUser = await prisma.user.create({
    data: {
      email: "maria.santos.student@ccdi.edu.ph",
      username: "2026-002",
      passwordHash,
      role: "STUDENT",
      firstName: "Maria Clara",
      lastName: "Santos",
      phone: "0917-200-3002",
      student: {
        create: {
          studentId: "2026-002",
          firstName: "Maria Clara",
          lastName: "Santos",
          course: "BSIS",
          yearLevel: 4,
          section: "A",
          contactNumber: "0917-200-3002",
          address: "Brgy. Talisay, Sorsogon City",
          companyName: "XYZ Solutions Inc.",
          companyAddress: "Magsaysay Street, Sorsogon City, Sorsogon",
          designation: "Software Development Intern",
          requiredHours: 500,
          completedHours: 500,
          startDate: d(2026, 4, 6),
          expectedEndDate: d(2026, 7, 6),
          actualEndDate: d(2026, 7, 4),
          status: "COMPLETED",
        },
      },
    },
    include: { student: true },
  });
  const maria = mariaUser.student!;

  const pedroUser = await prisma.user.create({
    data: {
      email: "pedro.reyes@ccdi.edu.ph",
      username: "2026-003",
      passwordHash,
      role: "STUDENT",
      firstName: "Pedro",
      lastName: "Reyes",
      phone: "0917-200-3003",
      student: {
        create: {
          studentId: "2026-003",
          firstName: "Pedro",
          lastName: "Reyes",
          course: "BSIS",
          yearLevel: 4,
          section: "B",
          contactNumber: "0917-200-3003",
          address: "Brgy. Pangpang, Sorsogon City",
          companyName: "Sorsogon Data Systems",
          companyAddress: "Burgos Street, Sorsogon City, Sorsogon",
          designation: "Network Support Intern",
          requiredHours: 500,
          completedHours: 120,
          startDate: d(2026, 7, 13),
          expectedEndDate: d(2026, 10, 12),
          status: "ONGOING",
        },
      },
    },
    include: { student: true },
  });
  const pedro = pedroUser.student!;

  const anaUser = await prisma.user.create({
    data: {
      email: "ana.gonzales@ccdi.edu.ph",
      username: "2026-004",
      passwordHash,
      role: "STUDENT",
      firstName: "Ana Marie",
      lastName: "Gonzales",
      phone: "0917-200-3004",
      student: {
        create: {
          studentId: "2026-004",
          firstName: "Ana Marie",
          lastName: "Gonzales",
          course: "BSIS",
          yearLevel: 4,
          section: "B",
          contactNumber: "0917-200-3004",
          address: "Brgy. Bucalbucalan, Sorsogon City",
          requiredHours: 500,
          completedHours: 0,
          status: "NOT_STARTED",
        },
      },
    },
    include: { student: true },
  });
  const ana = anaUser.student!;

  const joseUser = await prisma.user.create({
    data: {
      email: "jose.bonifacio@ccdi.edu.ph",
      username: "2026-005",
      passwordHash,
      role: "STUDENT",
      firstName: "Jose Rizal",
      lastName: "Bonifacio",
      phone: "0917-200-3005",
      student: {
        create: {
          studentId: "2026-005",
          firstName: "Jose Rizal",
          lastName: "Bonifacio",
          course: "BSIT",
          yearLevel: 4,
          section: "A",
          contactNumber: "0917-200-3005",
          address: "Brgy. Sirangan, Sorsogon City",
          companyName: "ABC Technologies",
          companyAddress: "Rizal Street, Sorsogon City, Sorsogon",
          designation: "IT Support Intern",
          requiredHours: 500,
          completedHours: 400,
          startDate: d(2026, 6, 1),
          expectedEndDate: d(2026, 9, 1),
          status: "ONGOING",
        },
      },
    },
    include: { student: true },
  });
  const jose = joseUser.student!;

  const andresUser = await prisma.user.create({
    data: {
      email: "andres.luna@ccdi.edu.ph",
      username: "2026-006",
      passwordHash,
      role: "STUDENT",
      firstName: "Andres",
      lastName: "Luna",
      phone: "0917-200-3006",
      student: {
        create: {
          studentId: "2026-006",
          firstName: "Andres",
          lastName: "Luna",
          course: "BSIS",
          yearLevel: 4,
          section: "B",
          contactNumber: "0917-200-3006",
          address: "Brgy. Basud, Sorsogon City",
          companyName: "Sorsogon Data Systems",
          companyAddress: "Burgos Street, Sorsogon City, Sorsogon",
          designation: "Network Support Intern",
          requiredHours: 500,
          completedHours: 48,
          startDate: d(2026, 7, 20),
          expectedEndDate: d(2026, 10, 19),
          status: "FAILED",
        },
      },
    },
    include: { student: true },
  });
  const andres = andresUser.student!;

  console.log("Created 6 students.");

  // ---------------------------------------------------------------------
  // DTR Records for Juan (primary demo account)
  // ---------------------------------------------------------------------
  const dtrPattern: Array<["PRESENT" | "LATE" | "ABSENT" | "EXCUSED", number, string?]> = [
    ["PRESENT", 3], ["PRESENT", 4], ["PRESENT", 5], ["PRESENT", 6], ["PRESENT", 7],
    ["PRESENT", 10], ["LATE", 11, "Traffic delay, informed in advance."], ["PRESENT", 12],
    ["PRESENT", 13], ["ABSENT", 14, "Sick leave - flu."], ["PRESENT", 17],
    ["PRESENT", 18], ["EXCUSED", 19, "University event - required attendance."],
  ];

  for (const [status, day, remarks] of dtrPattern) {
    const isPresentLike = status === "PRESENT" || status === "LATE";
    await prisma.dtrRecord.create({
      data: {
        studentId: juan.id,
        date: d(2026, 8, day),
        timeIn: isPresentLike ? d(2026, 8, day, status === "LATE" ? 8 : 8, status === "LATE" ? 32 : 2) : null,
        timeOut: isPresentLike ? d(2026, 8, day, 17, 6) : null,
        breakMinutes: isPresentLike ? 60 : 0,
        totalHours: isPresentLike ? (status === "LATE" ? 7.5 : 8) : 0,
        status,
        remarks: remarks ?? null,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Weekly Accomplishment Reports for Juan
  // ---------------------------------------------------------------------
  const week1 = await prisma.weeklyReport.create({
    data: {
      studentId: juan.id,
      weekNumber: 1,
      weekStartDate: d(2026, 8, 3),
      weekEndDate: d(2026, 8, 7),
      totalHours: 40,
      status: "SUBMITTED",
    },
  });

  await prisma.weeklyReportActivity.createMany({
    data: [
      { weeklyReportId: week1.id, date: d(2026, 8, 3), activity: "Computer Troubleshooting", description: "Assisted in troubleshooting workstation issues", skillsLearned: "Hardware troubleshooting" },
      { weeklyReportId: week1.id, date: d(2026, 8, 4), activity: "Network Configuration", description: "Assisted with network setup and cabling", skillsLearned: "Networking basics" },
      { weeklyReportId: week1.id, date: d(2026, 8, 5), activity: "Software Installation", description: "Installed required software on new workstations", skillsLearned: "Software deployment" },
      { weeklyReportId: week1.id, date: d(2026, 8, 6), activity: "Equipment Inventory", description: "Documented computer lab equipment", skillsLearned: "Asset management" },
      { weeklyReportId: week1.id, date: d(2026, 8, 7), activity: "User Support", description: "Assisted employees with basic IT issues", skillsLearned: "Customer service" },
    ],
  });

  const week2 = await prisma.weeklyReport.create({
    data: {
      studentId: juan.id,
      weekNumber: 2,
      weekStartDate: d(2026, 8, 10),
      weekEndDate: d(2026, 8, 14),
      totalHours: 32,
      status: "SUBMITTED",
    },
  });

  await prisma.weeklyReportActivity.createMany({
    data: [
      { weeklyReportId: week2.id, date: d(2026, 8, 10), activity: "Server Maintenance", description: "Assisted with routine server checks", skillsLearned: "Server administration" },
      { weeklyReportId: week2.id, date: d(2026, 8, 11), activity: "Backup Procedures", description: "Learned and performed data backup routines", skillsLearned: "Data management" },
      { weeklyReportId: week2.id, date: d(2026, 8, 12), activity: "Security Audit", description: "Reviewed network security policies", skillsLearned: "IT security basics" },
      { weeklyReportId: week2.id, date: d(2026, 8, 13), activity: "Documentation", description: "Updated IT procedure manuals", skillsLearned: "Technical writing" },
    ],
  });

  // ---------------------------------------------------------------------
  // Tasks for Juan
  // ---------------------------------------------------------------------
  await prisma.task.createMany({
    data: [
      { studentId: juan.id, title: "Computer Troubleshooting", description: "Fix workstation connectivity issues", date: d(2026, 8, 3), status: "COMPLETED", skillsLearned: "Hardware troubleshooting" },
      { studentId: juan.id, title: "Network Configuration", description: "Configure office network for new department", date: d(2026, 8, 4), status: "COMPLETED", skillsLearned: "Networking" },
      { studentId: juan.id, title: "Software Installation", description: "Deploy software on 20 new workstations", date: d(2026, 8, 5), status: "COMPLETED", skillsLearned: "Software deployment" },
      { studentId: juan.id, title: "Equipment Inventory", description: "Complete inventory of all IT equipment", date: d(2026, 8, 6), status: "COMPLETED", skillsLearned: "Asset management" },
      { studentId: juan.id, title: "Server Maintenance", description: "Perform monthly server maintenance checks", date: d(2026, 8, 10), status: "COMPLETED", skillsLearned: "Server administration" },
      { studentId: juan.id, title: "Backup System Review", description: "Review and test backup recovery procedures", date: d(2026, 8, 11), status: "COMPLETED", skillsLearned: "Data management" },
      { studentId: juan.id, title: "Security Policy Update", description: "Update network security policies document", date: d(2026, 8, 12), status: "ONGOING", skillsLearned: "IT security" },
      { studentId: juan.id, title: "IT Manual Documentation", description: "Create comprehensive IT procedure manual", date: d(2026, 8, 13), status: "ONGOING", skillsLearned: "Technical writing" },
      { studentId: juan.id, title: "Network Upgrade", description: "Upgrade network switches to gigabit", date: d(2026, 8, 17), status: "UNDONE", skillsLearned: "Network hardware" },
      { studentId: juan.id, title: "Cloud Migration Plan", description: "Plan migration of local files to cloud storage", date: d(2026, 8, 18), status: "UNDONE", skillsLearned: "Cloud computing" },
    ],
  });

  // ---------------------------------------------------------------------
  // Announcements
  // ---------------------------------------------------------------------
  await prisma.announcement.create({
    data: {
      title: "OJT Orientation for AY 2026-2027",
      content:
        "All OJT-bound students are required to attend the mandatory orientation on August 25, 2026, 9:00 AM at the CCDI Auditorium. Please bring your OJT application requirements.",
      authorId: admin.id,
      priority: "HIGH",
      audience: "STUDENTS",
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Deadline: Narrative Report Submission",
      content:
        "Students currently on OJT must submit their Narrative Report on or before September 15, 2026 through the Requirements module.",
      authorId: admin.id,
      priority: "URGENT",
      audience: "ALL",
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Welcome to the CCDI OJT Monitoring System",
      content:
        "This platform now centralizes DTR, weekly reports, tasks, and progress monitoring for the entire OJT program. Reach out to the administrator for any concerns.",
      authorId: admin.id,
      priority: "NORMAL",
      audience: "ALL",
    },
  });

  // ---------------------------------------------------------------------
  // Notifications for Juan
  // ---------------------------------------------------------------------
  await prisma.notification.createMany({
    data: [
      {
        userId: juanUser.id,
        category: "DTR",
        title: "DTR entry recorded",
        message: "Your DTR entry for August 18, 2026 has been recorded.",
        link: "/student/dtr",
        isRead: false,
      },
      {
        userId: juanUser.id,
        category: "WEEKLY_REPORT",
        title: "Weekly report reminder",
        message: "Week 3 weekly accomplishment report is due soon.",
        link: "/student/weekly-reports",
        isRead: false,
      },
      {
        userId: juanUser.id,
        category: "ANNOUNCEMENT",
        title: "New announcement published",
        message: "Deadline: Narrative Report Submission",
        link: "/student/announcements",
        isRead: true,
      },
    ],
  });

  // ---------------------------------------------------------------------
  // DTR Records for Jose Rizal Bonifacio (demo data)
  // ---------------------------------------------------------------------
  const joseDtrPattern: Array<["PRESENT" | "LATE" | "ABSENT" | "EXCUSED", number, string?]> = [
    ["PRESENT", 2], ["PRESENT", 3], ["PRESENT", 4], ["PRESENT", 5], ["PRESENT", 6],
    ["PRESENT", 9], ["PRESENT", 10], ["LATE", 11, "Traffic delay"], ["PRESENT", 12], ["PRESENT", 13],
    ["PRESENT", 16], ["PRESENT", 17], ["EXCUSED", 18, "University event"], ["PRESENT", 19], ["PRESENT", 20],
  ];

  for (const [status, day, remarks] of joseDtrPattern) {
    const isPresentLike = status === "PRESENT" || status === "LATE";
    await prisma.dtrRecord.create({
      data: {
        studentId: jose.id,
        date: d(2026, 8, day),
        timeIn: isPresentLike ? d(2026, 8, day, status === "LATE" ? 8 : 7, status === "LATE" ? 30 : 45) : null,
        timeOut: isPresentLike ? d(2026, 8, day, 17, 0) : null,
        breakMinutes: isPresentLike ? 60 : 0,
        totalHours: isPresentLike ? (status === "LATE" ? 7.5 : 8.25) : 0,
        status,
        remarks: remarks ?? null,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Weekly Accomplishment Reports for Jose Rizal Bonifacio (demo)
  // ---------------------------------------------------------------------
  const joseWeek1 = await prisma.weeklyReport.create({
    data: {
      studentId: jose.id,
      weekNumber: 1,
      weekStartDate: d(2026, 8, 2),
      weekEndDate: d(2026, 8, 6),
      totalHours: 40,
      status: "SUBMITTED",
    },
  });

  await prisma.weeklyReportActivity.createMany({
    data: [
      { weeklyReportId: joseWeek1.id, date: d(2026, 8, 2), hoursSpent: 8, activity: "Assisted in network troubleshooting and maintenance", remarks: "Resolved 3 connectivity issues" },
      { weeklyReportId: joseWeek1.id, date: d(2026, 8, 3), hoursSpent: 8, activity: "Installed and configured software on workstations", remarks: "Completed setup for 5 new PCs" },
      { weeklyReportId: joseWeek1.id, date: d(2026, 8, 4), hoursSpent: 8, activity: "Attended team meeting and training session", remarks: "Learned about company IT policies" },
      { weeklyReportId: joseWeek1.id, date: d(2026, 8, 5), hoursSpent: 8, activity: "Documented IT inventory and asset tracking", remarks: "Updated spreadsheet for 50+ assets" },
      { weeklyReportId: joseWeek1.id, date: d(2026, 8, 6), hoursSpent: 8, activity: "Shadowed senior IT staff on server maintenance", remarks: "Observed backup procedures" },
    ],
  });

  const joseWeek2 = await prisma.weeklyReport.create({
    data: {
      studentId: jose.id,
      weekNumber: 2,
      weekStartDate: d(2026, 8, 9),
      weekEndDate: d(2026, 8, 13),
      totalHours: 40,
      status: "SUBMITTED",
    },
  });

  await prisma.weeklyReportActivity.createMany({
    data: [
      { weeklyReportId: joseWeek2.id, date: d(2026, 8, 9), hoursSpent: 8, activity: "Performed routine server health checks", remarks: "All systems operational" },
      { weeklyReportId: joseWeek2.id, date: d(2026, 8, 10), hoursSpent: 8, activity: "Configured firewall rules and security policies", remarks: "Approved by senior admin" },
      { weeklyReportId: joseWeek2.id, date: d(2026, 8, 11), hoursSpent: 8, activity: "Helped setup new employee workstations", remarks: "3 employees onboarded" },
      { weeklyReportId: joseWeek2.id, date: d(2026, 8, 12), hoursSpent: 8, activity: "Resolved helpdesk tickets", remarks: "Closed 12 tickets" },
      { weeklyReportId: joseWeek2.id, date: d(2026, 8, 13), hoursSpent: 8, activity: "Participated in cybersecurity awareness seminar", remarks: "Certificate received" },
    ],
  });

  const joseWeek3 = await prisma.weeklyReport.create({
    data: {
      studentId: jose.id,
      weekNumber: 3,
      weekStartDate: d(2026, 8, 16),
      weekEndDate: d(2026, 8, 20),
      totalHours: 32,
      status: "SUBMITTED",
    },
  });

  await prisma.weeklyReportActivity.createMany({
    data: [
      { weeklyReportId: joseWeek3.id, date: d(2026, 8, 16), hoursSpent: 8, activity: "Monitored network traffic for anomalies", remarks: "Detected and reported 1 suspicious IP" },
      { weeklyReportId: joseWeek3.id, date: d(2026, 8, 17), hoursSpent: 8, activity: "Updated company website content", remarks: "3 pages updated" },
      { weeklyReportId: joseWeek3.id, date: d(2026, 8, 19), hoursSpent: 8, activity: "Assisted in data migration project", remarks: "200GB migrated successfully" },
      { weeklyReportId: joseWeek3.id, date: d(2026, 8, 20), hoursSpent: 8, activity: "Prepared weekly IT status report", remarks: "Presented to supervisor" },
    ],
  });

  // ---------------------------------------------------------------------
  // OJT Evaluation for Jose Rizal Bonifacio (demo)
  // ---------------------------------------------------------------------
  await prisma.ojtEvaluation.create({
    data: {
      studentId: jose.id,
      department: "IT Department",
      trainingPeriod: "June 1 - Sept 1, 2026",
      supervisorName: "Engr. Maria Santos",
      evaluationDate: d(2026, 8, 25),
      qualityOfWork: 4,
      productivityEfficiency: 4,
      accuracyAttentionToDetail: 5,
      abilityToFollowInstructions: 4,
      abilityToWorkIndependently: 3,
      understandingOfTasks: 4,
      technicalSkills: 4,
      problemSolvingSkills: 4,
      abilityToLearnApplyFeedback: 5,
      punctualityAttendance: 5,
      initiative: 4,
      responsibilityDependability: 5,
      professionalBehavior: 4,
      communicationSkills: 4,
      teamworkCollaboration: 4,
      customerClientInteraction: 4,
      workPerformanceScore: 33.6,
      knowledgeSkillsScore: 22.5,
      workAttitudeScore: 18.4,
      communicationTeamworkScore: 12.0,
      totalScore: 86.5,
      comments: "The trainee has shown excellent performance throughout the OJT period. Demonstrated strong technical skills, particularly in network troubleshooting and software configuration. Always punctual and shows great initiative in taking on new tasks. Recommended for completion of the OJT program. Areas for improvement: Could be more confident when working independently on complex tasks.",
      evaluatorSignature: "Engr. Maria Santos",
    },
  });

  // ---------------------------------------------------------------------
  // Tasks for Jose Rizal Bonifacio (demo)
  // ---------------------------------------------------------------------
  await prisma.task.createMany({
    data: [
      { studentId: jose.id, title: "Network Troubleshooting", description: "Resolve connectivity issues in office", date: d(2026, 8, 2), status: "COMPLETED", skillsLearned: "Network diagnostics" },
      { studentId: jose.id, title: "Software Configuration", description: "Setup software on new workstations", date: d(2026, 8, 3), status: "COMPLETED", skillsLearned: "Software deployment" },
      { studentId: jose.id, title: "IT Asset Inventory", description: "Complete inventory of all IT equipment", date: d(2026, 8, 5), status: "COMPLETED", skillsLearned: "Asset management" },
      { studentId: jose.id, title: "Server Maintenance", description: "Perform server health checks", date: d(2026, 8, 9), status: "COMPLETED", skillsLearned: "Server administration" },
      { studentId: jose.id, title: "Firewall Configuration", description: "Configure security policies", date: d(2026, 8, 10), status: "COMPLETED", skillsLearned: "Network security" },
      { studentId: jose.id, title: "Cybersecurity Seminar", description: "Attend and complete cybersecurity training", date: d(2026, 8, 13), status: "COMPLETED", skillsLearned: "Security awareness" },
      { studentId: jose.id, title: "Network Monitoring", description: "Monitor and report network anomalies", date: d(2026, 8, 16), status: "ONGOING", skillsLearned: "Network monitoring" },
      { studentId: jose.id, title: "Data Migration", description: "Migrate files to new storage system", date: d(2026, 8, 19), status: "ONGOING", skillsLearned: "Data management" },
    ],
  });

  console.log("Seed complete.");
  console.log("---------------------------------------------------------");
  console.log(" Default password for every seeded account:", DEFAULT_PASSWORD);
  console.log(" Admin:        admin@ccdi.edu.ph / admin");
  console.log(" Student:      juan.delacruz@ccdi.edu.ph / 2026-001");
  console.log("---------------------------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
