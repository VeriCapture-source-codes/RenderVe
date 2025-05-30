import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../utils/api';

function GoLiveModal({ selectedCategory, onClose }) {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [caption, setCaption] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [finalizing, setFinalizing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cameraInitializing, setCameraInitializing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
  };

  const openCamera = async () => {
    setCameraInitializing(true);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (webcamRef.current && webcamRef.current.video) {
        webcamRef.current.video.srcObject = stream;
        setCameraReady(true);
      } else {
        throw new Error("Webcam element not ready.");
      }
    } catch (err) {
      toast.error("Failed to initialize camera.");
      console.error(err);
      setShowCamera(false);
    } finally {
      setCameraInitializing(false);
    }
  };

  const startRecording = () => {
    const stream = webcamRef.current?.video?.srcObject;
    if (!stream || !(stream instanceof MediaStream)) {
      toast.error("Camera not ready. Please wait or try reopening.");
      return;
    }

    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    setRecordedChunks([]);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      setVideoPreviewUrl(videoURL);

      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setShowCamera(false);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!caption || recordedChunks.length === 0) {
      toast.error('Please record a video and enter a caption.');
      return;
    }

    setSubmitting(true);

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const file = new File([blob], 'live-video.webm', { type: 'video/webm' });

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=52e670ee2efd441e887480afa902c4ff`);
        const geoData = await geoRes.json();
        const components = geoData.results[0].components;
        const state = components.state || components.region || '';

        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('media', file);
        formData.append('location', state);
        formData.append('category', selectedCategory);

        const result = await apiRequest({
          method: 'POST',
          route: '/posts/upload-post',
          formData,
        });

        if (result.success) {
          toast.success('Live video uploaded successfully!');
          resetModal();
        } else {
          toast.error(result.message || 'Failed to upload video.');
        }
      } catch (error) {
        toast.error('Error uploading video or fetching location.');
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }, (err) => {
      toast.error('Unable to access location.');
      console.error(err);
      setSubmitting(false);
    });
  };

  const resetModal = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
    }

    const tracks = webcamRef.current?.video?.srcObject?.getTracks();
    tracks?.forEach(track => track.stop());

    setShowCamera(false);
    setCameraReady(false);
    setCameraInitializing(false);
    setRecording(false);
    setMediaRecorder(null);
    setRecordedChunks([]);
    setVideoPreviewUrl(null);
    setCaption('');
    setFinalizing(false);
    setSubmitting(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#121212',
        borderRadius: '12px',
        padding: '2rem',
        width: '95%',
        maxWidth: '520px',
        color: '#fff',
        boxShadow: '0 0 20px rgba(0, 224, 184, 0.3)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>🎥 Go Live</h2>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#ccc', marginBottom: '1.2rem' }}>
          Category: <strong style={{ color: '#00e0b8' }}>{selectedCategory}</strong>
        </p>

        <div
          style={{
            border: '2px dashed #00e0b8',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            backgroundColor: '#1e1e1e',
            cursor: !showCamera && !videoPreviewUrl && !recording ? 'pointer' : 'default'
          }}
          onClick={!showCamera && !videoPreviewUrl && !recording ? openCamera : undefined}
        >
          {showCamera ? (
            <Webcam
              audio
              ref={webcamRef}
              videoConstraints={videoConstraints}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          ) : videoPreviewUrl ? (
            <video
              src={videoPreviewUrl}
              controls
              style={{ width: '100%', borderRadius: '8px' }}
            />
          ) : (
            <div style={{ color: '#00e0b8' }}>
              <img
                src="https://img.icons8.com/ios-filled/50/00e0b8/video-call.png"
                alt="Open Camera"
                style={{ marginBottom: '0.5rem' }}
              />
              <div>Click to open camera</div>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Enter a caption for your live video"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            border: '1px solid #00e0b8',
            borderRadius: '6px',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            fontSize: '0.95rem'
          }}
        />

        {showCamera && (
          <div style={{ marginBottom: '1.2rem', textAlign: 'center' }}>
            {recording ? (
              <button
                onClick={stopRecording}
                disabled={finalizing}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '0.6rem 1.5rem',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold'
                }}
              >
                Stop Recording
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={finalizing || cameraInitializing || !cameraReady}
                style={{
                  backgroundColor: '#00e0b8',
                  color: '#000',
                  padding: '0.6rem 1.5rem',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold'
                }}
              >
                {cameraInitializing ? 'Initializing...' : 'Start Recording'}
              </button>
            )}
            {recording && <p style={{ color: 'red', fontWeight: 'bold', marginTop: '0.5rem' }}>Recording...</p>}
            {finalizing && <p style={{ color: 'orange', fontWeight: 'bold' }}>Finalizing video...</p>}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={resetModal}
            disabled={submitting || finalizing}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: 'transparent',
              border: '1px solid #444',
              color: '#ccc',
              borderRadius: '5px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!caption || recordedChunks.length === 0 || finalizing || submitting}
            style={{
              backgroundColor: (!caption || recordedChunks.length === 0 || finalizing || submitting)
                ? 'gray'
                : '#00e0b8',
              color: '#000',
              padding: '0.6rem 1.5rem',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: (!caption || recordedChunks.length === 0 || finalizing || submitting)
                ? 'not-allowed'
                : 'pointer'
            }}
          >
            {submitting ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoLiveModal;
