import React, { useRef, useState } from 'react';
import VideoRecorder from '../video-recorder';
import './Demo.scss';

const Demo = () => {
  const $RecorderRef = useRef(null);

  const [width, setWidth] = useState(250);
  const [height, setHeight] = useState(250);

  const onStart = () => console.log('Start.');
  const onStop = () => console.log('Stop.');
  const onProgress = (e) => console.log(`Progress ${e}`);
  const onDownload = () => console.log('Download');

  return (
    <div style={{ width: width, height: height }}>
      <div>
        <button onClick={() => $RecorderRef.current.stop()}>STOP</button>

        <button onClick={() => $RecorderRef.current.start()}>START</button>

        <button onClick={() => $RecorderRef.current.download()}>
          DOWNLOAD
        </button>
        <button
          onClick={() => {
            setWidth((oldState) => oldState + 100);
            setHeight((oldState) => oldState + 100);
          }}
        >
          Make container larger
        </button>
        <button
          onClick={() => {
            setWidth((oldState) => oldState - 100);
            setHeight((oldState) => oldState - 100);
          }}
        >
          Make container smaller
        </button>
      </div>

      <VideoRecorder
        ref={$RecorderRef}
        className='test-web-cam'
        onStart={onStart}
        onStop={onStop}
        onProgress={onProgress}
        onDownload={onDownload}
        timeLimit={10}
        audio={false}
      />
    </div>
  );
};
export default Demo;
