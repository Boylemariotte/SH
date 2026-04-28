import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Verificar que MONGO_URI esté definida
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in environment variables');
      console.log('Available environment variables:', Object.keys(process.env));
      throw new Error('MONGO_URI environment variable is required');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Error details:', error);
    
    // No hacer exit en producción para permitir que Render detecte el problema
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode - will retry connection...');
      // Reintentar conexión después de 5 segundos
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;
