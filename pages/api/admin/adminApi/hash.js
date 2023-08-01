import bcrypt from "bcryptjs";

const hash = async (input) => {
  const saltRounds = 10;
  return await bcrypt.hash(input, saltRounds);
};

export default hash;