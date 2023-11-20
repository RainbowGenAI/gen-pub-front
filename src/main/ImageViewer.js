
import React, { useState } from 'react';
import './ImageViewer.css';
import { createWorker } from 'tesseract.js';

function ImageViewer() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setSelectedImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeOcr = async () => {
        console.log("Confirm button clicked");
        //confirm("Confirm button clicked");
        if(!selectedImage) {
            alert("Select image first");
            return;
        }

        const worker = await createWorker();
        // await worker.load();
        // await worker.loadLanguage('kor+eng');
        // await worker.initialize('kor+eng');
        const { data: { text } } = await worker.recognize(selectedImage);
        console.log(text);
        
        const textContainer = document.querySelector('.text-container');
        textContainer.innerHTML = text;

        await worker.terminate();
    };

    return (
        <div className="container">
            <div className="header">
                Image Viewer
            </div>
            <div className="content">
                <div className="left-section">
                    <div className="button-container">
                        <input className="input-file" type="file" accept="image/*" onChange={handleImageUpload}/>
                        <button className="confirm-button" onClick={handleAnalyzeOcr}>Analyze OCR</button>
                    </div>
                    {selectedImage && (
                        <img src={selectedImage} alt="Uploaded" className="uploaded-image" style={{ maxWidth: '100%' }} />
                    )}
                </div>
                <div className="right-section">
                    <div className="text-container">
                    
                    </div>
                </div>
            </div>
            <div className="footer" style={{ backgroundColor: '#f0f0f0', padding: '10px', textAlign: 'center' }}>
                © 2023 Over The Rainbow
            </div>
        </div>
    );
}

export default ImageViewer;