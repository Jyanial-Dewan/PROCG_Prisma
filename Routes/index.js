const Router = require("express");
const cookieParser = require("cookie-parser");
const verifyUser = require("../Middleware/verifyUser");

const routes = Router();

// routes
const defPersonsRoutes = require("../Routes/defPersonsRoutes");
const defUsersRoutes = require("../Routes/defUsersRoutes");
const defTenantsRoutes = require("../Routes/defTenantsRoutes");
const defUserCredentialsRoutes = require("../Routes/defUserCredentialsRoutes");
const authentication = require("../Routes/authenticationRoutes");
const messagesRoutes = require("../Routes/messagesRoutes");
const dataSourcesRoutes = require("../Routes/dataSourcesRoutes");
const manageAccessEntitlementsRoutes = require("../Routes/manageAccessEntitlementsRoutes");
const accessEntitlementElementsRoutes = require("../Routes/accessEntitlementElementsRoutes");
const accessPointsEntitlementsRoutes = require("../Routes/accessPointsEntitlementsRoutes");
const combinedUserRoutes = require("../Routes/combinedUserRoutes");
const manageGlobalConditionsRoutes = require("../Routes/manageGlobalConditionsRoutes");
const manageGlobalConditionsLogicsRoutes = require("../Routes/manageGlobalConditionLogicsRoutes");
const manageGlobalConditionsLogicAttributesRoutes = require("../Routes/manageGlobalConditionLogicAttributesRoutes");
const manageAccessModelsRoutes = require("../Routes/manageAccessModelsRoutes");
const manageAccessModelLogicsRoutes = require("../Routes/manageAccessModelLogicsRoutes");
const manageAccessModelLogicAttributesRoutes = require("./manageAccessModelLogicAttributesRoutes");
const controlesRoutes = require("./controlsRoutes");

routes.use(cookieParser());
routes.use("/login", authentication);
routes.use("/logout", authentication);
routes.use(verifyUser);
routes.use("/auth", authentication);
routes.use("/persons", defPersonsRoutes);
routes.use("/users", defUsersRoutes);
routes.use("/tenants", defTenantsRoutes);
routes.use("/user-credentials", defUserCredentialsRoutes);
routes.use("/login", authentication);
routes.use("/messages", messagesRoutes);
routes.use("/data-sources", dataSourcesRoutes);
routes.use("/manage-access-entitlements", manageAccessEntitlementsRoutes);
routes.use("/access-entitlement-elements", accessEntitlementElementsRoutes);
routes.use("/access-points-element", accessPointsEntitlementsRoutes);
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
routes.use("/manage-access-model-logics", manageAccessModelLogicsRoutes);
routes.use(
  "/manage-access-model-logic-attributes",
  manageAccessModelLogicAttributesRoutes
);
routes.use("/controls", controlesRoutes);

module.exports = routes;
