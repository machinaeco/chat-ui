<script lang="ts">
	import { env as envPublic } from "$env/dynamic/public";
	import Modal from "$lib/components/Modal.svelte";
	import { createEventDispatcher } from "svelte";
	import Logo from "./icons/Logo.svelte";
	import { base } from "$app/paths";
	import { page } from "$app/stores";

	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<Modal on:close>
	<div
		class="from-primary-500/40 via-primary-500/10 to-primary-500/0 flex w-full flex-col items-center gap-6 bg-gradient-to-b px-5 pb-8 pt-9 text-center"
	>
		<h2 class="flex items-center text-2xl font-semibold text-gray-800">
			<Logo classNames="mr-1" />
			{envPublic.PUBLIC_APP_NAME}
		</h2>
		<div
			class="flex flex-col gap-3 rounded-xl border bg-white/80 p-3 text-left text-base text-sm text-gray-800"
		>
			<p>Machina Eco aims to make sustainable, green, and ethical AI accessible to everyone.</p>
			<p class="font-bold">
				You will receive {$page.data.freeMessagesPerDay} free messages per day.
				{#if $page.data.remainingMessages === 0}
					Unfortunately, you have used all your free messages for today.
				{:else if $page.data.remainingMessages === $page.data.freeMessagesPerDay}
					You still have all your free messages left for today.
				{:else}
					You currently have {$page.data.remainingMessages} messages left for today.
				{/if}
			</p>
			{#if $page.data.isBillingEnabled}
				<p>
					Check out the Machina Eco Pass to send more messages and support the development of
					sustainable AI.
				</p>
			{/if}
		</div>

		<div class="flex w-full flex-col gap-3">
			{#if $page.data.isBillingEnabled}
				<a
					href="{base}/pass"
					class="flex w-full flex-wrap items-center justify-center whitespace-nowrap rounded-full bg-black px-5 py-2 text-center text-lg font-semibold text-gray-100 transition-colors hover:bg-gray-900"
				>
					Machina Eco Pass
				</a>
			{/if}

			<button
				type="button"
				on:click={() => dispatch("close")}
				class="flex w-full flex-wrap items-center justify-center whitespace-nowrap rounded-full border-2 border-gray-300 bg-white px-5 py-2 text-center text-lg font-semibold text-gray-800 transition-colors hover:bg-slate-100"
			>
				{#if $page.data.remainingMessages === 0}
					Close
				{:else}
					Continue
				{/if}
			</button>
		</div>
	</div>
</Modal>
