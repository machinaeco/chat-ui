import { redirect } from "@sveltejs/kit";
import { getOIDCAuthorizationUrl } from "$lib/server/auth";
import { base } from "$app/paths";
import { env } from "$env/dynamic/private";

export const actions = {
	async default({ url, locals, request }) {
		const redirectToPass = !!(await request.formData()).get("pass");
		const referer = request.headers.get("referer");
		let redirectURI = `${(referer ? new URL(referer) : url).origin}${base}/login/callback${
			redirectToPass ? "?redirect=pass" : ""
		}`;

		// TODO: Handle errors if provider is not responding

		if (url.searchParams.has("callback")) {
			const callback = url.searchParams.get("callback") || redirectURI;
			if (env.ALTERNATIVE_REDIRECT_URLS.includes(callback)) {
				redirectURI = callback;
			}
		}

		const authorizationUrl = await getOIDCAuthorizationUrl(
			{ redirectURI },
			{ sessionId: locals.sessionId }
		);

		redirect(303, authorizationUrl);
	},
};
