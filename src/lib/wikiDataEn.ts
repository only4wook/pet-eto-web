// Pet Wiki - English breed data
// Full English translations for all 26 breeds (12 cats + 14 dogs)

export interface BreedInfoEn {
  description: string;
  characteristics: string;
  health: string;
  care: string;
  history: string;
}

export const BREED_EN: Record<string, BreedInfoEn> = {
  // ═════════ CATS (12) ═════════

  "korean-shorthair": {
    description:
      "The Korean Shorthair (Kosot) is a collective name for short-haired domestic cats that developed naturally in Korea. It is a non-pedigree cat without a formal breed standard, estimated to make up over 80 percent of all household cats in Korea. Thanks to a diverse genetic pool, these cats are generally healthy with strong immunity and high adaptability — making them well-suited even for first-time owners. Many are adopted from street cat populations through TNR programs.",
    characteristics:
      "A small-to-medium cat of 25–30 cm height and 3.5–5.5 kg weight. The most striking feature is color variety — mackerel tabby, orange tabby, tuxedo, calico, solid black, solid white, and mixed coats all occur. The myth that coat color determines personality has no scientific basis. Thanks to their mixed gene pool, they show lower incidence of purebred-specific genetic diseases like PKD or HCM. They are clever, curious, and responsive to toys, with a strong hunting instinct for moving objects.",
    health:
      "Generally healthy, but post-neuter obesity is the biggest threat. Obesity can cause diabetes, joint issues, and fatty liver — so food portions matter. Watch for stomatitis, FLUTD (lower urinary tract disease), and urinary stones. Wet food helps increase water intake. Former street cats should be tested early for FeLV (feline leukemia) and FIV (feline immunodeficiency virus). Average lifespan of 15–20 years — longer than most purebreds.",
    care:
      "Short coat needs brushing only 1–2 times a week; increase frequency during shedding season (spring/fall). Since they are active, provide vertical spaces like cat trees and wheels, plus 15–20 minutes of daily interactive play. Place scratchers around the home to build healthy claw habits. They adapt well to multi-cat households, but separate new arrivals for 1–2 weeks before gradual introduction.",
    history:
      "Cats are believed to have arrived on the Korean peninsula before the Three Kingdoms era, coexisting with humans as mousers. During the Joseon dynasty they were called 'myo (猫)' or 'goyangi' and served a practical role guarding grain storage. The Korean Shorthair is a naturally-evolved landrace cat shaped by natural selection rather than any breeding program. Groups like the Korean Cat Protection Association work to preserve the native population.",
  },

  "british-shorthair": {
    description:
      "The British Shorthair is the iconic cat of the UK — known for its round, chunky body and plush teddy-bear coat. The classic 'British Blue' (blue-grey) is the most famous color, striking against its copper eyes. Calm, composed, and independent, it is often called the 'gentleman cat' and prefers being near its owner rather than constantly held. A versatile breed suited to first-time owners, single-person households, and families with children alike.",
    characteristics:
      "A medium-to-large breed weighing 4–8 kg, with males noticeably larger than females. Features include a round head, chubby cheeks, short thick neck, broad chest, and solid muscular build. The short double coat is extremely dense, giving it that unique velvet/plush feel. Beyond blue, colors include lilac, cream, black, white, tabby, and bicolor. Very quiet and laid-back — not fond of jumping or rough play. Prefers staying near the owner rather than being picked up.",
    health:
      "Hypertrophic cardiomyopathy (HCM) is the most serious genetic concern — regular cardiac ultrasounds are advised. PKD can also occur, so adopt from parents who have been gene-tested. Their build makes them highly prone to obesity, which can cascade into diabetes and arthritis. Switch to calorie-controlled food post-neuter and monitor weight monthly. A high B-blood-type rate (40–50%) means blood typing is essential before transfusion or breeding.",
    care:
      "The dense double coat needs brushing 2–3 times a week, and daily during shedding season. Obesity prevention is the key care priority — use measured feeding instead of free-feeding, and ensure 15–20 minutes of daily play. Their laid-back nature means they won't exercise on their own; engage them with wand toys or laser pointers. Regular dental care (brushing 2–3x a week or dental treats) is also recommended.",
    history:
      "Descended from cats brought to Britain around the 1st century BC during the Roman invasion. For centuries they worked as mousers on British farms and streets. They first gained breed recognition at the world's first cat show held at the Crystal Palace in London in 1871. Harrison Weir established the breed standard. Numbers dropped sharply during the World Wars but were restored through breeding with Persians and Russian Blues. The Cheshire Cat in Alice in Wonderland is widely believed to be based on a British Shorthair.",
  },

  "russian-blue": {
    description:
      "The Russian Blue is an exceptionally elegant cat — its silvery blue-grey coat pairs with vivid emerald green eyes for an aristocratic look. Known as 'cat royalty,' it is shy and quiet by nature but extremely loyal once it bonds with its owner. It produces about half the Fel d 1 allergen of other breeds, making it relatively suitable for people with mild cat allergies. They appreciate tidy, predictable routines and are sensitive to environmental change.",
    characteristics:
      "A medium-sized cat of 3–5.5 kg with a slim, muscular semi-foreign body. Its defining trait is the double coat — short, dense, and so thick that finger marks remain visible. Each hair tip has silver tipping, giving the coat a unique shimmer under light. Eye color shifts from yellow as a kitten to brilliant emerald green in adulthood. The famous 'Russian Blue smile' comes from slightly upturned mouth corners. Wary of strangers and change, but deeply attached to family and sensitive to owner emotions.",
    health:
      "Genetically very healthy with few breed-specific genetic diseases. However, FLUTD and urinary stones need watching — encourage adequate water intake. Many individuals have strong appetites and can become overweight, so measured feeding is best. Their sensitive temperament means environmental change (moving, new family member) can trigger loss of appetite or excessive grooming (stress alopecia). Average lifespan 15–20 years — a long-lived breed.",
    care:
      "The short dense coat sheds little; one brushing per week is enough. The most important care point is maintaining a stable routine. Keep feeding, play, and sleep times consistent and minimize sudden environmental changes. They prefer quiet spaces — place hideouts (boxes, cat houses) away from noise. High intellect means they enjoy puzzle feeders and nosework toys. They are very particular about litter box cleanliness — clean 1–2 times daily.",
    history:
      "Originated in Arkhangelsk, a port region in northwest Russia — hence the alternative name 'Archangel Cat.' British sailors brought the breed to Europe in the 1860s, and it was first shown at the Crystal Palace in London in 1875. After heavy losses during the World Wars, Scandinavian and British breeders restored the breed through crosses with Siamese and British Blue. In Russia, the breed was believed to bring luck and was kept by the Russian imperial family.",
  },

  "persian": {
    description:
      "The Persian is the world's oldest and most iconic long-haired breed, recognizable by its flowing silk-like coat and distinctive flat, broad face. Called the 'queen of cats,' it is exceptionally quiet, calm, and graceful — essentially a living piece of interior decor on your sofa. Low activity levels make it perfect for indoor life, and it loves resting quietly beside its owner. However, daily grooming is essential — this is a high-maintenance breed best suited to owners who can invest time in coat care.",
    characteristics:
      "A medium breed of 3.5–7 kg with a cobby body — short thick legs, broad chest, and a large round head. Coat can reach 12 cm, with over 80 color variations including white, blue, cream, red, silver, golden, and bicolor. Face structure divides the breed into the extremely flat 'peke-face' and the traditional 'doll-face.' Extraordinarily gentle and quiet — they rarely vocalize and are rarely aggressive toward other animals or children. They prefer lounging to vigorous play, enjoying gentle feather-toy engagement.",
    health:
      "Polycystic kidney disease (PKD) is the most common genetic issue, with 36–49 percent of Persians carrying the gene — always check for PKD-tested parents before adopting. The flat (brachycephalic) face can cause respiratory issues and blocked tear ducts lead to constant tearing and brown staining around the eyes. Also watch for HCM, eye problems (cherry eye, corneal ulcers), and ringworm. The long coat means frequent hairballs — hairball-control food and treats help.",
    care:
      "Daily brushing of 30+ minutes is essential. Skip even one day and mats form — severe cases may require shaving. Two-step brushing with a slicker brush followed by a comb works best. Wipe the eye area daily with soft gauze to manage tear stains, and bathe 1–2 times monthly to manage oiliness. A 'sanitary trim' around the anus keeps things cleaner. In summer, a lion cut can help with heat stress.",
    history:
      "Believed to originate in Persia (modern Iran) around 1600 BCE. Italian traveler Pietro della Valle brought the breed to Europe in the 17th century, and it gained popularity among French and British aristocracy. Queen Victoria's love of Persians helped make them a nationwide favorite in Britain. Through the 20th century, the extremely flat peke-face became popular in America, but health concerns have renewed interest in the traditional doll-face style.",
  },

  "scottish-fold": {
    description:
      "The Scottish Fold is instantly recognizable for its forward-folded ears, round face, and large eyes — giving it an owl-like appearance and the nickname 'owl cat.' Very popular in Korea, they are affectionate, social, and adapt well to both people and other pets. However, the gene that creates the folded ears is linked to cartilage disease, making the breed's ethics increasingly debated in animal welfare circles.",
    characteristics:
      "Medium build of 3–6 kg, with a round chunky head, large eyes, and a short neck. The folded ear is a dominant genetic mutation (Fd) — one parent with the gene produces about 50 percent folded kittens. Kittens without folded ears are called 'Scottish Straights.' Ears begin folding around 3–4 weeks of age. The famous 'Buddha sit' posture — sitting upright with hind legs stretched out — is a breed signature. They are affectionate, people-oriented, and quiet vocalizers.",
    health:
      "Osteochondrodysplasia is the most serious health issue. The fold gene (Fd) affects cartilage throughout the body, not just the ears, and can cause joint pain, tail stiffness, and ankle swelling. Fold-to-fold breeding is banned as it results in 100% affected kittens — only fold-to-straight (or to British Shorthair) breeding is acceptable. Straight individuals are not at risk. Also watch for HCM and PKD. Always verify parent health history and gene test results before adopting.",
    care:
      "Short-hair Folds need brushing twice a week; long-hair (Highland Fold) needs 3–4 times. Moisture and debris can accumulate inside the folded ears — weekly ear cleaning is essential. Weight management is critical for joint health, and excessive jumping should be avoided. Watch for pain response when touching paws and consult a vet immediately if gait becomes unsteady or tail stiffens. Glucosamine/chondroitin supplements (with vet approval) can support joint health.",
    history:
      "In 1961, William Ross, a shepherd in Perthshire, Scotland, discovered a white cat named Susie with folded ears. A breeding program was built around Susie's kitten 'Snooks.' Britain's GCCF stopped registration in 1971 over health concerns, but the CFA in the US recognized the breed in 1978. Several European countries (Belgium, Austria) now ban fold breeding on welfare grounds, and ethical breeding awareness is growing in Korea.",
  },

  "bengal": {
    description:
      "The Bengal is a hybrid breed from crossing the Asian Leopard Cat with domestic cats, combining wild-leopard looks with a household-friendly temperament. Often called 'the little leopard in your living room,' they have the highest activity level and intelligence among domestic cats. They love water, climb high places, and even fetch toys — behaviors more typical of dogs. Best suited for energetic owners with spacious homes; possibly challenging for first-time cat owners.",
    characteristics:
      "A medium breed of 3.5–7 kg with a long muscular body, small head, and high cheekbones that suggest wild ancestry. Coat patterns are divided into Spotted and Marbled. Some have 'glitter' fur that shines gold in light. Colors include brown, silver, snow (seal, mink, sepia), and charcoal. They are remarkably clever — learning to open doors, drawers, and faucets. Many enjoy putting paws in water or jumping into showers. Without daily stimulation, they can develop destructive behaviors.",
    health:
      "HCM is the key genetic concern — regular cardiac ultrasounds recommended. PRA-b (progressive retinal atrophy) has a genetic test available; check parent results before adoption. Bengal-specific PK-Def (pyruvate kinase deficiency, causing anemia) can also be screened. Many have sensitive digestion — transition foods slowly and use grain-free high-protein diets.",
    care:
      "At least 30 minutes to 1 hour of active daily play is essential. Provide cat wheels, tall cat trees, and interactive puzzle toys. Without enough activity, stress-driven behaviors (scratching furniture, excessive vocalization) will emerge. They love water — secure water fountains and watch fish tanks carefully. Weekly brushing is enough for the short coat. High intelligence makes them excellent at clicker training, and many learn to walk on harness.",
    history:
      "In 1963, Jean Mill of California crossed an Asian Leopard Cat (Prionailurus bengalensis) with a domestic cat. The goal was a domestic-friendly cat with wild looks. Only F4 (4th generation) onward are accepted as companion pets by TICA; F1–F3 may be subject to wildlife regulations. TICA recognized the breed officially in 1986. The name 'Bengal' comes from the scientific name of the Asian Leopard Cat.",
  },

  "siamese": {
    description:
      "The Siamese is one of the oldest cat breeds and is famous as the 'chatterbox of the cat world.' Its unique point coloration (darker color on face, ears, paws, tail) and vivid blue eyes are its signature features, paired with a slim, elegant body. They constantly communicate with owners through vocalizations — the ultimate 'dog-like' cat who adores people. They suffer badly from loneliness and separation anxiety when left alone for long periods, making them better suited to family homes or multi-cat households.",
    characteristics:
      "A slim Oriental body of 3–5 kg with long legs, triangular head, large ears, and almond-shaped blue eyes. The point coloration results from temperature-sensitive albino gene (cs) — melanin concentrates on cooler extremities. Kittens start off pale and darken with age. Main point colors are seal, blue, chocolate, and lilac. Extremely intelligent — they come when called, learn to open doors, and shadow their owners throughout the day. They get along well with other pets, especially other active-breed cats.",
    health:
      "PRA (progressive retinal atrophy) causing vision loss and amyloidosis (liver disease) are breed-specific concerns. Genetic tendencies for crossed eyes and tail kinks have been largely bred out. Relatively prone to respiratory infections, and asthma rates are higher than other breeds. Stress sensitivity can cause excessive grooming, appetite loss, or diarrhea during changes. Dental disease (gingivitis, periodontitis) is common — routine dental care is a must. Average lifespan 15–20 years.",
    care:
      "Short coat needs only weekly brushing. The key care point is daily attention and interaction. Spend at least 30 minutes playing with them daily, and 'talk' to them. If they are alone often, consider adopting a second cat for company. High intelligence means they respond well to clicker training, fetch, and puzzle feeders. They love heights — provide tall cat trees and window hammocks.",
    history:
      "Originated in the royal court of Siam (now Thailand), first recorded in the 14th-century Thai manuscript 'Tamra Maew.' Considered sacred, they were forbidden to commoners, and Siamese cats were believed to receive the souls of deceased royalty. First introduced to the West in 1878 via the US consulate in Bangkok, and officially exhibited in Britain in 1884. The mid-20th-century trend favored extremely slim 'modern Siamese,' but traditional round-bodied 'Thai' or 'old-style Siamese' is making a comeback.",
  },

  "munchkin": {
    description:
      "The Munchkin is instantly lovable for its short legs and adorable waddling walk, earning the nickname 'dachshund of the cat world.' Very popular in Korea, they are curious and social, bonding well with owners. Despite the short legs, they are surprisingly agile and active — though they cannot jump as high as other cats. Like the Scottish Fold, the breed has genetic health controversies, making responsible breeder selection essential.",
    characteristics:
      "A small breed of 2.5–4 kg with legs about one-third the length of a normal cat's. The short legs come from an autosomal dominant gene — a single parent with the gene can produce short-legged kittens. Homozygous (both copies) is lethal, so those kittens are never born. The 'meerkat pose' — standing on hind legs to survey the area — is famously endearing. They also have a 'thief cat' tendency to collect and hide small objects. Both long- and short-hair types exist, and all coat colors and patterns are allowed. Their ground-hugging run resembles a ferret's.",
    health:
      "The short-leg gene's impact on spine and joints remains debated. Lordosis (excessive inward curvature of the spine) has been reported in some individuals and can compress internal organs in severe cases. Some studies suggest higher rates of osteoarthritis — watch for senior-age joint pain. Urinary, obesity, and dental issues occur at normal-cat rates. Ask breeders for X-ray results of parent cats.",
    care:
      "Choose cat trees with shorter, closely-spaced levels or ramps — high jumps strain their joints. Place steps beside sofas and beds. Weight management is critical; short legs plus obesity accelerates joint disease. They enjoy floor-level games (ball rolling, tunnels) and puzzle feeders. Short-hair types need weekly brushing; long-hair types 2–3 times weekly.",
    history:
      "Originated in Louisiana, USA, in 1983 when Sandra Hochenedel found a short-legged pregnant cat named Blackberry under a truck. Breeding began with Blackberry's male kitten Toulouse. First publicly shown at TICA's 1991 Madison Square Garden cat show, and officially recognized by TICA as a Championship breed in 2003. However, some registries including CFA and FIFe still decline recognition on health grounds. The name 'Munchkin' comes from the small people in The Wizard of Oz.",
  },

  "ragdoll": {
    description:
      "The Ragdoll — whose name means 'rag doll' — lives up to its name by going limp when picked up, a unique trait among large cats. With striking blue eyes, a lush semi-long pointed coat, and weights reaching 10 kg, they are gentle giants often called 'angel cats' or 'cats in dogs' clothing.' They are virtually without aggression and incredibly patient with children, making them ideal for families with young kids. Their popularity in Korea is rising quickly.",
    characteristics:
      "Males weigh 7–10 kg, females 4.5–7 kg — a large breed that takes 3–4 years to fully mature. The semi-long silk-like coat has less undercoat than typical long-haired cats, reducing matting. They share the Siamese point gene, so kittens are born white and develop color on face/ears/paws/tail as they grow. Patterns include colorpoint, mitted (white gloves), and bicolor (inverted V on face). Colors range from seal and blue to chocolate, lilac, red, and cream. They shadow their owners, come when called, and greet at the door — very dog-like.",
    health:
      "HCM is the key genetic concern, screenable via MYBPC3 mutation test. Always verify parent HCM gene test and cardiac ultrasound results before adoption. Urinary stones (especially calcium oxalate) occur more often than in other breeds — hydration is critical. Their large size means obesity stresses joints, so weight management matters. A slightly elevated FIP (feline infectious peritonitis) rate has been reported.",
    care:
      "The semi-long coat with less undercoat is easier to groom than other long-hairs — brushing 2–3 times weekly is sufficient. Watch for matting in the armpit and belly areas. As a large breed, provide extra-large litter boxes (1.5x body length) and roomy living space. Their docile nature means they can be bullied in multi-cat households — introduce carefully. Indoor-only is recommended. Excessive jumping from heights strains joints — provide stairs or steps.",
    history:
      "Developed in the 1960s by Ann Baker in Riverside, California. The founding cat Josephine, a white long-hair, reportedly produced unusually docile limp-when-held kittens after a traffic accident (no scientific basis). Baker selectively bred this trait, establishing the Ragdoll in 1966. Registered with CFA in 1993. Consistently ranks among the top 5 most popular breeds in the US and UK.",
  },

  "norwegian-forest": {
    description:
      "The Norwegian Forest Cat (Norsk Skogkatt) is a large long-haired breed that evolved naturally to survive the harsh Northern European winters. A waterproof double coat, muscular large build, and triangular face give it both a wild and dignified appearance. Nicknamed 'the forest fairy,' they love climbing trees and combine independence with deep family affection. As a landrace, they are genetically robust with few inherited diseases. They resemble Maine Coons but differ in face shape (triangular vs. square) and temperament.",
    characteristics:
      "Males weigh 6–9 kg, females 4–6 kg — a slow-maturing large breed taking about 5 years to fully grow. The defining trait is the water-resistant double coat: the outer layer of oily long guard hairs repels rain, while the dense wool undercoat provides insulation. Sharp lynx-like tufts decorate the ear tips, and long fur between the toes aids walking on snow. The thick plume-like tail can wrap around the face on cold days. Independent and confident, but gentle and deeply affectionate with family. They love heights and can descend headfirst from trees — an unusual feline ability.",
    health:
      "Glycogen Storage Disease type IV (GSD IV) is a breed-specific genetic condition — kittens with the gene may die before 5 months. Responsible breeders perform GSD IV testing. Also watch for HCM and hip dysplasia. Large size means obesity puts serious strain on joints — weight management is critical. As a landrace, overall health is excellent with lower genetic disease rates than most purebreds. Average lifespan 14–16 years — long for a large cat.",
    care:
      "Brush the lush double coat 2–3 times weekly, and daily during shedding season (spring/fall). Shedding season releases enormous amounts of undercoat — tools like the Furminator are very useful. The waterproof coat makes bathing difficult, so soak thoroughly when needed. They love heights — tall floor-to-ceiling cat trees are a favorite. Active by nature, they need 20–30 minutes of daily play, and many can be harness-trained for outdoor walks.",
    history:
      "These cats have survived naturally in Norwegian forests and farms for thousands of years, serving as rodent catchers across Scandinavia since the Viking era (800–1100 CE). In Norse mythology, the goddess Freyja's chariot was pulled by cats believed to be Norwegian Forest Cats. Nearly lost to indiscriminate crossbreeding in the early 20th century, Norwegian breeders launched a preservation program in the 1930s, gaining FIFe recognition as an official breed in 1977. Norway considers them a national breed.",
  },

  "selkirk-rex": {
    description:
      "The Selkirk Rex is unique among curly cats — its soft sheepwool-like curled coat gives it the nickname 'cat in sheep's clothing.' Unlike other Rex breeds (Cornish, Devon), it has a naturally round, chunky body resembling a British Shorthair. Personality is equally laid-back — gentle, patient, and affectionate. The curls appear in both long and short coat varieties, both captivating in their way.",
    characteristics:
      "Medium build of 3–7 kg with a rounded face, chubby cheeks, and large round eyes. Three coat textures — straight, light curl, and full curl — express the dominant curl gene differently. Unlike the Cornish Rex (one coat type) or Devon Rex (sparse wavy coat), the Selkirk has a full-coat three-layer fur. The curl develops in stages as kittens grow — kittens are born curly, straighten around 6 months, then curl fully again between 8–10 months. Easygoing, patient, and exceptionally kid-friendly.",
    health:
      "Inherited issues from the British Shorthair and Persian used in development include HCM and PKD. Pre-adoption gene testing is recommended. The curly coat, being an undercoat mutation, is prone to folliculitis and skin issues — watch for redness or itching. Regular ear cleaning is also important. Generally a healthy breed with an average lifespan of 15–20 years.",
    care:
      "Surprisingly low grooming needs despite the curly coat — brushing 2–3 times weekly is sufficient. Excessive brushing actually straightens the curls, so less is more. Bathe only once a month and air-dry rather than towel-dry to preserve natural curl. The curls release less dander, which may be slightly more tolerable for those with mild allergies. Their gentle temperament makes them great for homes with children or seniors.",
    history:
      "Originated in 1987 in Sheridan, Montana, USA, when a naturally curly-coated kitten named Miss DePesto was found in a shelter. Breeder Jeri Newman crossed her with a Persian to preserve the trait. Breed name comes from Newman's stepfather's name, Selkirk. TICA recognized the breed in 1994 and CFA in 2000. Because the curl gene is dominant, breed development has been rapid. Unofficial cousins exist in the UK and elsewhere.",
  },

  "sphynx": {
    description:
      "The Sphynx — the iconic hairless cat — looks striking but is actually one of the most affectionate and playful breeds. Its name evokes the sphinx of ancient Egypt. Warmer than other cats due to lack of fur (body temperature around 39°C), they love snuggling for warmth. 'Dog-like,' 'velcro cat,' and 'performer' are apt nicknames. First-time cat owners may find them challenging due to specialized skin care needs.",
    characteristics:
      "Medium build of 3.5–6 kg. 'Hairless' is misleading — a very fine peach-fuzz covers the skin, giving a velvet or chamois-leather feel. All coat patterns (color points, spots, bicolor) are visible through the skin. Prominent wedge-shaped head, large lemon-shaped eyes, and enormous ears are defining features. Energy levels are extraordinarily high — they run, jump, and explore constantly. Highly social — they follow owners everywhere and crave attention. Without interaction, they can become depressed or misbehave.",
    health:
      "HCM is the most serious genetic concern, with relatively high incidence — regular cardiac ultrasounds are essential. Skin issues (acne, oiliness, sunburn) are common and require routine care. Without fur for insulation, they get cold easily — use indoor temperature control and sweaters in winter. They eat more than typical cats to maintain body heat — use high-calorie, high-protein foods. Dental disease and gingivitis occur frequently, so dental hygiene is critical.",
    care:
      "Weekly baths are needed to manage oily skin secretions — normally absorbed by fur, oils build up on bare skin. Use cat-specific gentle shampoo with careful rinsing. Ear wax accumulates fast — clean weekly. Sun protection is critical — no direct sunlight, and sunscreen (or indoor-only living) is necessary. In winter, heated beds and sweaters provide warmth. Their constant craving for contact means they are best suited to owners who can spend lots of time with them.",
    history:
      "Originated in Toronto, Canada, in 1966 when a black cat gave birth to a hairless kitten named Prune through spontaneous mutation. Prune's breeding line began the Sphynx breed. TICA officially recognized the Sphynx in 1986. Now one of the most popular breeds in North America and Europe. A Sphynx named 'Mr. Bigglesworth' in the Austin Powers films brought global fame. Korean popularity is also growing.",
  },

  // ═════════ DOGS (14) ═════════

  "maltese": {
    description:
      "The Maltese is one of the most popular small dogs in Korea — a tiny companion from Mediterranean Malta, weighing just 2–4 kg. Pure white silky fur, large round black eyes, and a cheerful disposition pack huge personality into a small body. Lively, affectionate, brave, and social, they bring constant joy. They can adapt even in small apartments, making them well-suited for single-person households, seniors, and families alike.",
    characteristics:
      "Body height around 20–25 cm, weight 2–4 kg — a true 'ultra-small' dog. Pure white single coat grows long and silky throughout life. They shed very little, making them relatively friendly for allergy sufferers. Energetic and always alert — bark frequently at strangers or unfamiliar noises. They bond strongly with owners and can develop severe separation anxiety, so gradual alone-time training is essential.",
    health:
      "Patellar luxation (dislocating kneecaps) is the most common issue — over 70 percent of Maltese experience grade 1 or higher. Tear staining, periodontitis, tracheal collapse, and pancreatitis also need attention. Fragile due to tiny size — even small falls or rough play can cause fractures. Careful handling is essential. Average lifespan 12–15 years.",
    care:
      "The long white coat needs daily brushing, with a professional groom every 4–6 weeks. Wipe tear staining daily with a gentle eye-area cleaner. Active but small — 20–30 minutes of walking plus indoor play meets exercise needs. Weight management protects joints. Dental brushing 2–3 times weekly prevents small-breed dental disease. Train alone-time tolerance gradually from puppyhood to prevent separation anxiety.",
    history:
      "An ancient breed from Malta, recorded as far back as 1500 BCE in Phoenician trade documents. Egyptian pharaohs and Roman aristocracy kept Maltese as beloved companions. During the European Middle Ages they were the favored lapdogs of royalty and nobility. Queen Elizabeth I of England was a famous enthusiast. Maltese arrived in Korea during the 1988 Seoul Olympics era and rapidly became the most popular small breed.",
  },

  "poodle": {
    description:
      "The Poodle is the world's second-smartest dog breed (per Stanley Coren's dog intelligence rankings), combining curly hypoallergenic coats with exceptional athleticism and trainability. Three sizes exist — Standard (large), Miniature (medium), and Toy (small) — making them flexible for any household. Originally a water-retrieving hunting dog, they love swimming and have remarkable learning ability. Korea overwhelmingly prefers Toy Poodles.",
    characteristics:
      "Standard 20–32 kg, Miniature 5–9 kg, Toy 2–3 kg. The dense curly coat has minimal shedding, making them one of the best breeds for allergy sufferers. Colors include white, black, brown, silver, red, apricot, and parti-color. Highly intelligent and eager to please — they excel at tricks, agility, and obedience. Without enough mental stimulation, they can become bored and develop problem behaviors (excessive barking, furniture chewing).",
    health:
      "Toy Poodles commonly experience patellar luxation and tracheal collapse. Progressive retinal atrophy (PRA) and Addison's disease have genetic components — check breeder screening records. Dental disease is frequent due to dense tear-staining around the eyes and mouth. Hip dysplasia (Standard Poodles) and epilepsy may also occur. Average lifespan 12–15 years — longer for smaller sizes.",
    care:
      "The curly coat requires a professional groom every 4–6 weeks; without it, severe matting occurs. Daily brushing prevents tangles. Ears should be cleaned weekly — hair grows into the ear canal and must be plucked periodically. Mental stimulation is critical — basic obedience, tricks, and puzzle toys engage their intelligence. Exercise needs vary by size — Standards need 1–2 hours daily, Toys around 30 minutes.",
    history:
      "Origins are debated between Germany and France, though most registries cite Germany. 'Pudel' means 'splash in water' in German, reflecting their water-retrieving heritage. The classic continental clip was practical, not cosmetic — protecting joints from cold while keeping the dog buoyant. French aristocracy later refined the breed for companionship, earning the Poodle its reputation as France's national dog. Toy Poodles were developed in 18th-century Paris.",
  },

  "golden-retriever": {
    description:
      "The Golden Retriever is one of the world's best family dogs — with a gentle temperament, outstanding intelligence, and remarkable patience. Its golden wavy coat is the signature trait, but so is a permanently smiling face. Famously gentle with children and other pets, they excel as guide dogs, therapy dogs, and rescue animals. However, the large size and energy make them challenging for apartment-only households.",
    characteristics:
      "A large breed of 25–34 kg with a height around 55–61 cm. The double-coat has an outer water-resistant golden layer and a dense undercoat. Coat shades range from cream to dark gold. Exceptionally intelligent — ranked 4th most intelligent per Coren. Remarkably gentle — aggression is extremely rare, and they are famously patient with children. Shed heavily year-round, with two major seasonal sheds. Love water — essentially born swimmers.",
    health:
      "Hip and elbow dysplasia are the most concerning inherited conditions — always verify hip scores from parents before adoption. Sadly, Golden Retrievers have one of the highest cancer rates among breeds (~60% will develop cancer), especially hemangiosarcoma and lymphoma. Heart conditions (subaortic stenosis) and eye disease (PRA) also occur. Average lifespan 10–12 years — shorter than many due to cancer risk.",
    care:
      "Need 1–2 hours of vigorous exercise daily — walking, running, and swimming are all excellent. Without enough activity they may become destructive. Brush 2–3 times weekly, daily during shedding season. Ear infections are common — check and clean weekly. Mental stimulation matters as much as physical — retrieve games, scent work, and training sessions are essentials.",
    history:
      "Developed in 19th-century Scotland by Lord Tweedmouth, who crossed a Wavy-Coated Retriever with a Tweed Water Spaniel (now extinct). Goal: a reliable waterfowl retriever for Scottish estates. Additional crosses with Irish Setter, Bloodhound, and more refined the breed. Recognized by The Kennel Club (UK) in 1913 and the AKC (US) in 1925. Today one of the most popular breeds globally, especially in North America.",
  },

  "pomeranian": {
    description:
      "The Pomeranian packs an enormous personality into a tiny 2–3 kg body — confident, alert, and endlessly bold. The lion-like mane and fluffy double coat plus a fox-like smile make them instantly recognizable. Originally a mid-sized sled-type dog, selective breeding shrunk them into today's toy-sized companions. Famously devoted to their owners and often suspicious of strangers.",
    characteristics:
      "Weight 1.5–3.5 kg, height around 18–22 cm. The dense double coat stands off the body, especially around the neck and chest, creating the signature lion's ruff. Colors include orange, red, sable, cream, black, chocolate, and parti-color. Alert, curious, and vocal — they bark readily at unfamiliar people and sounds, making them surprisingly effective watchdogs. They carry themselves with remarkable confidence, often believing they are much larger than they are.",
    health:
      "Tracheal collapse is the most common concern — use a harness instead of a collar. Patellar luxation and dental disease are frequent. 'Black Skin Disease' (alopecia X) causes progressive coat loss with skin darkening. Hypoglycemia in puppies requires careful feeding. Heart conditions (mitral valve disease) develop in seniors. Average lifespan 12–16 years.",
    care:
      "Brush 2–3 times weekly to prevent mats, daily during shedding season. Avoid 'teddy bear' shaves — cutting below the guard coat can cause permanent coat damage (post-clipping alopecia). Socialize early to reduce reactivity to strangers. Keep them cool in summer — the thick coat overheats easily. Daily walks of 20–30 minutes are enough. Weight management and dental care are ongoing priorities.",
    history:
      "Named after the Pomerania region (now spanning Germany and Poland), where mid-sized Spitz dogs (~14 kg) served as herders and watchdogs. Queen Victoria of England brought a small Pomeranian back from an Italian trip in 1888 and made the breed fashionable. Her breeding program deliberately selected for smaller size, driving the breed toward its current toy dimensions. Mozart and Michelangelo both famously owned Pomeranians.",
  },

  "shih-tzu": {
    description:
      "The Shih Tzu is a small companion breed from Tibet/China, originally bred as a royal palace dog. The name means 'lion dog' in Chinese. Long flowing coats, a distinctive chrysanthemum-like face, and a sweet, playful temperament. They are affectionate, cheerful, and adapt well to apartment living — making them great for first-time owners, families with kids, and seniors alike. However, their brachycephalic face requires heat-stress awareness.",
    characteristics:
      "Weight 4–8 kg, height 20–28 cm. The double coat grows constantly in many colors (gold, white, black, brindle, silver). The 'chrysanthemum' face — fur radiating from the nose — is iconic. Brachycephalic (flat-faced) with protruding eyes and a defined underbite. Personality is consistently affectionate, cheerful, and slightly stubborn. Less vocal than many toys; they enjoy lounging with the family.",
    health:
      "Brachycephalic airway syndrome causes breathing issues and heat sensitivity — heatstroke risk is high in summer. Eye issues (corneal ulcers, dry eye, cherry eye) stem from the prominent eye shape. Patellar luxation, hip dysplasia, and dental crowding are common. Kidney disease (progressive renal atrophy) has breed-specific patterns. Average lifespan 10–16 years.",
    care:
      "The long coat needs daily brushing, with professional grooming every 4–6 weeks. Many owners opt for 'puppy cut' trims to reduce daily care burden. Eyes need daily cleaning and a top-knot or trim keeps fur out of eyes. Avoid heat and humidity — stay in air-conditioning during summer midday, and use cooling mats. Moderate exercise is best — 20–30 minutes of walking plus indoor play. Dental brushing at least 3 times weekly.",
    history:
      "Ancient breed originating in Tibet, gifted to Chinese emperors by Tibetan lamas. Bred in the Ming and Qing dynasty imperial courts, they were forbidden for commoners and nearly went extinct after the Chinese Revolution. British diplomats saved a small breeding pool in the 1930s, and modern Shih Tzus descend from just 14 dogs. AKC recognition came in 1969. Today one of the most popular small breeds worldwide.",
  },

  "welsh-corgi": {
    description:
      "The Welsh Corgi is a small-to-medium herding breed from Wales, famous for short legs, a long body, and a perpetually smiling face. Two types exist — Pembroke (shorter tail, more popular) and Cardigan (longer tail, older lineage). Originally cattle-herding dogs who nipped heels to move livestock, they remain energetic and intelligent. Queen Elizabeth II's lifelong love of the breed made Pembrokes world-famous. Excellent for active families but need firm leadership.",
    characteristics:
      "Weight 10–14 kg, height 25–30 cm. The short legs result from chondrodysplasia, giving the long-body appearance. Double coat sheds heavily year-round and more dramatically in seasonal sheds. Colors include red, sable, fawn, black-and-tan — always with white markings. Intelligent (ranked around 11th in Coren's rankings), trainable, and alert. Strong herding instincts remain — they may nip heels of children or other pets during play.",
    health:
      "IVDD (intervertebral disc disease) is the most serious concern due to the long body — avoid high jumps and stairs. Hip dysplasia and progressive retinal atrophy are also concerns. Obesity dramatically worsens spine and joint issues. Degenerative myelopathy (DM) has a genetic test available — screen before adoption. Eye issues (PRA) should be monitored. Average lifespan 12–15 years.",
    care:
      "Need 45–60 minutes of daily exercise — walking, fetch, and herding games. Discourage jumping from beds or sofas to protect the spine. Strict weight management is essential. Brush 2–3 times weekly, daily during shedding. Provide ramps for furniture access. Early socialization and training channel their herding drive positively. Puzzle toys and training games satisfy their high intelligence.",
    history:
      "Welsh Corgis have herded cattle in Wales for over 1,000 years, dating to the 10th century. 'Corgi' likely means 'dwarf dog' in Welsh. Pembrokes are believed to descend from Spitz-type dogs brought by Flemish weavers in the 12th century. King George VI gifted a Pembroke named Dookie to young Princess Elizabeth in 1933, starting her lifelong love — she owned over 30 Corgis during her reign. The AKC recognized Pembrokes in 1934.",
  },

  "bichon-frise": {
    description:
      "The Bichon Frise is a small companion dog with a fluffy white cotton-ball coat — the name is French for 'curly lap dog.' Cheerful, affectionate, and sociable, they thrive on human contact. Minimal shedding makes them one of the best breeds for allergy sufferers. They get along with other pets and children, and their adaptable nature fits apartment life well. However, they demand constant companionship and can develop separation anxiety.",
    characteristics:
      "Weight 3–5 kg, height 23–30 cm. The curly double coat is always pure white, though cream or apricot markings may fade with age. The groomed 'powder puff' look — rounded head with full leg plumes — is signature. Always cheerful with a distinctive expressive face. Sociable with strangers and other animals; poor watchdogs precisely because they love everyone. Intelligent and trainable, though occasionally stubborn. Playful into senior age.",
    health:
      "Skin allergies are very common — atopic dermatitis, flea allergy, and food allergy all occur frequently. Tear staining is pronounced on the white coat and requires daily cleaning. Patellar luxation, bladder stones, and dental disease are regular concerns. Hip dysplasia and hyperadrenocorticism (Cushing's) occur in seniors. Average lifespan 14–15 years — longer than many small breeds.",
    care:
      "Professional grooming every 4–6 weeks is mandatory — the curly coat mats severely without it. Daily brushing prevents tangles. Bathe every 2–3 weeks using white-coat shampoo to maintain brightness. Wipe eye area daily. They need 30 minutes of daily exercise plus mental stimulation. Never leave alone for long periods — consider a second pet or doggy daycare for working households.",
    history:
      "Descended from the 14th-century Mediterranean Barbichon family, the Bichon Frise developed on the Canary Islands (originally 'Bichon Tenerife'). Sailors brought them to Europe, where they became favorites in French royal courts during the 16th century. Devoted companions of King Henry III and later French aristocracy, they fell from grace after the French Revolution and survived as circus performers. French breeders rescued the breed in the 1930s, and the AKC recognized them in 1972.",
  },

  "chihuahua": {
    description:
      "The Chihuahua is the world's smallest recognized dog breed — weighing just 1.5–3 kg. Despite their size, they possess enormous courage, loyalty, and alertness. Named after the Mexican state of Chihuahua, they are the oldest breed native to the Americas. Two varieties exist (smooth-coat and long-coat), and many colors are accepted. They bond intensely with one primary owner and can be wary of strangers. Ideal for experienced owners who understand small-dog temperament.",
    characteristics:
      "Weight 1.5–3 kg, height 15–23 cm. Apple-shaped head, large bat-like ears, and expressive round eyes. A fontanel (molera) — soft spot in the skull — may persist into adulthood in some individuals and requires careful handling. Despite their tiny frame, they have outsized personalities — bold, alert, and protective. Prone to being vocal watchdogs. Strong one-person attachment can lead to possessive behavior if not socialized early.",
    health:
      "Their tiny body means fragility — falls from furniture can cause fractures. Molera (open fontanel) means head impacts need caution. Hypoglycemia, especially in puppies, is a frequent emergency — feed small meals often. Patellar luxation, dental overcrowding, tracheal collapse, and hydrocephalus (water on the brain) all occur. Heart murmurs are common in seniors. Average lifespan 14–18 years — very long for any breed.",
    care:
      "Handle gently — never let children pick them up alone. They are highly sensitive to cold; sweaters and indoor heating matter in winter. Use harnesses instead of collars to protect the trachea. Weight management is crucial despite their small size — even 500 g overweight is significant. Early socialization with strangers and other pets reduces reactivity. Dental brushing multiple times per week prevents severe dental disease.",
    history:
      "The Chihuahua's ancestors are believed to be the Techichi — a small companion dog of the ancient Toltec civilization in Mexico (around 9th century CE). Aztec nobility later kept Techichi-descended dogs, often sacrificing them in burial rites as spiritual guides. Modern Chihuahuas were discovered in the 1850s in Mexico's Chihuahua state. AKC recognition came in 1904. Taco Bell's 'Gidget' and Paris Hilton's 'Tinkerbell' drove modern popularity.",
  },

  "yorkshire-terrier": {
    description:
      "The Yorkshire Terrier — affectionately 'Yorkie' — is a tiny 2–3 kg terrier from 19th-century Yorkshire, England. Originally bred to hunt rats in textile mills, they retain a feisty, fearless terrier spirit despite their lap-dog size today. The silky steel-blue and tan coat grows to floor length when shown, but most pets wear shorter 'puppy cut' trims. Confident, alert, and vocal, they can be challenging for first-time owners but deeply devoted once bonded.",
    characteristics:
      "Weight 2–3.5 kg, height 18–23 cm. The long single-layer coat has a silky human-hair texture rather than fur, shedding minimally — relatively allergy-friendly. Standard colors are steel blue body with tan legs and face, though puppies are born black-and-tan and lighten with age. Alert, curious, and bold — they display full terrier confidence despite size. Territorial and often bark at unfamiliar people or sounds.",
    health:
      "Tracheal collapse is common due to delicate anatomy — always use a harness. Liver shunts (portosystemic shunt) have elevated breed incidence — requires early diagnosis. Patellar luxation, retinal dysplasia, and Legg-Calve-Perthes disease (hip joint degeneration) all occur. Dental disease is severe due to tiny jaws; most Yorkies need dental cleanings by age 3. Average lifespan 13–16 years.",
    care:
      "Daily brushing and weekly bathing if keeping long coat; shorter 'puppy cut' trims are more practical for pets. Professional grooming every 4–6 weeks. Tie up head hair to protect eyes. They are sensitive to cold — sweaters needed in winter. 20–30 minutes of daily walking plus indoor play. Start housebreaking early and consistently — tiny bladders make training challenging. Socialization prevents excessive reactivity.",
    history:
      "Developed in the 1800s in Yorkshire, England, by crossing several terrier breeds (Waterside Terrier, Clydesdale Terrier, etc.) for use as rat-catchers in textile mills. As the Industrial Revolution waned, the breed was refined for smaller size and entered the show ring. A famous Yorkie named 'Huddersfield Ben' (1865) is considered the foundation sire of the modern breed. AKC recognized in 1885.",
  },

  "dachshund": {
    description:
      "The Dachshund — literally 'badger dog' in German — is instantly recognizable for its elongated body and short legs. Bred to chase badgers and small prey into underground burrows, they retain strong hunting instincts and remarkable courage. Three coat varieties (smooth, long-haired, wire-haired) and two size classes (standard, miniature) offer wide variety. Stubborn yet affectionate, they bond deeply with family but can be aloof with strangers. A top-10 breed in both the US and Korea.",
    characteristics:
      "Standard 7–14 kg, Miniature under 5 kg. Long body, short legs, and deep chest reflect their underground-hunting heritage. Wide coat color range (red, black-and-tan, chocolate, dapple, cream, etc.). Three coat types have distinct grooming needs. Fearless and determined — surprising strength of will in a small body. Vocal — they bark freely and loudly. Strong prey drive means small animals can trigger chasing.",
    health:
      "IVDD (disc disease) affects 1 in 4 Dachshunds — the long back and short legs create severe spinal stress. Avoid jumping from heights, use ramps for furniture. Patellar luxation, progressive retinal atrophy, and epilepsy also occur. Obesity dramatically worsens back issues. Dental disease is frequent due to crowded teeth. Average lifespan 12–16 years — longer for miniatures.",
    care:
      "Prevent jumping and rough play to protect the spine. Provide ramps and steps everywhere. Strict weight control — even slight obesity doubles IVDD risk. Smooth coats need weekly brushing; long and wire-haired coats need 2–3 times weekly plus periodic hand-stripping (wire-haired). Strong prey drive requires secure leashes and fenced yards. Early socialization and consistent training channel their stubbornness positively.",
    history:
      "Developed in 15th-century Germany to hunt badgers and other burrow-dwelling prey. The elongated body allowed entry into badger setts; the short legs enabled digging and maneuvering underground. Initial Dachshunds were 14–18 kg; smaller miniatures were bred later for rabbit hunting. Beloved by German royalty, including Queen Victoria (half-German heritage). Became the mascot of the 1972 Munich Olympics. Among the world's most popular breeds today.",
  },

  "french-bulldog": {
    description:
      "The French Bulldog — affectionately 'Frenchie' — is a small brachycephalic breed with bat-like upright ears and a stocky muscular body. Developed from toy English Bulldogs crossed with Parisian ratters, they became favorites of Parisian lace workers and later celebrities. Adaptable, affectionate, and surprisingly quiet, they suit apartment living well. However, brachycephalic syndrome requires lifelong heat and exercise management. The AKC's most popular breed in 2022.",
    characteristics:
      "Weight 8–14 kg, height 28–33 cm. Flat face, short muzzle, bat ears, and thick muscular body are signature. The short smooth coat comes in brindle, fawn, pied, cream, and more. Known as 'clownish' — playful, affectionate, and people-oriented. Quieter than most breeds — rarely bark and don't demand extensive exercise. They cannot swim (top-heavy build) and struggle in heat.",
    health:
      "Brachycephalic Obstructive Airway Syndrome (BOAS) causes lifelong breathing difficulty — stenotic nares, elongated soft palate, and hypoplastic trachea are common. Heat stroke is a constant summer risk. IVDD (spine disease), allergies, and ear infections are frequent. Most Frenchies require C-section births due to narrow hips and large heads. Eye issues (cherry eye, corneal ulcers) and skin fold infections need routine care. Average lifespan 10–12 years.",
    care:
      "Never let them overheat — no summer midday walks, air conditioning indoors, cooling mats. Light exercise only: 20–30 minutes of walking daily. Avoid water activities. Clean skin folds daily to prevent infection. BOAS surgery may be recommended for severe cases. Regular dental care, ear cleaning, and nail trims are ongoing. Weight control is crucial as extra weight worsens breathing.",
    history:
      "Descended from English Bulldogs brought to France by 19th-century English textile workers displaced during industrialization. Parisian ratters and toy Bulldogs were crossed, creating the French Bulldog. Beloved by Parisian bohemians, society women, and artists like Toulouse-Lautrec and Edgar Degas. The breed exploded in popularity in 2010s thanks to celebrity ownership and social media. Today one of the most popular breeds in the US, UK, and Korea.",
  },

  "shiba-inu": {
    description:
      "The Shiba Inu is Japan's most popular native breed — a small-to-medium Spitz-type dog with a fox-like face, curled tail, and bold personality. Originally bred for hunting small game in Japan's mountainous regions, they retain fierce independence and dignity. 'Shiba smile,' the famous 'doge' meme, and their almost cat-like cleanliness have made them internet celebrities. However, their stubborn, aloof temperament makes them challenging for first-time owners.",
    characteristics:
      "Weight 8–11 kg, height 35–41 cm. Compact muscular body with the classic Spitz features — curled tail, prick ears, thick double coat. Coat colors: red (most common), sesame, black-and-tan, cream. The characteristic 'urajiro' — cream markings on cheeks, chest, and belly — is required in all colors. Extremely clean — they groom themselves like cats and generally avoid puddles. Independent, aloof with strangers, but fiercely loyal to their person. Famous for the 'Shiba scream' when displeased.",
    health:
      "Allergies (food and environmental) are very common — skin issues and itching are frequent complaints. Patellar luxation, hip dysplasia, and progressive retinal atrophy (PRA) have breed-specific prevalence. Glaucoma, seizures, and hypothyroidism occur more often than in many breeds. Generally a healthy breed with good longevity. Average lifespan 13–16 years.",
    care:
      "Heavy seasonal shedding requires 2–3 brushings weekly plus daily during 'coat blow.' They are often difficult to train due to independent nature — consistent, positive reinforcement works best. Secure leashes and fenced yards are essential — their prey drive can override recall. Early and extensive socialization prevents stranger-reactivity and same-sex aggression. Need 30–60 minutes of daily exercise. Respect their boundaries; they dislike being forced to cuddle.",
    history:
      "The Shiba Inu is Japan's oldest and smallest native breed, dating back over 2,000 years to prehistoric hunting dogs of Japan's mountains. 'Shiba' may mean 'brushwood' (referring to the terrain they hunted in) or 'small' in an older Japanese dialect. Nearly extinct after WWII due to distemper epidemics, three regional lines (Shinshu, Mino, Sanin) were combined to rebuild the breed. Designated a Japanese Natural Monument in 1936. AKC recognition came in 1992. The 'doge' meme brought worldwide fame in the 2010s.",
  },

  "border-collie": {
    description:
      "The Border Collie is widely regarded as the world's most intelligent dog breed — ranked #1 in Stanley Coren's rankings. Originally bred in the Scotland–England border region for sheep herding, they possess legendary intelligence, focus, and energy. A working border collie can herd 1,000+ sheep with verbal cues alone. This intensity makes them unsuitable for sedentary households — without 2+ hours of daily physical AND mental work, they develop severe behavioral problems.",
    characteristics:
      "Weight 14–20 kg, height 46–56 cm. Medium-sized athletic body built for endurance running. Double coat comes in two types — rough (longer) and smooth — and many colors (black-and-white most common, also red, merle, tricolor). The 'herding eye' — intense fixated stare used to control sheep — is the breed's signature. Extraordinarily trainable with 200+ word comprehension documented. Sensitive to owner emotion and environmental change.",
    health:
      "Generally healthy, but some genetic conditions warrant screening. Collie Eye Anomaly (CEA), PRA, and epilepsy have genetic tests available. Hip dysplasia affects some lines. Neuronal ceroid lipofuscinosis (CL) is a serious breed-specific disease — always verify parent test results. Border Collie Collapse (BCC) causes exercise-induced collapse in genetically affected dogs. Average lifespan 12–15 years.",
    care:
      "2+ hours of vigorous daily exercise is the absolute minimum — ideally with varied activities (running, fetch, swimming) plus mental work (obedience, agility, scent work, puzzle toys). Without this, destructive behavior is guaranteed. Best suited to experienced owners with time, space, and dog-sport interests. Brush 2–3 times weekly. Early socialization prevents herding behavior toward children (nipping heels). Not recommended for apartment-only or sedentary households.",
    history:
      "Developed in the border country of Scotland and England from Roman-era herding dogs crossed with Scandinavian herding dogs. The modern breed traces to 'Old Hemp' (born 1893), a dog whose quiet herding style (using the 'eye' rather than barking) became the breed foundation. Nearly every modern Border Collie descends from Hemp. Recognized by the Kennel Club (UK) in 1976 and AKC in 1995. Consistently tops intelligence rankings across studies.",
  },

  "labrador-retriever": {
    description:
      "The Labrador Retriever — 'Lab' for short — has been the AKC's #1 breed for over 30 years (until recently overtaken by French Bulldogs). Developed as a waterfowl-retrieving hunting dog in Newfoundland, Canada, they combine gentle temperament, exceptional trainability, and boundless energy. Famed as guide dogs, therapy dogs, and search-and-rescue workers, Labs are considered nearly 'perfect family dogs.' Three colors (black, yellow, chocolate) occur, and all are the same breed — only coat varies.",
    characteristics:
      "Weight 25–36 kg, height 55–62 cm. Powerful athletic build with webbed feet (for swimming) and the famous 'otter tail' — thick at the base, tapering. Short double coat is water-resistant. Exceptionally friendly with people, dogs, and other animals — poor guard dogs precisely because they love everyone. Highly food-motivated, which makes them easy to train but prone to obesity. Love water — swimming is their natural element. Remain puppy-like until age 3–4.",
    health:
      "Hip and elbow dysplasia are the most common inherited concerns — verify parent scores. Exercise-induced collapse (EIC) has a genetic test. PRA, cataracts, and heart conditions occur. Obesity is the #1 lifestyle concern — 60% of Labs are overweight per veterinary studies. This leads to arthritis, diabetes, and shorter lifespan. Average lifespan 10–12 years — shorter due to cancer and obesity.",
    care:
      "Need 1–2 hours of vigorous exercise daily — swimming, retrieving, and running are best. Insufficient exercise causes destructive chewing. Strict food portioning — measure every meal. No free-feeding. Brush 2–3 times weekly, daily during shedding. Train bite inhibition early (they are mouthy puppies). Socialize with water early since they'll seek it anyway. Regular ear cleaning prevents water-related infections.",
    history:
      "Originated in Newfoundland, Canada, where fishermen used 'St. John's Water Dogs' to retrieve nets and fish from cold Atlantic waters. 19th-century British aristocrats imported these dogs, and the Earl of Malmesbury coined 'Labrador.' British breeding refined the waterfowl-retrieving function. AKC recognized the Lab in 1917. Yellow Labs became famous through guide dog programs starting in the 1930s. Chocolate Labs gained popularity in the late 20th century.",
  },

  "siberian-husky": {
    description:
      "The Siberian Husky is a medium-sized sled dog from Siberia, developed by the Chukchi people for endurance sled-pulling across Arctic terrain. Thick double coats, wolf-like appearance, and famous blue or heterochromatic eyes captivate instantly — but the breed's intense energy, escape artistry, and stubbornness make them challenging for most households. Pack-oriented and highly social, they are friendly with strangers and other dogs — but rarely make good guard dogs.",
    characteristics:
      "Weight 16–27 kg, height 51–60 cm. Medium athletic build with dense double coat in gray, black, red, agouti, and piebald patterns. Blue, brown, or bi-colored (one blue, one brown) eyes are breed hallmarks. Remarkably vocal — they rarely bark but howl, 'talk,' and vocalize extensively. Extraordinarily friendly — dangerous for this reason with small prey (cats, rabbits). Master escape artists: they climb, dig, and open gates. Endurance runners — they can run 150+ km per day under ideal conditions.",
    health:
      "Generally healthy with good longevity. Eye issues (juvenile cataracts, PRA, corneal dystrophy) need screening. Hip dysplasia occurs but at lower rates than many breeds. Hypothyroidism and zinc-responsive dermatosis are breed-specific concerns. Uveodermatologic syndrome — an autoimmune attack on pigmented cells — affects eyes and skin. Average lifespan 12–14 years.",
    care:
      "Daily exercise of 1–2 hours is mandatory — running, skijoring, or bikejoring ideal. Without sufficient exercise, destructive behavior is guaranteed. They cannot be trusted off-leash — prey drive and endurance mean they'll run and not come back. Secure fencing (at least 2 m tall, buried deep) is essential. Heavy shedding requires 2–3 brushings weekly, daily during 'coat blow' (twice yearly). They handle cold well but struggle in heat over 25°C.",
    history:
      "The Chukchi people of northeastern Siberia bred these dogs for endurance sled-pulling over 3,000 years. First brought to Alaska in 1908 for sled racing, they quickly dominated the sport. The 1925 'Serum Run to Nome' — where sled dog teams relayed life-saving diphtheria antitoxin 1,085 km in 5.5 days — made 'Balto' and the breed world-famous. AKC recognition came in 1930. Now popular despite challenges thanks to 'Game of Thrones' direwolf imagery and social media.",
  },

  "korean-jindo": {
    description:
      "The Jindo is Korea's most celebrated native dog breed — a medium-sized Spitz-type originating on Jindo Island, South Jeolla Province. Legendary for loyalty, intelligence, and homing instinct, Jindos are Korean Natural Monument #53 (designated 1962). Stories of lost Jindos walking hundreds of kilometers home over months are cultural touchstones. They possess the independence of primitive breeds and rarely accept a new owner once bonded, making them difficult to rehome.",
    characteristics:
      "Weight 15–23 kg, height 45–55 cm. Medium build with curled tail, prick ears, and wedge-shaped head. Six officially recognized coat colors: white, fawn (yellow), black-and-tan, brindle (tiger), black, and gray-wolf. Double coat with harsh outer guard hairs and dense undercoat. Very clean — similar to Shibas in grooming themselves cat-like. Exceptional hunting instincts — they were historically used for deer and wild boar. Unflinching loyalty to a single owner, wariness of strangers.",
    health:
      "Naturally robust as a landrace breed with few genetic issues. Hypothyroidism is the most common health concern. Allergic dermatitis affects some individuals. Hip dysplasia occurs at lower rates than many medium breeds. Stress-sensitive — rehoming can trigger prolonged food refusal and depression. Some individuals show severe separation anxiety. Average lifespan 12–15 years.",
    care:
      "Active breed requiring 1–2 hours of daily exercise — walking, hiking, and running all welcome. Ideal in homes with a yard; apartment owners must compensate with longer walks. Escape artists — secure fencing is essential (they can climb and dig). Double coat sheds heavily in seasonal coat blows, requiring 2–3 brushings weekly. The most critical care priority is early-life socialization (3–12 weeks) — exposure to many people, animals, and environments reduces adult guardedness. Without it, adult Jindos become overly protective or anxious.",
    history:
      "Native to Jindo Island, South Jeolla Province, where they have evolved in near-isolation for centuries (possibly millennia). The island's geography minimized crossbreeding with mainland dogs, preserving a pure lineage. Designated Korean Natural Monument #53 in 1962, and their breeding is protected under the 'Jindo County Jindo Dog Protection and Development Ordinance.' Officially registered with the FCI in 2005, gaining international recognition. The legendary story of 'Baekgu' — a Jindo who walked 300 km over 7 months from Daejeon to Jindo to find her original owner — remains a powerful symbol of the breed's loyalty.",
  },
};

// Origin translation
export const ORIGIN_EN: Record<string, string> = {
  "한국": "Korea",
  "영국": "United Kingdom",
  "러시아": "Russia",
  "이란(페르시아)": "Iran (Persia)",
  "스코틀랜드": "Scotland",
  "미국": "United States",
  "태국": "Thailand",
  "노르웨이": "Norway",
  "캐나다": "Canada",
  "몰타": "Malta",
  "프랑스/독일": "France / Germany",
  "영국(스코틀랜드)": "UK (Scotland)",
  "독일/폴란드": "Germany / Poland",
  "중국(티베트)": "China (Tibet)",
  "웨일스(영국)": "Wales (UK)",
  "프랑스/벨기에": "France / Belgium",
  "멕시코": "Mexico",
  "독일": "Germany",
  "프랑스": "France",
  "일본": "Japan",
  "대한민국(진도)": "South Korea (Jindo Island)",
};

// Personality tag translation (common traits)
export const PERSONALITY_EN: Record<string, string> = {
  // Cats
  "독립적": "Independent",
  "영리함": "Clever",
  "적응력 강함": "Adaptable",
  "호기심 많음": "Curious",
  "온순함": "Gentle",
  "느긋함": "Laid-back",
  "조용함": "Quiet",
  "수줍음": "Shy",
  "충성스러움": "Loyal",
  "차분함": "Calm",
  "애교 많음": "Affectionate",
  "다정함": "Warm",
  "사교적": "Sociable",
  "유순함": "Docile",
  "장난기 많음": "Playful",
  "활발함": "Lively",
  "호기심 강함": "Very Curious",
  "장난꾸러기": "Mischievous",
  "수다쟁이": "Talkative",
  "개냥이": "Dog-like Cat",
  "관심 집중": "Attention-Seeking",
  "애정 깊음": "Deeply Affectionate",
  "짧은 다리": "Short Legs",
  "애교쟁이": "Sweet",
  "봉제인형": "Plushy",
  "안기기 좋아함": "Loves Cuddles",
  "대형묘": "Large Cat",
  "자연발생종": "Landrace",
  "똑똑함": "Smart",
  "에너지": "Energetic",
  "모험심": "Adventurous",
  "곱슬털": "Curly Coat",
  "인내심 강함": "Patient",
  "애교 폭발": "Super Affectionate",
  "체온 높음": "Warm Body",

  // Dogs
  "용감함": "Brave",
  "매우 영리함": "Highly Intelligent",
  "훈련 잘 됨": "Trainable",
  "자신감 있음": "Confident",
  "쾌활함": "Cheerful",
  "고집 있음": "Stubborn",
  "대담함": "Bold",
  "털 빠짐 적음": "Low Shedding",
  "독립심": "Independent",
  "충성심 강함": "Fiercely Loyal",
  "경계심": "Watchful",
  "체구 작음": "Tiny Build",
  "자신감": "Self-Assured",
  "사냥 본능": "Hunting Instinct",
  "애정 많음": "Loving",
  "헛짖음 적음": "Rarely Barks",
  "청결함": "Clean",
  "고집": "Strong-Willed",
  "천재견": "Genius Dog",
  "활동량 최상": "Extremely Active",
  "충성심": "Loyalty",
  "집중력": "Focused",
  "천사견": "Angel Dog",
  "인내심": "Patient",
  "수영 좋아함": "Loves Swimming",
  "순종적": "Obedient",
  "썰매견": "Sled Dog",
  "서열 중시": "Pack-Oriented",
  "에너지 넘침": "High Energy",
  "친화적": "Friendly",
  "맹목적 충성": "Devoted",
  "귀소본능": "Homing Instinct",
};
