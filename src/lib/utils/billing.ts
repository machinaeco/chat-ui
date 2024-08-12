import { env } from "$env/dynamic/private";
import JSON5 from "json5";
import Stripe from "stripe";
import { z } from "zod";
import { collections } from "$lib/server/database";
import type { User } from "$lib/types/User";

export const billingEnvSchema = z
	.object({
		stripe: z
			.object({
				secretKey: z.string(),
				webhookSecret: z.string(),
				prices: z.object({
					monthly: z.object({
						id: z.string(),
						amount: z.record(z.string(), z.number()),
					}),
					yearly: z.object({
						id: z.string(),
						amount: z.record(z.string(), z.number()),
					}),
				}),
				successUrl: z.string(),
				cancelUrl: z.string(),
				returnUrl: z.string(),
			})
			.optional(),
	})
	.optional();

export const billingEnv = billingEnvSchema.parse(JSON5.parse(env.BILLING || "{}"));

export const stripe = billingEnv?.stripe
	? new Stripe(billingEnv.stripe.secretKey, {
			apiVersion: "2024-06-20",
	  })
	: null;

export async function getCurrentPass(user: User) {
	const passes = await collections.passes
		.find({ userId: user._id, expiresAt: { $gt: new Date() } })
		.sort({ expiresAt: -1 })
		.limit(1)
		.toArray();
	return passes.length ? passes[0] : null;
}

export async function hasActivePass(user: User) {
	return (await getCurrentPass(user))?.paymentFailed === false;
}

export async function hasPaymentFailed(user: User) {
	return (await getCurrentPass(user))?.paymentFailed === true;
}
