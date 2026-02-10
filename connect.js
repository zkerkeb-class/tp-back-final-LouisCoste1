import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/pokemon-database');
        console.log('✅ Connected to MongoDB successfully.');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        console.error('💡 Assurez-vous que MongoDB est en cours d\'exécution sur localhost:27017');
        process.exit(1);
    }
};

// Gestion des événements de connexion
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

connectDB();