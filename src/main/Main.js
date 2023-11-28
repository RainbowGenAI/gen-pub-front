
import React, { useEffect, useState, useRef } from 'react';
import '../scss/Main.scss';
import { createWorker } from 'tesseract.js';
import { Button, InputGroup} from 'react-bootstrap';
import ImageViewer from './ImageViewer';
import ResultViewer from './ResultViewer';
import { fabric } from 'fabric';

import LLM from './LLM';

LLM.initOpenAI();

function Main() {
    const userPromptRef = React.useRef();
    const [selectedImage, setSelectedImage] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [userInput, setUserInput] = useState(null);
    const [labelInfo, setLabelInfo] = useState([]);
    const [isRightSection, setIsRightSection] = useState('image'); //image, text
    const textContainerRef = useRef(null);

    // useEffect(() => {
    // }, [selectedImage]);

    // useEffect(() => {
    // }, [generatedImage]);

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
        setIsRightSection('text');

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

    const handleGerateImage = () => {
        console.log("handleGerateImage button clicked");
        setIsRightSection('image');

        // LLM.createImage("test");
        LLM.createPromptByImage(userInput, selectedImage)
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

    const handleCreatedAnnotation = (label) => {
        console.log("handleCreatedAnnotation button clicked");
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
        console.log("Regenerate image button clicked");
        console.log(labelInfo)

        setIsRightSection('image');

        if (!selectedImage) {
            alert("Select image first");
            return;
        }

        fabric.Image.fromURL(selectedImage, function(img) {
            // 요소의 너비와 높이를 가져옵니다
            const width = img.width;
            const height = img.height;
            const canvas = new fabric.Canvas('canvas', {width: width, height: height});

            // 캔버스에 이미지를 추가합니다
            canvas.add(img);

            // 마스크로 사용할 객체를 생성합니다
            // const x = labelInfo[0].x ?? 0;
            // const y = labelInfo[0].y ?? 0;
            // const h = labelInfo[0].h ?? 0;
            // const w = labelInfo[0].w ?? 0;
            // const mask = new fabric.Rect({
            //     left: x,
            //     top: y,
            //     width: w,
            //     height: h,
            //     fill: '#fff', // 마스크 색상
            //     globalCompositeOperation: 'destination-out',
            // });

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
            
            // 캔버스를 렌더링하고 PNG 형식으로 내보냅니다
            const pngDataUrl = canvas.toDataURL('image/png');
            setGeneratedImage(pngDataUrl);

            LLM.modifyImage(selectedImage, pngDataUrl, 'test')
            .then((result) => {
                console.log(result);
                return result;
            });

        });

    };

    const handleGenerateHtmlCode = () => {
        console.log("Create final image button clicked");
        setIsRightSection('text');
        // LLM.createImage("test");
        LLM.createCodeByImage(selectedImage)
        .then((result) => {
            console.log(result);
            textContainerRef.current.textContent = result;
        }).catch((err) => {
            console.log(err);
        })
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
                            <Button variant="success" type="button" className="generate-image-button" style={{marginRight: '5px'}} onClick={handleGerateImage}>Generate Design</Button>
                            <Button variant="primary" type="button" className="confirm-button" onClick={handleConfirmImage}>Confirm</Button>
                        </div>
                    </div>
                </div>
                <div className="step-3 col-3">
                    <span className="">3. Modify Image</span>
                    <div className="m-2 button-container">
                        <Button variant="success" type="button" className="regenerate-image-button m-2" onClick={handleRegenerateImage}>Re-Generate Design</Button>
                        <Button variant="info" type="button" className="analyze-ocr-button m-2" onClick={handleAnalyzeOcr}>Analyze OCR</Button>
                        <Button variant="primary" type="button" className="confirm-button" onClick={handleConfirmImage}>Confirm</Button>
                    </div>
                </div>
                <div className="step-4 col-3">
                    <span className="">4. Generate Code</span>
                    <div className="m-2 button-container">
                        <InputGroup className="mb-3"  style={{justifyContent: "flex-end"}}>
                            <Button variant="primary" type="button" className="generate-html-code-button" onClick={handleGenerateHtmlCode}>Generate Code</Button>
                        </InputGroup>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="left-section">
                    <ImageViewer 
                        selectedImage={selectedImage}
                        labelInfo={labelInfo}
                        handleCreatedAnnotation={handleCreatedAnnotation}
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