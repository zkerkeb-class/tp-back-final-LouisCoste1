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
});

//  pokemon est le nom de la collection dans la base de données MongoDB. il y aura une collection nommée "pokemons"
export default mongoose.model("pokemon", pokemonSchema);