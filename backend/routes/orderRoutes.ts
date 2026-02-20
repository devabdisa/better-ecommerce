import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import {
  initializeChapaPayment,
  verifyChapaPayment,
  chapaCallback,
  chapaWebhook,
} from "../controllers/chapaController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// ── Chapa payment routes (order matters — place before /:id) ──
// Webhook: No auth required (Chapa calls this directly, verified via signature)
router.route("/chapa/webhook").post(chapaWebhook);

// Callback: No auth required (Chapa redirects here with query params)
router.route("/chapa/callback").get(chapaCallback);

// ── Order CRUD routes ──
router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calculateTotalSalesByDate);

// ── Order-specific routes ──
router.route("/:id").get(authenticate, findOrderById);

// Chapa payment: Initialize payment for an order
router.route("/:id/pay/chapa").post(authenticate, initializeChapaPayment);

// Chapa payment: Verify payment status after user returns from checkout
router.route("/:id/verify-payment").get(authenticate, verifyChapaPayment);

// Legacy/Admin: Manually mark as paid (kept for admin use)
router.route("/:id/pay").put(authenticate, authorizeAdmin, markOrderAsPaid);

// Delivery
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;
