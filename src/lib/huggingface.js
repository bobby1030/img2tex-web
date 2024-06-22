import { HUGGINGFACE_API_KEY } from '$env/static/private';

export async function queryHuggingFace(equationImgBase64) {
	let imageBase64 = equationImgBase64.split(',')[1];

	// Prepare API payload
	let payload = {
		inputs: imageBase64, // Image in base64
		parameters: {
			max_new_tokens: 500 // Prevent Hugging Face from truncating the output
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

	if (response.status == 503) {
		// Retry once
		console.log('Model is not ready, retrying...');
		payload.parameters.wait_for_model = true;
		response = await send_request(payload);
	}

	return new Promise((resolve, reject) => {
		if (response.ok) {
			response.json().then((data) => {
				resolve(data);
			});
		} else {
			response.text().then((text) => {
				reject(text);
			});
		}
	});
}
