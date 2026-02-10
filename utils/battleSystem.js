import { moves, typeChart } from '../data/moves.js';

// Calcul des dégâts selon la formule Pokémon officielle
export function calculateDamage(attacker, defender, move) {
  const moveData = moves[move];
  if (!moveData) return 0;

  // Vérifier la précision
  const hitChance = Math.random() * 100;
  if (hitChance > moveData.accuracy) {
    return { damage: 0, critical: false, effectiveness: 1, missed: true };
  }

  // Stats de base
  const level = attacker.level || 50;
  const attack = moveData.category === 'physical' ? attacker.base.Attack : attacker.base.SpecialAttack;
  const defense = moveData.category === 'physical' ? defender.base.Defense : defender.base.SpecialDefense;
  const power = moveData.power;

  // Formule de base avec réduction pour éviter les one-shots
  let damage = ((((2 * level) / 5) + 2) * power * (attack / defense)) / 50 + 2;
  
  // Réduction globale pour rendre le combat plus long et stratégique
  damage *= 0.4; // Les combats durent maintenant ~3-5 tours au lieu de 1-2

  // STAB (Same Type Attack Bonus)
  const attackerTypes = Array.isArray(attacker.type) ? attacker.type : [attacker.type];
  if (attackerTypes.includes(moveData.type)) {
    damage *= 1.5;
  }

  // Efficacité de type
  let effectiveness = 1;
  const defenderTypes = Array.isArray(defender.type) ? defender.type : [defender.type];
  
  defenderTypes.forEach(defType => {
    if (typeChart[moveData.type] && typeChart[moveData.type][defType] !== undefined) {
      effectiveness *= typeChart[moveData.type][defType];
    }
  });

  damage *= effectiveness;

  // Coup critique (6.25% de chance)
  const critical = Math.random() < 0.0625;
  if (critical) {
    damage *= 1.5;
  }

  // Variation aléatoire (85-100%)
  const randomFactor = (Math.random() * 0.15) + 0.85;
  damage *= randomFactor;

  return {
    damage: Math.floor(damage),
    critical,
    effectiveness,
    missed: false,
    moveType: moveData.type,
    moveName: moveData.name,
  };
}

// Calculer l'XP gagnée après un combat
export function calculateExpGain(defeatedPokemon, isWild = true) {
  const baseExp = 100;
  const level = defeatedPokemon.level || 50;
  const multiplier = isWild ? 1 : 1.5; // Plus d'XP contre des dresseurs
  
  return Math.floor(baseExp * level * multiplier / 7);
}

// Vérifier si un Pokémon peut évoluer
export function checkEvolution(pokemon) {
  const evolutions = {
    1: { id: 2, level: 16 },    // Bulbasaur -> Ivysaur
    2: { id: 3, level: 32 },    // Ivysaur -> Venusaur
    4: { id: 5, level: 16 },    // Charmander -> Charmeleon
    5: { id: 6, level: 36 },    // Charmeleon -> Charizard
    7: { id: 8, level: 16 },    // Squirtle -> Wartortle
    8: { id: 9, level: 36 },    // Wartortle -> Blastoise
    25: { id: 26, level: 22 },  // Pikachu -> Raichu
    133: { id: 134, level: 16 }, // Eevee -> Vaporeon (simplifié)
  };

  const evo = evolutions[pokemon.id];
  if (evo && pokemon.level >= evo.level) {
    return evo.id;
  }
  return null;
}

// Calculer le niveau basé sur l'XP
export function getLevelFromExp(exp) {
  // Formule simplifiée : level = racine cubique(exp/10) + 1
  return Math.floor(Math.pow(exp / 10, 1/3)) + 1;
}

// Calculer l'XP nécessaire pour le prochain niveau
export function getExpForNextLevel(level) {
  return Math.floor(Math.pow(level, 3) * 10);
}

// Générer une IA pour le combat (choix de l'attaque)
export function aiChooseMove(aiPokemon, playerPokemon) {
  const availableMoves = aiPokemon.moves || [];
  
  if (availableMoves.length === 0) {
    return 'tackle';
  }

  // IA basique : choisir l'attaque la plus efficace
  let bestMove = availableMoves[0];
  let bestScore = 0;

  availableMoves.forEach(moveKey => {
    const moveData = moves[moveKey];
    if (!moveData) return;

    let score = moveData.power || 0;

    // Bonus si super efficace
    const playerTypes = Array.isArray(playerPokemon.type) ? playerPokemon.type : [playerPokemon.type];
    playerTypes.forEach(defType => {
      if (typeChart[moveData.type] && typeChart[moveData.type][defType]) {
        score *= typeChart[moveData.type][defType];
      }
    });

    // STAB bonus
    const aiTypes = Array.isArray(aiPokemon.type) ? aiPokemon.type : [aiPokemon.type];
    if (aiTypes.includes(moveData.type)) {
      score *= 1.2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMove = moveKey;
    }
  });

  return bestMove;
}

// Créer un état de combat initial
export function initBattle(pokemon1, pokemon2) {
  const maxHP1 = calculateMaxHP(pokemon1);
  const maxHP2 = calculateMaxHP(pokemon2);

  return {
    pokemon1: {
      ...pokemon1,
      currentHP: maxHP1,
      maxHP: maxHP1,
      level: pokemon1.level || 50,
      exp: pokemon1.exp || 0,
    },
    pokemon2: {
      ...pokemon2,
      currentHP: maxHP2,
      maxHP: maxHP2,
      level: pokemon2.level || 50,
      exp: pokemon2.exp || 0,
    },
    turn: 1,
    log: [],
    winner: null,
  };
}

// Calculer les HP max d'un Pokémon - augmentés pour des combats plus longs
export function calculateMaxHP(pokemon) {
  const base = pokemon.base.HP;
  const level = pokemon.level || 50;
  // Multiplier par 2 pour avoir des HP plus conséquents
  return Math.floor((((2 * base * level) / 100) + level + 10) * 2);
}

// Exécuter un tour de combat
export function executeTurn(battleState, move1, move2) {
  const { pokemon1, pokemon2 } = battleState;
  const newLog = [...battleState.log];

  // Déterminer qui attaque en premier (basé sur Speed)
  const p1Speed = pokemon1.base.Speed;
  const p2Speed = pokemon2.base.Speed;
  
  let first, second, firstMove, secondMove;
  if (p1Speed >= p2Speed) {
    first = pokemon1;
    second = pokemon2;
    firstMove = move1;
    secondMove = move2;
  } else {
    first = pokemon2;
    second = pokemon1;
    firstMove = move2;
    secondMove = move1;
  }

  // Première attaque
  const result1 = calculateDamage(first, second, firstMove);
  second.currentHP = Math.max(0, second.currentHP - result1.damage);
  
  newLog.push({
    attacker: first.name.french,
    move: result1.moveName,
    damage: result1.damage,
    critical: result1.critical,
    effectiveness: result1.effectiveness,
    missed: result1.missed,
    targetHP: second.currentHP,
  });

  // Si le second Pokémon est KO, le combat est terminé
  if (second.currentHP === 0) {
    return {
      ...battleState,
      pokemon1,
      pokemon2,
      log: newLog,
      winner: first === pokemon1 ? 1 : 2,
      turn: battleState.turn + 1,
    };
  }

  // Deuxième attaque
  const result2 = calculateDamage(second, first, secondMove);
  first.currentHP = Math.max(0, first.currentHP - result2.damage);
  
  newLog.push({
    attacker: second.name.french,
    move: result2.moveName,
    damage: result2.damage,
    critical: result2.critical,
    effectiveness: result2.effectiveness,
    missed: result2.missed,
    targetHP: first.currentHP,
  });

  // Vérifier le gagnant
  let winner = null;
  if (first.currentHP === 0) {
    winner = second === pokemon1 ? 1 : 2;
  }

  return {
    ...battleState,
    pokemon1,
    pokemon2,
    log: newLog,
    winner,
    turn: battleState.turn + 1,
  };
}
