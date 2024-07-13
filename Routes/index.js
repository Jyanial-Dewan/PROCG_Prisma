// import defPersonsRoutes from "./defPersonsRoutes";
// import defUsersRoutes from "./defUsersRoutes";
// import defTenantsRoutes from "./defTenantsRoutes"
// import defUserCredentialsRoutes from "./defUserCredentialsRoutes";
const defPersonsRoutes = require("../Routes/defPersonsRoutes");
const defUsersRoutes = require("../Routes/defUsersRoutes");
const defTenantsRoutes = require("../Routes/defTenantsRoutes");
const defUserCredentialsRoutes = require("../Routes/defUserCredentialsRoutes");
const authentication = require("../Routes/authenticationRoutes");
const Router = require("express");
// import { Router } from "express";

const routes = Router();

routes.use("/def-persons", defPersonsRoutes);
routes.use("/def-users", defUsersRoutes);
routes.use("/def-tenants", defTenantsRoutes);
routes.use("/def-user-credentials", defUserCredentialsRoutes);
routes.use("/login", authentication);

module.exports = routes;
