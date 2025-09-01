'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './AudiobookPlayer.module.css';

export default function AudiobookPlayer({ book }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const time = (e.target.value / 100) * duration;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    const volumeValue = e.target.value / 100;
    audio.volume = volumeValue;
    setVolume(volumeValue);
  };

  const handlePlaybackRateChange = (e) => {
    const audio = audioRef.current;
    const rate = parseFloat(e.target.value);
    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.playerContainer}>
      <audio ref={audioRef} src={`/audiobooks/${book.id}.mp3`} />
      
      <div className={styles.playerInfo}>
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
      </div>
      
      <div className={styles.controls}>
        <button onClick={togglePlay} className={styles.playButton}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <div className={styles.progressContainer}>
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className={styles.progressBar}
          />
          <span>{formatTime(duration)}</span>
        </div>
        
        <div className={styles.volumeContainer}>
          <label>Volume:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
          />
        </div>
        
        <div className={styles.playbackRateContainer}>
          <label>Speed:</label>
          <select 
            value={playbackRate} 
            onChange={handlePlaybackRateChange}
            className={styles.playbackRateSelect}
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>
    </div>
  );
}