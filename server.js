require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const logger = require("./app/utils/logger");
const initRolesAndPermissions = require("./app/seed/initRolesAndPermissions");
const initUsers = require("./app/seed/initUsers");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./app/config/swaggerConfig");
const verifyToken = require("./app/middlewares/authJwt").verifyToken;

const app = express();
app.use(cors());
app.use(express.json());
app.use(require("helmet")());

// Public routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
require("./app/routes/auth.routes")(app);

// Protected route groups
app.use("/api/users", verifyToken, require("./app/routes/user.routes"));
app.use("/api/admin", verifyToken, require("./app/routes/admin.routes"));
app.use("/api/files", verifyToken, require("./app/routes/file.routes"));

const PORT = process.env.PORT || 8080;

db.sequelize.sync({ alter: true }).then(async () => {
  console.log("✅ Database synced");
  const roleInstances = await initRolesAndPermissions();
  await initUsers(roleInstances);
  // Start your server
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
});
