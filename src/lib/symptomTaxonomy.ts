// P.E.T 부위별 31개 증상 분류 체계
// TTcare의 31개 증상 식별 기능과 동등 이상을 목표로 구조화
// 이미지 분석 API가 이 분류를 참조하여 체계적으로 체크하도록 프롬프트에 주입

export interface SymptomCategory {
  id: string;
  bodyPart: string;
  bodyPartEn: string;
  species: "dog" | "cat" | "both";
  symptoms: Array<{
    id: string;
    ko: string;
    en: string;
    severityBase: "normal" | "mild" | "moderate" | "urgent";
    description: string;
    descriptionEn: string;
  }>;
}

// ═══════════════════════════════════════════════════
// DOG — 5 부위, 총 19개 증상
// ═══════════════════════════════════════════════════
export const DOG_SYMPTOMS: SymptomCategory[] = [
  {
    id: "dog-body",
    bodyPart: "몸통·피부",
    bodyPartEn: "Body & Skin",
    species: "dog",
    symptoms: [
      { id: "d-body-1", ko: "탈모(원형)",        en: "Focal alopecia (circular)",  severityBase: "moderate", description: "원형·타원형 탈모. 곰팡이·모낭충·알레르기 가능성.", descriptionEn: "Circular/oval patches of hair loss. Possible ringworm, demodex, or allergy." },
      { id: "d-body-2", ko: "발진/홍반",          en: "Rash / erythema",             severityBase: "mild",     description: "피부가 붉고 작은 돌기. 알레르기·접촉성 피부염.", descriptionEn: "Redness with small bumps. Allergy or contact dermatitis." },
      { id: "d-body-3", ko: "비듬/각질",          en: "Dandruff / scaling",          severityBase: "mild",     description: "건조·피지 분비 이상. 영양 불균형도 원인.", descriptionEn: "Dry skin or sebum imbalance. Can be nutritional." },
      { id: "d-body-4", ko: "종괴/혹",            en: "Mass / lump",                 severityBase: "urgent",   description: "피하 종양·지방종·농양. 조직검사 필요.", descriptionEn: "Subcutaneous tumor, lipoma, or abscess. Biopsy recommended." },
      { id: "d-body-5", ko: "과도한 긁음",        en: "Excessive scratching",        severityBase: "mild",     description: "아토피·진드기·음식 알레르기 신호.", descriptionEn: "Signal for atopy, mites, or food allergy." },
    ],
  },
  {
    id: "dog-ear",
    bodyPart: "귀",
    bodyPartEn: "Ear",
    species: "dog",
    symptoms: [
      { id: "d-ear-1", ko: "귀 안쪽 붉음",        en: "Red inner ear",              severityBase: "moderate", description: "외이염·세균·효모 감염.", descriptionEn: "Otitis externa, bacterial or yeast infection." },
      { id: "d-ear-2", ko: "갈색 분비물",         en: "Brown discharge",            severityBase: "moderate", description: "귀진드기 또는 말라세지아.", descriptionEn: "Ear mites or Malassezia yeast." },
      { id: "d-ear-3", ko: "악취",               en: "Foul odor",                  severityBase: "moderate", description: "세균성 외이염 가능성.", descriptionEn: "Bacterial otitis is likely." },
      { id: "d-ear-4", ko: "부풀어 오름",         en: "Swelling (aural hematoma)",  severityBase: "urgent",   description: "이개혈종. 수술 필요.", descriptionEn: "Aural hematoma — requires surgical drainage." },
    ],
  },
  {
    id: "dog-paw",
    bodyPart: "발",
    bodyPartEn: "Paws",
    species: "dog",
    symptoms: [
      { id: "d-paw-1", ko: "발가락 사이 염증",     en: "Interdigital inflammation",  severityBase: "moderate", description: "농피증·이물질 침입.", descriptionEn: "Pyoderma or foreign body." },
      { id: "d-paw-2", ko: "발톱 부러짐",         en: "Broken nail",                severityBase: "moderate", description: "출혈·감염 위험.", descriptionEn: "Risk of bleeding and infection." },
      { id: "d-paw-3", ko: "발바닥 과각화",       en: "Hyperkeratosis of pads",     severityBase: "mild",     description: "노령·간부전·아연 결핍 가능.", descriptionEn: "Senior age, liver issues, or zinc deficiency." },
      { id: "d-paw-4", ko: "절뚝거림",           en: "Limping",                    severityBase: "moderate", description: "슬개골 탈구·인대 부상·관절염.", descriptionEn: "Patellar luxation, ligament injury, or arthritis." },
    ],
  },
  {
    id: "dog-eye",
    bodyPart: "눈",
    bodyPartEn: "Eye",
    species: "dog",
    symptoms: [
      { id: "d-eye-1", ko: "눈곱 과다",          en: "Excessive discharge",        severityBase: "mild",     description: "결막염·눈물흘림증.", descriptionEn: "Conjunctivitis or epiphora." },
      { id: "d-eye-2", ko: "결막 충혈",          en: "Conjunctival redness",       severityBase: "moderate", description: "알레르기·외상·감염.", descriptionEn: "Allergy, trauma, or infection." },
      { id: "d-eye-3", ko: "눈 불투명",          en: "Cloudy cornea / lens",       severityBase: "urgent",   description: "백내장·각막 궤양·녹내장.", descriptionEn: "Cataract, corneal ulcer, or glaucoma." },
    ],
  },
  {
    id: "dog-teeth",
    bodyPart: "치아·구강",
    bodyPartEn: "Teeth & Mouth",
    species: "dog",
    symptoms: [
      { id: "d-teeth-1", ko: "치석",             en: "Dental calculus",             severityBase: "mild",     description: "스케일링 필요.", descriptionEn: "Dental cleaning needed." },
      { id: "d-teeth-2", ko: "잇몸 붉음/출혈",    en: "Red / bleeding gums",         severityBase: "moderate", description: "치주염·치은염.", descriptionEn: "Periodontitis or gingivitis." },
      { id: "d-teeth-3", ko: "구취",             en: "Halitosis",                   severityBase: "mild",     description: "치주 질환 신호.", descriptionEn: "Sign of periodontal disease." },
    ],
  },
];

// ═══════════════════════════════════════════════════
// CAT — 2 부위, 총 12개 증상 (TTcare와 동일 범위)
// ═══════════════════════════════════════════════════
export const CAT_SYMPTOMS: SymptomCategory[] = [
  {
    id: "cat-eye",
    bodyPart: "눈",
    bodyPartEn: "Eye",
    species: "cat",
    symptoms: [
      { id: "c-eye-1", ko: "제3안검 노출",       en: "Third eyelid protrusion",    severityBase: "moderate", description: "전신 쇠약·탈수·허피스 감염 신호.", descriptionEn: "Sign of systemic illness, dehydration, or herpes." },
      { id: "c-eye-2", ko: "눈곱(녹/황)",         en: "Green/yellow discharge",      severityBase: "moderate", description: "세균성 결막염.", descriptionEn: "Bacterial conjunctivitis." },
      { id: "c-eye-3", ko: "눈물 과다",          en: "Excessive tearing",           severityBase: "mild",     description: "눈물 덕트 막힘·허피스.", descriptionEn: "Blocked tear duct or herpes." },
      { id: "c-eye-4", ko: "동공 크기 불균형",    en: "Unequal pupil sizes",         severityBase: "urgent",   description: "신경학적 이상 가능 — 즉시 병원.", descriptionEn: "Possible neurological issue — see vet immediately." },
      { id: "c-eye-5", ko: "각막 혼탁",          en: "Cloudy cornea",               severityBase: "urgent",   description: "각막 궤양·포도막염.", descriptionEn: "Corneal ulcer or uveitis." },
      { id: "c-eye-6", ko: "FGS 통증 지표",      en: "FGS pain indicators",         severityBase: "moderate", description: "Feline Grimace Scale: 귀·눈꺼풀·머리 자세 통증 신호.", descriptionEn: "Feline Grimace Scale: pain signals from ears, orbital tightening, head posture." },
    ],
  },
  {
    id: "cat-teeth",
    bodyPart: "치아·구강",
    bodyPartEn: "Teeth & Mouth",
    species: "cat",
    symptoms: [
      { id: "c-teeth-1", ko: "치은염",           en: "Gingivitis",                  severityBase: "moderate", description: "만성 구내염 위험군.", descriptionEn: "Risk of chronic stomatitis." },
      { id: "c-teeth-2", ko: "치아 흡수성 병변",  en: "Tooth resorption",            severityBase: "urgent",   description: "FORL — 발치 필수 수준 통증.", descriptionEn: "FORL — painful, extraction often needed." },
      { id: "c-teeth-3", ko: "구취",             en: "Halitosis",                   severityBase: "mild",     description: "치주 또는 신장 질환 신호.", descriptionEn: "Periodontal or kidney disease signal." },
      { id: "c-teeth-4", ko: "침 흘림",          en: "Drooling",                    severityBase: "moderate", description: "구강 통증·신부전·독성 섭취.", descriptionEn: "Oral pain, kidney failure, or toxin ingestion." },
      { id: "c-teeth-5", ko: "먹기 거부",        en: "Food refusal",                severityBase: "moderate", description: "치아 통증·전신 질환.", descriptionEn: "Tooth pain or systemic illness." },
      { id: "c-teeth-6", ko: "턱 부종",          en: "Jaw swelling",                severityBase: "urgent",   description: "농양·종양 가능.", descriptionEn: "Possible abscess or tumor." },
    ],
  },
];

// 전체 증상 수: 19 (DOG) + 12 (CAT) = 31개 — TTcare 동등
export const TOTAL_SYMPTOMS = DOG_SYMPTOMS.reduce((a, c) => a + c.symptoms.length, 0)
  + CAT_SYMPTOMS.reduce((a, c) => a + c.symptoms.length, 0);

// Gemini 프롬프트용 요약 문자열 생성 (한국어)
export function buildSymptomChecklistKo(species: "dog" | "cat"): string {
  const cats = species === "dog" ? DOG_SYMPTOMS : CAT_SYMPTOMS;
  const lines: string[] = [];
  lines.push(`## ${species === "dog" ? "강아지" : "고양이"} 부위별 증상 체크리스트 (총 ${cats.reduce((a, c) => a + c.symptoms.length, 0)}개)`);
  cats.forEach((cat) => {
    lines.push(`### [${cat.bodyPart}]`);
    cat.symptoms.forEach((s) => {
      lines.push(`  - ${s.ko}: ${s.description} (기본 심각도: ${s.severityBase})`);
    });
  });
  lines.push("");
  lines.push("## 교차 분석 지시");
  lines.push("1. 이미지에서 보이는 부위를 먼저 파악 (정면/측면/부분 확대)");
  lines.push("2. 위 체크리스트의 해당 부위 증상을 차례로 스캔");
  lines.push("3. 발견한 증상은 반드시 fgs_breakdown 또는 bboxes에 정량적으로 기록");
  lines.push("4. 2개 이상 부위에 이상 시 severity를 한 단계 올릴 것");
  return lines.join("\n");
}

// Gemini 프롬프트용 요약 문자열 생성 (영어)
export function buildSymptomChecklistEn(species: "dog" | "cat"): string {
  const cats = species === "dog" ? DOG_SYMPTOMS : CAT_SYMPTOMS;
  const lines: string[] = [];
  lines.push(`## ${species === "dog" ? "DOG" : "CAT"} body-part symptom checklist (total ${cats.reduce((a, c) => a + c.symptoms.length, 0)} symptoms)`);
  cats.forEach((cat) => {
    lines.push(`### [${cat.bodyPartEn}]`);
    cat.symptoms.forEach((s) => {
      lines.push(`  - ${s.en}: ${s.descriptionEn} (baseline severity: ${s.severityBase})`);
    });
  });
  lines.push("");
  lines.push("## Cross-analysis instructions");
  lines.push("1. First identify which body parts are visible (frontal/lateral/close-up)");
  lines.push("2. Systematically scan the visible body-part's checklist above");
  lines.push("3. Record any detected symptom quantitatively in fgs_breakdown or bboxes");
  lines.push("4. If 2+ body parts show abnormalities, raise severity one level");
  return lines.join("\n");
}
