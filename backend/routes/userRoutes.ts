import { Router } from "express";
import { createUser, loginUser, logoutCurrentUser } from "../controllers/userController.js";

const router = Router();

router.route("/").post(createUser);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

export default router;
