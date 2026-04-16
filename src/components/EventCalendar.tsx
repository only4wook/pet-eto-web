"use client";

import React, { useState, useEffect } from "react";

const EVENTS_2026 = [
  { id: "ev1", title: "서울 펫쇼", location: "코엑스", startMonth: 1, startDay: 15, endMonth: 1, endDay: 17, color: "#FF6B35" },
  { id: "ev2", title: "고양 반려동물 문화축제", location: "킨텍스", startMonth: 3, startDay: 22, endMonth: 3, endDay: 23, color: "#2EC4B6" },
  { id: "ev3", title: "반려동물 건강 세미나", location: "한양대", startMonth: 4, startDay: 19, endMonth: 4, endDay: 19, color: "#FF6B35" },
  { id: "ev4", title: "부산 펫 페스티벌", location: "벡스코", startMonth: 5, startDay: 10, endMonth: 5, endDay: 11, color: "#7C3AED" },
  { id: "ev5", title: "세계 동물의 날", location: "전국", startMonth: 10, startDay: 4, endMonth: 10, endDay: 4, color: "#059669" },
  { id: "ev6", title: "크리스마스 펫 마켓", location: "코엑스", startMonth: 12, startDay: 20, endMonth: 12, endDay: 25, color: "#DC2626" },
];

const MONTH_NAMES = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

const DAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

const TODAY_MONTH = 4;
const TODAY_DAY = 17;
const YEAR = 2026;

function getDaysInMonth(month: number): number {
  return new Date(YEAR, month, 0).getDate();
}

function getFirstDayOfWeek(month: number): number {
  return new Date(YEAR, month - 1, 1).getDay();
}

function getEventsForDay(month: number, day: number) {
  return EVENTS_2026.filter((ev) => {
    if (ev.startMonth === ev.endMonth) {
      return ev.startMonth === month && day >= ev.startDay && day <= ev.endDay;
    }
    if (month === ev.startMonth) return day >= ev.startDay;
    if (month === ev.endMonth) return day <= ev.endDay;
    return month > ev.startMonth && month < ev.endMonth;
  });
}

function isPast(month: number, day: number): boolean {
  if (month < TODAY_MONTH) return true;
  if (month === TODAY_MONTH && day < TODAY_DAY) return true;
  return false;
}

function isToday(month: number, day: number): boolean {
  return month === TODAY_MONTH && day === TODAY_DAY;
}

export default function EventCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS_2026[number] | null>(null);
  const [selectedDay, setSelectedDay] = useState<{ month: number; day: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = isMobile ? 1 : isTablet ? 2 : 3;

  function handleDayClick(month: number, day: number) {
    const events = getEventsForDay(month, day);
    if (events.length > 0) {
      setSelectedEvent(events[0]);
      setSelectedDay({ month, day });
    } else {
      setSelectedEvent(null);
      setSelectedDay(null);
    }
  }

  function renderMonth(month: number) {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfWeek(month);
    const isCurrentMonth = month === TODAY_MONTH;

    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = Array(firstDay).fill(null);

    for (let d = 1; d <= daysInMonth; d++) {
      currentWeek.push(d);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    return (
      <div
        key={month}
        style={{
          background: isCurrentMonth ? "#FFF7ED" : "#FFFFFF",
          borderRadius: 12,
          padding: 16,
          border: isCurrentMonth ? "2px solid #FF6B35" : "1px solid #E5E5E7",
          transition: "box-shadow 0.2s",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: isCurrentMonth ? "#FF6B35" : "#1D1D1F",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {MONTH_NAMES[month - 1]}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0,
            textAlign: "center",
          }}
        >
          {DAY_HEADERS.map((h, i) => (
            <div
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: i === 0 ? "#DC2626" : i === 6 ? "#2563EB" : "#9CA3AF",
                paddingBottom: 4,
              }}
            >
              {h}
            </div>
          ))}

          {weeks.flat().map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} style={{ height: 32 }} />;
            }

            const events = getEventsForDay(month, day);
            const hasEvent = events.length > 0;
            const past = isPast(month, day);
            const today = isToday(month, day);
            const isSelected =
              selectedDay?.month === month && selectedDay?.day === day;
            const dayOfWeek = (getFirstDayOfWeek(month) + day - 1) % 7;

            return (
              <div
                key={`day-${day}`}
                onClick={() => handleDayClick(month, day)}
                style={{
                  height: 32,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: hasEvent ? "pointer" : "default",
                  position: "relative",
                  borderRadius: 6,
                  background: today
                    ? "#FF6B35"
                    : isSelected
                    ? "#FFF1EB"
                    : "transparent",
                  transition: "background 0.15s",
                  opacity: past && !today ? 0.4 : 1,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: today ? 700 : 400,
                    color: today
                      ? "#FFFFFF"
                      : dayOfWeek === 0
                      ? "#DC2626"
                      : dayOfWeek === 6
                      ? "#2563EB"
                      : "#1D1D1F",
                    lineHeight: 1,
                  }}
                >
                  {day}
                </span>
                {hasEvent && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 2,
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    {events.slice(0, 3).map((ev, i) => (
                      <span
                        key={ev.id + i}
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: ev.color,
                          display: "inline-block",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
        padding: isMobile ? 16 : 28,
        fontFamily: "inherit",
        color: "#1D1D1F",
        maxWidth: 1080,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          marginBottom: 20,
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              color: "#1D1D1F",
            }}
          >
            2026 반려동물 이벤트 캘린더
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#6B7280",
              margin: "4px 0 0 0",
            }}
          >
            올해 예정된 반려동물 행사를 한눈에 확인하세요
          </p>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 12,
            color: "#6B7280",
          }}
        >
          {EVENTS_2026.map((ev) => (
            <div
              key={ev.id}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: ev.color,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span>{ev.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected event display */}
      {selectedEvent && (
        <div
          style={{
            background: "#F5F5F7",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 14,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: selectedEvent.color,
              flexShrink: 0,
            }}
          />
          <div>
            <span style={{ fontWeight: 600, color: "#1D1D1F" }}>
              {selectedEvent.title}
            </span>
            <span style={{ color: "#9CA3AF", margin: "0 8px" }}>|</span>
            <span style={{ color: "#6B7280" }}>{selectedEvent.location}</span>
            <span style={{ color: "#9CA3AF", margin: "0 8px" }}>|</span>
            <span style={{ color: "#6B7280" }}>
              {selectedEvent.startMonth}월 {selectedEvent.startDay}일
              {selectedEvent.startDay !== selectedEvent.endDay ||
              selectedEvent.startMonth !== selectedEvent.endMonth
                ? ` ~ ${selectedEvent.endMonth}월 ${selectedEvent.endDay}일`
                : ""}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setSelectedDay(null);
            }}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              color: "#9CA3AF",
              padding: "0 4px",
              lineHeight: 1,
            }}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      )}

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 12,
        }}
      >
        {Array.from({ length: 12 }, (_, i) => renderMonth(i + 1))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 11,
          color: "#9CA3AF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "#FF6B35",
              display: "inline-block",
            }}
          />
          오늘
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "#FFF7ED",
              border: "1px solid #FF6B35",
              display: "inline-block",
            }}
          />
          이번 달
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#FF6B35",
              display: "inline-block",
            }}
          />
          이벤트
        </div>
      </div>
    </div>
  );
}
