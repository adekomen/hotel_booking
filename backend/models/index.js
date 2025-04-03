import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import { sequelize } from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = _basename(__filename);
const db = {};

readdirSync(__dirname)
  .filter((file) => file.endsWith(".js") && file !== "index.js")
  .forEach(async (file) => {
    const modelModule = await import(join(__dirname, file));
    const model = modelModule.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export { sequelize, Sequelize };
export default db;