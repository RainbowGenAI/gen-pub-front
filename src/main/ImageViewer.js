import React, { useEffect, useState, useRef } from 'react';
import '../scss/ImageViewer.scss';

import OpenSeadragon from 'openseadragon';
import Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';

let viewer = null;

function ImageViewer(props) {
  const [label, setLabel] = useState(null);

  useEffect(() => {
    if(!label) return;
    const text = extractTextFromBbox(props.ocrData, label);
    console.log(text);
    label.ocrText = text;

    props.handleCreatedAnnotation(label);

  }, [label]);

  const formatter = (annotation) => {

    var tagBodies = annotation.bodies.filter(function(body) {
      return body.type === 'TextualBody' && body.purpose === 'tagging';
    });

    console.log(tagBodies)
    if (tagBodies.length === 0) {
        return;
    }

    // E.g. you could return the first tag, and Annotorious will add it as a CSS class name
    return tagBodies[0].value;
  }

  useEffect(() => {
      if(!props.selectedImage) return;
      const selectedImage = props.selectedImage;

      // console.log(selectedImage);
      if(viewer) {
          viewer.destroy();
      }
      
      viewer = OpenSeadragon({
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
          zoomPerClick: 1
      });

      const config = {
            formatter: formatter
          }

      const anno = Annotorious(viewer, config);

      anno.on('createAnnotation', function(a) {
           console.log(a);
          const comment = a.body[0].value;
          const xywh = a.target.selector.value;
          const values = xywh.replace("xywh=pixel:", "").split(",");
          // console.log(comment, xywh);

          const x = parseFloat(values[0]);
          const y = parseFloat(values[1]);
          const w = parseFloat(values[2]);
          const h = parseFloat(values[3]);

          // console.log(x, y, h, w);
          
          const label = {
            comment: comment,
            x: x,
            y: y,
            h: h,
            w: w,
          };

          setLabel(label);

          // props.handleCreatedAnnotation(label);
          
      });

    }, [props.selectedImage]);

    function extractTextFromBbox(ocrData, label) {
      const { x: left, y: top, w: width, h: height } = label;
      const right = left + width;
      const bottom = top + height;
    
      // OCR 데이터에서 bounding box에 해당하는 텍스트를 추출합니다
      let texts = "";
      ocrData.filter(line => {
          const words = line.words.filter(word => {
              const { x0: wordLeft, y0: wordTop, x1: wordRight, y1: wordBottom } = word.bbox;

              // 아이템의 좌표가 bounding box 내부에 있는지 확인합니다
              return wordLeft >= left && wordTop >= top && wordRight <= right && wordBottom <= bottom;
          }).map(word => word.text);

          if(words.length > 0) {
            if(texts.length > 0) texts += '\n';
            texts += words.join(' ');
          }
      });

      // 추출된 텍스트를 반환합니다
      return texts;
      
    }


    //Stop error resizeObserver
    const debounce = (callback, delay) => {
      let tid;
      return function (...args) {
        const ctx = this;
        tid && clearTimeout(tid);
        tid = setTimeout(() => {
          callback.apply(ctx, args);
        }, delay);
      };
    };
    
    const _ = window.ResizeObserver;
    window.ResizeObserver = class ResizeObserver extends _ {
      constructor(callback) {
        callback = debounce(callback, 20);
        super(callback);
      }
    };


  return (
    <>
      <div id="openseadragonId-1" style={{width: "100%", height: "100%"}}></div>
    </>
  );
}

export default ImageViewer;
