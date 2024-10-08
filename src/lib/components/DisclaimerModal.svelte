<script lang="ts">
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { env as envPublic } from "$env/dynamic/public";
	import LogoHuggingFaceBorderless from "$lib/components/icons/LogoHuggingFaceBorderless.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { useSettingsStore } from "$lib/stores/settings";
	import { cookiesAreEnabled } from "$lib/utils/cookiesAreEnabled";
	import Logo from "./icons/Logo.svelte";

	const settings = useSettingsStore();
</script>

<Modal>
	<div
		class="from-primary-500/40 via-primary-500/10 to-primary-500/0 flex w-full flex-col gap-6 bg-gradient-to-b px-5 pb-8 pt-9 sm:px-6"
	>
		<h2 class="flex items-center text-2xl font-semibold text-gray-800">
			<Logo classNames="mr-1" />
			{envPublic.PUBLIC_APP_NAME}
		</h2>

		<p class="text-lg font-semibold leading-snug text-gray-800" style="text-wrap: balance;">
			{envPublic.PUBLIC_APP_DESCRIPTION}
		</p>

		{#if envPublic.PUBLIC_APP_CLAIM_1 || envPublic.PUBLIC_APP_CLAIM_2 || envPublic.PUBLIC_APP_CLAIM_3}
			<ul class="list-disc px-3 text-left text-sm text-gray-800">
				{#if envPublic.PUBLIC_APP_CLAIM_1}
					<li>
						{envPublic.PUBLIC_APP_CLAIM_1}
					</li>
				{/if}
				{#if envPublic.PUBLIC_APP_CLAIM_2}
					<li>
						{envPublic.PUBLIC_APP_CLAIM_2}
					</li>
				{/if}
				{#if envPublic.PUBLIC_APP_CLAIM_3}
					<li>
						{envPublic.PUBLIC_APP_CLAIM_3}
					</li>
				{/if}
			</ul>
		{/if}

		<p class="text-sm text-gray-500">
			{envPublic.PUBLIC_APP_DISCLAIMER_MESSAGE}
		</p>

		<div class="flex w-full flex-col items-center gap-2">
			{#if $page.data.guestMode || !$page.data.loginEnabled}
				<button
					class="w-full justify-center rounded-full border-2 border-gray-300 bg-black px-5 py-2 text-lg font-semibold text-gray-100 transition-colors hover:bg-gray-900"
					class:bg-white={$page.data.loginEnabled}
					class:text-gray-800={$page.data.loginEnabled}
					class:hover:bg-slate-100={$page.data.loginEnabled}
					on:click|preventDefault|stopPropagation={() => {
						if (!cookiesAreEnabled()) {
							window.open(window.location.href, "_blank");
						}

						$settings.ethicsModalAccepted = true;
					}}
				>
					{#if $page.data.loginEnabled}
						Try as guest
					{:else}
						Start chatting
					{/if}
				</button>
			{/if}
			{#if $page.data.loginEnabled}
				<form action="{base}/login" target="_parent" method="POST" class="w-full">
					<button
						type="submit"
						class="flex w-full flex-wrap items-center justify-center whitespace-nowrap rounded-full border-2 border-black bg-black px-5 py-2 text-lg font-semibold text-gray-100 transition-colors hover:bg-gray-900"
					>
						Sign in
						{#if envPublic.PUBLIC_APP_NAME === "HuggingChat"}
							<span class="flex items-center">
								&nbsp;with <LogoHuggingFaceBorderless classNames="text-xl mr-1 ml-1.5 flex-none" /> Hugging
								Face
							</span>
						{/if}
					</button>
				</form>
			{/if}
			{#each JSON.parse(envPublic.PUBLIC_NAV_LINKS || "[]") as navLink}
				<a
					href={navLink.href}
					target="_blank"
					rel="noreferrer"
					class="flex flex-none items-center gap-1.5 rounded-lg px-3 py-0.5 text-sm text-gray-500 hover:bg-gray-100"
				>
					{navLink.title}
				</a>
			{/each}
		</div>
	</div>
</Modal>
