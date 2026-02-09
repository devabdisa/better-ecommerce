import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController.js";

const router = Router();

router.route("/").post(createUser);
router.post("/auth", loginUser);

export default router;
