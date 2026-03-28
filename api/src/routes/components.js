import { requireAuth } from '../utils/auth.js';

export async function handleComponents(request, env, corsHeaders) {
	const url = new URL(request.url);
	const path = url.pathname.replace(/\/$/, '');

	// POST
	if (request.method === 'POST') {
		let user;
		try {
			user = await requireAuth(request, env.JWT_SECRET);
		} /* 401 unauthorized */ catch {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		let body;
		try {
			body = await request.json();
		} /* 400 invalid json */ catch {
			return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		const { project_id, name, desc, ports } = body;
		if (!project_id || !name) {
			return new Response(JSON.stringify({ error: 'Missing required fields' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		try {
			// project ownership
			console.log(`project_id: ${project_id}, user_id: ${user.id}`);
			const project = await env.DB.prepare('SELECT id, owner_id FROM projects WHERE id = ?').bind(project_id).first();

			console.log('DB result:', project);
			console.log('Expected user:', user.id);

			console.log(project);

			/* 403 - project not found or not yours */
			if (!project || project.owner_id !== user.id) {
				return new Response(JSON.stringify({ error: 'Project not found or not yours' }), {
					status: 403,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}

			// Insert new component
			const result = await env.DB.prepare('INSERT INTO components (project_id, name, "desc", owner_id, ports) VALUES (?, ?, ?, ?, ?)')
				.bind(project_id, name, desc || null, user.id, JSON.stringify(ports))
				.run();

			const row = await env.DB.prepare('SELECT id FROM components WHERE rowid = ?').bind(result.meta.last_row_id).first();

			return new Response(JSON.stringify({ id: row.id }), {
				status: 201,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		} catch (err) /* 500 - db not found or not yours */ {
			return new Response(JSON.stringify({ error: 'Database error', detail: err.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}
	}

	// GET
	if (request.method === 'GET' && path.endsWith('/components')) {
		const result = await env.DB.prepare('SELECT * FROM components').all();
		const components = result.results.map((c) => ({ ...c, ports: JSON.parse(c.ports) }));
		return new Response(JSON.stringify(components), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
	}

	if (request.method === 'GET' && path.startsWith('/components/')) {
		const id = path.split('/').pop();

		const component = await env.DB.prepare('SELECT * FROM components WHERE id = ?').bind(id).first();

		if (!component) {
			return new Response(JSON.stringify({ error: 'Component not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// string => array
		let ports = [];
		if (component.ports) {
			try {
				ports = JSON.parse(component.ports);
			} catch {
				ports = [];
			}
		}

		const response = { ...component, ports };

		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}

	// DELETE
	if (request.method === 'DELETE' && path.startsWith('/components/')) {
		const user = await requireAuth(request, env.JWT_SECRET);
		const id = path.split('/').pop();

		await env.DB.prepare('DELETE FROM components WHERE id = ? AND owner_id = ?').bind(id, user.id).run();

		return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
	}
	// unsupported routes
	return new Response('Not found', { status: 404, headers: corsHeaders });
}
