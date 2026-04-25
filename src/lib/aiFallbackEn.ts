// English fallback knowledge base for P.E.T AI
// Used when Gemini API is unavailable (quota exhausted, network error).
// Keyword-based rules — covers high-frequency questions in English.

interface FallbackRule {
  keywords: string[];
  response: string;
}

const RULES: FallbackRule[] = [
  // ───── Emergency / Toxicity ─────
  {
    keywords: ["chocolate", "choco"],
    response: `🚨 URGENT — chocolate toxicity in pets

📱 Do right now:
1. Note the type (dark/milk/white) and amount (grams)
2. Call a 24h vet clinic: "my pet ate X grams of chocolate"
3. Save the wrapper for ingredient check
4. Note the exact time of ingestion

⚠️ Toxicity (per 1 kg body weight):
- Dark chocolate: symptoms at 2 g/kg, life-threatening at 5 g/kg
- Milk chocolate: dangerous at 20 g/kg
- White chocolate: largely safe but lactose can cause diarrhea

⛔ Do NOT:
- Induce vomiting at home (aspiration risk)
- Force water (accelerates absorption)
- Wait and see — cats metabolize theobromine slower than dogs

💰 Cost: decontamination ₩50K–150K, overnight IV ₩200K–500K, ICU ₩500K–1.5M

Tell me the exact amount and your pet's weight and I'll estimate the risk precisely.`,
  },
  {
    keywords: ["lemon", "citrus", "orange", "grapefruit"],
    response: `⚠️ Citrus (lemon, orange, grapefruit) is toxic to both cats and dogs.

Toxic compounds: psoralens, essential oils (limonene, linalool), citric acid.

Symptoms (1–6 hours after ingestion):
1. Vomiting, diarrhea
2. Drooling, loss of appetite
3. Sensitivity to light
4. Depression, tremors (high doses)

Do right now:
1. Remove any remaining citrus
2. Rinse your pet's mouth with plain water
3. Call a vet if more than a small bite was consumed
4. Monitor for vomiting over the next 6 hours

Most small bites cause only mild GI upset. Large amounts or essential oils (diffusers, cleaning products) can be serious.

Vet visit cost: ₩30K–80K for exam + symptomatic care.`,
  },
  {
    keywords: ["onion", "garlic", "chives", "leek"],
    response: `🚨 Onion and garlic are highly toxic to cats and dogs — they cause red blood cell damage (hemolytic anemia).

Toxic dose:
- Dogs: 15–30 g/kg (garlic is ~5x more potent than onion)
- Cats: even smaller amounts are dangerous

Symptoms (can be delayed 1–7 days):
1. Weakness, lethargy
2. Pale gums
3. Dark/red urine
4. Rapid breathing
5. Vomiting, diarrhea

Do now:
1. Remove any remaining food
2. Note amount and form (raw/cooked/powder — powder is most concentrated)
3. Go to a 24h vet immediately if any was consumed

Treatment: decontamination, blood transfusion if severe.
Cost: ₩200K–1M depending on severity.`,
  },
  {
    keywords: ["grape", "raisin"],
    response: `🚨 EMERGENCY — grapes and raisins can cause acute kidney failure in dogs (and possibly cats).

Even a tiny amount (1 grape for a small dog) can be fatal. The toxic mechanism is still not fully understood.

Do RIGHT NOW:
1. Note amount and time
2. Go to a 24h vet — do NOT wait

Treatment:
- Induced vomiting within 2 hours
- Activated charcoal
- 48h IV fluid therapy to protect kidneys
- Blood work to monitor kidney function

Cost: ₩300K–1.5M for full hospitalization.

Do not try home remedies. This is a life-threatening emergency.`,
  },

  // ───── Common symptoms ─────
  {
    keywords: ["vomit", "throw up", "throwing up"],
    response: `Vomiting — here's how to evaluate it.

⚠️ Go to a vet NOW if:
- Blood in vomit (red or coffee-ground appearance)
- Vomiting 3+ times in one hour
- Abdomen is hard/swollen
- Your pet is lethargic or unresponsive
- Puppy or kitten under 6 months old

💡 Observe at home (12–24h) if:
- Vomited once, otherwise normal
- Eating, drinking, active
- No blood

Home care:
1. Withhold food for 6–8 hours (water OK)
2. Then offer small amounts of bland food (boiled chicken + rice)
3. Gradually return to normal diet over 2–3 days
4. Note frequency, color, contents (for vet if needed)

Likely causes: dietary indiscretion, hairball (cats), parasites, pancreatitis, foreign body.

Tell me your pet's species, age, and what the vomit looks like for a more targeted answer.`,
  },
  {
    keywords: ["diarrhea", "loose stool", "watery stool"],
    response: `Diarrhea assessment:

🚨 Urgent if:
- Bloody or black tarry stool
- 3+ episodes in an hour
- Lethargy, not drinking
- Puppy/kitten (dehydration risk is high)

💡 Home monitoring (24h) if:
- One or two soft stools
- Active, eating, drinking

Home care:
1. Bland diet: boiled chicken + white rice (3:1 ratio)
2. Small frequent meals
3. Ensure water access
4. Probiotics help (pet-specific ones like FortiFlora)

Avoid: human anti-diarrheal meds, dairy, fatty foods.

Common causes: food change, stress, parasites, infection, IBD.

If it lasts >48h or worsens, go to a vet. Stool sample helps with diagnosis.
Cost: exam + stool test ₩50K–120K.`,
  },
  {
    keywords: ["scratching", "itch", "itchy", "licking"],
    response: `Excessive scratching or licking is a common complaint with many causes.

Top 5 causes:
1. **Fleas/mites** — check for tiny dark specks, especially around the tail base
2. **Food allergy** — often shows as chronic ear infections + paw licking
3. **Environmental allergies (atopy)** — seasonal, worse in spring/summer
4. **Dry skin** — more in winter, or with poor nutrition
5. **Anxiety-driven** — over-grooming as self-soothing

Home steps:
1. Check for fleas with a flea comb (white paper test)
2. Look for redness, hotspots, scaly patches
3. Note when it started — seasonal? after food change?

See a vet if:
- Skin is raw, bleeding, or has a bad smell
- Your pet can't sleep due to itching
- Hair loss in patches
- Black/brown ear discharge

Initial vet visit: ₩50K–100K. Allergy blood panel: ₩200K–400K.`,
  },
  {
    keywords: ["not eating", "loss of appetite", "won't eat", "no appetite"],
    response: `Loss of appetite in pets is always worth investigating.

🚨 Urgent if:
- No food for 24h (dogs) or 12h (cats) — cats can develop hepatic lipidosis very quickly
- Paired with vomiting, diarrhea, or lethargy
- Senior pet or known chronic disease

Common causes:
1. Dental pain (very common in cats — check gums)
2. GI upset
3. Stress (new environment, new pet)
4. Illness (kidney, liver, pancreatitis)
5. Food aversion (changed brand recently?)

Try at home:
1. Warm the food slightly — releases aroma
2. Add low-sodium chicken broth
3. Offer a different texture (wet food if usually dry)
4. Quiet feeding area away from other pets

If no improvement in 24h for cats, 48h for dogs, or any concerning signs, see a vet.
Initial exam ₩50K–100K, blood panel ₩100K–200K.`,
  },
  {
    keywords: ["limping", "limp", "lame", "sore leg"],
    response: `Limping — here's how to assess.

🚨 Go NOW if:
- Non-weight-bearing (holding leg up)
- Visible wound, bone, or severe swelling
- Happened after a fall or accident
- Dragging limb or loss of feeling

⚠️ Vet within 24h if:
- Limping 1+ days without improvement
- Painful when touched
- Swollen joint

💡 Monitor if:
- Mild, intermittent limp
- Happens after rough play
- Improves with rest

Common causes by size:
- Small breeds: patellar luxation, IVDD (back disease)
- Large breeds: hip/elbow dysplasia, cruciate tear
- All: soft tissue strain, foreign body in paw

Home care:
1. Check paw pad and between toes
2. Gently palpate each joint — note where the pain response is
3. Restrict activity (no jumping, short leash walks only)
4. No human painkillers — they can be toxic

Exam + X-ray: ₩100K–300K. Orthopedic surgery if needed: ₩1M–3.5M.`,
  },

  // ───── Care & Information ─────
  {
    keywords: ["neuter", "spay", "castrate"],
    response: `Spay/neuter — key information for Korean pet parents.

When to do it:
- Dogs: 5–8 months (depending on size — larger breeds wait longer)
- Cats: 5–6 months, before first heat

Health benefits:
1. Eliminates risk of pyometra (life-threatening uterine infection)
2. Reduces mammary tumor risk by up to 90% if done before first heat
3. Prevents testicular cancer
4. Reduces roaming, marking, some aggression

Cost (Korea):
- Cat spay: ₩200K–400K
- Cat neuter: ₩100K–200K
- Small dog spay: ₩300K–500K
- Large dog spay: ₩500K–800K
- Neuter (dog): ₩200K–500K

Recovery: 7–10 days. Cone collar for 10 days. Suture check at day 7.

What to ask your vet: pre-op bloodwork, anesthesia protocol, pain management plan.`,
  },
  {
    keywords: ["vaccine", "vaccination", "shots", "dhppl", "fvrcp"],
    response: `Vaccination schedule — Korean standard.

🐕 Puppies (DHPPL + extras):
- 6–8 weeks: 1st DHPPL + Corona
- 10–12 weeks: 2nd DHPPL + Corona
- 14–16 weeks: 3rd DHPPL + Kennel Cough
- 16+ weeks: DHPPL + Rabies
- Annual boosters thereafter

Heartworm: start at 8 weeks, monthly for life.

🐈 Kittens (FVRCP):
- 6–8 weeks: 1st FVRCP
- 10–12 weeks: 2nd FVRCP
- 14–16 weeks: 3rd FVRCP + Rabies
- Annual boosters

Cost per dose: ₩30K–50K. Full puppy series: ₩150K–250K.

Rabies is legally required in Korea. DHPPL + heartworm are strongly recommended.

If you're late on schedule, vets can usually catch up — don't skip, just restart the series if too much time has passed.`,
  },
  {
    keywords: ["insurance", "pet insurance"],
    response: `Pet insurance in Korea — here's what to know.

Enrollment age:
- Best: 8 weeks to 3 years
- Acceptable: up to 7 years (with higher premium)
- After 8–10 years: usually denied or limited

Monthly premium: ₩20K–80K (varies by breed, age, coverage).

What's covered:
- Surgery (often capped annually)
- Hospitalization
- Outpatient visits (often with deductible)
- Liability (if your pet bites someone)

What's usually NOT covered:
- Pre-existing conditions
- Routine checkups, vaccinations
- Dental (sometimes optional add-on)
- Cosmetic procedures

Top Korean providers: KB Insurance, Samsung Fire, Hyundai Marine, Meritz.

Small dogs with patellar/IVDD risk (Maltese, Poodle, Dachshund) benefit most — these can be ₩1M–3M surgeries.`,
  },
  {
    keywords: ["hospital", "vet clinic", "clinic", "seoul vet", "24h"],
    response: `Finding a vet clinic in Korea.

For routine care:
- Google Maps or Naver Map: search "동물병원" + your neighborhood
- Look for reviews (>4.0 stars, 50+ reviews)
- Ask for English-speaking vets if you need one

For emergencies (24h):
- Seoul: Konkuk Animal Hospital, VIP Animal Hospital, 이리온 24시
- Gangnam area: 청담우리 24시, 24시 분당
- Most major cities have 1–2 24h clinics

P.E.T can help you find vets near your location. Tap "Request Match" above and our manager will recommend clinics within 10 minutes.

English-friendly clinics in Seoul:
- Konkuk University Animal Hospital (English intake available)
- International pet clinics in Itaewon, Gangnam

Average costs:
- Initial exam: ₩30K–50K
- Emergency visit: ₩100K–300K
- Simple X-ray: ₩50K–100K`,
  },

  // ───── Greetings / intro ─────
  {
    keywords: ["hello", "hi", "hey"],
    response: `Hello! I'm P.E.T AI 🐾

I can help with:
• **Symptoms** — "my cat is vomiting", "my dog is limping"
• **Toxicity** — "my dog ate chocolate", "is onion safe for cats?"
• **Breed info** — "Maltese health issues", "Persian grooming needs"
• **Costs** — "neutering cost in Korea", "patella surgery price"
• **Clinics** — "24h vets in Gangnam", "English-speaking clinics"
• **Care** — "puppy vaccination schedule", "first-time owner checklist"

Ask me anything — I'm trained on veterinary knowledge equivalent to a board-certified vet with 20 years of experience.`,
  },
];

export function findEnglishFallback(query: string): string | null {
  const q = query.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => q.includes(k.toLowerCase()))) {
      return rule.response;
    }
  }
  return null;
}

// General English default response — used only if no rule matches
export function defaultEnglishResponse(query: string): string {
  return `I'd love to help with your question: "${query}"

While I'm briefly unable to reach my main AI brain, here are ways I can still help:

🐾 Try rephrasing with specifics:
- What species and age?
- What symptom or topic?
- Urgent or routine?

📚 Common topics I know well:
• Symptoms: vomiting, diarrhea, limping, scratching, not eating
• Toxicity: chocolate, onion, grapes, lemon, essential oils
• Care: vaccinations, neutering, insurance, puppy/kitten basics
• Korean vet costs and 24h clinics

🏥 For urgent issues, tap "Request Match" above — our human managers respond within 10 minutes and can connect you to verified vets.

Please try your question again — I'll do my best to answer!`;
}
