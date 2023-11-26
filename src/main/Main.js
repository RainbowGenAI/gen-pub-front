
import React, { useEffect, useState, useRef } from 'react';
import '../scss/Main.scss';
import { createWorker } from 'tesseract.js';
import { Button, InputGroup} from 'react-bootstrap';
import ImageViewer from './ImageViewer';

import LLM from './LLM';

LLM.initOpenAI();

function Main() {
    const userPromptRef = React.useRef();
    const [selectedImage, setSelectedImage] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [userInput, setUserInput] = useState(null);
    const textContainerRef = useRef(null);

    useEffect(() => {
        if(!generatedImage) return;


    }, [generatedImage]);

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
        if (!selectedImage) {
            alert("Select image first");
            return;
        }

        const worker = await createWorker();
        await worker.load();
        await worker.loadLanguage('kor');
        await worker.reinitialize('kor');
        const response = await worker.recognize(selectedImage);

        console.log(response.data);
        // textContainerRef.current.textContent = response.data.text;

        await worker.terminate();
    };

    const handleGerateImage = () => {
        console.log("handleGerateImage button clicked");

        // LLM.createImage("test");
        LLM.createImagePrpomt(userInput, selectedImage)
        .then((result) => {
            console.log(result);
            return result;
        })
        .then((result) => {
            return LLM.createImage(result);
        })
        .then((result) => {
            console.log(result.substring(0, 50));
            setGeneratedImage(result);
        });
    };

    const handleCreatedAnnotation = (comment, x, y, h, w) => {
        console.log("handleCreatedAnnotation");
        console.log(comment, x, y, h, w);
    };

    const handleUserPropmtInput = (e) => {
        userPromptRef.current.style.height = 'inherit';
        userPromptRef.current.style.height = `${userPromptRef.current.scrollHeight}px`;
    };

    const handleConfirmImage = () => {
        console.log("Confirm button clicked");
        if (!generatedImage) {
            alert("Generate image first");
            return;
        }

        setSelectedImage(generatedImage);
        setGeneratedImage(null);
    }

    const handleCreateFinalImage = () => {
        console.log("Create final image button clicked");
    };
    return (
        <div className="container-fluid container-custom">
            <div className="header fs-3">
                <div className="step-1 col-3">
                    <span className="m-2">1. Upload wireframe</span>
                    <div className="m-2 button-container">
                        <InputGroup className="mb-3">
                            <input className="form-control" type="file" id="formFile" accept="image/*" onChange={handleImageUpload}></input>
                        </InputGroup>
                    </div>
                </div>
                <div className="step-2 col-3">
                    <span className="">2. Generate Image</span>
                    <div className="m-2 button-container">
                        <InputGroup className="mb-3">
                            <textarea className="form-control" id="userPrompt" ref={userPromptRef} 
                                placeholder='원하는 스타일을 입력해 주세요' rows="1" 
                                onInput={handleUserPropmtInput} 
                                onChange={e => setUserInput(e.target.value)}
                                style={{maxHeight: '4em'}} >
                            </textarea>
                        </InputGroup>
                        <div style={{textAlign: "right"}}>
                            <Button variant="success" type="button" className="generate-image-button" onClick={handleGerateImage}>Generate Design</Button>
                            <Button variant="primary" type="button" className="confirm-button" onClick={handleConfirmImage}>Confirm</Button>
                        </div>
                    </div>
                </div>
                <div className="step-3 col-3">
                    <span className="">3. Annotate Image</span>
                    <div className="m-2 button-container" style={{height: "auto"}}>
                        <InputGroup className="mb-3"  style={{justifyContent: "flex-end"}}>
                            <Button variant="primary" type="button" className="analyze-ocr-button" onClick={handleAnalyzeOcr}>Analyze OCR</Button>
                        </InputGroup>
                    </div>
                </div>
                <div className="step-4 col-3">
                    <span className="">4. Final Image</span>
                    <div className="m-2 button-container">
                        <InputGroup className="mb-3"  style={{justifyContent: "flex-end"}}>
                            <Button variant="primary" type="button" className="create-final-image-button" onClick={handleCreateFinalImage}>Create Final Image</Button>
                        </InputGroup>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="left-section">
                    <ImageViewer 
                        selectedImage={selectedImage}
                        handleCreatedAnnotation={handleCreatedAnnotation}
                    />
                </div>
                <div className="right-section">
                    <div className="image-container">
                        {generatedImage && (
                            <img src={generatedImage} alt="Uploaded" className="generated-image" style={{ maxWidth: '100%' }} />)
                        }
                    </div>
                    {/* <div className="text-container" ref={textContainerRef}>
                    </div> */}
                </div>
            </div>
            <div className="footer">
                © 2023 Over The Rainbow
            </div>
        </div>
    );
}

export default Main;