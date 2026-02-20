import { Request, Response } from "express";
import crypto from "crypto";
import Order from "../models/orderModel.js";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const CHAPA_BASE_URL = "https://api.chapa.co/v1";

/**
 * Helper: Generate a secure, unique transaction reference.
 * Format: EP-<orderId>-<randomHex>-<timestamp>
 * "EP" = Ethio Panda prefix for easy identification in Chapa dashboard.
 */
function generateTxRef(orderId: string): string {
  // Keep under 50 chars: EP-{8 chars}-{8 hex}-{13 digits} = ~33 chars
  const shortId = orderId.slice(-8);
  const randomPart = crypto.randomBytes(4).toString("hex");
  const timestamp = Date.now();
  return `EP-${shortId}-${randomPart}-${timestamp}`;
}

/**
 * Helper: Get Chapa secret key with validation.
 */
function getChapaSecretKey(): string {
  const key = process.env.CHAPA_SECRET_KEY;
  if (!key) {
    throw new Error(
      "CHAPA_SECRET_KEY is not configured in environment variables",
    );
  }
  return key;
}

// ─────────────────────────────────────────────────────────────
// POST /api/orders/:id/pay/chapa
// Initialize a Chapa payment for an existing order.
// ─────────────────────────────────────────────────────────────
const initializeChapaPayment = async (req: Request, res: Response) => {
  try {
    const secretKey = getChapaSecretKey();
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email",
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Security: Ensure the requesting user owns this order
    const orderUserId = (order.user as any)._id
      ? (order.user as any)._id.toString()
      : order.user.toString();
    if (orderUserId !== (req as any).user._id.toString()) {
      res.status(403).json({ message: "Not authorized to pay for this order" });
      return;
    }

    // Idempotency: If order is already paid, reject
    if (order.isPaid) {
      res.status(400).json({ message: "Order is already paid" });
      return;
    }

    // Always generate a fresh tx_ref for each payment attempt.
    // Chapa permanently reserves tx_refs after the first API call,
    // even if the user never completes the payment.
    let txRef = generateTxRef(order._id.toString());
    order.chapaTxRef = txRef;
    await order.save();

    // Extract user info — the populated user object
    const user = order.user as any;

    // Helper: build payload and call Chapa API
    const callChapaInit = async (ref: string) => {
      const payload = {
        amount: order.totalPrice.toString(),
        currency: "ETB",
        email: user.email || "",
        first_name: user.username || "Customer",
        last_name: "",
        tx_ref: ref,
        callback_url: `${req.protocol}://${req.get("host")}/api/orders/chapa/callback`,
        return_url:
          req.body.return_url ||
          `${req.protocol}://${req.get("host")}/order/${order._id}`,
        customization: {
          title: "Ethio Panda",
          description: `Order ${order._id}`,
        },
        meta: {
          order_id: order._id.toString(),
        },
      };

      const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return { response, payload };
    };

    // Call Chapa Initialize API
    let { response, payload } = await callChapaInit(txRef);
    let data = await response.json();

    // If tx_ref collision (rare edge case), generate a new one and retry once
    if (
      data.status === "failed" &&
      typeof data.message === "string" &&
      data.message.toLowerCase().includes("reference has been used")
    ) {
      txRef = generateTxRef(order._id.toString());
      order.chapaTxRef = txRef;
      await order.save();

      const retry = await callChapaInit(txRef);
      response = retry.response;
      payload = retry.payload;
      data = await response.json();
    }

    if (data.status === "success") {
      res.json({
        message: "Payment initialized successfully",
        checkout_url: data.data.checkout_url,
        tx_ref: txRef,
      });
    } else {
      // Log the full Chapa error for debugging
      console.error("Chapa API rejected initialization:");
      console.error("  HTTP Status:", response.status);
      console.error("  Response:", JSON.stringify(data, null, 2));
      console.error("  Payload sent:", JSON.stringify(payload, null, 2));
      res.status(400).json({
        message: data.message || "Failed to initialize payment",
        error: data.data || data,
      });
    }
  } catch (error: any) {
    console.error("Chapa initialization error:", error.message);
    res
      .status(500)
      .json({ message: "Payment initialization failed", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/orders/:id/verify-payment
// Verify payment status with Chapa after user returns from checkout.
// ─────────────────────────────────────────────────────────────
const verifyChapaPayment = async (req: Request, res: Response) => {
  try {
    const secretKey = getChapaSecretKey();
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Security: Ensure the requesting user owns this order
    if (order.user.toString() !== (req as any).user._id.toString()) {
      res.status(403).json({ message: "Not authorized to verify this order" });
      return;
    }

    // If already paid, return current state (idempotent)
    if (order.isPaid) {
      res.json({
        message: "Order is already paid",
        isPaid: true,
        order,
      });
      return;
    }

    const txRef = order.chapaTxRef;
    if (!txRef) {
      res
        .status(400)
        .json({ message: "No payment was initialized for this order" });
      return;
    }

    // Call Chapa Verify API
    const response = await fetch(
      `${CHAPA_BASE_URL}/transaction/verify/${txRef}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    const data = await response.json();

    if (data.status === "success" && data.data?.status === "success") {
      // Verify the amount matches to prevent tampering
      const chapaAmount = parseFloat(data.data.amount);
      const orderAmount = parseFloat(order.totalPrice.toString());

      if (Math.abs(chapaAmount - orderAmount) > 0.01) {
        console.error(
          `Amount mismatch! Order: ${orderAmount}, Chapa: ${chapaAmount}, tx_ref: ${txRef}`,
        );
        res.status(400).json({
          message: "Payment amount does not match order total",
        });
        return;
      }

      // Mark order as paid
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        tx_ref: txRef,
        chapa_ref: data.data.reference || "",
        status: "success",
        payment_method: data.data.payment_method || "chapa",
        paid_at: data.data.created_at || new Date().toISOString(),
      };

      const updatedOrder = await order.save();

      res.json({
        message: "Payment verified successfully",
        isPaid: true,
        order: updatedOrder,
      });
    } else if (data.data?.status === "pending") {
      res.json({
        message: "Payment is still pending",
        isPaid: false,
        status: "pending",
      });
    } else {
      res.json({
        message: "Payment was not successful",
        isPaid: false,
        status: data.data?.status || "failed",
      });
    }
  } catch (error: any) {
    console.error("Chapa verification error:", error.message);
    res
      .status(500)
      .json({ message: "Payment verification failed", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/orders/chapa/callback
// Chapa calls this URL after payment completion.
// Receives: { trx_ref, ref_id, status }
// ─────────────────────────────────────────────────────────────
const chapaCallback = async (req: Request, res: Response) => {
  try {
    const { trx_ref, status } = req.query;

    if (!trx_ref) {
      res.status(400).json({ message: "Missing transaction reference" });
      return;
    }

    const txRef = trx_ref as string;

    // Only process successful callbacks
    if (status !== "success") {
      res.json({ message: "Callback received", status });
      return;
    }

    const order = await Order.findOne({ chapaTxRef: txRef });
    if (!order) {
      console.error(`Callback: No order found for tx_ref: ${txRef}`);
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Idempotency: Don't reprocess if already paid
    if (order.isPaid) {
      res.json({ message: "Order already processed" });
      return;
    }

    // Critical: Always verify with Chapa API before marking as paid
    const secretKey = getChapaSecretKey();
    const verifyResponse = await fetch(
      `${CHAPA_BASE_URL}/transaction/verify/${txRef}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    const verifyData = await verifyResponse.json();

    if (
      verifyData.status === "success" &&
      verifyData.data?.status === "success"
    ) {
      // Verify amount
      const chapaAmount = parseFloat(verifyData.data.amount);
      const orderAmount = parseFloat(order.totalPrice.toString());

      if (Math.abs(chapaAmount - orderAmount) > 0.01) {
        console.error(
          `Callback amount mismatch! Order: ${orderAmount}, Chapa: ${chapaAmount}, tx_ref: ${txRef}`,
        );
        res.status(400).json({ message: "Amount mismatch" });
        return;
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        tx_ref: txRef,
        chapa_ref: verifyData.data.reference || "",
        status: "success",
        payment_method: verifyData.data.payment_method || "chapa",
        paid_at: verifyData.data.created_at || new Date().toISOString(),
      };

      await order.save();
    }

    res.json({ message: "Callback processed" });
  } catch (error: any) {
    console.error("Chapa callback error:", error.message);
    res.status(500).json({ message: "Callback processing failed" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/orders/chapa/webhook
// Chapa sends webhook events for payment status changes.
// This is the most reliable way to confirm payments.
// ─────────────────────────────────────────────────────────────
const chapaWebhook = async (req: Request, res: Response) => {
  try {
    const secretKey = getChapaSecretKey();

    // ── Step 1: Verify webhook signature ──
    const chapaSignature =
      req.headers["chapa-signature"] || req.headers["x-chapa-signature"];

    if (!chapaSignature) {
      console.warn("Webhook received without signature — rejecting");
      res.status(401).json({ message: "Missing signature" });
      return;
    }

    // Compute expected signature: HMAC SHA256 of the raw body using the secret key
    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (chapaSignature !== expectedSignature) {
      console.warn("Webhook signature mismatch — rejecting");
      res.status(401).json({ message: "Invalid signature" });
      return;
    }

    // ── Step 2: Parse the event ──
    const event = req.body;
    const txRef = event.tx_ref;

    // We only care about charge.success events for payment confirmation
    if (event.event !== "charge.success" || event.status !== "success") {
      // Acknowledge but don't process non-success events
      console.log(
        `Webhook event received: ${event.event}, status: ${event.status}`,
      );
      res.status(200).json({ message: "Event acknowledged" });
      return;
    }

    if (!txRef) {
      console.warn("Webhook: Missing tx_ref in event payload");
      res.status(200).json({ message: "No tx_ref, event acknowledged" });
      return;
    }

    // ── Step 3: Find the order ──
    const order = await Order.findOne({ chapaTxRef: txRef });
    if (!order) {
      console.warn(`Webhook: No order found for tx_ref: ${txRef}`);
      res.status(200).json({ message: "Order not found, event acknowledged" });
      return;
    }

    // Idempotency: Don't reprocess
    if (order.isPaid) {
      res.status(200).json({ message: "Already processed" });
      return;
    }

    // ── Step 4: Re-verify with Chapa API (best practice) ──
    const verifyResponse = await fetch(
      `${CHAPA_BASE_URL}/transaction/verify/${txRef}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    const verifyData = await verifyResponse.json();

    if (
      verifyData.status === "success" &&
      verifyData.data?.status === "success"
    ) {
      // Verify amount
      const chapaAmount = parseFloat(verifyData.data.amount);
      const orderAmount = parseFloat(order.totalPrice.toString());

      if (Math.abs(chapaAmount - orderAmount) > 0.01) {
        console.error(
          `Webhook amount mismatch! Order: ${orderAmount}, Chapa: ${chapaAmount}, tx_ref: ${txRef}`,
        );
        res
          .status(200)
          .json({ message: "Amount mismatch, event acknowledged" });
        return;
      }

      // ── Step 5: Mark as paid ──
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        tx_ref: txRef,
        chapa_ref: verifyData.data.reference || event.reference || "",
        status: "success",
        payment_method:
          verifyData.data.payment_method || event.payment_method || "chapa",
        paid_at: verifyData.data.created_at || new Date().toISOString(),
      };

      await order.save();
      console.log(
        `Webhook: Order ${order._id} marked as paid via tx_ref: ${txRef}`,
      );
    }

    // Always respond 200 to acknowledge the webhook
    res.status(200).json({ message: "Webhook processed" });
  } catch (error: any) {
    console.error("Chapa webhook error:", error.message);
    // Still respond 200 to prevent Chapa from retrying indefinitely
    res.status(200).json({ message: "Webhook error, acknowledged" });
  }
};

export {
  initializeChapaPayment,
  verifyChapaPayment,
  chapaCallback,
  chapaWebhook,
};
