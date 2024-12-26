const Router = require("express");
const defPersonsController = require("../Controller/defPersonsController");
// upload profile image middleware
const upload = require("../Middleware/multerUpload");
const router = Router();

// Routes
router.get("/", defPersonsController.defPersons);
router.get("/p", defPersonsController.perPagePersons);
router.get("/:id", defPersonsController.uniqueDefPerson);
router.post("/", defPersonsController.createDerPerson);
router.delete("/:id", defPersonsController.deleteDefPerson);
router.put(
  "/:id",
  upload.single("profileImage"), // Middleware for file upload
  defPersonsController.updateDefPerson
);

module.exports = router;
