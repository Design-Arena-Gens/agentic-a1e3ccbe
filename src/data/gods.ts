export type DeityMotif =
  | "lotus"
  | "chakra"
  | "mandala"
  | "river"
  | "mountain"
  | "flame"
  | "sunburst"
  | "conch";

export interface HinduDeity {
  id: string;
  name: string;
  epithet: string;
  mantra: string[];
  qualities: string[];
  description: string;
  palettes: [string, string, string][];
  motifs: DeityMotif[];
}

export const HINDU_DEITIES: HinduDeity[] = [
  {
    id: "ganesha",
    name: "Ganesha",
    epithet: "Remover of Obstacles",
    mantra: ["ॐ गं गणपतये नमः", "Om Gam Ganapataye Namaha"],
    qualities: ["Wisdom", "New Beginnings", "Prosperity"],
    description:
      "Ganesha, the elephant-headed deity, guides seekers through challenges with gentle intellect and benevolent strength.",
    palettes: [
      ["#FF7133", "#FFD166", "#29D9C2"],
      ["#F25F5C", "#FFE066", "#247BA0"],
      ["#EF476F", "#FFD166", "#118AB2"],
    ],
    motifs: ["lotus", "mandala", "sunburst"],
  },
  {
    id: "lakshmi",
    name: "Lakshmi",
    epithet: "Goddess of Abundance",
    mantra: ["ॐ श्रीं महालक्ष्म्यै नमः", "Om Shreem Mahalakshmyai Namaha"],
    qualities: ["Wealth", "Harmony", "Grace"],
    description:
      "Lakshmi embodies radiant prosperity, showering blessings of beauty, gratitude, and flourishing life.",
    palettes: [
      ["#F72585", "#B5179E", "#7209B7"],
      ["#C77DFF", "#E0AAFF", "#FF7AA2"],
      ["#FF9E00", "#FF5400", "#FF6D00"],
    ],
    motifs: ["lotus", "river", "sunburst"],
  },
  {
    id: "saraswati",
    name: "Saraswati",
    epithet: "Muse of Knowledge",
    mantra: ["ॐ ऐं सरस्वत्यै नमः", "Om Aim Saraswatyai Namaha"],
    qualities: ["Creativity", "Wisdom", "Learning"],
    description:
      "Saraswati inspires the arts and sciences with her serene flow of knowledge and eloquence.",
    palettes: [
      ["#4895EF", "#4CC9F0", "#A9DEF9"],
      ["#4361EE", "#4895EF", "#06D6A0"],
      ["#3A86FF", "#8338EC", "#FFBE0B"],
    ],
    motifs: ["river", "mandala", "lotus"],
  },
  {
    id: "shiva",
    name: "Shiva",
    epithet: "Lord of Transformation",
    mantra: ["ॐ नमः शिवाय", "Om Namah Shivaya"],
    qualities: ["Meditation", "Renewal", "Cosmic Balance"],
    description:
      "Shiva dances through creation and dissolution, illuminating stillness in the heart of change.",
    palettes: [
      ["#0B4F6C", "#145374", "#5588A3"],
      ["#1B262C", "#0F4C75", "#3282B8"],
      ["#0B132B", "#1C2541", "#3A506B"],
    ],
    motifs: ["mountain", "flame", "mandala"],
  },
  {
    id: "krishna",
    name: "Krishna",
    epithet: "Divine Enchanter",
    mantra: ["ॐ नमो भगवते वासुदेवाय", "Om Namo Bhagavate Vasudevaya"],
    qualities: ["Compassion", "Joy", "Playfulness"],
    description:
      "Krishna plays the cosmic flute, reminding beings of love, devotion, and playful wisdom.",
    palettes: [
      ["#14248A", "#2C6EAD", "#F4A261"],
      ["#264653", "#2A9D8F", "#E76F51"],
      ["#023047", "#219EBC", "#8ECAE6"],
    ],
    motifs: ["river", "sunburst", "chakra"],
  },
  {
    id: "durga",
    name: "Durga",
    epithet: "Warrior Mother",
    mantra: [
      "या देवी सर्वभूतेषु शक्ति रूपेण संस्थिता",
      "Ya Devi Sarvabhuteshu Shakti Rupena Samsthita",
    ],
    qualities: ["Courage", "Protection", "Strength"],
    description:
      "Durga rides the lion heart, embodying fierce compassion and the triumph of dharma.",
    palettes: [
      ["#780116", "#F24333", "#F77D34"],
      ["#D00000", "#FFBA08", "#3F88C5"],
      ["#720026", "#CE4257", "#FF7F51"],
    ],
    motifs: ["flame", "sunburst", "mandala"],
  },
  {
    id: "hanuman",
    name: "Hanuman",
    epithet: "Devotee of Devotion",
    mantra: ["ॐ हनुमते नमः", "Om Hanumate Namaha"],
    qualities: ["Service", "Strength", "Loyalty"],
    description:
      "Hanuman leaps across doubt with unwavering devotion and a heart ablaze with faith.",
    palettes: [
      ["#F07167", "#FED9B7", "#00AFB9"],
      ["#E76F51", "#2A9D8F", "#264653"],
      ["#FF7F11", "#FFB997", "#086375"],
    ],
    motifs: ["mountain", "sunburst", "conch"],
  },
  {
    id: "kali",
    name: "Kali",
    epithet: "Liberator of Time",
    mantra: ["ॐ क्रीं कालीकायै नमः", "Om Krim Kalikayai Namaha"],
    qualities: ["Liberation", "Fearlessness", "Transformation"],
    description:
      "Kali dissolves illusion with fierce grace, granting freedom through surrendered trust.",
    palettes: [
      ["#240046", "#3C096C", "#5A189A"],
      ["#1B0033", "#5B1865", "#FF6B6B"],
      ["#1A1A2E", "#16213E", "#0F3460"],
    ],
    motifs: ["flame", "mandala", "sunburst"],
  },
  {
    id: "rama",
    name: "Rama",
    epithet: "Prince of Dharma",
    mantra: ["श्री राम जय राम जय जय राम", "Shri Ram Jai Ram Jai Jai Ram"],
    qualities: ["Honor", "Devotion", "Steadfastness"],
    description:
      "Rama's bow draws the arc of righteousness, guiding seekers to live with integrity.",
    palettes: [
      ["#1864AB", "#1C7ED6", "#74C0FC"],
      ["#126782", "#1A9CA8", "#19C5D8"],
      ["#15616D", "#FFECD1", "#FF7D00"],
    ],
    motifs: ["mountain", "river", "chakra"],
  },
  {
    id: "parvati",
    name: "Parvati",
    epithet: "Mother of Mountains",
    mantra: ["ॐ पार्वत्यै नमः", "Om Parvatyai Namaha"],
    qualities: ["Compassion", "Strength", "Fertility"],
    description:
      "Parvati uplifts the world with steadfast love, balancing fierce resolve and gentle nurture.",
    palettes: [
      ["#8E9AAF", "#CBC0D3", "#FEEAFA"],
      ["#FFB4A2", "#E5989B", "#B5838D"],
      ["#FF8FA3", "#FFB3C1", "#FFCCD5"],
    ],
    motifs: ["mountain", "lotus", "mandala"],
  },
  {
    id: "vishnu",
    name: "Vishnu",
    epithet: "Preserver of Worlds",
    mantra: ["ॐ नमो नारायणाय", "Om Namo Narayanaya"],
    qualities: ["Equilibrium", "Compassion", "Protection"],
    description:
      "Vishnu sustains the cosmic order, reclining upon the serpent of infinity with serene guardianship.",
    palettes: [
      ["#023E8A", "#0077B6", "#90E0EF"],
      ["#1B4965", "#62B6CB", "#CAE9FF"],
      ["#0C7489", "#13505B", "#F6AE2D"],
    ],
    motifs: ["chakra", "conch", "river"],
  },
  {
    id: "kartikeya",
    name: "Kartikeya",
    epithet: "Commander of Devas",
    mantra: ["ॐ सरवनभवाय नमः", "Om Saravanabhavaya Namaha"],
    qualities: ["Valor", "Strategy", "Youthful Energy"],
    description:
      "Kartikeya rides the peacock of brilliance, leading the cosmic forces with youthful courage.",
    palettes: [
      ["#2D6A4F", "#52B788", "#B7E4C7"],
      ["#1B4332", "#40916C", "#74C69D"],
      ["#1D3557", "#457B9D", "#A8DADC"],
    ],
    motifs: ["mountain", "sunburst", "chakra"],
  },
];
