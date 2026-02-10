import express from 'express';
import cors from 'cors';
import pokemon from './schema/pokemon.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { 
  initBattle, 
  executeTurn, 
  aiChooseMove, 
  calculateExpGain, 
  checkEvolution,
  getLevelFromExp,
  calculateMaxHP 
} from './utils/battleSystem.js';
import { defaultMovesByType } from './data/moves.js';

import './connect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors()); 

app.use(express.json());

app.use('/assets', express.static(join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/pokemons', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const pokemons = await pokemon.find({}).sort({ id: 1 }).skip(skip).limit(limit);
    const total = await pokemon.countDocuments();
    
    res.json({
      pokemons,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPokemons: total
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/pokemons/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'Name query parameter is required' });
    }
    
    const poke = await pokemon.findOne({
      $or: [
        { 'name.english': new RegExp(name, 'i') },
        { 'name.french': new RegExp(name, 'i') },
        { 'name.japanese': new RegExp(name, 'i') },
        { 'name.chinese': new RegExp(name, 'i') }
      ]
    });
    
    if (poke) {
      res.json(poke);
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/pokemons/:id', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const poke = await pokemon.findOne({ id: pokeId });
    if (poke) {
      res.json(poke);
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/pokemons', async (req, res) => {
  try {
    console.log('📝 Tentative de création d\'un Pokémon:', JSON.stringify(req.body, null, 2));
    
    const newPokemon = new pokemon(req.body);
    console.log('✅ Pokémon validé, sauvegarde en cours...');
    
    const savedPokemon = await newPokemon.save();
    console.log('🎉 Pokémon créé avec succès! ID:', savedPokemon.id);
    
    res.status(201).json(savedPokemon);
  } catch (error) {
    console.error('❌ Erreur lors de la création du Pokémon:', error.message);
    console.error('Détails de l\'erreur:', error);
    
    if (error.code === 11000) {
      res.status(400).json({ error: 'Pokemon with this ID already exists' });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.put('/pokemons/:id', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const updatedPokemon = await pokemon.findOneAndUpdate(
      { id: pokeId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (updatedPokemon) {
      res.json(updatedPokemon);
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.delete('/pokemons/:id', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const deletedPokemon = await pokemon.findOneAndDelete({ id: pokeId });
    
    if (deletedPokemon) {
      res.json({ message: 'Pokemon deleted successfully', pokemon: deletedPokemon });
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ============= ROUTES DE COMBAT =============

// Initialiser un combat entre deux Pokémon
app.post('/battle/init', async (req, res) => {
  try {
    const { pokemon1Id, pokemon2Id } = req.body;
    
    const poke1 = await pokemon.findOne({ id: pokemon1Id });
    const poke2 = await pokemon.findOne({ id: pokemon2Id });
    
    if (!poke1 || !poke2) {
      return res.status(404).json({ error: 'One or both Pokemon not found' });
    }

    // Assigner des moves par défaut si nécessaire
    if (!poke1.moves || poke1.moves.length === 0) {
      const primaryType = Array.isArray(poke1.type) ? poke1.type[0] : poke1.type;
      poke1.moves = defaultMovesByType[primaryType] || ['tackle', 'scratch', 'hyperBeam', 'tackle'];
    }
    if (!poke2.moves || poke2.moves.length === 0) {
      const primaryType = Array.isArray(poke2.type) ? poke2.type[0] : poke2.type;
      poke2.moves = defaultMovesByType[primaryType] || ['tackle', 'scratch', 'hyperBeam', 'tackle'];
    }

    const battleState = initBattle(poke1.toObject(), poke2.toObject());
    
    res.json(battleState);
  } catch (error) {
    console.error('Battle init error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Exécuter un tour de combat
app.post('/battle/turn', async (req, res) => {
  try {
    const { battleState, move1, move2 } = req.body;
    
    const newState = executeTurn(battleState, move1, move2);
    
    res.json(newState);
  } catch (error) {
    console.error('Battle turn error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Combat contre l'IA
app.post('/battle/ai-turn', async (req, res) => {
  try {
    const { battleState, playerMove } = req.body;
    
    // L'IA choisit son attaque
    const aiMove = aiChooseMove(battleState.pokemon2, battleState.pokemon1);
    
    const newState = executeTurn(battleState, playerMove, aiMove);
    
    res.json({ ...newState, aiMove });
  } catch (error) {
    console.error('AI battle error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Gagner de l'XP et potentiellement monter de niveau
app.post('/pokemon/:id/gain-exp', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const { expGained } = req.body;
    
    const poke = await pokemon.findOne({ id: pokeId });
    if (!poke) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    poke.exp = (poke.exp || 0) + expGained;
    const newLevel = getLevelFromExp(poke.exp);
    const leveledUp = newLevel > poke.level;
    
    if (leveledUp) {
      poke.level = newLevel;
    }

    await poke.save();
    
    res.json({ pokemon: poke, leveledUp, newLevel });
  } catch (error) {
    console.error('Gain exp error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Vérifier si un Pokémon peut évoluer
app.get('/pokemon/:id/can-evolve', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const poke = await pokemon.findOne({ id: pokeId });
    
    if (!poke) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    const evolutionId = checkEvolution(poke.toObject());
    
    if (evolutionId) {
      const evolution = await pokemon.findOne({ id: evolutionId });
      res.json({ canEvolve: true, evolution });
    } else {
      res.json({ canEvolve: false });
    }
  } catch (error) {
    console.error('Check evolution error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Faire évoluer un Pokémon
app.post('/pokemon/:id/evolve', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const poke = await pokemon.findOne({ id: pokeId });
    
    if (!poke) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    const evolutionId = checkEvolution(poke.toObject());
    
    if (!evolutionId) {
      return res.status(400).json({ error: 'Pokemon cannot evolve yet' });
    }

    const evolution = await pokemon.findOne({ id: evolutionId });
    if (!evolution) {
      return res.status(404).json({ error: 'Evolution not found' });
    }

    // Transférer les stats de combat
    evolution.level = poke.level;
    evolution.exp = poke.exp;
    evolution.wins = poke.wins;
    evolution.losses = poke.losses;
    evolution.shiny = poke.shiny;
    
    // Conserver les moves ou en assigner de nouveaux
    if (poke.moves && poke.moves.length > 0) {
      evolution.moves = poke.moves;
    } else {
      const primaryType = Array.isArray(evolution.type) ? evolution.type[0] : evolution.type;
      evolution.moves = defaultMovesByType[primaryType] || ['tackle', 'scratch', 'hyperBeam', 'tackle'];
    }

    await evolution.save();
    await pokemon.findOneAndDelete({ id: pokeId });
    
    res.json({ evolved: true, newPokemon: evolution });
  } catch (error) {
    console.error('Evolution error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Enregistrer un résultat de combat
app.post('/pokemon/:id/battle-result', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const { won } = req.body;
    
    const poke = await pokemon.findOne({ id: pokeId });
    if (!poke) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    if (won) {
      poke.wins = (poke.wins || 0) + 1;
    } else {
      poke.losses = (poke.losses || 0) + 1;
    }

    await poke.save();
    res.json(poke);
  } catch (error) {
    console.error('Battle result error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Créer un Pokémon shiny aléatoire
app.post('/pokemon/:id/make-shiny', async (req, res) => {
  try {
    const pokeId = parseInt(req.params.id, 10);
    const poke = await pokemon.findOne({ id: pokeId });
    
    if (!poke) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    poke.shiny = true;
    await poke.save();
    
    res.json(poke);
  } catch (error) {
    console.error('Make shiny error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Obtenir le leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const topPokemons = await pokemon.find({})
      .sort({ wins: -1, losses: 1 })
      .limit(10);
    
    res.json(topPokemons);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


console.log('Server is set up. Ready to start listening on a port.');

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});