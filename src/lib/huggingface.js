import { HUGGINGFACE_API_KEY } from '$env/static/private';

export async function queryHuggingFace(imgArrayBuffer) {
	let imageBase64 = Buffer.from(await imgArrayBuffer.arrayBuffer()).toString('base64');

	// Prepare API payload
	const payload = {
		inputs: imageBase64, // Image in base64
		parameters: {
			max_new_tokens: 200 // Prevent Hugging Face from truncating the output
		}
	};

	const response = await fetch(
		'https://api-inference.huggingface.co/models/Norm/nougat-latex-base',
		{
			headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
			method: 'POST',
			body: JSON.stringify(payload)
		}
	);

	console.log(response);

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
