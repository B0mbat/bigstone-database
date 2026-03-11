export async function handleProjects(request, env) {
	const url = new URL(request.url);

	if (request.method === 'POST' && url.pathname === '/projects') {
		const { name, desc } = await request.json();

		const result = await env.DB.prepare('INSERT INTO projects (name, desc) VALUES (?, ?)').bind(name, desc).run();

		// Log this in your terminal (wrangler dev) to see exactly what D1 is sending back
		console.log(JSON.stringify(result));

		return new Response(
			JSON.stringify({
				id: result.meta.last_row_id,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}

	if (request.method === 'GET' && url.pathname === '/projects') {
		const { results } = await env.DB.prepare('SELECT * FROM projects').all();

		return Response.json(results);
	}

	if (request.method === 'DELETE' && url.pathname.startsWith('/projects/')) {
		const id = url.pathname.split('/').pop();
		if (!id || isNaN(id)) {
			return new Response(JSON.stringify({ error: 'Invalid ID' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		await env.DB.prepare(`DELETE FROM projects WHERE id = ?`).bind(id).run();

		return new Response(JSON.stringify({ success: true, deleted: id }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response('Not found', { status: 404 });
}
