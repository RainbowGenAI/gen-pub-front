
import React, { useEffect, useState, useRef } from 'react';
import './Main.scss';
import { createWorker } from 'tesseract.js';
import { Button, InputGroup, Form} from 'react-bootstrap';
import OpenSeadragon from 'openseadragon';
import Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';

import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";

const OPENAI_CONFIG = {
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
    temperature: 0.9,
}

const llm = new OpenAI(OPENAI_CONFIG);
const chatModel = new ChatOpenAI(OPENAI_CONFIG);

function Main() {
    const [selectedImage, setSelectedImage] = useState(null);
    const textContainerRef = useRef(null);

    // for OpenSeadragon    
    useEffect(() => {
        if(!selectedImage) return;
        const viewer = OpenSeadragon({
            id: 'openseadragonId-1',
            tileSources: {
                type: 'image',
                url: selectedImage,
            },
            showNavigator: true,
            navigatorPosition: 'BOTTOM_RIGHT',
            navigatorHeight: 100,
            navigatorWidth: 100,
            zoomInButton: 'zoom-in',
            zoomOutButton: 'zoom-out',
            // sequenceMode: true,
            // showReferenceStrip: true,
            // homeButton: 'home',
        });

        const anno = Annotorious(viewer);

        // Load annotations in W3C WebAnnotation format
        anno.loadAnnotations('annotations.w3c.json');

        // Attach handlers to listen to events
        anno.on('createAnnotation', function(a) {
            // Do something
            console.log(a); // => 'my-selector'
            const value = target.body.value; // => 'my-value'
            // value parsing 하기
            value
        });

    }, [selectedImage]);


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

        textContainerRef.current.textContent = response.data.text;
        await worker.terminate();
    };

    const handleAnalyzeImage = async () => {
        console.log("handleAnalyzeImage button clicked");
        const text = "What would be a good company name for a company that makes colorful socks?";
        
        const llmResult = await llm.predict(text);
        console.log("llmResult", llmResult);
        
        const chatResult = await chatModel.predict(text);
        console.log("chatResult", chatResult);

        textContainerRef.current.textContent = "LLM Result : " + llmResult;
    };

    const handleGerateImage = () => {
        console.log("handleGerateImage button clicked");
    };


    return (
        <div className="container-fluid container-custom">
            <div className="header fs-3">
                <div className="step-1 col-3 bg-secondary">
                    <span className="m-2">Step 1</span>
                    <div className="m-2 button-container">
                        <InputGroup className="mb-3">
                            <input className="form-control" type="file" id="formFile" accept="image/*" onChange={handleImageUpload}></input>
                        </InputGroup>
                    </div>
                </div>
                <div className="step-2 col-3 bg-success">
                    <span className="">Step 2</span>
                    <div className="m-2 button-container">
                        <InputGroup className="mb-3">
                            <Button variant="warning" type="button" className="confirm-button" onClick={handleAnalyzeImage}>Analyze Image</Button>
                            <Button variant="primary" type="button" className="confirm-button" onClick={handleGerateImage}>Generate Design</Button>
                        </InputGroup>
                    </div>
                </div>
                <div className="step-3 col-3 bg-warning">
                    <span className="">Step 3</span>
                    <div className="m-2 button-container">
                        <InputGroup className="mb-3">
                            <Button variant="primary" type="button" className="confirm-button" onClick={handleAnalyzeOcr}>Analyze OCR</Button>
                        </InputGroup>
                    </div>
                </div>
                <div className="step-4 col-3 bg-info">
                    <span className="">Step 4</span>
                </div>
            </div>
            <div className="content">
                <div className="left-section">
                    <div id="openseadragonId-1" style={{width: "100%", height: "100%"}}></div>
                    {/* {selectedImage && (
                        <img src={selectedImage} alt="Uploaded" className="uploaded-image" style={{ maxWidth: '100%' }} />
                    )} */}
                </div>
                <div className="right-section">
                    <div className="text-container" ref={textContainerRef}>
                    </div>
                </div>
            </div>
            <div className="footer">
                © 2023 Over The Rainbow
            </div>
        </div>
    );
}

export default Main;