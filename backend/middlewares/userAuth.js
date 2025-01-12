import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: 'Invalid token',
        success: false,
      });
    }

    req._id = decode.userID;
    next();
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
};

export default authUser;
