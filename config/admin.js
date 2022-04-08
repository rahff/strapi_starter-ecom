module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '5a397a2297b9aa3267c6c0e6f462d1a3'),
  },
});
