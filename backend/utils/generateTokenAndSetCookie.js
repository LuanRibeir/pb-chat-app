import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Make the cookie inaccessible by the browser
    maxAge: 30 * 24 * 60 * 60 * 1000, //  Calculate the number of milliseconds in 30 days
    sameSite: "strict", // CSRF (Cross-Site Request Forgery)
  });

  return token;
};
