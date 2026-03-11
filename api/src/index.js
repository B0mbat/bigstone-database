import { handleProjects } from './routes/projects.js';
import { handleComponents } from './routes/components.js';
import { handleContributors } from './routes/contributors.js';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/projects')) {
			return handleProjects(request, env);
		}

		if (url.pathname.startsWith('/components')) {
			return handleComponents(request, env);
		}

		if (url.pathname.startsWith('/contributors')) {
			return handleContributors(request, env);
		}

		return new Response('Not found', { status: 404 });
	},
};
