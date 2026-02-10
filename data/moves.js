// Database des attaques Pokémon avec puissance, type, précision
export const moves = {
  // Attaques Feu
  flamethrower: { name: 'Flamethrower', type: 'Fire', power: 90, accuracy: 100, pp: 15, category: 'special' },
  fireBlast: { name: 'Fire Blast', type: 'Fire', power: 110, accuracy: 85, pp: 5, category: 'special' },
  ember: { name: 'Ember', type: 'Fire', power: 40, accuracy: 100, pp: 25, category: 'special' },
  
  // Attaques Eau
  waterGun: { name: 'Water Gun', type: 'Water', power: 40, accuracy: 100, pp: 25, category: 'special' },
  hydroPump: { name: 'Hydro Pump', type: 'Water', power: 110, accuracy: 80, pp: 5, category: 'special' },
  surf: { name: 'Surf', type: 'Water', power: 90, accuracy: 100, pp: 15, category: 'special' },
  
  // Attaques Plante
  vineWhip: { name: 'Vine Whip', type: 'Grass', power: 45, accuracy: 100, pp: 25, category: 'physical' },
  razorLeaf: { name: 'Razor Leaf', type: 'Grass', power: 55, accuracy: 95, pp: 25, category: 'physical' },
  solarBeam: { name: 'Solar Beam', type: 'Grass', power: 120, accuracy: 100, pp: 10, category: 'special' },
  
  // Attaques Électrique
  thunderShock: { name: 'Thunder Shock', type: 'Electric', power: 40, accuracy: 100, pp: 30, category: 'special' },
  thunderbolt: { name: 'Thunderbolt', type: 'Electric', power: 90, accuracy: 100, pp: 15, category: 'special' },
  thunder: { name: 'Thunder', type: 'Electric', power: 110, accuracy: 70, pp: 10, category: 'special' },
  
  // Attaques Psy
  confusion: { name: 'Confusion', type: 'Psychic', power: 50, accuracy: 100, pp: 25, category: 'special' },
  psychic: { name: 'Psychic', type: 'Psychic', power: 90, accuracy: 100, pp: 10, category: 'special' },
  
  // Attaques Normal
  tackle: { name: 'Tackle', type: 'Normal', power: 40, accuracy: 100, pp: 35, category: 'physical' },
  scratch: { name: 'Scratch', type: 'Normal', power: 40, accuracy: 100, pp: 35, category: 'physical' },
  hyperBeam: { name: 'Hyper Beam', type: 'Normal', power: 150, accuracy: 90, pp: 5, category: 'special' },
  
  // Attaques Dragon
  dragonClaw: { name: 'Dragon Claw', type: 'Dragon', power: 80, accuracy: 100, pp: 15, category: 'physical' },
  dragonBreath: { name: 'Dragon Breath', type: 'Dragon', power: 60, accuracy: 100, pp: 20, category: 'special' },
  
  // Attaques Combat
  karateChop: { name: 'Karate Chop', type: 'Fighting', power: 50, accuracy: 100, pp: 25, category: 'physical' },
  
  // Attaques Glace
  iceBeam: { name: 'Ice Beam', type: 'Ice', power: 90, accuracy: 100, pp: 10, category: 'special' },
  blizzard: { name: 'Blizzard', type: 'Ice', power: 110, accuracy: 70, pp: 5, category: 'special' },
  
  // Attaques Poison
  sludgeBomb: { name: 'Sludge Bomb', type: 'Poison', power: 90, accuracy: 100, pp: 10, category: 'special' },
  poisonSting: { name: 'Poison Sting', type: 'Poison', power: 15, accuracy: 100, pp: 35, category: 'physical' },
  
  // Attaques Roche
  rockThrow: { name: 'Rock Throw', type: 'Rock', power: 50, accuracy: 90, pp: 15, category: 'physical' },
  rockSlide: { name: 'Rock Slide', type: 'Rock', power: 75, accuracy: 90, pp: 10, category: 'physical' },
  
  // Attaques Vol
  peck: { name: 'Peck', type: 'Flying', power: 35, accuracy: 100, pp: 35, category: 'physical' },
  aerialAce: { name: 'Aerial Ace', type: 'Flying', power: 60, accuracy: 999, pp: 20, category: 'physical' },
  
  // Attaques Spectre
  shadowBall: { name: 'Shadow Ball', type: 'Ghost', power: 80, accuracy: 100, pp: 15, category: 'special' },
  
  // Attaques Ténèbres
  bite: { name: 'Bite', type: 'Dark', power: 60, accuracy: 100, pp: 25, category: 'physical' },
  
  // Attaques Acier
  ironTail: { name: 'Iron Tail', type: 'Steel', power: 100, accuracy: 75, pp: 15, category: 'physical' },
  
  // Attaques Fée
  dazzlingGleam: { name: 'Dazzling Gleam', type: 'Fairy', power: 80, accuracy: 100, pp: 10, category: 'special' },
};

// Tableau des efficacités de type
export const typeChart = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
};

// Attaques par défaut selon le type du Pokémon
export const defaultMovesByType = {
  Fire: ['ember', 'scratch', 'flamethrower', 'fireBlast'],
  Water: ['waterGun', 'tackle', 'surf', 'hydroPump'],
  Grass: ['vineWhip', 'tackle', 'razorLeaf', 'solarBeam'],
  Electric: ['thunderShock', 'tackle', 'thunderbolt', 'thunder'],
  Psychic: ['confusion', 'tackle', 'psychic', 'shadowBall'],
  Normal: ['tackle', 'scratch', 'bite', 'hyperBeam'],
  Dragon: ['scratch', 'dragonBreath', 'dragonClaw', 'hyperBeam'],
  Fighting: ['karateChop', 'tackle', 'rockSlide', 'hyperBeam'],
  Ice: ['tackle', 'iceBeam', 'blizzard', 'waterGun'],
  Poison: ['poisonSting', 'tackle', 'sludgeBomb', 'bite'],
  Rock: ['rockThrow', 'tackle', 'rockSlide', 'earthquake'],
  Flying: ['peck', 'aerialAce', 'tackle', 'hyperBeam'],
  Ghost: ['shadowBall', 'confusion', 'bite', 'psychic'],
  Dark: ['bite', 'scratch', 'shadowBall', 'hyperBeam'],
  Steel: ['ironTail', 'tackle', 'rockSlide', 'hyperBeam'],
  Fairy: ['dazzlingGleam', 'tackle', 'psychic', 'hyperBeam'],
  Bug: ['tackle', 'bite', 'aerialAce', 'shadowBall'],
  Ground: ['tackle', 'rockThrow', 'rockSlide', 'earthquake'],
};
