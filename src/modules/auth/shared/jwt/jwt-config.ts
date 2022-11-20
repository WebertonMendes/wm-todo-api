export const jwtConfig = {
  secret: `${process.env.JWT_SECRET}`,
  expires: '3600s', // 1h
};
