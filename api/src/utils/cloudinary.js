// src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * Upload a file to Cloudinary and return metadata for D1
 * @param {Buffer|string} file - file path or Buffer
 * @param {Object} options - optional
 *   - folder: target folder
 *   - resource_type: 'image' | 'raw'
 *   - type: 'image' | 'schematic'
 * @returns {Object} - { public_id, url, type, format, bytes }
 */
export async function uploadFile(file, { folder = '', resource_type = 'image', type = 'image' } = {}) {
	try {
		const result = await cloudinary.uploader.upload(file, {
			folder,
			resource_type, // 'image' or 'raw'
		});

		return {
			public_id: result.public_id,
			url: result.secure_url,
			type,
			format: result.format,
			bytes: result.bytes,
		};
	} catch (err) {
		console.error('Cloudinary upload failed:', err);
		throw err;
	}
}

/**
 * Delete a file from Cloudinary and optionally from your D1 metadata
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resource_type - 'image' | 'raw'
 * @returns {Object} result from Cloudinary
 */
export async function deleteFile(publicId, resource_type = 'image') {
	try {
		const result = await cloudinary.uploader.destroy(publicId, { resource_type });
		console.log('Deleted Cloudinary file:', publicId, result);
		return result;
	} catch (err) {
		console.error('Cloudinary deletion failed:', err);
		throw err;
	}
}

/**
 * Example: transform URL for resized image
 * @param {string} url
 * @param {Object} options - { width, height, format }
 * @returns {string} transformed URL
 */
export function transformURL(url, { width, height, format } = {}) {
	let transforms = [];
	if (width) transforms.push(`w_${width}`);
	if (height) transforms.push(`h_${height}`);
	if (format) transforms.push(`f_${format}`);

	if (transforms.length === 0) return url;
	return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}
