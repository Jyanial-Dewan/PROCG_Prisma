// import defPersonsRoutes from "./defPersonsRoutes";
// import defUsersRoutes from "./defUsersRoutes";
// import defTenantsRoutes from "./defTenantsRoutes"
// import defUserCredentialsRoutes from "./defUserCredentialsRoutes";
const defPersonsRoutes = require("../Routes/defPersonsRoutes");
const defUsersRoutes = require("../Routes/defUsersRoutes");
const defTenantsRoutes = require("../Routes/defTenantsRoutes");
const defUserCredentialsRoutes = require("../Routes/defUserCredentialsRoutes");
const authentication = require("../Routes/authenticationRoutes");
const messagesRoutes = require("../Routes/messagesRoutes");
const dataSourcesRoutes = require("../Routes/dataSourcesRoutes");
const manageAccessEntitlementsRoutes = require("../Routes/manageAccessEntitlementsRoutes");
const accessPointsEntitlementRoutes = require("../Routes/accessPointsEntitlementRoutes");
const Router = require("express");
// import { Router } from "express";

const routes = Router();

routes.use("/persons", defPersonsRoutes);
routes.use("/users", defUsersRoutes);
routes.use("/tenants", defTenantsRoutes);
routes.use("/user-credentials", defUserCredentialsRoutes);
routes.use("/login", authentication);
routes.use("/messages", messagesRoutes);
routes.use("/data-sources", dataSourcesRoutes);
routes.use("/manage-access-entitlements", manageAccessEntitlementsRoutes);
routes.use("/access-points-entitlement", accessPointsEntitlementRoutes);

module.exports = routes;
