export interface ClassSubject {
  name: string;
  code?: string;
  chapters: string[];
}

export interface ClassDefinition {
  classLevel: string; // '1' to '12'
  title: string;
  category: 'primary' | 'middle' | 'matric' | 'intermediate';
  streams?: {
    name: string;
    subjects: ClassSubject[];
  }[];
  subjects: ClassSubject[];
}

export const SINDH_BOARD_CLASSES: ClassDefinition[] = [
  {
    classLevel: '1',
    title: 'Class 1 (Primary)',
    category: 'primary',
    subjects: [
      { name: 'English', chapters: ['Alphabet & Phonics', 'Sight Words & Rhymes', 'Simple Sentences', 'Colors & Numbers', 'Myself & Family'] },
      { name: 'Urdu', chapters: ['حروفِ تہجی اور بنیادی الفاظ', 'آسان نظمیں', 'میرا تعارف', 'رنگوں اور جانوروں کے نام'] },
      { name: 'Sindhi', chapters: ['سنڌي الفابيٽ (حروف)', 'سولا لفظ ۽ جملا', 'منهنجو خاندان', 'رنگ ۽ ڳڻپ'] },
      { name: 'Mathematics', chapters: ['Counting 1-100', 'Basic Addition', 'Basic Subtraction', 'Shapes & Patterns', 'Measurement Concepts'] },
      { name: 'General Knowledge / Islamiat', chapters: ['Our Environment', 'Cleanliness & Manners', 'Pillars of Islam (بنیادی کلمے)', 'Good Habits'] },
    ],
  },
  {
    classLevel: '2',
    title: 'Class 2 (Primary)',
    category: 'primary',
    subjects: [
      { name: 'English', chapters: ['Nouns & Pronouns', 'Stories & Reading Comprehension', 'Action Verbs', 'Opposite Words', 'Simple Paragraph Writing'] },
      { name: 'Urdu', chapters: ['اسم اور صفت کی پہچان', 'سبق: پیارے نبی ﷺ', 'کہانیاں اور اخلاقی اسباق', 'املا اور جملہ سازی'] },
      { name: 'Sindhi', chapters: ['سنڌي لفظ ۽ گرامر', 'اخلاقي ڪهاڻيون', 'وطن سان محبت', 'جملا ۽ سوال جواب'] },
      { name: 'Mathematics', chapters: ['Numbers up to 1000', 'Addition with Carrying', 'Subtraction with Borrowing', 'Introduction to Multiplication', 'Fractions & Time'] },
      { name: 'General Science', chapters: ['Living & Non-living Things', 'Plants and Animals', 'Human Body Parts & Senses', 'Weather & Seasons', 'Water and Air'] },
      { name: 'Islamiat', chapters: ['ایمان اور ارکانِ اسلام', 'نماز کی اہمیت', 'اخلاق و آداب', 'سیرت النبی ﷺ'] },
    ],
  },
  {
    classLevel: '3',
    title: 'Class 3 (Primary)',
    category: 'primary',
    subjects: [
      { name: 'English', chapters: ['Parts of Speech Overview', 'Tenses (Present & Past)', 'Comprehension Passages', 'Creative Writing', 'Vocabulary Building'] },
      { name: 'Mathematics', chapters: ['Place Value & Ordering', 'Multiplication Tables', 'Division Basics', 'Geometry & Angles', 'Money & Measurement'] },
      { name: 'General Science', chapters: ['Habitats of Living Things', 'States of Matter', 'Forces and Motion', 'Sun, Earth and Moon', 'Health & Hygiene'] },
      { name: 'Urdu', chapters: ['گرامر: واحد جمع، مذکر مؤنث', 'سبق: خدمتِ خلق', 'نظم: حمد و نعت', 'خطوط اور درخواست نویسی'] },
      { name: 'Sindhi', chapters: ['سنڌي ٻوليءَ جو گرامر', 'سنڌ جا مشهور ماڳ', 'استاد جو احترام', 'مضمون نويسي'] },
      { name: 'Social Studies', chapters: ['Our Community & Villages', 'Map Reading Basics', 'Rules and Responsibilities', 'Historical Personalities of Pakistan'] },
      { name: 'Islamiat', chapters: ['قرآن مجید کی تعلیمات', 'وضو اور طہارت کا طریقہ', 'سچائی اور امانت داری', 'انبیاء کرام کے واقعات'] },
    ],
  },
  {
    classLevel: '4',
    title: 'Class 4 (Primary)',
    category: 'primary',
    subjects: [
      { name: 'English', chapters: ['Sentence Structure & Types', 'Adjectives & Adverbs', 'Prepositions & Conjunctions', 'Story Writing & Essays', 'Punctuation Rules'] },
      { name: 'Mathematics', chapters: ['Factors and Multiples (LCM & HCF)', 'Fractions & Decimals', 'Perimeter & Area', 'Data Handling & Graphs', 'Units of Measurement'] },
      { name: 'General Science', chapters: ['Human Body Systems (Digestive & Skeletal)', 'Ecosystems & Food Chains', 'Forms of Energy', 'Simple Machines', 'Electricity & Magnetism'] },
      { name: 'Urdu', chapters: ['مضامین: قائد اعظم، ہمارا وطن', 'گرامر: مترادف اور متضاد الفاظ', 'سبق: محنت کی عظمت', 'کہانی نویسی'] },
      { name: 'Sindhi', chapters: ['شاهه عبداللطيف ڀٽائي رح جو تعارف', 'سنڌ جا درياء ۽ وسيلا', 'گرامر ۽ اصطلاح', 'چٺي ۽ درخواست'] },
      { name: 'Social Studies', chapters: ['Provinces of Pakistan (Focus on Sindh)', 'Climate and Natural Vegetation', 'Citizenship & Human Rights', 'Pakistan Movement Overview'] },
      { name: 'Islamiat', chapters: ['طہارت اور پاکیزگی', 'روزہ اور رمضان کے فضائل', 'احترامِ والدین و اساتذہ', 'خلفائے راشدین'] },
    ],
  },
  {
    classLevel: '5',
    title: 'Class 5 (Primary Board)',
    category: 'primary',
    subjects: [
      { name: 'English', chapters: ['Active and Passive Voice Basics', 'Direct & Indirect Speech Introduction', 'Essay & Letter Writing', 'Unseen Passages & MCQs', 'Idiomatic Expressions'] },
      { name: 'Mathematics', chapters: ['Operations on Large Numbers', 'LCM and HCF Word Problems', 'Percentage & Ratio Basics', 'Unitary Method', 'Angles, Triangles & Quadrilaterals'] },
      { name: 'General Science', chapters: ['Classification of Living Organisms', 'Microorganisms and Disease Prevention', 'Physical & Chemical Changes', 'Light and Sound Energy', 'Space & Solar System Exploration'] },
      { name: 'Urdu', chapters: ['کامل گرامر: جملے کی بناوٹ', 'مضامین: وقت کی پابندی، سائنس کے کرشمے', 'نظم: علامہ اقبال کی نظمیں', 'سندھ بورڈ ماڈل پیپر حل'] },
      { name: 'Sindhi', chapters: ['سنڌي ادبي نصاب', 'سنڌ جا ميلا ۽ ثقافت', 'مڪمل گرامر ۽ سوال جواب', 'امتحاني حل ٿيل ماڊل پيپر'] },
      { name: 'Social Studies', chapters: ['Geography and Maps of Sindh & Pakistan', 'Government & Constitution Basics', 'Culture, Heritage and Indus Valley', 'Environmental Conservation'] },
      { name: 'Islamiat', chapters: ['زکوٰۃ اور حج کی فرضیت', 'سیرتِ عائشہ صدیقہ و فاطمۃ الزہراء رض', 'اسلام میں حقوق العباد', 'آخری پارے کی منتخب سورتیں'] },
    ],
  },
  {
    classLevel: '6',
    title: 'Class 6 (Middle)',
    category: 'middle',
    subjects: [
      { name: 'English', chapters: ['Grammar: Tenses Mastery', 'Narrative and Expository Writing', 'Comprehension & Vocabulary', 'Dialogues & Letters', 'Poetry Analysis'] },
      { name: 'Mathematics', chapters: ['Sets and Venn Diagrams', 'Integers and Real Line', 'Fractions & Decimals Algebra', 'Linear Equations in One Variable', 'Geometry: Lines and Angles'] },
      { name: 'General Science', chapters: ['Cellular Organization of Plants and Animals', 'Sense Organs', 'Photosynthesis and Respiration', 'Air, Atmosphere & Climate Change', 'Solutions and Suspensions'] },
      { name: 'Computer Education', chapters: ['Introduction to Computers & Hardware', 'Operating Systems & File Management', 'Word Processing Essentials', 'Internet, Email & Digital Safety'] },
      { name: 'Urdu', chapters: ['نثر و نظم کا مطالعہ', 'قواعد: اسم معرفہ اور نکرہ', 'مضمون نگاری اور فہم و ادراک', 'سبق: علم کی اہمیت'] },
      { name: 'Sindhi', chapters: ['سنڌي نثر ۽ شاعري', 'سنڌ جي تاريخي عظمت', 'گرامر جا اصول', 'حل ٿيل مشقون'] },
      { name: 'Social Studies', chapters: ['Indus Valley Civilization (Mohenjo-daro)', 'Ancient Civilizations', 'Physical Geography of South Asia', 'Civic Life and Social Harmony'] },
      { name: 'Islamiat', chapters: ['عقائد: توحید، رسالت، آخرت', 'عبادات: صلوٰۃ، صوم، زکوٰۃ', 'اسوہ حسنہ: مدنی زندگی', 'اسلامی معاشرت'] },
    ],
  },
  {
    classLevel: '7',
    title: 'Class 7 (Middle)',
    category: 'middle',
    subjects: [
      { name: 'English', chapters: ['Conditional Sentences', 'Direct and Indirect Speech', 'Summary Writing', 'Formal Letters & Applications', 'Literary Devices'] },
      { name: 'Mathematics', chapters: ['Direct and Inverse Variation', 'Financial Arithmetic (Profit, Loss, Zakat)', 'Algebraic Identities & Formulas', 'Factorization of Algebraic Expressions', 'Circumference & Area of Circles'] },
      { name: 'General Science', chapters: ['Human Organ Systems (Circulatory & Respiratory)', 'Transport in Humans and Plants', 'Periodic Table Basics & Elements', 'Acids, Alkalis and Salts', 'Light Reflection & Dispersion', 'Heat and Temperature'] },
      { name: 'Computer Education', chapters: ['Spreadsheets with Microsoft Excel', 'Computer Software & System Architecture', 'Multimedia & Presentations', 'Cybersecurity & Ethics'] },
      { name: 'Urdu', chapters: ['حمد و نعت کی تشریح', 'نثر: حب الوطنی اور محنت', 'قواعد: محاورات اور ضرب الامثال', 'تفصیلی مضامین'] },
      { name: 'Sindhi', chapters: ['سنڌي لوڪ گيت ۽ شاعري', 'سنڌ جا صوفي بزرگ', 'مڪمل گرامر ۽ سنڌ بورڊ حل ٿيل سوال'] },
      { name: 'Social Studies', chapters: ['Muslim Rule in Subcontinent (Sindh & Ghaznavids)', 'Mughal Empire Era', 'World Climate Zones', 'Human Population & Resources'] },
      { name: 'Islamiat', chapters: ['غزواتِ نبوی (بدر، احد، خندق)', 'عدل و انصاف اور مساوات', 'سیرت خلفائے راشدین', 'معاشرتی ذمہ داریاں'] },
    ],
  },
  {
    classLevel: '8',
    title: 'Class 8 (Middle Board Exam)',
    category: 'middle',
    subjects: [
      { name: 'English', chapters: ['Active/Passive & Direct/Indirect Complete Rules', 'Comprehensive Essay Writing', 'Formal Speeches & Letters', 'Critical Reading Passages', 'Sindh Board Model Paper Solutions'] },
      { name: 'Mathematics', chapters: ['Square Roots and Cube Roots', 'Number Systems (Binary & Decimal)', 'Simultaneous Linear Equations', 'Pythagoras Theorem & Trigonometry Intro', 'Surface Area and Volume of Cylinders & Cones'] },
      { name: 'General Science', chapters: ['Human Nervous System and Senses', 'Cell Division (Mitosis & Meiosis)', 'Biotechnology and Genetic Engineering Basics', 'Chemical Reactions and Equations', 'Acids, Bases, and Salts', 'Force and Pressure in Fluids'] },
      { name: 'Computer Education', chapters: ['Computer Networks & Topologies', 'Basics of HTML & Web Design', 'Database Fundamentals', 'Ethical Issues in Computing & AI Overview'] },
      { name: 'Urdu', chapters: ['جامع گرامر اور تشریحات', 'مشہور شعراء کا کلام', 'امتحانی مضامین اور درخواستیں', 'بورڈ امتحان کے حل شدہ پیپرز'] },
      { name: 'Sindhi', chapters: ['سنڌي نصاب جو مڪمل تجزيو', 'شاهه لطيف جا بيت ۽ معنا', 'بورڊ جا ماڊل پيپرز ۽ حل'] },
      { name: 'Social Studies', chapters: ['Decline of Mughals and British Advent in Sindh', 'Sir Syed Ahmad Khan & Aligarh Movement', 'Pakistan Resolution 1940', 'Geography & Economic Resources of Sindh'] },
      { name: 'Islamiat', chapters: ['جہاد فی سبیل اللہ کی حقیقت', 'حلال و حرام کے احکام', 'حجۃ الوداع کا تاریخی خطبہ', 'اسلام کا نظامِ اخلاق'] },
    ],
  },
  {
    classLevel: '9',
    title: 'Class 9 (SSC Part-I / Matric)',
    category: 'matric',
    subjects: [
      {
        name: 'Physics (New STBB Syllabus)',
        chapters: [
          'Unit 1: Physical Quantities & Measurement',
          'Unit 2: Kinematics (Motion, Velocity, Acceleration, Equations of Motion)',
          'Unit 3: Dynamics (Newton’s Laws of Motion, Momentum, Friction)',
          'Unit 4: Turning Effect of Forces (Torque, Equilibrium, Center of Gravity)',
          'Unit 5: Gravitation (Newton’s Law of Gravitation, Artificial Satellites)',
          'Unit 6: Work, Energy & Power (Kinetic & Potential Energy, Conservation of Energy)',
          'Unit 7: Properties of Matter (Elasticity, Hooke’s Law, Pressure in Liquids, Archimedes Principle)',
          'Unit 8: Thermal Properties of Matter (Specific Heat, Latent Heat, Thermal Expansion)',
          'Unit 9: Transfer of Heat (Conduction, Convection, Radiation, Greenhouse Effect)',
        ],
      },
      {
        name: 'Chemistry (New STBB Syllabus)',
        chapters: [
          'Chapter 1: Fundamentals of Chemistry (Mole Concept, Empirical & Molecular Formulas)',
          'Chapter 2: Structure of Atoms (Bohr’s Model, Isotopes, Electronic Configuration)',
          'Chapter 3: Periodic Table & Periodicity of Properties (Electronegativity, Ionization Energy)',
          'Chapter 4: Structure of Molecules (Ionic, Covalent, Coordinate, Metallic Bonds)',
          'Chapter 5: Physical States of Matter (Boyle’s Law, Charles’s Law, Evaporation, Boiling Point)',
          'Chapter 6: Solutions (Molarity, Solubility, Saturated & Unsaturated Solutions)',
          'Chapter 7: Electrochemistry (Oxidation-Reduction, Electrolytic & Galvanic Cells, Corrosion)',
          'Chapter 8: Chemical Reactivity (Metals and Non-metals, Reactivity Series)',
        ],
      },
      {
        name: 'Biology (New STBB Syllabus)',
        chapters: [
          'Chapter 1: Introduction to Biology & Branches',
          'Chapter 2: Solving a Biological Problem (Scientific Method)',
          'Chapter 3: Biodiversity & Five Kingdom Classification',
          'Chapter 4: Cells & Tissues (Light & Electron Microscopes, Organelles)',
          'Chapter 5: Cell Cycle (Mitosis, Meiosis, Significance)',
          'Chapter 6: Enzymes (Mechanism of Enzyme Action, Factors Affecting Enzymes)',
          'Chapter 7: Bioenergetics (Photosynthesis, Light & Dark Reactions, Respiration)',
          'Chapter 8: Nutrition (Autotrophic & Heterotrophic, Human Digestive System)',
          'Chapter 9: Transport (Transport in Plants, Human Circulatory System, Blood Groups)',
        ],
      },
      {
        name: 'Mathematics (Sindh Textbook Board)',
        chapters: [
          'Unit 1: Real and Complex Numbers',
          'Unit 2: Logarithms (Laws of Logarithms, Scientific Notation)',
          'Unit 3: Algebraic Expressions & Formulas',
          'Unit 4: Factorization, HCF & LCM',
          'Unit 5: Algebraic Manipulation',
          'Unit 6: Linear Equations and Inequalities',
          'Unit 7: Linear Graphs and their Application',
          'Unit 8: Introduction to Coordinate Geometry',
          'Unit 9: Congruent & Similar Triangles Theorems',
        ],
      },
      {
        name: 'Computer Science',
        chapters: [
          'Chapter 1: Fundamentals of Computer & Generations',
          'Chapter 2: Fundamentals of Operating Systems (Windows, Linux)',
          'Chapter 3: Office Automation (MS Word, Excel, PowerPoint)',
          'Chapter 4: Data Communication & Computer Networks',
          'Chapter 5: Computer Security and Ethics (Malware, Viruses, Cyber Laws)',
        ],
      },
      {
        name: 'English Compulsory',
        chapters: [
          'Unit 1: The Last Sermon of Hazrat Muhammad ﷺ',
          'Unit 2: Shah Abdul Latif Bhittai (Life and Poetry)',
          'Unit 3: The Neem Tree (Poem Analysis)',
          'Unit 4: Mohenjo-Daro (The Mound of the Dead)',
          'Unit 5: Health is Wealth (Exercise and Nutrition)',
          'Grammar: Active/Passive, Direct/Indirect, Prepositions, Tenses',
          'Composition: Essays, Letters, Applications, Story Writing',
        ],
      },
      {
        name: 'Islamiat Compulsory / Ethics',
        chapters: [
          'سورۃ الانفال (آیات 1 تا 75 کا ترجمہ و تشریح)',
          'احادیثِ مبارکہ (1 تا 10 کی تشریح اور عملی تطبیق)',
          'ایمانیات و عبادات (توحید، رسالت، ملائکہ، کتب)',
          'سیرتِ طیبہ ﷺ اور اسلامی اخلاق',
        ],
      },
      {
        name: 'Sindhi Salees / Urdu Salees',
        chapters: [
          'سنڌي سليس: چونڊ سبق ۽ شاعري (شاهه ڀٽائي، سچل سرمست)',
          'اردو سلیس: اسباق اور نظمیں',
          'گرامر: تشبیہ، استعارہ، روزمرہ اور محاورات',
          'امتحانی پرچے کے حل شدہ سوالات',
        ],
      },
    ],
  },
  {
    classLevel: '10',
    title: 'Class 10 (SSC Part-II / Matric)',
    category: 'matric',
    subjects: [
      {
        name: 'Physics (Class 10 STBB)',
        chapters: [
          'Chapter 10: Simple Harmonic Motion and Waves',
          'Chapter 11: Sound (Characteristics, Speed, Echo, Ultrasound)',
          'Chapter 12: Geometrical Optics (Reflection, Refraction, Lenses, Optical Instruments)',
          'Chapter 13: Electrostatics (Coulomb’s Law, Electric Field, Capacitors)',
          'Chapter 14: Current Electricity (Ohm’s Law, Resistance, Series/Parallel Circuits, Electrical Power)',
          'Chapter 15: Electromagnetism (Magnetic Effect of Current, Electromagnetic Induction, Transformer)',
          'Chapter 16: Basic Electronics (Analogue & Digital, Logic Gates: AND, OR, NOT, NAND, NOR)',
          'Chapter 17: Information and Communication Technology (ICT)',
          'Chapter 18: Atomic and Nuclear Physics (Radioactivity, Half-life, Nuclear Fission & Fusion)',
        ],
      },
      {
        name: 'Chemistry (Class 10 STBB)',
        chapters: [
          'Chapter 9: Chemical Equilibrium (Law of Mass Action, Equilibrium Constant Kc)',
          'Chapter 10: Acids, Bases and Salts (Arrhenius, Bronsted-Lowry, Lewis Concepts, pH Scale)',
          'Chapter 11: Organic Chemistry (Functional Groups, Homologous Series, Alkanes, Alkenes, Alkynes)',
          'Chapter 12: Hydrocarbons (Preparation and Chemical Reactions of Alkanes & Alkenes)',
          'Chapter 13: Biochemistry (Carbohydrates, Proteins, Lipids, Nucleic Acids, DNA & RNA)',
          'Chapter 14: The Atmosphere (Layers of Atmosphere, Air Pollutants, Acid Rain, Global Warming)',
          'Chapter 15: Water (Soft and Hard Water, Waterborne Diseases, Water Treatment)',
          'Chapter 16: Chemical Industries (Metallurgy of Copper, Solvay Process, Urea Manufacture)',
        ],
      },
      {
        name: 'Biology (Class 10 STBB)',
        chapters: [
          'Chapter 10: Gaseous Exchange (Human Respiratory System, Disorders: Asthma, Bronchitis)',
          'Chapter 11: Homeostasis (Osmoregulation, Human Excretory System, Kidney Structure & Dialysis)',
          'Chapter 12: Coordination and Control (Nervous System, Neurons, Reflex Arc, Endocrine Glands)',
          'Chapter 13: Support and Movement (Human Skeleton, Joints, Disorders: Arthritis, Osteoporosis)',
          'Chapter 14: Reproduction (Asexual & Sexual Reproduction, Flowers, Human Reproductive System)',
          'Chapter 15: Inheritance (Mendel’s Laws of Inheritance, Genes, Chromosomes, DNA Replication)',
          'Chapter 16: Man and His Environment (Ecosystem, Biogeochemical Cycles, Pollution & Conservation)',
          'Chapter 17: Biotechnology (Fermentation, Genetic Engineering, Insulin Production)',
          'Chapter 18: Pharmacology (Medicinal Drugs, Antibiotics & Vaccines, Drug Addiction)',
        ],
      },
      {
        name: 'Mathematics (Class 10 STBB)',
        chapters: [
          'Unit 17: Sets and Functions (De Morgan’s Laws, Binary Relations)',
          'Unit 18: Variations (Direct, Inverse, Joint Variation, Theorem on Proportions)',
          'Unit 19: Matrices and Determinants (Cramer’s Rule, Matrix Inversion Method)',
          'Unit 20: Basic Statistics (Mean, Median, Mode, Variance, Standard Deviation, Histograms)',
          'Unit 21: Partial Fractions (Resolving into Partial Fractions)',
          'Unit 22: Introduction to Trigonometry (Trigonometric Ratios, Identities, Angles of Elevation/Depression)',
          'Unit 23: Geometry: Chords of a Circle Theorems',
          'Unit 24: Geometry: Tangent to a Circle Theorems & Practical Geometry',
        ],
      },
      {
        name: 'Pakistan Studies (مطالعہ پاکستان)',
        chapters: [
          'باب 1: تاریخِ پاکستان (1971 سے تاحال، بھٹو، ضیاء الحق، مشرف اور جمہوری ادوار)',
          'باب 2: پاکستان اور خارجہ پالیسی (پاک چین، پاک امریکہ، مسئلہ کشمیر اور ہمسایہ ممالک)',
          'باب 3: پاکستان کی معاشی ترقی (زراعت، صنعتیں، معدنی وسائل، تجارتی شعبہ)',
          'باب 4: پاکستان کی آبادی، معاشرہ اور ثقافت (زبانیں، تہذیب، اقلیتوں کے حقوق، سندھ کا ورثہ)',
          'باب 5: تحفظِ نسواں اور شہریوں کے آئینی حقوق',
        ],
      },
      {
        name: 'English Compulsory',
        chapters: [
          'Lessons: Hazrat Ayesha (RA), The Dignity of Work, The Great Visionaries',
          'Poems: Abou Ben Adhem, A Nation’s Strength, The Daffodils',
          'Grammar: Idioms, Pair of Words, Narration, Voice, Prepositions',
          'Writing: Formal Letters, Applications, Board Essays, Translation from Sindhi/Urdu to English',
        ],
      },
      {
        name: 'Computer Science (Class 10)',
        chapters: [
          'Chapter 1: Problem Solving & Algorithm Development (Flowcharts & Pseudocode)',
          'Chapter 2: Programming in C (Data Types, Operators, Control Structures: if-else, loops)',
          'Chapter 3: Functions and Arrays in C Programming',
          'Chapter 4: HTML & Web Development (Tags, Links, Lists, Tables, CSS Basics)',
        ],
      },
    ],
  },
  {
    classLevel: '11',
    title: 'Class 11 (HSSC-I / 1st Year Intermediate)',
    category: 'intermediate',
    streams: [
      {
        name: 'Pre-Medical',
        subjects: [
          {
            name: 'Biology (Botany & Zoology - New STBB)',
            chapters: [
              'Section 1: Biological Molecules (Carbohydrates, Lipids, Proteins, Nucleic Acids)',
              'Section 2: Enzymes (Enzyme Kinetics, Inhibitors, Coenzymes)',
              'Section 3: The Cell (Membrane Structure, Organelles, Endosymbiotic Theory)',
              'Section 4: Variety of Life & Viruses (HIV, Bacteriophage, Viral Diseases)',
              'Section 5: Kingdom Prokaryotae (Bacteria Structure, Classification, Antibiotic Resistance)',
              'Section 6: Kingdom Protista and Fungi',
              'Section 7: Kingdom Plantae (Bryophytes, Pteridophytes, Gymnosperms, Angiosperms)',
              'Section 8: Kingdom Animalia (Invertebrates to Chordates)',
              'Section 9: Bioenergetics & Respiration (Glycolysis, Krebs Cycle, Electron Transport Chain)',
              'Section 10: Nutrition and Digestion in Animals',
              'Section 11: Circulation & Immunity (Heart Anatomy, Cardiac Cycle, Antibodies, Lymphatic System)',
            ],
          },
          {
            name: 'Chemistry (Class 11 STBB)',
            chapters: [
              'Chapter 1: Stoichiometry (Mole Calculations, Limiting Reactant, Percentage Yield)',
              'Chapter 2: Atomic Structure (Quantum Numbers, Orbitals, Heisenberg Principle, Spectra)',
              'Chapter 3: Theories of Chemical Bonding (VSEPR Theory, Valence Bond Theory, Hybridization, MOT)',
              'Chapter 4: States of Matter: Gases (Kinetic Molecular Theory, Real Gases, Van der Waals Equation)',
              'Chapter 5: States of Matter: Liquids & Solids (Intermolecular Forces, Crystal Lattices)',
              'Chapter 6: Chemical Equilibrium (Le Chatelier’s Principle, Common Ion Effect, Buffer Solutions)',
              'Chapter 7: Reaction Kinetics (Rate Laws, Order of Reaction, Arrhenius Equation, Catalysis)',
              'Chapter 8: Thermochemistry (First Law of Thermodynamics, Hess’s Law, Enthalpies)',
              'Chapter 9: Electrochemistry (Electrode Potentials, Nernst Equation, Electrochemical Cells)',
            ],
          },
          {
            name: 'Physics (Class 11 STBB)',
            chapters: [
              'Chapter 1: Measurement (Significant Figures, Dimensional Analysis, Errors)',
              'Chapter 2: Vectors and Equilibrium (Vector Addition, Dot & Cross Product, Torque, First & Second Conditions of Equilibrium)',
              'Chapter 3: Motion and Force (Newton’s Laws, Momentum, Collisions, Projectile Motion, Rocket Propulsion)',
              'Chapter 4: Work and Energy (Work Done by Variable Force, Gravitational Potential Energy, Escape Velocity)',
              'Chapter 5: Circular Motion (Centripetal Force, Geostationary Orbits, Angular Momentum)',
              'Chapter 6: Fluid Dynamics (Viscosity, Bernoulli’s Equation, Terminal Velocity)',
              'Chapter 7: Oscillations (Simple Harmonic Motion, Simple Pendulum, Damped & Forced Oscillations)',
              'Chapter 8: Waves (Sound Waves, Doppler’s Effect, Stationary Waves in Strings and Air Columns)',
              'Chapter 9: Physical Optics (Huygens’ Principle, Young’s Double Slit Experiment, Diffraction Grating, Polarization)',
              'Chapter 10: Thermodynamics (First & Second Laws of Thermodynamics, Carnot Engine, Entropy)',
            ],
          },
          { name: 'English (Compulsory)', chapters: ['Short Stories & Plays', 'Poetry Analysis', 'Comprehension & Vocabulary', 'Grammar & Synthesis', 'Essay & Report Writing'] },
          { name: 'Urdu (Compulsory)', chapters: ['حصہ نثر: تاریخی اور فکری مضامین', 'حصہ نظم: حمد، نعت، قومی نظمیں', 'حصہ غزل: میر، غالب، اقبال', 'گرامر اور ادبی اصطلاحات'] },
          { name: 'Islamic Education (اسلامیات لازمی)', chapters: ['قرآن مجید کا اعجاز اور تعارف', 'توحید و رسالت کا فکری و عملی اثر', 'حقوق اللہ اور حقوق العباد', 'سیرت النبی ﷺ بحیثیت نمونہ حیات'] },
        ],
      },
      {
        name: 'Pre-Engineering',
        subjects: [
          {
            name: 'Mathematics (Class 11 STBB)',
            chapters: [
              'Chapter 1: Complex Numbers (Argand Diagram, De Moivre’s Theorem)',
              'Chapter 2: Matrices and Determinants (Properties, Rank, System of Linear Equations)',
              'Chapter 3: Vectors (Scalar and Vector Triple Products, Geometric Applications)',
              'Chapter 4: Sequences and Series (Arithmetic, Geometric, Harmonic Progressions, Binomial Theorem)',
              'Chapter 5: Permutation, Combination and Probability',
              'Chapter 6: Mathematical Induction and Binomial Expansion',
              'Chapter 7: Trigonometric Functions & Identities',
              'Chapter 8: Graphs of Trigonometric Functions & Inverse Trigonometry',
              'Chapter 9: Solutions of Triangles (Law of Sines, Cosines, Tangents, Real-life Applications)',
            ],
          },
          { name: 'Physics (Class 11 STBB)', chapters: ['Vectors, Motion & Forces', 'Work & Energy', 'Circular Motion', 'Fluid Dynamics', 'Oscillations & Waves', 'Physical Optics', 'Thermodynamics'] },
          { name: 'Chemistry (Class 11 STBB)', chapters: ['Stoichiometry', 'Atomic Structure', 'Chemical Bonding', 'States of Matter', 'Equilibrium & Kinetics', 'Thermochemistry'] },
          { name: 'English (Compulsory)', chapters: ['Prose, Poetry, Essays, Grammar, Comprehension'] },
          { name: 'Urdu (Compulsory)', chapters: ['نثر، نظمیں، غزلیں، قواعد'] },
          { name: 'Islamic Education', chapters: ['ایمانیات، عبادات، سیرتِ طیبہ ﷺ'] },
        ],
      },
      {
        name: 'Computer Science (ICS)',
        subjects: [
          {
            name: 'Computer Science (Class 11 STBB)',
            chapters: [
              'Chapter 1: Basics of Information Technology',
              'Chapter 2: Information Networks (LAN, WAN, Topologies, OSI Model, TCP/IP)',
              'Chapter 3: Data Communications (Transmission Media, Modulation, Signals)',
              'Chapter 4: Applications and Uses of Computers in Business & Science',
              'Chapter 5: Computer Architecture (CPU, Memory, Registers, Buses, Instruction Cycle)',
              'Chapter 6: Security, Copyright and the Law',
              'Chapter 7: Windows Operating System Essentials',
              'Chapter 8: Word Processing and Spreadsheets',
              'Chapter 9: Internet and Email Technologies',
            ],
          },
          { name: 'Mathematics (Class 11 STBB)', chapters: ['Complex Numbers', 'Matrices', 'Sequences & Series', 'Trigonometry', 'Permutation & Probability'] },
          { name: 'Physics or Statistics', chapters: ['Core Physics Chapters or Statistical Distributions, Mean, Standard Deviation'] },
          { name: 'English (Compulsory)', chapters: ['Prose, Poetry, Grammar, Technical Writing'] },
          { name: 'Urdu / Islamiat', chapters: ['لازمی مضامین'] },
        ],
      },
      {
        name: 'Commerce (I.Com Part-I)',
        subjects: [
          {
            name: 'Principles of Accounting',
            chapters: [
              'Introduction to Accounting & Accounting Equation',
              'Recording Transactions: Journal and Ledger',
              'Trial Balance and Rectification of Errors',
              'Bank Reconciliation Statement (BRS)',
              'Bills of Exchange & Promissory Notes',
              'Final Accounts of Sole Proprietorship (Trading & P/L Account, Balance Sheet)',
            ],
          },
          {
            name: 'Principles of Commerce',
            chapters: [
              'Nature & Scope of Commerce and Trade',
              'Sole Proprietorship and Partnership Firms',
              'Joint Stock Company (Formation, Capital, Management)',
              'Channels of Distribution: Wholesalers and Retailers',
              'Advertising, Sales Promotion and Warehousing',
            ],
          },
          {
            name: 'Principles of Economics',
            chapters: [
              'Microeconomics: Demand and Supply Analysis',
              'Elasticity of Demand & Consumer Equilibrium (Utility Analysis)',
              'Laws of Production and Costs',
              'Market Structures: Perfect Competition & Monopoly',
              'National Income Concepts (GDP, GNP, NNP)',
            ],
          },
          {
            name: 'Business Mathematics',
            chapters: ['Ratios, Proportions & Percentages', 'Mathematics of Finance (Simple & Compound Interest)', 'Annuities and Linear Equations', 'Matrix Algebra in Business'],
          },
          { name: 'English / Urdu / Islamiat', chapters: ['Compulsory Subjects'] },
        ],
      },
    ],
    subjects: [
      { name: 'Physics', chapters: ['Vectors & Equilibrium', 'Motion & Force', 'Work & Energy', 'Circular Motion', 'Waves & Optics', 'Thermodynamics'] },
      { name: 'Chemistry', chapters: ['Stoichiometry', 'Atomic Structure', 'Bonding Theories', 'States of Matter', 'Equilibrium', 'Kinetics'] },
      { name: 'Biology', chapters: ['Biological Molecules', 'Cell Biology', 'Enzymes', 'Kingdom Plantae & Animalia', 'Bioenergetics', 'Circulation'] },
      { name: 'Mathematics', chapters: ['Complex Numbers', 'Matrices', 'Sequences & Series', 'Trigonometry', 'Probability'] },
      { name: 'Computer Science', chapters: ['IT Basics', 'Computer Networks', 'Architecture', 'Security & Internet'] },
    ],
  },
  {
    classLevel: '12',
    title: 'Class 12 (HSSC-II / 2nd Year Intermediate)',
    category: 'intermediate',
    streams: [
      {
        name: 'Pre-Medical',
        subjects: [
          {
            name: 'Biology (Class 12 STBB)',
            chapters: [
              'Chapter 14: Respiration and Gas Exchange Mechanisms',
              'Chapter 15: Homeostasis (Excretion, Thermoregulation, Kidneys)',
              'Chapter 16: Support and Locomotion (Muscles, Sliding Filament Theory, Skeletal Disorders)',
              'Chapter 17: Nervous Coordination and Hormonal Control (Brain Anatomy, Endocrine Regulation)',
              'Chapter 18: Reproduction in Animals and Plants',
              'Chapter 19: Growth and Development (Embryonic Stages, Regeneration, Aging)',
              'Chapter 20: Chromosomes and DNA (DNA Replication, Transcription, Translation, Genetic Code)',
              'Chapter 21: Cell Cycle and Cancer (Mechanisms of Oncogenesis)',
              'Chapter 22: Variation and Genetics (Mendelian Genetics, Sex Linkage, Gene Mutations)',
              'Chapter 23: Biotechnology (Recombinant DNA, PCR, Gel Electrophoresis, Gene Therapy)',
              'Chapter 24: Evolution (Darwinism, Natural Selection, Evidence for Evolution)',
              'Chapter 25: Ecosystems & Environmental Conservation',
            ],
          },
          {
            name: 'Chemistry (Class 12 STBB)',
            chapters: [
              'Chapter 13: s and p-Block Elements (Periodicity, Hydrides, Halides, Oxides)',
              'Chapter 14: d and f-Block Elements (Transition Metals, Coordination Compounds, Metallurgy)',
              'Chapter 15: Fundamental Principles of Organic Chemistry (Classification, IUPAC Nomenclature, Isomerism)',
              'Chapter 16: Hydrocarbons (Alkanes, Alkenes, Alkynes, Benzene & Aromaticity, Electrophilic Substitution)',
              'Chapter 17: Alkyl Halides and Organometallic Compounds (SN1, SN2 Mechanisms, Grignard Reagent)',
              'Chapter 18: Alcohols, Phenols and Ethers (Acidity of Phenol, Chemical Tests, Lucas Test)',
              'Chapter 19: Aldehydes and Ketones (Nucleophilic Addition, Cannizzaro Reaction, Aldol Condensation)',
              'Chapter 20: Carboxylic Acids and Functional Derivatives (Esterification, Amides, Acid Halides)',
              'Chapter 21: Macromolecules (Polymers, Plastics, Proteins, Nucleic Acids)',
              'Chapter 22: Environmental Chemistry and Industrial Processes in Pakistan',
            ],
          },
          {
            name: 'Physics (Class 12 STBB)',
            chapters: [
              'Chapter 11: Electrostatics (Gauss’s Law, Electric Potential, Millikan’s Experiment)',
              'Chapter 12: Current Electricity (Kirchhoff’s Laws, Wheatstone Bridge, Potentiometer)',
              'Chapter 13: Electromagnetism (Ampere’s Law, Force on Moving Charge, Lorentz Force, e/m Ratio)',
              'Chapter 14: Electromagnetic Induction (Faraday’s Law, Lenz’s Law, AC Generator, Transformers)',
              'Chapter 15: Alternating Current (AC Circuits: R, L, C Series and Parallel, Resonance)',
              'Chapter 16: Physics of Solids (Mechanical & Electrical Properties, Band Theory, Superconductors)',
              'Chapter 17: Electronics (Semiconductor Diodes, Rectification, Transistors as Amplifiers)',
              'Chapter 18: Dawn of Modern Physics (Photoelectric Effect, Compton Effect, De Broglie Wavelength, Uncertainty Principle)',
              'Chapter 19: Atomic Spectra (Bohr’s Model of Hydrogen, X-rays Production, Lasers)',
              'Chapter 20: Nuclear Physics (Mass Defect, Binding Energy, Radioactivity, Nuclear Radiation Detectors)',
            ],
          },
          { name: 'English (Compulsory)', chapters: ['Twenty Minutes with Mrs. Oakentubb', 'Reflections on the Re-Awakening of the East', 'The Silver Box', 'Grammar, Idioms, Essays'] },
          { name: 'Urdu / Pakistan Studies', chapters: ['مطالعہ پاکستان لازمی اور اردو'] },
        ],
      },
      {
        name: 'Pre-Engineering',
        subjects: [
          {
            name: 'Mathematics (Class 12 STBB)',
            chapters: [
              'Chapter 1: Functions and Limits (Types of Functions, Limits Evaluation, Continuity)',
              'Chapter 2: Differentiation (Rules of Differentiation, Implicit Differentiation, Chain Rule)',
              'Chapter 3: Applications of Derivatives (Tangents & Normals, Maxima & Minima, Rate of Change)',
              'Chapter 4: Integration (Definite & Indefinite Integrals, Integration by Parts, Partial Fractions)',
              'Chapter 5: Applications of Integrals (Area Under Curves, Differential Equations)',
              'Chapter 6: Analytic Geometry - Straight Lines (Distance Formula, Slope, Equations of Lines)',
              'Chapter 7: Conic Sections (Circle, Parabola, Ellipse, Hyperbola Standard Equations)',
              'Chapter 8: Vectors and 3D Geometry (Dot & Cross Product in Geometry)',
            ],
          },
          { name: 'Physics (Class 12 STBB)', chapters: ['Electrostatics', 'Current Electricity', 'Electromagnetism', 'Alternating Current', 'Modern Physics', 'Nuclear Physics'] },
          { name: 'Chemistry (Class 12 STBB)', chapters: ['Inorganic Chemistry (s, p, d Blocks)', 'Organic Chemistry (Hydrocarbons, Alcohols, Aldehydes, Carboxylic Acids)', 'Industrial Chemistry'] },
          { name: 'English & Pak Studies', chapters: ['Compulsory Subjects'] },
        ],
      },
      {
        name: 'Computer Science (ICS)',
        subjects: [
          {
            name: 'Computer Science (Class 12 STBB)',
            chapters: [
              'Section 1: Database Management Systems (DBMS, Relational Model, ER Diagrams, Normalization)',
              'Section 2: Structured Query Language (SQL Queries: SELECT, INSERT, UPDATE, DELETE, JOINS)',
              'Section 3: Introduction to C++ / C Programming (Variables, Constants, Control Flow)',
              'Section 4: Loops and Decision Structures (for, while, do-while, switch)',
              'Section 5: Functions, Arrays, and Strings in C/C++',
              'Section 6: Pointers and File Handling Basics',
            ],
          },
          { name: 'Mathematics (Class 12 STBB)', chapters: ['Functions & Limits', 'Differentiation', 'Integration', 'Analytic Geometry', 'Conic Sections'] },
          { name: 'Physics or Statistics', chapters: ['Core Class 12 Syllabus'] },
          { name: 'English & Pakistan Studies', chapters: ['Compulsory Subjects'] },
        ],
      },
      {
        name: 'Commerce (I.Com Part-II)',
        subjects: [
          {
            name: 'Advanced Accounting',
            chapters: ['Accounting for Incomplete Records (Single Entry)', 'Consignment Accounts', 'Partnership Accounts: Admission, Retirement & Dissolution', 'Joint Stock Company Accounts: Shares, Debentures, Dividends', 'Depreciation Methods'],
          },
          {
            name: 'Commercial Banking',
            chapters: ['Evolution, Definition and Functions of Commercial Banks', 'Types of Bank Accounts and Credit Instruments (Cheques, Bills, Letters of Credit)', 'State Bank of Pakistan (SBP) & Monetary Policy', 'Electronic Banking & Digital Payments in Pakistan'],
          },
          {
            name: 'Business Statistics',
            chapters: ['Data Collection and Frequency Distributions', 'Measures of Central Tendency (Mean, Median, Mode)', 'Measures of Dispersion (Range, Standard Deviation, Variance)', 'Index Numbers and Probability Basics'],
          },
          {
            name: 'Business Economics',
            chapters: ['Macroeconomic Concepts', 'Public Finance and Taxation', 'Inflation, Deflation and Trade Cycles', 'International Trade and Balance of Payments of Pakistan'],
          },
          { name: 'English & Pakistan Studies', chapters: ['Compulsory Subjects'] },
        ],
      },
    ],
    subjects: [
      { name: 'Physics', chapters: ['Electrostatics', 'Current Electricity', 'Electromagnetism', 'AC Circuits', 'Modern Physics', 'Nuclear Physics'] },
      { name: 'Chemistry', chapters: ['Periodic Trends', 'Organic Chemistry Basics', 'Hydrocarbons', 'Alkyl Halides', 'Biochemistry', 'Industrial Chemistry'] },
      { name: 'Biology', chapters: ['Respiration', 'Homeostasis', 'Locomotion', 'Reproduction', 'Genetics & DNA', 'Biotechnology', 'Ecosystems'] },
      { name: 'Mathematics', chapters: ['Functions & Limits', 'Differentiation', 'Integration', 'Conic Sections', 'Analytic Geometry'] },
      { name: 'Computer Science', chapters: ['Database Systems & SQL', 'C/C++ Programming', 'Loops & Decision Structures', 'Functions & Pointers'] },
    ],
  },
];
