require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const adminRouter = require("./routes/admin.routes");
const userRouter = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/', adminRouter);
app.use('/', userRouter);


const PORT = process.env.PORT || 5000;

/* Teste de la connexion à la database et demarrage du server */
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie.');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Échec de connexion à la base de données :', err);
  });