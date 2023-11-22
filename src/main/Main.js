
import React, { useEffect, useState } from 'react';
import './Main.scss';
import { createWorker } from 'tesseract.js';
import { Button, InputGroup, Form} from 'react-bootstrap';
import OpenSeadragon from 'openseadragon';
import Annotorious from '@recogito/annotorious-openseadragon';

import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';


function Main() {
    const [selectedImage, setSelectedImage] = useState(null);


    useEffect(() => {
        if(!selectedImage) return;

        // Initialize OpenSeadragon
        const viewer = OpenSeadragon({
            id: 'openseadragonId-1',
            // other OpenSeadragon options...
            // prefixUrl: 'openseadragon/images/',
            // tileSources: 'https://path-to-your-image.dzi',
            tileSources: {
                type: 'image',
                url: selectedImage,
            },
            // sequenceMode: true,
            // showReferenceStrip: true,
            // referenceStripScroll: 'horizontal',
            // referenceStripElement: 'referenceStrip',
            // referenceStripHeight: 100,
            // referenceStripWidth: 100,
            // referenceStripPosition: 'BOTTOM_LEFT',
            // referenceStripScroll: 'horizontal',
            // showNavigator: true,
            navigatorPosition: 'BOTTOM_RIGHT',
            navigatorHeight: 100,
            navigatorWidth: 100,
            zoomInButton: 'zoom-in',
            zoomOutButton: 'zoom-out',
            // homeButton: 'home',
        });

        // Initialize Annotorious
        const anno = Annotorious(viewer);

        // const script = document.createElement('script');
        // script.src = 'openseadragon/openseadragon.min.js';
        // script.async = true;
        // document.body.appendChild(script);

        // return () => {
        //     document.body.removeChild(script);
        // }
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
        <div className="container-fluid container-custom">
            <div className="header fs-3">
                <div className="step-1 col-3 bg-secondary">
                    <span className="m-2">Step 1</span>
                    <div className="m-2 button-container">
                        <InputGroup className="mb-3">
                            <input className="form-control" type="file" id="formFile" accept="image/*" onChange={handleImageUpload}></input>
                            <Button variant="primary" type="button" className="confirm-button" onClick={handleAnalyzeOcr}>Analyze OCR</Button>
                        </InputGroup>
                    </div>
                </div>
                <div className="step-2 col-3 bg-success">
                    <span className="">Step 2</span>
                </div>
                <div className="step-3 col-3 bg-warning">
                    <span className="">Step 3</span>
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
                    <div className="text-container">
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