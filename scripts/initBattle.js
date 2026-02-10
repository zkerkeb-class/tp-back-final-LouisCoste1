import pokemon from '../schema/pokemon.js';
import { defaultMovesByType } from '../data/moves.js';
import '../connect.js';

// Script pour initialiser les Pokémon avec des moves et des niveaux aléatoires

async function initializePokemonBattle() {
  try {
    console.log('🔄 Initialisation du système de combat...');

    // Récupérer tous les Pokémon
    const allPokemon = await pokemon.find({});
    console.log(`📊 ${allPokemon.length} Pokémon trouvés`);

    let updated = 0;

    for (const poke of allPokemon) {
      let hasChanges = false;

      // Assigner un niveau aléatoire si pas de niveau
      if (!poke.level || poke.level === 0) {
        poke.level = Math.floor(Math.random() * 50) + 5; // Level entre 5 et 55
        hasChanges = true;
      }

      // Assigner des moves si pas de moves
      if (!poke.moves || poke.moves.length === 0) {
        const primaryType = Array.isArray(poke.type) ? poke.type[0] : poke.type;
        poke.moves = defaultMovesByType[primaryType] || ['tackle', 'scratch', 'hyperBeam', 'tackle'];
        hasChanges = true;
      }

      // Initialiser les stats de combat
      if (poke.wins === undefined) {
        poke.wins = 0;
        hasChanges = true;
      }
      if (poke.losses === undefined) {
        poke.losses = 0;
        hasChanges = true;
      }

      // Initialiser XP basé sur le level
      if (!poke.exp || poke.exp === 0) {
        poke.exp = Math.pow(poke.level, 3) * 10;
        hasChanges = true;
      }

      // 5% de chance d'être shiny
      if (poke.shiny === undefined) {
        poke.shiny = Math.random() < 0.05;
        hasChanges = true;
      }

      if (hasChanges) {
        await poke.save();
        updated++;
      }
    }

    console.log(`✅ ${updated} Pokémon mis à jour avec le système de combat !`);
    console.log('🎮 Le système de combat est prêt !');
    
    // Afficher quelques exemples
    const samples = await pokemon.find({}).limit(5);
    console.log('\n📝 Exemples de Pokémon initialisés :');
    samples.forEach(p => {
      console.log(`   - ${p.name.french} (Niv. ${p.level}) ${p.shiny ? '✨' : ''}`);
      console.log(`     Types: ${p.type.join(', ')}`);
      console.log(`     Moves: ${p.moves.join(', ')}`);
      console.log(`     Stats: ${p.wins}W / ${p.losses}L`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initializePokemonBattle();
