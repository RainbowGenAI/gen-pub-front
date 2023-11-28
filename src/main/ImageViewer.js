import React, { useEffect, useState, useRef } from 'react';
import '../scss/ImageViewer.scss';

import OpenSeadragon from 'openseadragon';
import Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';

let viewer = null;

function ImageViewer(props) {

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
          zoomPerClick: 1,
      });

      const anno = Annotorious(viewer);

      anno.on('createAnnotation', function(a) {
          // console.log(a);
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
          
          props.handleCreatedAnnotation(label);
          
      });

    }, [props.selectedImage]);

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
