import { ObjectId } from "mongodb";
import { collections } from "$lib/server/database";
import { billingEnv, stripe } from "$lib/utils/billing.js";
import type Stripe from "stripe";

export async function POST({ request }) {
	if (!stripe || !billingEnv?.stripe) {
		return new Response("Stripe is not configured.", { status: 500 });
	}

	const body = await request.text();
	const signature = request.headers.get("Stripe-Signature");

	if (!signature) {
		return new Response("No signature.", { status: 400 });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, billingEnv.stripe.webhookSecret);
	} catch (error) {
		return new Response(
			"Webhook signature verification failed: " + (error as { message?: string }).message,
			{ status: 400 }
		);
	}

	switch (event.type) {
		case "customer.subscription.created":
		case "customer.subscription.updated":
			return handleCustomerSubscription(event.data.object);
		default:
			return new Response();
	}
}

async function handleCustomerSubscription(subscription: Stripe.Subscription) {
	const subscriptionPass = await collections.passes.findOne({
		"billingInfo.stripe.subscriptionId": subscription.id,
	});

	if (subscriptionPass) {
		await collections.passes.updateOne(
			{ _id: subscriptionPass._id },
			{
				$set: {
					updatedAt: new Date(),
					...toPassData(subscription),
				},
			}
		);
	} else {
		const user = await collections.users.findOne({
			_id: new ObjectId(subscription.metadata.userId),
		});
		if (!user) {
			return new Response("User not found.", { status: 404 });
		}

		await collections.passes.insertOne({
			_id: new ObjectId(),
			createdAt: new Date(),
			updatedAt: new Date(),
			userId: user._id,
			...toPassData(subscription),
		});
	}

	return new Response();
}

function toPassData(subscription: Stripe.Subscription) {
	return {
		type: (subscription.items.data[0].price.id === billingEnv?.stripe?.prices.yearly.id
			? "yearly"
			: "monthly") as "monthly" | "yearly",
		expiresAt: new Date(subscription.current_period_end * 1000),
		billingInfo: {
			stripe: {
				subscriptionId: subscription.id,
				customerId: subscription.customer as string,
				priceId: subscription.items.data[0].price.id,
				currentPeriodEnd: subscription.current_period_end,
				status: subscription.status,
			},
		},
		paymentFailed: ["incomplete_expired", "canceled", "unpaid"].includes(subscription.status),
	};
}
