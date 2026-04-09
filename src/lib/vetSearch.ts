import type { VetClinic } from "../types";

// 고양시/일산 지역 동물병원 데이터 (정적, MVP용)
// 나중에 카카오 Local API로 대체 가능
const VET_CLINICS: VetClinic[] = [
  { name: "24시 일산동물의료센터", address: "경기 고양시 일산동구 장항동 858", phone: "031-901-7588", lat: 37.6584, lng: 126.7735, distance: 0, is24h: true },
  { name: "24시 센트럴동물메디컬센터", address: "경기 고양시 일산서구 대화동 2208", phone: "031-924-7582", lat: 37.6731, lng: 126.7484, distance: 0, is24h: true },
  { name: "킨텍스동물병원", address: "경기 고양시 일산서구 킨텍스로 240", phone: "031-908-3375", lat: 37.6690, lng: 126.7510, distance: 0, is24h: false },
  { name: "한양동물병원", address: "경기 고양시 덕양구 화정동 983", phone: "031-969-7975", lat: 37.6340, lng: 126.8320, distance: 0, is24h: false },
  { name: "고양동물메디컬센터", address: "경기 고양시 일산동구 백석동 1325", phone: "031-903-7500", lat: 37.6440, lng: 126.7870, distance: 0, is24h: false },
  { name: "24시 마두동물병원", address: "경기 고양시 일산동구 마두동 803", phone: "031-905-0075", lat: 37.6530, lng: 126.7730, distance: 0, is24h: true },
  { name: "라온동물병원", address: "경기 고양시 일산서구 주엽동 100", phone: "031-912-3456", lat: 37.6610, lng: 126.7580, distance: 0, is24h: false },
  { name: "풍산동물병원", address: "경기 고양시 덕양구 행신동 710", phone: "031-972-8282", lat: 37.6120, lng: 126.8340, distance: 0, is24h: false },
];

// Haversine 공식으로 거리 계산 (km)
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

export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("위치 서비스를 지원하지 않는 브라우저입니다."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        // 위치 거부 시 고양시 일산 기본 좌표
        resolve({ lat: 37.6584, lng: 126.7735 });
      },
      { timeout: 5000 }
    );
  });
}
