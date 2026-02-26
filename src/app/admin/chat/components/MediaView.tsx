'use client';

import { Camera, Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import styles from './media-view.module.css';

export function MediaView() {
  const [images] = useState<string[]>([
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
  ]);

  const handleCapture = () => {
    console.log('Capture image');
  };

  const handleUpload = () => {
    console.log('Upload image');
  };

  return (
    <div className={styles.mediaView}>
      <div className={styles.cameraSection}>
        <div className={styles.cameraFrame}>
          <div className={styles.cameraPlaceholder}>
            <Camera size={32} className={styles.cameraIcon} />
          </div>
        </div>
        <h4 className={styles.sectionTitle}>Camera Active</h4>
        <p className={styles.instructions}>
          Live camera feed is displayed above. Click the button below to capture
          an image.
        </p>
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.captureButton}
            onClick={handleCapture}
          >
            <Camera size={18} className={styles.buttonIcon} />
            Capture
          </button>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={handleUpload}
          >
            <Upload size={18} className={styles.buttonIcon} />
            Upload
          </button>
        </div>
      </div>

      <div className={styles.imagesSection}>
        <h4 className={styles.imagesTitle}>Your Images :</h4>
        <div className={styles.imageGrid}>
          {images.map((image, index) => (
            <div key={index} className={styles.imageItem}>
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                className={styles.image}
                width={200}
                height={200}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
