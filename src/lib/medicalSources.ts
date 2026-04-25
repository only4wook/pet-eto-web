export interface MedicalReference {
  title: string;
  titleEn: string;
  organization: string;
  organizationEn: string;
  url: string;
  category: "emergency" | "toxicity" | "eye" | "dental" | "skin" | "behavior" | "nutrition" | "general";
}

export interface ExpertAttribution {
  name: string;
  clinic?: string | null;
  license?: string | null;
  role?: string | null;
}

const REFERENCES: MedicalReference[] = [
  {
    title: "반려동물 응급처치 안내",
    titleEn: "Pet first aid basics",
    organization: "미국수의사회",
    organizationEn: "American Veterinary Medical Association",
    url: "https://www.avma.org/resources-tools/pet-owners/emergencycare/first-aid-tips-pet-owners",
    category: "emergency",
  },
  {
    title: "초콜릿 독성",
    titleEn: "Chocolate toxicity",
    organization: "Merck Veterinary Manual",
    organizationEn: "Merck Veterinary Manual",
    url: "https://www.merckvetmanual.com/toxicology/food-hazards/chocolate-poisoning-in-dogs",
    category: "toxicity",
  },
  {
    title: "반려동물 독성 물질",
    titleEn: "Toxic and non-toxic plants and substances",
    organization: "ASPCA Animal Poison Control Center",
    organizationEn: "ASPCA Animal Poison Control Center",
    url: "https://www.aspca.org/pet-care/animal-poison-control",
    category: "toxicity",
  },
  {
    title: "고양이 눈 건강",
    titleEn: "Feline eye health",
    organization: "Cornell Feline Health Center",
    organizationEn: "Cornell Feline Health Center",
    url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics",
    category: "eye",
  },
  {
    title: "반려동물 치과 관리",
    titleEn: "Pet dental care",
    organization: "American Veterinary Dental College",
    organizationEn: "American Veterinary Dental College",
    url: "https://avdc.org/animal-owner-resources/",
    category: "dental",
  },
  {
    title: "피부 질환 개요",
    titleEn: "Skin disorders in dogs and cats",
    organization: "Merck Veterinary Manual",
    organizationEn: "Merck Veterinary Manual",
    url: "https://www.merckvetmanual.com/dog-owners/skin-disorders-of-dogs/overview-of-skin-disorders-of-dogs",
    category: "skin",
  },
  {
    title: "행동 문제와 환경 관리",
    titleEn: "Behavior problems and enrichment",
    organization: "AAHA",
    organizationEn: "American Animal Hospital Association",
    url: "https://www.aaha.org/resources/pet-behavior-problems/",
    category: "behavior",
  },
  {
    title: "반려동물 영양 가이드",
    titleEn: "Pet nutrition resources",
    organization: "WSAVA Global Nutrition Committee",
    organizationEn: "WSAVA Global Nutrition Committee",
    url: "https://wsava.org/global-guidelines/global-nutrition-guidelines/",
    category: "nutrition",
  },
  {
    title: "보호자용 동물 건강 정보",
    titleEn: "Animal health topics for pet owners",
    organization: "Merck Veterinary Manual",
    organizationEn: "Merck Veterinary Manual",
    url: "https://www.merckvetmanual.com/pet-health",
    category: "general",
  },
];

const KEYWORDS: Record<MedicalReference["category"], RegExp> = {
  emergency: /응급|긴급|경련|발작|출혈|호흡|숨|의식|쇼크|교통사고|emergency|urgent|seizure|bleeding|breath|collapse/i,
  toxicity: /초콜릿|포도|건포도|양파|마늘|자일리톨|카페인|알코올|독성|중독|먹었|chocolate|grape|raisin|onion|garlic|xylitol|toxic|poison/i,
  eye: /눈|안검|동공|각막|눈곱|충혈|eye|eyelid|pupil|cornea|discharge/i,
  dental: /치아|잇몸|구강|입냄새|구취|침 흘|tooth|teeth|gum|dental|mouth|drool|halitosis/i,
  skin: /피부|털|탈모|가려|발진|귀|발바닥|skin|hair|rash|itch|ear|paw/i,
  behavior: /행동|분리불안|공격|울|합사|훈련|스트레스|behavior|anxiety|aggression|training|stress/i,
  nutrition: /사료|간식|먹어도|영양|비만|체중|food|treat|nutrition|diet|weight/i,
  general: /./,
};

function byCategory(category: MedicalReference["category"]): MedicalReference | undefined {
  return REFERENCES.find((ref) => ref.category === category);
}

export function selectMedicalReferences(input: string, limit = 3): MedicalReference[] {
  const picked: MedicalReference[] = [];
  const add = (ref?: MedicalReference) => {
    if (ref && !picked.some((item) => item.url === ref.url)) picked.push(ref);
  };

  for (const category of ["emergency", "toxicity", "eye", "dental", "skin", "behavior", "nutrition"] as const) {
    if (KEYWORDS[category].test(input)) add(byCategory(category));
  }

  add(byCategory("general"));
  return picked.slice(0, limit);
}

export function formatReferenceLabel(ref: MedicalReference, locale: "ko" | "en" = "ko"): string {
  return locale === "en"
    ? `${ref.titleEn} — ${ref.organizationEn}`
    : `${ref.title} — ${ref.organization}`;
}
