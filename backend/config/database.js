import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        logging: true,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connexion à la base de données réussie !");
    } catch (error) {
        console.error("Erreur de connexion :", error);
        process.exit(1);
    }
};

export { sequelize, connectDB };