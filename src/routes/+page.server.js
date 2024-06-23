import { error, fail } from '@sveltejs/kit';
import { queryHuggingFace } from '$lib/huggingface';

export const actions = {
	postEquation: async ({ request }) => {
		const data = await request.formData();
		const equationImgBase64 = data.get('equationImgBase64');

		return queryHuggingFace(equationImgBase64)
			.then((data) => {
				return {
					success: true,
					texOutput: data[0].generated_text
				};
			})
			.catch((err) => {
				return fail(503, {
					success: false,
					message: err
				});
			});
	}
};
