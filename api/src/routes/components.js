import { requireAuth } from '../utils/auth.js';

export async function handleComponents(request, env, corsHeaders) {
	const url = new URL(request.url);
	const path = url.pathname.replace(/\/$/, '');

	if (request.method === 'POST' && path === '/components') {
		const user = await requireAuth(request, env.JWT_SECRET);

		const { project_id, name, desc, ports } = await request.json();

		const project = await env.DB.prepare('SELECT * FROM projects WHERE id = ? AND owner_id = ?').bind(project_id, user.id).first();
		if (!project) {
			return new Response(JSON.stringify({ fail: 'ID (user / project) doesnt match' }), {
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		const result = await env.DB.prepare('INSERT INTO components (project_id, name, "desc", ports = "") VALUES (?, ?, ?, ?)')
			.bind(project_id, name, desc, JSON.stringify(ports || []))
			.run();

		return new Response(JSON.stringify({ id: result.meta.last_row_id }), {
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}

	if (request.method === 'GET' && path === '/components') {
		const result = await env.DB.prepare('SELECT id, project_id, name, desc, ports, image_url, dim_x, dim_y, dim_z FROM components').all();

		return new Response(JSON.stringify(result.results), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
	}
}
