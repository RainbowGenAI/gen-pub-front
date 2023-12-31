
import React, { useEffect, useState, useRef } from 'react';
import '../scss/Main.scss';
import { createWorker } from 'tesseract.js';
import { Button, InputGroup} from 'react-bootstrap';
import ImageViewer from './ImageViewer';
import ResultViewer from './ResultViewer';
import { fabric } from 'fabric';

import LLM from './LLM';

import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Resizer from "react-image-file-resizer";



LLM.initOpenAI();

function Main() {
    const userPromptRef = React.useRef();
    const [selectedImage, setSelectedImage] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [userInput, setUserInput] = useState(null);
    const [labelInfo, setLabelInfo] = useState([]);
    const [isRightSection, setIsRightSection] = useState('image'); //image, text
    const [ocrData, setOcrData] = useState([]);
    const textContainerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isFirst, setIsFirst] = useState(true);

    const resizeFile = (file) =>
      new Promise((resolve) => {
        Resizer.imageFileResizer(
          file, // Blob
          1024, // maxWidth.
          1024,// maxHeight
          "PNG",// Format.
          80, // Quality 100 is max.
          0,
          (uri) => {
            resolve(uri);
          },
          "file" // output type = base64 | blob | file
        );
      }
    );


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

    useEffect(() => {
        if (selectedImage && isFirst) {
            handleAnalyzeOcr();
            setIsFirst(false);
        }
    }, [selectedImage]);

    const handleAnalyzeOcr = async () => {
        console.log("Confirm button clicked");
        setIsRightSection('text');

        if (!selectedImage) {
            alert("Select image first");
            return;
        }
        setLoading(true);

        const worker = await createWorker();
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.reinitialize('eng');
        const response = await worker.recognize(selectedImage);
        setLoading(false);

        console.log(response.data.lines);
        setOcrData(response.data.lines);
        textContainerRef.current.textContent = response.data.text;

        await worker.terminate();
    };

    const handleGerateImage = () => {
        console.log("handleGerateImage button clicked");

        if (!selectedImage) {
            alert("Select image first");
            return;
        }
        
        setIsRightSection('image');

        // LLM.createImage("test");
        setLoading(true);
        LLM.createPromptByImage(userInput, selectedImage)
        .then((result) => {
            console.log(result);
            return result;
        })
        .then((result) => {
            return LLM.createImage(result);
        })
        .then((result) => {
            setLoading(false);
            console.log(result.substring(0, 50));
            setGeneratedImage(result);
        })
        .catch((err) => {   
            alert("Please try again");
            // console.log(err);
        });
    };

    const handleCreatedAnnotation = (label) => {
        console.log("handleCreatedAnnotation button clicked");
        console.log(label);
        setLabelInfo(labelInfo => [...labelInfo, label]);
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

    const handleRegenerateImage = () => {
        console.log("Regenerate image button clicked", labelInfo);

        setIsRightSection('image');
        setLoading(true);

        if (!selectedImage) {
            alert("Select image first");
            return;
        }

        let pngDataUrl = null;
        fabric.Image.fromURL(selectedImage, function(img) {
            // 요소의 너비와 높이를 가져옵니다
            const width = img.width;
            const height = img.height;
            const canvas = new fabric.Canvas('canvas', {width: width, height: height});

            // 캔버스에 이미지를 추가합니다
            canvas.add(img);

            // labelInfo 배열의 각 요소에 대해 new fabric.Rect를 생성하고 canvas.add를 호출합니다
            labelInfo.forEach(label => {
                const rect = new fabric.Rect({
                    left: label.x,
                    top: label.y,
                    width: label.w,
                    height: label.h,
                    fill: '#fff',
                    globalCompositeOperation: 'destination-out',
                });
            
                // 캔버스에 마스크를 추가합니다
                canvas.add(rect);
            });

            // 이미지의 크기를 조정합니다
            // img.scaleToWidth(width);
            // canvas.setHeight(img.getScaledHeight());
            
            pngDataUrl = canvas.toDataURL('image/png', 0.5);

        });

        let selectedImageFile = null;
        let maskedImageFile = null;
        base64ToFile(selectedImage, "\\selectedImage.png")
        .then(async(result) => {
            const convertedInputFile1 = await resizeFile(result);
            selectedImageFile = convertedInputFile1;
        })
        .then(() => {
            return base64ToFile(pngDataUrl, "\\maskedImage.png");
        })
        .then(async(result) => {
            const convertedInputFile2 = await resizeFile(result);
            maskedImageFile = convertedInputFile2;
        })
        .then(() => {
            console.log(selectedImageFile);
            console.log(maskedImageFile);
            return LLM.modifyImage(selectedImageFile, maskedImageFile, labelInfo, ocrData)
        })
        .then((result) => {
            setLoading(false);
            setGeneratedImage(result)
        });
    };

    async function base64ToFile(base64String, filename) {
        // fetch the base64 string
        const response = await fetch(base64String);
      
        // get a Blob from the response
        const blob = await response.blob();
      
        // create a File from the Blob
        const file = new File([blob], filename, { type: blob.type });
      
        return file;
      }

    const handleGenerateHtmlCode = () => {
        console.log("Create final image button clicked");
        setIsRightSection('text');
        // LLM.createImage("test");
        setLoading(true);
        LLM.createCodeByImage(selectedImage)
        .then((result) => {
            setLoading(false);
            console.log(result);
            result = result.split("```html")[1].split("```");
            textContainerRef.current.textContent = result;
        }).catch((err) => {
            setLoading(false);
            console.log(err);
        })
    };

    const handleCheckByNewTab = () => {
        var win = window.open('','Title','height=300,width=300');
        win.document.body.innerHTML = textContainerRef.current.textContent;
    };

    async function base64ToFile(base64String, filename) {
        // fetch the base64 string
        const response = await fetch(base64String);
      
        // get a Blob from the response
        const blob = await response.blob();
      
        // create a File from the Blob
        const file = new File([blob], filename, { type: blob.type });
      
        return file;
    }

    return (
        <div className="container-fluid container-custom">
        {loading && <div style={{
                               position: "fixed",
                               left: "50%",
                               top: "50%",
                               transform: "translate(-50%, -50%)"}}>
            {<Spinner animation="grow" variant="warning" role="status">
                <span className="sr-only"></span>
            </Spinner>}
        </div>}
            <div className="header fs-3">
                <div className="step-1 col-3">
                    <span className="m-2">1. Upload Wireframe</span>
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
                            <Button variant="success" type="button" className="generate-image-button" style={{marginRight: '5px'}} onClick={handleGerateImage}>Generate Design</Button>
                            <Button variant="primary" type="button" className="confirm-button" onClick={handleConfirmImage}>Confirm</Button>
                        </div>
                    </div>
                </div>
                <div className="step-3 col-3">
                    <span className="" >3. Modify Image</span>
                    <div className="m-2 button-container" style={{height: '100px', display:'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                        <Button variant="success" type="button" className="regenerate-image-button" style={{marginRight: '5px'}} onClick={handleRegenerateImage}>Re-Generate</Button>
                        <Button variant="primary" type="button" className="confirm-button" onClick={handleConfirmImage}>Confirm</Button>
                    </div>
                </div>
                <div className="step-4 col-3">
                    <span className="">4. Generate Code</span>
                    <div className="m-2 button-container" style={{height: '100px', display:'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}} >
                        <Button variant="success" type="button" className="generate-html-code-button" style={{marginRight: '5px'}} onClick={handleGenerateHtmlCode}>Generate Code</Button>
                        <Button variant="warning" type="button" className="check-html-code-button" onClick={handleCheckByNewTab}>Check by new Tab</Button>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="left-section">
                    <ImageViewer 
                        selectedImage={selectedImage}
                        labelInfo={labelInfo}
                        handleCreatedAnnotation={handleCreatedAnnotation}
                        ocrData={ocrData}
                    />
                </div>
                <div className="right-section">
                    <div className={`image-container ${isRightSection != 'image'? 'hide' : ''}`}>
                        {/* {generatedImage && (
                            <img src={generatedImage} alt="Uploaded" className="generated-image" />)
                        } */}
                        <ResultViewer 
                            generatedImage={generatedImage}
                        />
                    </div>
                    <div className={`text-container ${isRightSection != 'text'? 'hide' : ''}`} ref={textContainerRef}>
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