import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto_super_seguro_por_defecto', {
    expiresIn: '30d',
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'Usuario o email ya registrados' });
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        stats: user.stats,
        preferences: user.preferences,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' });
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email y seleccionar password (+password porque está en select: false)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Actualizar último login
      user.lastLogin = new Date();
      await user.save();
      
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        stats: user.stats,
        preferences: user.preferences,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  // req.user vendrá del middleware de autenticación (que implementaremos si es necesario)
  // Por ahora asumimos que el middleware agrega req.user
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      stats: user.stats,
      preferences: user.preferences,
      recentQuizzes: user.recentQuizzes,
      recentPointsHistory: user.recentPointsHistory,
      studyGuides: user.studyGuides
    });
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};

