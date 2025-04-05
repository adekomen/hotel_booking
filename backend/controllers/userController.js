// Modifier les informations du profil
import User from '../models/user.js'; 
import bcrypt from 'bcrypt';


export const updateUserProfile = async (req, res) => {
    try {
        const { first_name, last_name, phone_number, profile_picture, email, password } = req.body;
        const userId = req.userId; // Id de l'utilisateur authentifié

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const updatedData = {
            first_name,
            last_name,
            phone_number,
            profile_picture,
        };

        // Vérifie si l'email a changé
        if (email && email !== user.email) {
            updatedData.email = email;
        }

        // Vérifie si un nouveau mot de passe a été fourni
        if (password) {
            // Hashage du mot de passe avant de l'enregistrer
            const hashedPassword = bcrypt.hashSync(password, 10); // Assure-toi d'importer bcrypt pour le hashage
            updatedData.password_hash = hashedPassword;
        }

        await user.update(updatedData);

        res.json({ message: 'Profil mis à jour avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

  
  // Supprimer le profil (soft delete)
  export const deleteUserProfile = async (req, res) => {
    try {
      const userId = req.userId; // Id de l'utilisateur authentifié
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      await user.update({ deleted_at: new Date() });
  
      res.json({ message: 'Profil supprimé avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  