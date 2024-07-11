import defPersonsRoutes from "./defPersonsRoutes.js";
import defUsersRoutes from "./defUsersRoutes.js";
import defUserCredentialsRoutes from "./defUserCredentialsRoutes.js";
import { Router } from "express";

const routes = Router();

routes.use("/def-persons", defPersonsRoutes);
routes.use("/def-users", defUsersRoutes);
routes.use("/def-user-credentials", defUserCredentialsRoutes);

export default routes;
