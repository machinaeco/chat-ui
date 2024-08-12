<script lang="ts">
	import CarbonSustainability from "~icons/carbon/sustainability";
	import EosIconsLoading from "~icons/eos-icons/loading";
	import { base } from "$app/paths";
	import { page } from "$app/stores";

	const monthlyLabel = new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: $page.data.currency,
		maximumFractionDigits: 0,
	}).format($page.data.monthlyAmount);
	const yearlyLabel = new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: $page.data.currency,
		maximumFractionDigits: 0,
	}).format($page.data.yearlyAmount);

	$: loading = null as "monthly" | "yearly" | "manage" | null;
</script>

<div class="scrollbar-custom mr-1 h-full overflow-y-auto py-12 max-sm:pt-8 md:py-24">
	<div class="pt-42 mx-auto flex flex-col px-5 xl:w-[60rem] 2xl:w-[64rem]">
		<div class="flex items-center">
			<h1 class="text-2xl font-bold">
				Machina Eco Pass
				<CarbonSustainability class="inline-block text-lime-500" />
			</h1>
		</div>
		<h2 class="text-lg text-gray-500">
			Be a part of our mission for a greener future. Join us with your Machina Eco Pass.
		</h2>
		<div class="overflow-auto py-6">
			<div class="prose dark:prose-invert">
				<p>
					At Machina Eco, we believe that technology should not come at the expense of our planet.
					Our team is dedicated to minimizing the environmental impact of AI by sourcing all of our
					electricity from renewable sources and offsetting our CO2 emissions.
				</p>
				<p>
					Our mission is to make sustainable, green and ethical AI accessible to everyone. In order
					to use our resources responsibly, we have set the free usage limit to 12 messages per day.
				</p>
				<p>
					With your Machina Eco Pass, you can send as many messages as you want, while supporting
					the development of green AI.
				</p>
				<p>
					Choose a Machina Eco Pass for one month or save with the annual pass. With either option,
					you'll make a positive impact on the environment while getting full access to eco-friendly
					hosted AI models.
				</p>
			</div>
		</div>
		<div class="mt-4 max-w-[65ch] overflow-hidden rounded-xl border text-base dark:border-gray-800">
			<div
				class="flex justify-between p-4"
				class:flex-col={$page.data.userHasActivePass || $page.data.userHasPaymentFailed}
			>
				<div class="flex flex-col gap-3">
					{#if $page.data.userHasActivePass}
						<h3 class="font-bold text-green-700 dark:text-lime-500">
							Congratulations on your Machina Eco Pass! 🎉
						</h3>
						<div class="text-gray-600 dark:text-gray-300">
							<ul class="list-disc px-3 text-left">
								<li>You can send as many messages as you want with no daily limit</li>
								<li>You support the development of sustainable AI</li>
								<li>You have full access to eco-friendly hosted AI models</li>
							</ul>
						</div>
					{:else if $page.data.userHasPaymentFailed}
						<h3 class="font-bold text-red-700">Payment for your Machina Eco Pass has failed.</h3>
						<div class="text-gray-600 dark:text-gray-300">
							Please update your payment information to continue.
						</div>
					{:else}
						<h3 class="font-bold">Machina Eco Pass</h3>
						<div class="text-gray-600 dark:text-gray-300">
							<ul class="list-disc px-3 text-left">
								<li>Send as many messages as you want with no daily limit</li>
								<li>Support the development of sustainable AI</li>
								<li>Full access to eco-friendly hosted AI models</li>
							</ul>
						</div>
					{/if}
				</div>
				<form action="{base}/api/billing/stripe/subscription" method="POST">
					{#if $page.data.userHasActivePass || $page.data.userHasPaymentFailed}
						<button
							type="submit"
							name="pass"
							value="manage"
							on:click={() => {
								loading = "manage";
							}}
							class="mt-4 flex flex-wrap items-center justify-center whitespace-nowrap rounded-full border-2 border-gray-300 bg-white px-5 py-2 text-center text-lg font-semibold text-gray-600 transition-colors hover:bg-slate-100 dark:border-gray-600 dark:bg-black dark:text-gray-300 dark:hover:bg-slate-900"
						>
							{#if loading === "manage"}
								<EosIconsLoading />
							{:else if $page.data.userHasActivePass}
								Modify or cancel your Pass
							{:else}
								Update payment information
							{/if}
						</button>
					{:else}
						<div class="flex flex-col gap-1">
							<button
								type="submit"
								name="pass"
								value="monthly"
								on:click={() => {
									loading = "monthly";
								}}
								class="flex w-full flex-wrap items-center justify-center whitespace-nowrap rounded-full bg-black px-5 py-2 text-center text-lg font-semibold text-gray-100 transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
							>
								{#if loading === "monthly"}
									<EosIconsLoading />
								{:else}
									{monthlyLabel}
									<span class="ms-2 text-sm text-gray-400">per month</span>
								{/if}
							</button>
							<div class="text-center text-sm italic text-gray-500 dark:text-gray-400">
								<span>– or –</span>
							</div>
							<button
								type="submit"
								name="pass"
								value="yearly"
								on:click={() => {
									loading = "yearly";
								}}
								class="flex w-full flex-wrap items-center justify-center whitespace-nowrap rounded-full bg-black px-5 py-2 text-center text-lg font-semibold text-gray-100 transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
							>
								{#if loading === "yearly"}
									<EosIconsLoading />
								{:else}
									{yearlyLabel}
									<span class="ms-2 text-sm text-gray-400">per year</span>
								{/if}
							</button>
						</div>
					{/if}
				</form>
			</div>
		</div>
	</div>
</div>
