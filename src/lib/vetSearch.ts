import type { VetClinic } from "../types";

// 서울/경기 주요 동물병원 데이터 (정적, MVP용)
const VET_CLINICS: VetClinic[] = [
  // === 고양시/일산 ===
  { name: "24시 일산동물의료센터", address: "경기 고양시 일산동구 장항동 858", phone: "031-901-7588", lat: 37.6584, lng: 126.7735, distance: 0, is24h: true },
  { name: "24시 센트럴동물메디컬센터", address: "경기 고양시 일산서구 대화동 2208", phone: "031-924-7582", lat: 37.6731, lng: 126.7484, distance: 0, is24h: true },
  { name: "킨텍스동물병원", address: "경기 고양시 일산서구 킨텍스로 240", phone: "031-908-3375", lat: 37.6690, lng: 126.7510, distance: 0, is24h: false },
  { name: "한양동물병원", address: "경기 고양시 덕양구 화정동 983", phone: "031-969-7975", lat: 37.6340, lng: 126.8320, distance: 0, is24h: false },
  { name: "고양동물메디컬센터", address: "경기 고양시 일산동구 백석동 1325", phone: "031-903-7500", lat: 37.6440, lng: 126.7870, distance: 0, is24h: false },
  { name: "24시 마두동물병원", address: "경기 고양시 일산동구 마두동 803", phone: "031-905-0075", lat: 37.6530, lng: 126.7730, distance: 0, is24h: true },
  // === 서울 성동구 (한양대 근처) ===
  { name: "24시 SNC동물메디컬센터", address: "서울 성동구 왕십리로 115", phone: "02-2292-7575", lat: 37.5615, lng: 127.0390, distance: 0, is24h: true },
  { name: "한양동물병원", address: "서울 성동구 행당동 319", phone: "02-2293-7501", lat: 37.5580, lng: 127.0360, distance: 0, is24h: false },
  { name: "왕십리동물병원", address: "서울 성동구 왕십리로 300", phone: "02-2296-0075", lat: 37.5610, lng: 127.0370, distance: 0, is24h: false },
  { name: "이든동물병원", address: "서울 성동구 마장로 20", phone: "02-2281-7582", lat: 37.5650, lng: 127.0300, distance: 0, is24h: false },
  // === 서울 강남/서초 ===
  { name: "24시 강남동물메디컬센터", address: "서울 강남구 역삼동 823", phone: "02-555-7582", lat: 37.5000, lng: 127.0400, distance: 0, is24h: true },
  { name: "24시 청담동물병원", address: "서울 강남구 청담동 118", phone: "02-547-0075", lat: 37.5240, lng: 127.0530, distance: 0, is24h: true },
  { name: "VIP동물의료센터", address: "서울 강남구 논현동 63", phone: "02-515-7575", lat: 37.5130, lng: 127.0280, distance: 0, is24h: true },
  // === 서울 마포/홍대 ===
  { name: "24시 마포동물의료센터", address: "서울 마포구 합정동 411", phone: "02-332-7575", lat: 37.5490, lng: 126.9130, distance: 0, is24h: true },
  { name: "홍대동물병원", address: "서울 마포구 서교동 395", phone: "02-336-0075", lat: 37.5560, lng: 126.9250, distance: 0, is24h: false },
  // === 서울 종로/중구 ===
  { name: "24시 서울동물메디컬센터", address: "서울 중구 을지로 100", phone: "02-2266-7582", lat: 37.5660, lng: 126.9920, distance: 0, is24h: true },
  // === 서울 강서구/화곡 ===
  { name: "24시 강서YD동물의료센터", address: "서울 강서구 화곡로 264", phone: "02-2061-7582", lat: 37.5450, lng: 126.8370, distance: 0, is24h: true },
  { name: "화곡동물병원", address: "서울 강서구 화곡동 1065", phone: "02-2691-7975", lat: 37.5410, lng: 126.8390, distance: 0, is24h: false },
  { name: "마곡동물병원", address: "서울 강서구 마곡동로 136", phone: "02-2662-0075", lat: 37.5590, lng: 126.8280, distance: 0, is24h: false },
  { name: "발산동물병원", address: "서울 강서구 공항대로 168", phone: "02-2658-7582", lat: 37.5560, lng: 126.8370, distance: 0, is24h: false },
  // === 서울 송파/잠실 ===
  { name: "24시 송파동물의료센터", address: "서울 송파구 송파대로 345", phone: "02-412-7575", lat: 37.5050, lng: 127.1120, distance: 0, is24h: true },
  { name: "잠실동물병원", address: "서울 송파구 잠실동 178", phone: "02-421-0075", lat: 37.5130, lng: 127.1000, distance: 0, is24h: false },
  // === 서울 관악/신림 ===
  { name: "24시 관악동물의료센터", address: "서울 관악구 봉천로 488", phone: "02-877-7575", lat: 37.4780, lng: 126.9530, distance: 0, is24h: true },
  // === 서울 영등포/여의도 ===
  { name: "영등포동물병원", address: "서울 영등포구 영등포로 200", phone: "02-2634-7582", lat: 37.5170, lng: 126.9070, distance: 0, is24h: false },
  // === 서울 노원 ===
  { name: "24시 노원동물의료센터", address: "서울 노원구 상계동 710", phone: "02-932-7575", lat: 37.6540, lng: 127.0610, distance: 0, is24h: true },
  // === 서울 광진/건대 ===
  { name: "건대동물병원", address: "서울 광진구 자양동 685", phone: "02-444-7582", lat: 37.5400, lng: 127.0690, distance: 0, is24h: false },
  // === 파주 ===
  { name: "24시 파주동물의료센터", address: "경기 파주시 운정동 1126", phone: "031-949-7575", lat: 37.7130, lng: 126.7610, distance: 0, is24h: true },
  { name: "운정동물병원", address: "경기 파주시 와석순환로 415", phone: "031-948-0075", lat: 37.7150, lng: 126.7500, distance: 0, is24h: false },
  { name: "금촌동물병원", address: "경기 파주시 금촌동 210", phone: "031-944-7582", lat: 37.7620, lng: 126.7830, distance: 0, is24h: false },
  // === 수원/용인 ===
  { name: "24시 수원동물메디컬센터", address: "경기 수원시 영통구 영통동 992", phone: "031-206-7575", lat: 37.2540, lng: 127.0580, distance: 0, is24h: true },
  { name: "24시 용인동물의료센터", address: "경기 용인시 수지구 죽전동 1328", phone: "031-898-7575", lat: 37.3250, lng: 127.1080, distance: 0, is24h: true },
  // === 인천 ===
  { name: "24시 인천동물의료센터", address: "인천 남동구 구월동 1138", phone: "032-436-7575", lat: 37.4500, lng: 126.7310, distance: 0, is24h: true },
  // === 성남/분당 ===
  { name: "24시 분당동물메디컬센터", address: "경기 성남시 분당구 정자동 178", phone: "031-715-7575", lat: 37.3660, lng: 127.1080, distance: 0, is24h: true },
];

// Haversine 공식
function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearbyVetClinics(lat: number, lng: number, is24hOnly?: boolean): VetClinic[] {
  let clinics = VET_CLINICS.map((c) => ({
    ...c,
    distance: Math.round(calcDistance(lat, lng, c.lat, c.lng) * 10) / 10,
  }));

  if (is24hOnly) clinics = clinics.filter((c) => c.is24h);

  return clinics.sort((a, b) => a.distance - b.distance);
}

// 지역명으로 병원 검색
export function searchVetByArea(area: string, is24hOnly?: boolean): VetClinic[] {
  let clinics = VET_CLINICS.filter((c) => c.address.includes(area) || c.name.includes(area));
  if (is24hOnly) clinics = clinics.filter((c) => c.is24h);
  return clinics;
}

export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 37.5615, lng: 127.0390 }); // 한양대 기본
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({ lat: 37.5615, lng: 127.0390 }), // 위치 거부 시 한양대
      { timeout: 5000 }
    );
  });
}
