import { Dependencies } from '$lib/constants';
import { sdkForConsole, sdkForProject, setProject } from '$lib/stores/sdk';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, depends }) => {
    depends(Dependencies.PROJECT);

    if (sdkForProject.client.config.project !== params.project) {
        setProject(params.project);
    }

    try {
        const project = await sdkForConsole.projects.get(params.project);
        localStorage.setItem('project', project.$id);
        localStorage.setItem('organization', project.teamId);

        return {
            project,
            organization: await sdkForConsole.teams.get(project.teamId)
        };
    } catch (e) {
        throw error(e.code, e.message);
    }
};
