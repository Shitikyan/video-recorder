import React from 'react';
import Webcam from 'react-webcam';

import './VideoRecorder.scss';

/**
 * @summary Represents video recorder component.
 *
 * @param {boolean} [audio=true] Indicates whether to record audio. Defaults to true.
 * @param {number} timeLimit Indicates max size of video in seconds.
 *
 * @fires onStart Fired when video capturing starts.
 * @fires onStop Fired when video capturing finished.
 * @fires onProgress Fired each second during video capturing.
 * @fires onDownload Fired when video is downloaded.
 */
class VideoRecorder extends React.Component {
  $webcamRef = React.createRef();
  $mediaRecorderRef = null;

  constructor(options) {
    super(options);

    this.timerInterval = null;

    this.state = {
      sec: 0,
      recordedChunks: [],
      recording: false,
    };
  }

  /**
   * Starts video recording.
   */
  start() {
    this.setState({ recordedChunks: [], recording: true });

    this.timerInterval = setInterval(() => {
      const { sec } = this.state;
      this.setState({ sec: sec + 1 });

      this.emitEvent('onProgress', sec);

      if (this.props.timeLimit && sec == this.props.timeLimit) {
        this.stop();
      }
    }, 1000);

    this.$mediaRecorderRef = new MediaRecorder(this.$webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    this.$mediaRecorderRef.addEventListener(
      'dataavailable',
      this.addChunks.bind(this)
    );
    this.$mediaRecorderRef.start();
    this.emitEvent('onStart');
  }

  /**
   * Stops video recording.
   */
  stop() {
    if (this.$mediaRecorderRef.state !== 'inactive') {
      this.$mediaRecorderRef.stop();
      clearInterval(this.timerInterval);
      this.setState({ sec: 0, recording: false });

      const blob = new Blob(this.state.recordedChunks, {
        type: 'video/mp4',
      });

      this.emitEvent('onStop', { blob });
    }
  }

  /**
   * Downloads last recorded video.
   */
  download() {
    if (this.state.recordedChunks.length) {
      const blob = new Blob(this.state.recordedChunks, {
        type: 'video/mp4',
      });
      this.setState({ recordedChunks: [] });
      this.downloadBlob(blob);
      this.emitEvent('onDownload');
    }
  }

  /**
   * Internal usage.
   */
  downloadBlob(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'webcam-capture.mp4';
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Internal usage.
   */
  addChunks({ data }) {
    if (data.size > 0) {
      this.setState({ recordedChunks: this.state.recordedChunks.concat(data) });
    }
  }

  /**
   * Internal usage.
   */
  emitEvent(type, ...args) {
    if (this.props[type]) {
      this.props[type](...args);
    }
  }

  /**
   * Internal usage.
   */
  get minutes() {
    const { sec } = this.state;
    const min = Math.floor(sec / 60);
    return min < 10 ? `0${min}` : min;
  }

  /**
   * Internal usage.
   */
  get seconds() {
    let { sec } = this.state;
    sec = sec % 60;
    return sec < 10 ? `0${sec}` : sec;
  }

  render() {
    const { $webcamRef } = this;
    const { recording } = this.state;
    const { audio, className } = this.props;

    return (
      <div className='webcam'>
        <Webcam
          style={{ width: '100%', height: '100%' }}
          className={className ?? null}
          audio={audio ?? true}
          ref={$webcamRef}
        />
        {recording && (
          <p className='time'>
            {this.minutes}:{this.seconds}
          </p>
        )}
      </div>
    );
  }
}

export default VideoRecorder;
