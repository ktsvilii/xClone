import mongoose from 'mongoose';

const connect = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected ${connection.host}`);
  } catch (error) {
    console.log(`Error connection to database: ${error.message}`);
    process.exit(1);
  }
};

export default connect;
