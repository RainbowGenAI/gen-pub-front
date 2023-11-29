import React, { useEffect, useState, useRef } from 'react';
// import '../scss/ImageViewer.scss';

import OpenSeadragon from 'openseadragon';
let viewer = null;

function ResultViewer(props) {

  useEffect(() => {
      if(viewer) viewer.destroy();
      
      if(!props.generatedImage) return;


      const generatedImage = props.generatedImage;


      
      viewer = OpenSeadragon({
          id: 'openseadragonId-2',
          tileSources: {
              type: 'image',
              url: generatedImage,
          },
          showNavigator: true,
          navigatorPosition: 'BOTTOM_RIGHT',
          navigatorHeight: 100,
          navigatorWidth: 100,
          zoomInButton: 'zoom-in',
          zoomOutButton: 'zoom-out',
          zoomPerClick: 1,
      });


    }, [props.generatedImage]);

    //Stop error resizeObserver
    // const debounce = (callback, delay) => {
    //   let tid;
    //   return function (...args) {
    //     const ctx = this;
    //     tid && clearTimeout(tid);
    //     tid = setTimeout(() => {
    //       callback.apply(ctx, args);
    //     }, delay);
    //   };
    // };
    
    // const _ = window.ResizeObserver;
    // window.ResizeObserver = class ResizeObserver extends _ {
    //   constructor(callback) {
    //     callback = debounce(callback, 20);
    //     super(callback);
    //   }
    // };


  return (
    <>
      <div id="openseadragonId-2" style={{width: "100%", height: "100%"}}></div>
    </>
  );
}

export default ResultViewer;
