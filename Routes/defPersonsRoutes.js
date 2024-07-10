import { Router } from "express";
import { defPersonsController } from "../Controller/defPersonsController.js";

const router = Router();

router.get('/', defPersonsController.defPersons);
router.get('/:id', defPersonsController.uniqueDefPerson);
router.post('/', defPersonsController.createDerPerson);
router.delete('/:id', defPersonsController.deleteDefPerson);
router.put('/:id', defPersonsController.updateDefPerson);

export default router;