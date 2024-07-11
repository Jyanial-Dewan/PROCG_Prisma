import { Router } from "express";
import { defTenantsController } from "../Controller/defTenanantsController.js";

const router = Router();

router.get('/', defTenantsController.defTenants);
router.get('/:id', defTenantsController.uniqueDefTenant);
router.post('/', defTenantsController.createDefTenant);
router.delete('/:id',defTenantsController.deleteDefTenant);
router.put('/:id', defTenantsController.updateDefTenant);

export default router;