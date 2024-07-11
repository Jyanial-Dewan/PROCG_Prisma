import defPersonsRoutes from "./defPersonsRoutes.js";
import defUsersRoutes from "./defUsersRoutes.js";
import { Router } from "express";

const routes = Router();

routes.use("/def-persons", defPersonsRoutes);
routes.use("/def-users", defUsersRoutes);

export default routes;
