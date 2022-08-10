module.exports = {
  mongo_host: process.env.MONGO_HOST || "mongos.env.svc.reputation.test",
  mongo_port: process.env.MONGO_PORT || "27017",
  mongo_options: {
    auth: { authSource: "admin" },
    useNewUrlParser: true,
    socketTimeoutMS: 0,
    user: process.env.E2E_MONGO_USERNAME || "engineering",
    pass:
      process.env.E2E_MONGO_PASSWORD || "Chartreuse Verdigris Veridian Emerald",
  },
};
