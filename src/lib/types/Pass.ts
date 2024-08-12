import type { ObjectId } from "bson";
import type { Timestamps } from "./Timestamps";
import type { User } from "./User";

export interface Pass extends Timestamps {
	_id: ObjectId;
	userId: User["_id"];
	type: "monthly" | "yearly";
	expiresAt: Date;
	billingInfo: BillingInfo;
	paymentFailed: boolean;
}

export type BillingInfo = {
	stripe: StripeBillingInfo;
};

export type StripeBillingInfo = {
	subscriptionId: string;
	customerId: string;
	priceId: string;
	currentPeriodEnd: number;
	status:
		| "incomplete"
		| "incomplete_expired"
		| "trialing"
		| "active"
		| "past_due"
		| "canceled"
		| "unpaid"
		| "paused";
};
