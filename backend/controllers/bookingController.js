// Récupérer l'historique des réservations
import Booking from '../models/booking.js';
export const getUserBookings = async (req, res) => {
    try {
      const userId = req.userId;
      const bookings = await Booking.findAll({
        where: { user_id: userId },
        include: [{
          model: Hotel,
          as: 'hotel'
        }]
      });
  
      res.json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  