import express from 'express';
import cors from 'cors';
import pokemon from './schema/pokemon.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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


console.log('Server is set up. Ready to start listening on a port.');

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});