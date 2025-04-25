import React, { useState } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../../../utils/baseURL';

const UploadImage = ({ name, value, onImageChange, placeholder }) => {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState(value);

    // Convert file to Base64 format
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    // Upload image to the server
    const uploadSingleImage = (base64) => {
        setLoading(true);
        axios
            .post(`${getBaseUrl()}/uploadImage`, { image: base64 })
            .then((res) => {
                const imageUrl = res.data;
                setUrl(imageUrl);  // Set the URL state with the uploaded image URL
                alert("Image uploaded successfully");
                onImageChange(imageUrl);  // Pass the uploaded image URL back to the parent
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            })
            .finally(() => setLoading(false));
    };

    // Handle the file input change event
    const uploadImage = async (event) => {
        const files = event.target.files;
        if (files.length === 1) {
            const base64 = await convertBase64(files[0]);
            uploadSingleImage(base64);  // Upload the converted base64 image
        }
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {placeholder}
            </label>
            <input
                type="file"
                name={name}
                id={name}
                onChange={uploadImage}
                className="add-product-InputCSS mt-2"
            />
            {loading && (
                <div className="mt-2 text-sm text-blue-600">Uploading image...</div>
            )}
            {url && (
                <div className="mt-2 text-sm text-green-600">
                    <p>Image uploaded successfully!</p>
                    <img
                        src={url}
                        alt="uploaded"
                        className="mt-2 w-48 h-auto rounded-lg shadow-md object-cover"
                    />
                </div>
            )}
        </div>
    );
};

export default UploadImage;
