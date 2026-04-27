"""
Lumina Beauty Cosmetic Shade Database
Maps skin tones to cosmetic product shades with undertone information.
Each shade is defined in RGB, with LAB conversion done at runtime for accurate matching.
"""

SHADE_DATABASE = [
    # Fair shades
    {
        "code": "L05",
        "name": "Porcelain",
        "category": "Fair",
        "rgb": (255, 237, 220),
        "hex": "#FFEDDC",
        "undertone": "Neutral",
        "description": "Very fair with neutral undertones"
    },
    {
        "code": "L10",
        "name": "Ivory",
        "category": "Fair",
        "rgb": (252, 227, 205),
        "hex": "#FCE3CD",
        "undertone": "Cool",
        "description": "Fair with cool pink undertones"
    },
    {
        "code": "L15",
        "name": "Shell",
        "category": "Fair",
        "rgb": (248, 222, 196),
        "hex": "#F8DEC4",
        "undertone": "Warm",
        "description": "Fair with warm golden undertones"
    },
    # Light shades
    {
        "code": "L20",
        "name": "Light 01",
        "category": "Light",
        "rgb": (245, 225, 208),
        "hex": "#F5E1D0",
        "undertone": "Cool",
        "description": "Light with cool undertones"
    },
    {
        "code": "L25",
        "name": "Light 02 Neutral",
        "category": "Light",
        "rgb": (238, 214, 193),
        "hex": "#EED6C1",
        "undertone": "Neutral",
        "description": "Light with neutral undertones"
    },
    {
        "code": "L30",
        "name": "Light 03",
        "category": "Light",
        "rgb": (229, 199, 174),
        "hex": "#E5C7AE",
        "undertone": "Warm",
        "description": "Light with warm undertones"
    },
    # Medium shades
    {
        "code": "M10",
        "name": "Medium 01",
        "category": "Medium",
        "rgb": (217, 181, 150),
        "hex": "#D9B596",
        "undertone": "Cool",
        "description": "Medium with cool undertones"
    },
    {
        "code": "M20",
        "name": "Sand",
        "category": "Medium",
        "rgb": (210, 170, 135),
        "hex": "#D2AA87",
        "undertone": "Neutral",
        "description": "Medium with neutral sandy undertones"
    },
    {
        "code": "M25",
        "name": "Medium 02",
        "category": "Medium",
        "rgb": (200, 161, 128),
        "hex": "#C8A180",
        "undertone": "Warm",
        "description": "Medium with warm golden undertones"
    },
    {
        "code": "M30",
        "name": "Honey",
        "category": "Medium",
        "rgb": (192, 152, 115),
        "hex": "#C09873",
        "undertone": "Warm",
        "description": "Medium-warm with honey undertones"
    },
    {
        "code": "M35",
        "name": "Medium 03",
        "category": "Medium",
        "rgb": (182, 141, 106),
        "hex": "#B68D6A",
        "undertone": "Neutral",
        "description": "Medium-tan with neutral undertones"
    },
    # Medium-Deep shades
    {
        "code": "M40",
        "name": "Caramel",
        "category": "Medium-Deep",
        "rgb": (170, 128, 92),
        "hex": "#AA805C",
        "undertone": "Warm",
        "description": "Medium-deep with warm caramel undertones"
    },
    {
        "code": "M45",
        "name": "Toffee",
        "category": "Medium-Deep",
        "rgb": (160, 118, 82),
        "hex": "#A07652",
        "undertone": "Neutral",
        "description": "Medium-deep with rich neutral undertones"
    },
    # Deep shades
    {
        "code": "D10",
        "name": "Deep 01",
        "category": "Deep",
        "rgb": (155, 115, 84),
        "hex": "#9B7354",
        "undertone": "Cool",
        "description": "Deep with cool undertones"
    },
    {
        "code": "D20",
        "name": "Chestnut",
        "category": "Deep",
        "rgb": (140, 100, 68),
        "hex": "#8C6444",
        "undertone": "Warm",
        "description": "Deep with warm chestnut undertones"
    },
    {
        "code": "D30",
        "name": "Deep 02",
        "category": "Deep",
        "rgb": (125, 92, 67),
        "hex": "#7D5C43",
        "undertone": "Neutral",
        "description": "Deep with rich neutral undertones"
    },
    {
        "code": "D40",
        "name": "Espresso",
        "category": "Deep",
        "rgb": (110, 78, 52),
        "hex": "#6E4E34",
        "undertone": "Warm",
        "description": "Very deep with warm espresso undertones"
    },
    {
        "code": "D50",
        "name": "Ebony",
        "category": "Deep",
        "rgb": (90, 62, 40),
        "hex": "#5A3E28",
        "undertone": "Cool",
        "description": "Very deep with cool undertones"
    },
    {
        "code": "D60",
        "name": "Midnight",
        "category": "Deep",
        "rgb": (72, 48, 30),
        "hex": "#48301E",
        "undertone": "Neutral",
        "description": "Deepest with neutral undertones"
    },
]


# Product recommendations based on skin characteristics
PRODUCT_RECOMMENDATIONS = {
    "Fair": [
        {"productType": "Luminous Silk Serum", "reason": "Lightweight formula that enhances your natural fair complexion with a dewy, glass-skin finish."},
        {"productType": "Rose Petal Blush", "reason": "Soft pink tones that complement fair skin beautifully without overwhelming your natural glow."},
        {"productType": "SPF 50 Shield Cream", "reason": "Essential high-protection sunscreen tailored for fair skin's sensitivity to UV exposure."},
    ],
    "Light": [
        {"productType": "Velvet Touch Powder", "reason": "Sets your foundation with a velvety matte finish while maintaining light skin's natural luminosity."},
        {"productType": "Peach Glow Highlighter", "reason": "Warm peach shimmer that adds dimension and catches light perfectly on light skin tones."},
        {"productType": "Hydra-Balance Moisturizer", "reason": "Balanced hydration that prevents shine while keeping your skin nourished and radiant."},
    ],
    "Medium": [
        {"productType": "Radiance Serum Foundation", "reason": "Buildable coverage with a luminous satin finish designed for medium tones' unique warmth."},
        {"productType": "Bronze Goddess Contour", "reason": "Sculpting palette with warm bronze tones that naturally define medium skin complexions."},
        {"productType": "Vitamin C Brightening Elixir", "reason": "Targets uneven tones and dark spots common in medium complexions for a clearer canvas."},
    ],
    "Medium-Deep": [
        {"productType": "Dewy Glow Cushion", "reason": "Rich, hydrating cushion compact that delivers a gorgeous glow on medium-deep skin."},
        {"productType": "Amber Gold Eyeshadow Palette", "reason": "Curated warm metallics and earth tones that pop beautifully against medium-deep complexions."},
        {"productType": "Midnight Dew Cream", "reason": "Deep-nourishing night cream that addresses hyperpigmentation and enhances your natural radiance."},
    ],
    "Deep": [
        {"productType": "Pure Skin Tint", "reason": "Sheer-to-full coverage tint with rich pigments specially calibrated for deep skin tones."},
        {"productType": "Cocoa Butter Lip Balm", "reason": "Deeply moisturizing and subtly tinted to complement and enhance deep skin's natural beauty."},
        {"productType": "Retinol Renewal Serum", "reason": "Clinically formulated to even skin tone while maintaining deep skin's natural melanin-rich glow."},
    ],
}
