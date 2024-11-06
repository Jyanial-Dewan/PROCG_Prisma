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
const Router = require("express");

const routes = Router();

routes.use("/api/v2/persons", defPersonsRoutes);
routes.use("/api/v2/users", defUsersRoutes);
routes.use("/api/v2/tenants", defTenantsRoutes);
routes.use("/api/v2/user-credentials", defUserCredentialsRoutes);
routes.use("/api/v2/login", authentication);
routes.use("/api/v2/messages", messagesRoutes);
routes.use("/api/v2/data-sources", dataSourcesRoutes);
routes.use(
  "/api/v2/manage-access-entitlements",
  manageAccessEntitlementsRoutes
);
routes.use(
  "/api/v2/access-entitlement-elements",
  accessEntitlementElementsRoutes
);
routes.use("/api/v2/access-points-element", accessPointsEntitlementsRoutes);
routes.use("/api/v2/combined-user", combinedUserRoutes);
routes.use("/api/v2/manage-global-conditions", manageGlobalConditionsRoutes);
routes.use(
  "/api/v2/manage-global-condition-logics",
  manageGlobalConditionsLogicsRoutes
);
routes.use(
  "/api/v2/manage-global-condition-logic-attributes",
  manageGlobalConditionsLogicAttributesRoutes
);
routes.use("/api/v2/manage-access-models", manageAccessModelsRoutes);
routes.use("/api/v2/manage-access-model-logics", manageAccessModelLogicsRoutes);
routes.use(
  "/api/v2/manage-access-model-logic-attributes",
  manageAccessModelLogicAttributesRoutes
);
routes.use("/api/v2/controls", controlesRoutes);

module.exports = routes;
