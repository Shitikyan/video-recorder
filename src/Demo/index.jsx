import React, { useRef, useState } from 'react';
import VideoRecorder from '../video-recorder';
import './Demo.scss';

const MAX_WIDTH = 640;
const MIN_WIDTH = 50;

const Demo = () => {
  const $RecorderRef = useRef(null);

  const [width, setWidth] = useState(450);
  const [height, setHeight] = useState(450);

  const onStart = () => console.log('Start.');
  const onStop = () => console.log('Stop.');
  const onProgress = (e) => console.log(`Propgress ${e}`);
  const onDownload = () => console.log('Download');

  return (
    <div>
      <div className='buttons'>
        <button onClick={() => $RecorderRef.current.start()}>START</button>

        <button onClick={() => $RecorderRef.current.stop()}>STOP</button>

        <button onClick={() => $RecorderRef.current.download()}>
          DOWNLOAD
        </button>
        <button
          onClick={() => {
            if (width < MAX_WIDTH) {
              setWidth((oldState) => oldState + 100);
              setHeight((oldState) => oldState + 100);
            }
          }}
        >
          Make Container Larger
        </button>
        <button
          onClick={() => {
            if (width > MIN_WIDTH) {
              setWidth((oldState) => oldState - 100);
              setHeight((oldState) => oldState - 100);
            }
          }}
        >
          Make Container Smaller
        </button>
      </div>
      <div style={{ width: width, height: height }}>
        <VideoRecorder
          className='test-web-cam'
          ref={$RecorderRef}
          onStart={onStart}
          onStop={onStop}
          onProgress={onProgress}
          onDownload={onDownload}
          timeLimit={10}
          audio={false}
        />
      </div>
    </div>
  );
};
export default Demo;
