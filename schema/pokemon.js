import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        english: { type: String },
        japanese: { type: String },
        chinese: { type: String },
        french: { type: String, required: true },
    },
    type: {
        type: [String],
        required: true,
    },
    base: {
        HP: { type: Number, required: true, min: 0, default: 0 },
        Attack: { type: Number, required: true, min: 0, default: 0 },
        Defense: { type: Number, required: true, min: 0, default: 0 },
        SpecialAttack: { type: Number, required: true, min: 0, default: 0 },
        SpecialDefense: { type: Number, required: true, min: 0, default: 0 },
        Speed: { type: Number, required: true, min: 0, default: 0 },
    },
    image: {
        type: String,
        required: true,
    },
    // Nouveaux champs pour le système de combat
    level: {
        type: Number,
        default: 5,
        min: 1,
        max: 100,
    },
    exp: {
        type: Number,
        default: 0,
        min: 0,
    },
    moves: {
        type: [String],
        default: [],
    },
    shiny: {
        type: Boolean,
        default: false,
    },
    nature: {
        type: String,
        default: 'Hardy',
    },
    wins: {
        type: Number,
        default: 0,
    },
    losses: {
        type: Number,
        default: 0,
    },
});

//  pokemon est le nom de la collection dans la base de données MongoDB. il y aura une collection nommée "pokemons"
export default mongoose.model("pokemon", pokemonSchema);