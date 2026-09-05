export type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusMeta {
  label: string;
  variant: StatusVariant;
}

const STATUS_MAP: Record<string, StatusMeta> = {
  // OJT status
  NOT_STARTED: { label: "Not Started", variant: "neutral" },
  ONGOING: { label: "Ongoing", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
  FAILED: { label: "Failed", variant: "danger" },
  ON_HOLD: { label: "On Hold", variant: "warning" },

  // Applications / requirements
  DRAFT: { label: "Draft", variant: "neutral" },
  SUBMITTED: { label: "Submitted", variant: "info" },
  UNDER_REVIEW: { label: "Under Review", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  REVISION_REQUIRED: { label: "Revision Required", variant: "warning" },
  NOT_SUBMITTED: { label: "Not Submitted", variant: "neutral" },

  // Attendance
  PRESENT: { label: "Present", variant: "success" },
  LATE: { label: "Late", variant: "warning" },
  ABSENT: { label: "Absent", variant: "danger" },
  EXCUSED: { label: "Excused", variant: "info" },
  HALF_DAY: { label: "Half Day", variant: "warning" },
  HOLIDAY: { label: "Holiday", variant: "neutral" },

  // Daily log
  PENDING: { label: "Pending", variant: "warning" },
  REVISION_REQUESTED: { label: "Revision Requested", variant: "warning" },

  // Users / partnership
  ACTIVE: { label: "Active", variant: "success" },
  DISABLED: { label: "Disabled", variant: "danger" },
  INACTIVE: { label: "Inactive", variant: "neutral" },
};

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getStatusMeta(status: string): StatusMeta {
  return STATUS_MAP[status] ?? { label: toTitleCase(status), variant: "neutral" };
}
