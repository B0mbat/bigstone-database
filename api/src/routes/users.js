export async function handleUsers(request, env, corsHeaders) {
	const url = new URL(request.url);
	const path = url.pathname.replace(/\/$/, ''); // I have no idea how this works, i just found this

	if (request.method === 'GET' && path.startsWith(`/users/`)) {
		const id = path.split('/').pop();

		const result = await env.DB.prepare('SELECT id, username, created_at, cmpnt_creations FROM users WHERE id = ?').bind(id).first();

		return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
	}
}
