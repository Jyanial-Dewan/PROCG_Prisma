import defPersonsRoutes from "./defPersonsRoutes.js";
import { Router } from "express";

const routes = Router();

routes.use('/def-persons', defPersonsRoutes);

export default routes;