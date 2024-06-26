import { HUGGINGFACE_API_KEY } from '$env/static/private';

export async function queryHuggingFace(equationImgBase64) {
	let imageBase64 = equationImgBase64.split(',')[1];

	// Prepare API payload
	let payload = {
		inputs: imageBase64, // Image in base64
		parameters: {
			max_new_tokens: 500 // Prevent Hugging Face from truncating the output
		},
		options: {

		}
	};

	const send_request = (payload) => {
		return fetch('https://api-inference.huggingface.co/models/Norm/nougat-latex-base', {
			headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
			method: 'POST',
			body: JSON.stringify(payload)
		});
	};

	let response = await send_request(payload);

	return new Promise((resolve, reject) => {
		if (response.ok) {
			response.json().then((data) => {
				resolve(data);
			});
		} else {
			response.json().then((error) => {
				console.log(error)
				if (response.status === 503) {
					reject('Hugging Face model is warming up. Please try again in a few seconds.');
				} else {
					reject(error.error);
				}
			});
		}
	});
}
