import {headers} from "next/headers";
import {NextResponse} from "next/server";
import Stripe from "stripe";
import {client, writeClient} from "@/sanity/lib/client";
import {ORDER_BY_STRIPE_PAYMENT_ID_QUERY} from "@/lib/sanity/queries/orders";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        console.error("Missing stripe-signature header");
        return NextResponse.json(
            {error: "Missing stripe-signature header"},
            {status: 400}
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log(`Received event: ${event.type}`);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Webhook signature verification failed:", message);
        return NextResponse.json(
            {error: `Webhook Error: ${message}`},
            {status: 400}
        );
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed": {
            console.log("Processing checkout.session.completed event");
            const session = event.data.object as Stripe.Checkout.Session;
            console.log("Session ID:", session.id);
            console.log("Session metadata:", session.metadata);
            await handleCheckoutCompleted(session);
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({received: true});
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const stripePaymentId = session.payment_intent as string;

    try {
        console.log("Starting to handle checkout completed event");
        console.log("Stripe Payment ID:", stripePaymentId);

        // Idempotency check: prevent duplicate processing on webhook retries
        const existingOrder = await client.fetch(ORDER_BY_STRIPE_PAYMENT_ID_QUERY, {
            stripePaymentId,
        });

        if (existingOrder) {
            console.log(
                `Webhook already processed for payment ${stripePaymentId}, skipping`
            );
            return;
        }

        console.log("No existing order found, proceeding with creation");

        // Extract metadata
        const {
            clerkUserId,
            userEmail,
            sanityCustomerId,
            productIds: productIdsString,
            quantities: quantitiesString,
        } = session.metadata ?? {};

        console.log("Extracted metadata:", { clerkUserId, userEmail, sanityCustomerId, productIdsString, quantitiesString });

        if (!clerkUserId || !productIdsString || !quantitiesString) {
            console.error("Missing required metadata in checkout session", {
                hasClerkUserId: !!clerkUserId,
                hasProductIds: !!productIdsString,
                hasQuantities: !!quantitiesString
            });
            return;
        }

        const productIds = productIdsString.split(",");
        const quantities = quantitiesString.split(",").map(Number);

        console.log("Parsed product IDs and quantities:", { productIds, quantities });

        // Get line items from Stripe
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        console.log("Retrieved line items from Stripe:", lineItems.data.length);

        // Build order items array
        const orderItems = productIds.map((productId, index) => {
            const item = {
                _key: `item-${index}`,
                product: {
                    _type: "reference" as const,
                    _ref: productId,
                },
                quantity: quantities[index],
                priceAtPurchase: lineItems.data[index]?.amount_total
                    ? lineItems.data[index].amount_total / 100
                    : 0,
            };
            console.log(`Created order item ${index}:`, item);
            return item;
        });

        // Generate order number
        const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        console.log("Generated order number:", orderNumber);

        // Extract shipping address
        const shippingAddress = session.customer_details?.address;
        const address = shippingAddress
            ? {
                name: session.customer_details?.name ?? "",
                line1: shippingAddress.line1 ?? "",
                line2: shippingAddress.line2 ?? "",
                city: shippingAddress.city ?? "",
                postcode: shippingAddress.postal_code ?? "",
                country: shippingAddress.country ?? "",
            }
            : undefined;

        console.log("Creating order in Sanity with data:", {
            orderNumber,
            clerkUserId,
            email: userEmail ?? session.customer_details?.email ?? "",
            itemCount: orderItems.length,
            total: (session.amount_total ?? 0) / 100,
            stripePaymentId
        });

        // Create order in Sanity with customer reference
        const order = await writeClient.create({
            _type: "order",
            orderNumber,
            ...(sanityCustomerId && {
                customer: {
                    _type: "reference",
                    _ref: sanityCustomerId,
                },
            }),
            clerkUserId,
            email: userEmail ?? session.customer_details?.email ?? "",
            items: orderItems,
            total: (session.amount_total ?? 0) / 100,
            status: "paid",
            stripePaymentId,
            address,
            createdAt: new Date().toISOString(),
        });

        console.log(`Order created successfully: ${order._id} (${orderNumber})`);

        // Decrease stock for all products in a single transaction
        console.log("Updating stock for products:", productIds);
        await productIds
            .reduce(
                (tx, productId, i) =>
                    tx.patch(productId, (p) => p.dec({stock: quantities[i]})),
                writeClient.transaction()
            )
            .commit();

        console.log(`Stock updated successfully for ${productIds.length} products`);
    } catch (error) {
        console.error("Error handling checkout.session.completed:", error);
        throw error; // Re-throw to return 500 and trigger Stripe retry
    }
}