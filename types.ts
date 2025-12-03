

export interface DesignParams {
  text: string;
  sport: string;
  colors: string;
  style: string;
  mode: '2D' | '3D';
  referenceImage?: string; // Base64 string of the uploaded image
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  params: DesignParams;
  createdAt: number;
  prompt?: string;
}

export enum SportStyle {
  // CLASSIC & VINTAGE
  VINTAGE = '1. Vintage Collegiate',
  RETRO_JERSEY = '2. 70s Retro Jersey',
  VARSITY_SCRIPT = '3. Classic Varsity Script',
  HERITAGE_CREST = '4. Heritage Crest',
  OLD_SCHOOL_TATTOO = '5. Old School Tattoo',
  LETTERMAN = '6. Letterman Jacket Patch',
  VICTORIAN_SPORT = '7. Victorian Athletic',
  DISTRESSED_STAMP = '8. Distressed Rubber Stamp',
  BEER_LABEL = '9. Vintage Beer Label',
  TRADITIONAL_PENNANT = '10. Felt Pennant Style',
  BASEBALL_CARD = '11. Vintage Trading Card',
  ART_DECO = '12. 1920s Art Deco',
  MID_CENTURY = '13. 50s Mid-Century Modern',
  PROHIBITION = '14. Prohibition Era Whiskey Label',
  UNION_MADE = '15. Union Made Label Badge',
  NEWSPAPER_HEADLINE = '16. Vintage Newspaper Headline',
  
  // ERAS & DECADES
  EIGHTIES_SYNTH = '17. 80s Synthwave & Neon',
  NINETIES_GRUNGE = '18. 90s Grunge & Flannel',
  Y2K_AESTHETIC = '19. Y2K Chrome & Blobs',
  DISCO_FUNK = '20. 70s Disco Funk',
  SPACE_AGE = '21. 60s Space Age Atomic',
  WILD_WEST = '22. Wild West Saloon',
  ROARING_TWENTIES = '23. Roaring 20s Gatsby',
  PSYCHEDELIC_60S = '24. 60s Psychedelic Rock',
  
  // MODERN & TECH
  MODERN = '25. Modern Athletic',
  MINIMAL = '26. Minimalist Tech',
  ESPORTS = '27. Futuristic Esports',
  CLEAN_CORPORATE = '28. Clean Corporate Identity',
  GLITCH = '29. Digital Glitch Art',
  CYBERPUNK = '30. Cyberpunk HUD',
  WIREFRAME = '31. 3D Wireframe',
  CIRCUIT_BOARD = '32. Electronic Circuit',
  QUANTUM = '33. Quantum Physics Abstract',
  GEOMETRIC = '34. Sacred Geometry',
  HOLOGRAM = '35. Holographic Projection',
  AUGMENTED_REALITY = '36. AR Interface Overlay',
  QR_CODE = '37. Digital Data Pattern',
  APP_ICON = '38. Glossy App Icon',
  FLAT_UI = '39. Flat UI Design',
  
  // AGGRESSIVE & BOLD
  AGGRESSIVE = '40. Aggressive Mascot',
  BOLD_SLAB = '41. Heavy Bold Slab',
  BLOCK_SHADOW = '42. Heavy Block Shadow',
  GRITTY_TEXTURE = '43. Gritty Grunge Texture',
  SHATTERED = '44. Shattered Glass',
  TRASH_POLKA = '45. Trash Polka',
  METAL_BAND = '46. Death Metal Band Logo',
  WARNING_SIGN = '47. Industrial Warning',
  URBAN_DECAY = '48. Urban Decay',
  HAZARD_STRIPES = '49. Caution Hazard Stripes',
  MILITARY_STENCIL = '50. Military Stencil Ops',
  BIOMECHANICAL = '51. Biomechanical Giger Style',
  TOXIC_WASTE = '52. Toxic Waste Barrel',
  BARBED_WIRE = '53. Barbed Wire & Chain',
  
  // ARTISTIC & ILLUSTRATIVE
  GRAFFITI = '54. Street Graffiti',
  HAND_LETTERED = '55. Hand Lettered Script',
  SKETCH = '56. Pencil Sketch',
  COMIC_BOOK = '57. Comic Book Action',
  POP_ART = '58. Pop Art halftone',
  STIPPLE = '59. Stipple Shading',
  WATERCOLOR = '60. Watercolor Splash',
  INK_BLOT = '61. Rorschach Ink Blot',
  ORIGAMI = '62. Paper Folded Origami',
  LOW_POLY = '63. Low Poly 3D',
  VOXEL_ART = '64. Voxel Block Art',
  UQIYO_E = '65. Japanese Woodblock Print',
  NOIR_FILM = '66. Film Noir High Contrast',
  OIL_PAINTING = '67. Thick Impasto Oil Paint',
  DREAM_HASE = '68. Dreamy Haze',
  BLUEPRINT = '69. Technical Blueprint',
  MOSAIC = '70. Tile Mosaic',
  STAINED_GLASS = '71. Cathedral Stained Glass',
  ENGRAVING = '72. Engraving Style',
  DOTWORK = '73. Dotwork',
  
  // MATERIAL & TEXTURE
  STITCHED = '74. Embroidered Patch Effect',
  METALLIC = '75. Brushed Metal',
  ICE_CHROME = '76. Ice Chrome 3D',
  FROSTED = '77. Frosted Ice Effect',
  CHALKBOARD = '78. Coach Chalkboard',
  NEON_GLOW = '79. Neon Cyberpunk',
  WOOD_CARVED = '80. Wood Carved',
  STONE_CHISELED = '81. Stone Chiseled',
  DENIM = '82. Denim Texture',
  CARBON_FIBER = '83. Carbon Fiber',
  GOLD_FOIL = '84. Gold Foil Stamp',
  LEATHER = '85. Embossed Leather',
  CHAINMAIL = '86. Medieval Chainmail',
  MARBLE = '87. Italian Marble',
  DIAMOND = '88. Diamond Encrusted',
  RUSTED_METAL = '89. Rusted Corroded Metal',
  DAMASCUS_STEEL = '90. Damascus Steel Pattern',
  VELVET = '91. Crushed Velvet Texture',
  KNITTED = '92. Knitted Winter Sweater',
  CARDBOARD = '93. Corrugated Cardboard',
  DUCT_TAPE = '94. Duct Tape DIY',
  
  // NATURE & ELEMENTAL
  FIRE_FLAME = '95. Engulfed in Flames',
  LIGHTNING = '96. Electric Lightning Storm',
  OCEAN_WAVE = '97. Crashing Ocean Waves',
  FOREST_MOSS = '98. Overgrown Forest Moss',
  ROCK_LAVA = '99. Molten Lava Rock',
  SLIME_OOZE = '100. Toxic Slime Ooze',
  SMOKE_VAPOR = '101. Ethereal Smoke Vapor',
  CRYSTAL_SHARD = '102. Jagged Crystal Shards',
  SANDSTORM = '103. Desert Sandstorm',
  TROPICAL = '104. Tropical Palm Leaves',
  COSMIC_NEBULA = '105. Cosmic Space Nebula',
  
  // HOCKEY SPECIFIC
  RINK_ICE = '106. Scratched Rink Ice',
  PUCK_RUBBER = '107. Vulcanized Rubber',
  GOAL_NET = '108. Goal Net Texture',
  ZAMBONI_TRAIL = '109. Zamboni Ice Trail',
  WINTER_CLASSIC = '110. Winter Classic Felt',
  LOCKER_ROOM = '111. Locker Room Steel Mesh',
  TAPE_JOB = '112. Hockey Stick Tape Job',
  CHAMPIONSHIP_RING = '113. Championship Ring Bling',
  SCOREBOARD = '114. Vintage Dot Matrix Scoreboard',
  PENALTY_BOX = '115. Penalty Box Glass Reflections',
  FROZEN_POND = '116. Cracked Frozen Pond Natural',
  GOALIE_MASK = '117. Airbrushed Goalie Mask Art',
  HOCKEY_CARD = '118. 90s Hockey Card Hologram',
}

export const PRESET_SPORTS = [
  'Hockey'
];