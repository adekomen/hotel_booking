require("dotenv").config();
const { User } = require("./models");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    await User.create({
      email: "k.francoisadesu@gmail.com",
      password_hash: await bcrypt.hash("LesaintDeDieu1208", 12),
      first_name: "Franco",
      last_name: "ADESU",
      sexe: "Masculin"
      role: "admin",
    });
    console.log("✅ Compte admin créé avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de la création admin :", error);
  } finally {
    process.exit();
  }
};

createAdmin();
