// controllers/favoriteController.js
import Favorite from '../models/favorite.js';

export const getUserFavorites = async (req, res) => {
  try {
    // On suppose que le middleware d'authentification a mis l'ID utilisateur dans req.user.id
    const userId = req.user.id;
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      // Si tu as un modèle Hotel, inclure ses données :
      include: [{ association: 'hotel' }]
    });
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
