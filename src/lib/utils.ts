export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${m}.${d} ${h}:${min}`;
}

export function getCategoryColor(cat: string): string {
  switch (cat) {
    case "질문": return "#3B82F6";
    case "정보": return "#22C55E";
    case "일상": return "#A855F7";
    case "긴급": return "#EF4444";
    default: return "#888";
  }
}
