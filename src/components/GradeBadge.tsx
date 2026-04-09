"use client";
import { getGrade, getRoleInfo } from "../lib/grades";

interface Props {
  points: number;
  role?: string;
  showLabel?: boolean;
}

export default function GradeBadge({ points, role, showLabel = true }: Props) {
  const roleInfo = role ? getRoleInfo(role) : null;
  const grade = getGrade(points);

  // 전문가는 전문가 배지 우선 표시
  if (roleInfo) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        background: roleInfo.bgColor, color: roleInfo.color,
        padding: "1px 6px", borderRadius: 3, fontSize: 11, fontWeight: 700,
        whiteSpace: "nowrap",
      }}>
        {roleInfo.icon} {showLabel && roleInfo.label}
      </span>
    );
  }

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: grade.bgColor, color: grade.color,
      padding: "1px 6px", borderRadius: 3, fontSize: 11, fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      {grade.icon} {showLabel && grade.label}
    </span>
  );
}
