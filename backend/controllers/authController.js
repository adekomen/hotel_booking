import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  User  from '../models/user.js';
import nodemailer from 'nodemailer';

// Inscription
export const registerUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone_number, profile_picture } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      phone_number,
      profile_picture,
    });

    const sendVerificationEmail = (email, token) => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
      
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Vérification de votre email',
          html: `<a href="http://localhost:5000/api/auth/verify/${token}">Cliquez ici pour vérifier votre email</a>`,
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email envoyé: ' + info.response);
          }
        });
      };

    // Générer un token JWT
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Utilisateur créé avec succès', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Connexion
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Connexion réussie', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
