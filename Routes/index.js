const defPersonsRoutes = require("../Routes/defPersonsRoutes");
const defUsersRoutes = require("../Routes/defUsersRoutes");
const defTenantsRoutes = require("../Routes/defTenantsRoutes");
const defUserCredentialsRoutes = require("../Routes/defUserCredentialsRoutes");
const authentication = require("../Routes/authenticationRoutes");
const messagesRoutes = require("../Routes/messagesRoutes");
const dataSourcesRoutes = require("../Routes/dataSourcesRoutes");
const manageAccessEntitlementsRoutes = require("../Routes/manageAccessEntitlementsRoutes");
const accessPointsEntitlementRoutes = require("../Routes/accessPointsEntitlementRoutes");
const combinedUserRoutes = require("../Routes/combinedUserRoutes");
const manageGlobalConditionsRoutes = require("../Routes/manageGlobalConditionsRoutes");
const manageGlobalConditionsLogicsRoutes = require("../Routes/manageGlobalConditionLogicsRoutes");
const manageGlobalConditionsLogicAttributesRoutes = require("../Routes/manageGlobalConditionLogicAttributesRoutes");
const manageAccessModelsRoutes = require("../Routes/manageAccessModelsRoutes");
const manageAccessModelsAttributesRoutes = require("../Routes/manageAccessModelsAttributesRoutes");
const Router = require("express");

const routes = Router();

routes.use("/persons", defPersonsRoutes);
routes.use("/users", defUsersRoutes);
routes.use("/tenants", defTenantsRoutes);
routes.use("/user-credentials", defUserCredentialsRoutes);
routes.use("/login", authentication);
routes.use("/messages", messagesRoutes);
routes.use("/data-sources", dataSourcesRoutes);
routes.use("/manage-access-entitlements", manageAccessEntitlementsRoutes);
routes.use("/access-points-element", accessPointsEntitlementRoutes);
routes.use("/combined-user", combinedUserRoutes);
routes.use("/manage-global-conditions", manageGlobalConditionsRoutes);
routes.use(
  "/manage-global-condition-logics",
  manageGlobalConditionsLogicsRoutes
);
routes.use(
  "/manage-global-condition-logic-attributes",
  manageGlobalConditionsLogicAttributesRoutes
);
routes.use("/manage-access-models", manageAccessModelsRoutes);
routes.use(
  "/manage-access-model-attributes",
  manageAccessModelsAttributesRoutes
);

module.exports = routes;
