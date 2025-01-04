// Mock user database
const users = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123", // In production, this would be hashed
    role: "admin",
    name: "adminLulu",
  },
  {
    id: 2,
    email: "user@example.com",
    password: "user123",
    role: "user",
    name: "regularLulu",
  },
];

export const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

export const validatePassword = (user, password) => {
  return user.password === password; // In production, use proper password hashing
};

export const getUserProfile = (userId) => {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  // Don't send password in response
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
