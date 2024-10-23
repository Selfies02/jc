import pkg from 'bcryptjs';
const {
  genSalt,
  hash,
  compare
} = pkg;
const SALT_ROUNDS = 10;
export async function hashPassword(password) {
  try {
    const salt = await genSalt(SALT_ROUNDS);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error encriptando la contraseña');
  }
}
export async function comparePassword(password, hashedPassword) {
  try {
    const match = await compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Error comparando las contraseñas');
  }
}