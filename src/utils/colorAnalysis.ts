/**
 * Color Analysis Utility
 * Derives personal color season, hairstyle, makeup, and jewelry recommendations
 * from the skin analysis result data.
 */

// ─── Types ───────────────────────────────────────────────────────────

export type Season = "Spring" | "Summer" | "Autumn" | "Winter";
export type SubSeason =
  | "Light Spring" | "Warm Spring" | "Bright Spring"
  | "Light Summer" | "Cool Summer" | "Soft Summer"
  | "Soft Autumn" | "Warm Autumn" | "Deep Autumn"
  | "Deep Winter" | "Cool Winter" | "Bright Winter";

export interface ColorPalette {
  best: string[];
  good: string[];
  avoid: string[];
}

export interface HairstyleRec {
  name: string;
  description: string;
  tier: "best" | "good" | "avoid";
  colorHex: string;
}

export interface MakeupRec {
  area: string;
  shade: string;
  description: string;
  hex: string;
}

export interface MakeupLook {
  name: string;
  description: string;
  tier: "recommended" | "good" | "avoid";
  palette: string[];
}

export interface JewelryRec {
  metal: string;
  description: string;
  tier: "best" | "good" | "avoid";
  hex: string;
}

export interface PersonalColorReport {
  season: Season;
  subSeason: SubSeason;
  seasonDescription: string;
  seasonEmoji: string;
  colorPalette: ColorPalette;
  hairstyles: HairstyleRec[];
  makeupAreas: MakeupRec[];
  makeupLooks: MakeupLook[];
  jewelry: JewelryRec[];
}

// ─── Season Determination ────────────────────────────────────────────

function determineSeason(undertone: string, category: string): { season: Season; subSeason: SubSeason } {
  const cat = category.toLowerCase();
  const ut = undertone.toLowerCase();

  if (ut === "warm") {
    if (cat.includes("fair") || cat.includes("light")) {
      return { season: "Spring", subSeason: "Light Spring" };
    } else if (cat.includes("medium-deep") || cat.includes("deep")) {
      return { season: "Autumn", subSeason: "Deep Autumn" };
    } else {
      return { season: "Autumn", subSeason: "Warm Autumn" };
    }
  } else if (ut === "cool") {
    if (cat.includes("fair") || cat.includes("light")) {
      return { season: "Summer", subSeason: "Light Summer" };
    } else if (cat.includes("medium-deep") || cat.includes("deep")) {
      return { season: "Winter", subSeason: "Deep Winter" };
    } else {
      return { season: "Winter", subSeason: "Cool Winter" };
    }
  } else {
    // Neutral
    if (cat.includes("fair") || cat.includes("light")) {
      return { season: "Summer", subSeason: "Soft Summer" };
    } else if (cat.includes("medium-deep") || cat.includes("deep")) {
      return { season: "Autumn", subSeason: "Soft Autumn" };
    } else {
      return { season: "Autumn", subSeason: "Soft Autumn" };
    }
  }
}

// ─── Season Descriptions ─────────────────────────────────────────────

const SEASON_INFO: Record<SubSeason, { description: string; emoji: string }> = {
  "Light Spring": { description: "Fresh, warm, and luminous. Your natural coloring has a delicate warmth that glows with light, clear colors.", emoji: "🌸" },
  "Warm Spring": { description: "Golden, vibrant, and alive. Your warm complexion radiates with sunny, saturated hues.", emoji: "🌻" },
  "Bright Spring": { description: "Clear, vivid, and energetic. Your coloring is high-contrast with warm clarity.", emoji: "🌷" },
  "Light Summer": { description: "Soft, cool, and ethereal. Your gentle coloring harmonizes with muted, powdery tones.", emoji: "🌿" },
  "Cool Summer": { description: "Elegant, serene, and refined. Your cool undertones pair beautifully with dusty pastels.", emoji: "💎" },
  "Soft Summer": { description: "Muted, balanced, and graceful. Your neutral-cool tones shine with soft, blended colors.", emoji: "🕊️" },
  "Soft Autumn": { description: "Warm, muted, and sophisticated. Your earthy neutrals glow with dusty, organic shades.", emoji: "🍂" },
  "Warm Autumn": { description: "Rich, golden, and grounded. Your deep warmth comes alive with harvest-inspired palettes.", emoji: "🍁" },
  "Deep Autumn": { description: "Intense, warm, and dramatic. Your deep coloring calls for rich, saturated earth tones.", emoji: "🌰" },
  "Deep Winter": { description: "Bold, high-contrast, and powerful. Your deep coloring pairs with vivid, dramatic hues.", emoji: "❄️" },
  "Cool Winter": { description: "Icy, crisp, and striking. Your cool clarity shines with pure, sharp colors.", emoji: "💠" },
  "Bright Winter": { description: "Vibrant, clear, and electrifying. Your high-contrast features pop with bold jewel tones.", emoji: "✨" },
};

// ─── Color Palettes by Season ────────────────────────────────────────

const SEASON_PALETTES: Record<Season, ColorPalette> = {
  Spring: {
    best: ["#F7C59F", "#FECDA6", "#E8A87C", "#D4956B", "#FFD166", "#A8D8B9", "#FFECD2", "#FF9A76", "#FCBF49", "#C9E4CA"],
    good: ["#FFE5D9", "#F9DCC4", "#E4C1A0", "#D4A276", "#FFDAB9", "#B5DECE", "#FFF0DB"],
    avoid: ["#4A4E69", "#22223B", "#2B2D42", "#6D6875", "#3A0CA3", "#7B2CBF", "#C9184A"],
  },
  Summer: {
    best: ["#D4A5A5", "#C9B1BD", "#A3B9C9", "#B8C4CE", "#D5C4D7", "#E8D5D5", "#C4B7CB", "#A8B2BD", "#D1BEC6", "#B7C9D3"],
    good: ["#E6D5D5", "#DFC8D0", "#C9D6DF", "#D7CCD4", "#C6B3BF", "#ADBDCA", "#DCCFE3"],
    avoid: ["#FF6B00", "#FF8500", "#E85D04", "#DC2F02", "#D00000", "#9D0208", "#F4A261"],
  },
  Autumn: {
    best: ["#A67B5B", "#8B6F47", "#C4956A", "#D4A373", "#9C6644", "#B5835A", "#C08552", "#BF9B6E", "#A47551", "#7F5539"],
    good: ["#DDB892", "#E6CCB2", "#B08968", "#7F5539", "#9C6644", "#B5835A", "#C2956B"],
    avoid: ["#FF69B4", "#FF1493", "#C71585", "#DB7093", "#4CC9F0", "#4895EF", "#7209B7"],
  },
  Winter: {
    best: ["#9B2335", "#0F4C75", "#3282B8", "#BBE1FA", "#E8E8E8", "#2C003E", "#512B58", "#900C3F", "#1B1464", "#006E7F"],
    good: ["#C9485B", "#3B5998", "#8B9DC3", "#DFE3EE", "#F0E1E9", "#6B4380", "#B83B5E"],
    avoid: ["#F4A261", "#E9C46A", "#E76F51", "#DDB892", "#D4A373", "#CCD5AE", "#FEFAE0"],
  },
};

// ─── Hairstyle Recommendations ───────────────────────────────────────

function getHairstyleRecommendations(category: string, undertone: string): HairstyleRec[] {
  const cat = category.toLowerCase();
  const ut = undertone.toLowerCase();

  if (cat.includes("fair") || cat.includes("light")) {
    if (ut === "warm") {
      return [
        { name: "Honey Balayage", description: "Warm honey tones with soft layers create a sun-kissed, natural look that enhances your warm undertones", tier: "best", colorHex: "#D4A373" },
        { name: "Soft Caramel Waves", description: "Rich caramel highlights through flowing waves add dimension and warmth to your light complexion", tier: "best", colorHex: "#C08552" },
        { name: "Golden Blonde Layers", description: "Light golden shades complement your warm skin without washing out your features", tier: "good", colorHex: "#E6CCB2" },
        { name: "Ash Blonde Straight", description: "Cool ash tones may clash with your warm undertones and make your complexion look dull", tier: "avoid", colorHex: "#B0A898" },
      ];
    } else if (ut === "cool") {
      return [
        { name: "Ash Brunette Layers", description: "Cool-toned brunette with soft layering harmonizes beautifully with your cool undertones", tier: "best", colorHex: "#8B7D6B" },
        { name: "Platinum Blonde Bob", description: "Icy platinum frames your face and enhances the cool clarity of your complexion", tier: "best", colorHex: "#E8E0D8" },
        { name: "Rose Brown Waves", description: "Subtle rose-tinted brown adds a modern, cool edge that flatters your skin", tier: "good", colorHex: "#A0756D" },
        { name: "Warm Copper Red", description: "Too much warmth in copper shades creates visual dissonance with your cool-toned skin", tier: "avoid", colorHex: "#B8652A" },
      ];
    } else {
      return [
        { name: "Natural Brunette Layers", description: "Soft, natural brown with feathered layers brings out your balanced complexion beautifully", tier: "best", colorHex: "#9C8B7A" },
        { name: "Soft Ombré Waves", description: "Gradual lightening from roots to tips creates a versatile, universally flattering look", tier: "best", colorHex: "#BFA891" },
        { name: "Light Auburn Highlights", description: "Subtle warmth through auburn adds interest without overwhelming your neutral base", tier: "good", colorHex: "#A0664D" },
        { name: "Jet Black Straight", description: "Too dark and stark; may create harsh contrast against your lighter neutral complexion", tier: "avoid", colorHex: "#2C2C2C" },
      ];
    }
  } else if (cat.includes("deep")) {
    if (ut === "warm") {
      return [
        { name: "Rich Espresso Curls", description: "Deep, warm espresso tones enhance your natural depth with luxurious dimension", tier: "best", colorHex: "#3E2723" },
        { name: "Warm Auburn Layers", description: "Red-warm undertones in auburn complement your golden-deep complexion perfectly", tier: "best", colorHex: "#6D3521" },
        { name: "Dark Chestnut Waves", description: "Warm chestnut adds subtle richness while keeping harmony with your skin tone", tier: "good", colorHex: "#5C3A2E" },
        { name: "Platinum or Ashy Blonde", description: "Too cool and light; creates an unnatural mismatch with your warm, deep complexion", tier: "avoid", colorHex: "#C4B8A8" },
      ];
    } else {
      return [
        { name: "Blue-Black Sleek", description: "Cool blue-black sheen enhances the cool depth of your complexion with stunning clarity", tier: "best", colorHex: "#1A1A2E" },
        { name: "Dark Cherry Highlights", description: "Subtle cherry accents add cool-toned dimension and visual interest", tier: "best", colorHex: "#5C1A2E" },
        { name: "Deep Mahogany Waves", description: "Neutral-deep mahogany works well as a versatile, rich option", tier: "good", colorHex: "#4A2530" },
        { name: "Golden Blonde Highlights", description: "Too warm and light; creates stark contrast that looks artificial against your deep tones", tier: "avoid", colorHex: "#C5A36E" },
      ];
    }
  } else {
    // Medium / Medium-Deep
    if (ut === "warm") {
      return [
        { name: "Warm Chestnut Layers", description: "Rich chestnut with warm undertones enhances your golden complexion with natural elegance", tier: "best", colorHex: "#7B4B2A" },
        { name: "Caramel Balayage", description: "Sun-kissed caramel through your lengths adds a beautiful, warm-toned dimension", tier: "best", colorHex: "#B8763E" },
        { name: "Dark Honey Waves", description: "Deep honey-gold creates warmth and movement that flatters your skin beautifully", tier: "good", colorHex: "#9C7A42" },
        { name: "Cool Silver Highlights", description: "Silvery tones clash with your warm base and may make your complexion look sallow", tier: "avoid", colorHex: "#A8A8A8" },
      ];
    } else if (ut === "cool") {
      return [
        { name: "Dark Chocolate Straight", description: "Cool-leaning dark chocolate harmonizes with your undertones for a polished, refined look", tier: "best", colorHex: "#4A3728" },
        { name: "Plum Brown Highlights", description: "Cool plum accents add subtle sophistication and enhance your cool-toned complexion", tier: "best", colorHex: "#5E3548" },
        { name: "Espresso Bob", description: "Clean espresso with cool undertones creates a chic, structured look for your tone", tier: "good", colorHex: "#3E2D26" },
        { name: "Warm Golden Highlights", description: "Too warm; golden tones may appear brassy and unflattering against your cool skin", tier: "avoid", colorHex: "#C5A255" },
      ];
    } else {
      return [
        { name: "Soft Brunette Waves", description: "Natural, neutral brunette with gentle waves — universally flattering and effortlessly chic", tier: "best", colorHex: "#6B5344" },
        { name: "Mushroom Brown Layers", description: "This cool-neutral shade is on-trend and beautifully complements balanced complexions", tier: "best", colorHex: "#8B7D6B" },
        { name: "Light Mocha Highlights", description: "Subtle mocha dimension adds movement without disrupting your neutral harmony", tier: "good", colorHex: "#9E8672" },
        { name: "Bright Fiery Red", description: "Too saturated and warm; may overpower your neutral, balanced complexion", tier: "avoid", colorHex: "#C0392B" },
      ];
    }
  }
}

// ─── Makeup Recommendations ──────────────────────────────────────────

function getMakeupAreas(season: Season, _undertone: string): MakeupRec[] {
  const palettes: Record<Season, MakeupRec[]> = {
    Spring: [
      { area: "Brows", shade: "Soft Taupe", description: "Natural arch with warm taupe fill", hex: "#A0877C" },
      { area: "Eyes", shade: "Warm Peach", description: "Peachy shimmer with golden lid accent", hex: "#E8A87C" },
      { area: "Cheeks", shade: "Coral Flush", description: "Fresh coral that mimics a natural blush", hex: "#E88D72" },
      { area: "Lips", shade: "Warm Nude", description: "MLBB nude with warm pink undertone", hex: "#C48B7A" },
    ],
    Summer: [
      { area: "Brows", shade: "Ash Brown", description: "Soft, cool-toned brow with natural shape", hex: "#8B7E74" },
      { area: "Eyes", shade: "Mauve Tone", description: "Dusty mauve with subtle shimmer", hex: "#B5838D" },
      { area: "Cheeks", shade: "Rose Pink", description: "Soft rose that enhances cool-toned skin", hex: "#D4A5A5" },
      { area: "Lips", shade: "Berry Rose", description: "Muted berry that complements cool undertones", hex: "#B56576" },
    ],
    Autumn: [
      { area: "Brows", shade: "Warm Brown", description: "Rich warm brown with soft arch", hex: "#7B5B3A" },
      { area: "Eyes", shade: "Bronze Shimmer", description: "Earthy bronze with copper highlights", hex: "#B07D4B" },
      { area: "Cheeks", shade: "Terracotta Glow", description: "Warm terracotta for a sun-warmed flush", hex: "#C07C54" },
      { area: "Lips", shade: "Warm Rosy Nude", description: "Muted rosy brown with warm undertones", hex: "#B5726A" },
    ],
    Winter: [
      { area: "Brows", shade: "Dark Espresso", description: "Clean, defined brows in deep espresso", hex: "#3E2723" },
      { area: "Eyes", shade: "Smoky Plum", description: "Deep plum with cool shimmer", hex: "#5C3A58" },
      { area: "Cheeks", shade: "Cool Berry", description: "Vivid berry flush for high-contrast drama", hex: "#9B2335" },
      { area: "Lips", shade: "True Red", description: "Classic blue-red that pops on cool/deep skin", hex: "#C0392B" },
    ],
  };

  return palettes[season] || palettes.Autumn;
}

function getMakeupLooks(season: Season): MakeupLook[] {
  const looks: Record<Season, MakeupLook[]> = {
    Spring: [
      { name: "Fresh & Dewy", description: "Clean, luminous look for everyday warmth", tier: "recommended", palette: ["#E8A87C", "#F7C59F", "#C48B7A", "#D4A373", "#FECDA6"] },
      { name: "Peach Glow", description: "Sun-kissed peach for a youthful glow", tier: "good", palette: ["#F5B895", "#E8A87C", "#D99A7E", "#C78E6D", "#E6C5A8"] },
      { name: "Cool Berry", description: "Too cool and muted for your warm coloring", tier: "avoid", palette: ["#B56576", "#9B2335", "#6D4C6E", "#8B687F", "#A07590"] },
    ],
    Summer: [
      { name: "Soft Rosé", description: "Muted, romantic tones for effortless elegance", tier: "recommended", palette: ["#D4A5A5", "#C9B1BD", "#B5838D", "#D1BEC6", "#E8D5D5"] },
      { name: "Lavender Dream", description: "Cool, ethereal palette for special occasions", tier: "good", palette: ["#C4B7CB", "#D5C4D7", "#B8A9C2", "#D1C6D8", "#E0D6E6"] },
      { name: "Warm Bronze", description: "Too warm and saturated for your cool tones", tier: "avoid", palette: ["#B07D4B", "#D4A373", "#C08552", "#A67B5B", "#9C6644"] },
    ],
    Autumn: [
      { name: "Natural & Warm", description: "Earthy, organic tones for daily elegance", tier: "recommended", palette: ["#A67B5B", "#C4956A", "#B5835A", "#D4A373", "#9C6644"] },
      { name: "Rustic Bronze", description: "Rich bronze-copper for warm, golden glow", tier: "good", palette: ["#B8763E", "#C08552", "#A0714E", "#BF9B6E", "#8B6F47"] },
      { name: "Icy Pastel", description: "Too cool and washed-out for your warm depth", tier: "avoid", palette: ["#C9D6DF", "#D4A5A5", "#B8C4CE", "#E0D6E6", "#C4B7CB"] },
    ],
    Winter: [
      { name: "Bold & Defined", description: "High-contrast drama for striking impact", tier: "recommended", palette: ["#9B2335", "#0F4C75", "#2C003E", "#900C3F", "#1B1464"] },
      { name: "Jewel Tones", description: "Vivid emerald, sapphire, and ruby accents", tier: "good", palette: ["#006E7F", "#512B58", "#900C3F", "#3282B8", "#6B4380"] },
      { name: "Earthy Muted", description: "Too dull and warm for your crisp coloring", tier: "avoid", palette: ["#D4A373", "#C4956A", "#B08968", "#DDB892", "#CCD5AE"] },
    ],
  };

  return looks[season] || looks.Autumn;
}

// ─── Jewelry Recommendations ─────────────────────────────────────────

function getJewelryRecommendations(undertone: string): JewelryRec[] {
  const ut = undertone.toLowerCase();

  if (ut === "warm") {
    return [
      { metal: "Gold", description: "Warm gold beautifully enhances your natural golden undertones and creates a harmonious glow", tier: "best", hex: "#D4A853" },
      { metal: "Rose Gold", description: "A warm-pink metal that softly complements your skin with a romantic, feminine touch", tier: "good", hex: "#B76E79" },
      { metal: "Silver", description: "Cool-toned silver may clash with your warm complexion and diminish your natural warmth", tier: "avoid", hex: "#C0C0C0" },
    ];
  } else if (ut === "cool") {
    return [
      { metal: "Silver", description: "Cool sterling silver perfectly mirrors your undertones for a sleek, polished look", tier: "best", hex: "#C0C0C0" },
      { metal: "White Gold", description: "Understated cool elegance that enhances your natural skin clarity", tier: "good", hex: "#E8E8E8" },
      { metal: "Yellow Gold", description: "Too warm for your cool complexion — may create visual dissonance", tier: "avoid", hex: "#D4A853" },
    ];
  } else {
    return [
      { metal: "Rose Gold", description: "The perfect neutral metal — adds warmth while staying balanced with your skin", tier: "best", hex: "#B76E79" },
      { metal: "Gold", description: "Classic gold works beautifully with your versatile, balanced complexion", tier: "good", hex: "#D4A853" },
      { metal: "Heavy Oxidized Silver", description: "Very dark, heavy metals can overpower your neutral harmony", tier: "avoid", hex: "#6B6B6B" },
    ];
  }
}

// ─── Main Export ──────────────────────────────────────────────────────

export function generatePersonalColorReport(
  undertone: string,
  category: string
): PersonalColorReport {
  const { season, subSeason } = determineSeason(undertone, category);
  const info = SEASON_INFO[subSeason];
  const palette = SEASON_PALETTES[season];

  return {
    season,
    subSeason,
    seasonDescription: info.description,
    seasonEmoji: info.emoji,
    colorPalette: palette,
    hairstyles: getHairstyleRecommendations(category, undertone),
    makeupAreas: getMakeupAreas(season, undertone),
    makeupLooks: getMakeupLooks(season),
    jewelry: getJewelryRecommendations(undertone),
  };
}
