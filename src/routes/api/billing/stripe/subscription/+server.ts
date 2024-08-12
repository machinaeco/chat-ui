import { redirect } from "@sveltejs/kit";
import type Stripe from "stripe";
import { base } from "$app/paths";
import type { User } from "$lib/types/User";
import { billingEnv, getCurrentPass, stripe } from "$lib/utils/billing.js";

export async function POST({ locals, request }) {
	if (!locals.user?._id) {
		throw redirect(307, `${base}/login`);
	}

	if (!stripe || !billingEnv?.stripe) {
		return new Response("Stripe is not configured.", { status: 500 });
	}

	const currentPass = await getCurrentPass(locals.user);
	if (currentPass) {
		return redirectToBillingPortal(
			stripe,
			currentPass.billingInfo.stripe.customerId,
			billingEnv.stripe.returnUrl
		);
	}

	const priceId =
		(await request.formData()).get("pass") === "yearly"
			? billingEnv.stripe.prices.yearly.id
			: billingEnv.stripe.prices.monthly.id;

	return redirectToCheckout(
		stripe,
		locals.user,
		priceId,
		locals.currency || "USD",
		billingEnv.stripe.successUrl,
		billingEnv.stripe.cancelUrl
	);
}

async function redirectToBillingPortal(stripe: Stripe, customerId: string, returnUrl: string) {
	let url;
	try {
		url = (
			await stripe.billingPortal.sessions.create({
				customer: customerId,
				return_url: returnUrl,
			})
		).url;
	} catch (error) {
		return new Response((error as { message?: string }).message, { status: 500 });
	}
	throw redirect(303, url);
}

async function redirectToCheckout(
	stripe: Stripe,
	user: User,
	priceId: string,
	currency: string,
	successUrl: string,
	cancelUrl: string
) {
	let url;
	try {
		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "subscription",
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			success_url: successUrl,
			cancel_url: cancelUrl,
			allow_promotion_codes: true,
			automatic_tax: { enabled: true },
			customer_email: user.email,
			currency,
			subscription_data: {
				metadata: {
					userId: user._id.toString(),
				},
			},
		});
		url = checkoutSession.url;
		if (!url) {
			return new Response("No Checkout URL returned from Stripe.", { status: 500 });
		}
	} catch (error) {
		return new Response((error as { message?: string }).message, { status: 500 });
	}
	throw redirect(303, url);
}
