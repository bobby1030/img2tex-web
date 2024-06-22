import { error } from '@sveltejs/kit';
import { queryHuggingFace } from '$lib/huggingface';

export const actions = {
	postEquation: async ({ request }) => {
		const data = await request.formData();
		const equationImgs = data.get('equationImgs');

		return queryHuggingFace(equationImgs)
			.then((data) => {
				return {
					message: 'success',
					texOutput: data[0].generated_text
				};
			})
			.catch((err) => {
				return error(400, {
					message: err
				});
			});
	}
};
