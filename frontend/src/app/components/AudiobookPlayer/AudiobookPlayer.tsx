'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '../../api/apiService';
import styles from './AudiobookPlayer.module.css';

export default function AudiobookPlayer({ book }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.getProgress(book.id, token);
          setProgress(response.progress);
          // Set current time based on progress
          if (audioRef.current) {
            audioRef.current.currentTime = (response.progress / 100) * duration;
          }
        } catch (err) {
          console.error('Failed to fetch listening progress');
        }
      }
    };

    fetchProgress();
  }, [book.id, duration]);

  const updateProgress = async (newProgress) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.updateProgress(book.id, newProgress, token);
        setProgress(newProgress);
      } catch (err) {
        console.error('Failed to update listening progress');
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      // Update progress
      if (audio.duration > 0) {
        const newProgress = (audio.currentTime / audio.duration) * 100;
        updateProgress(newProgress);
      }
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      // Mark as 100% complete when finished
      updateProgress(100);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleAudioEnd);
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
        
        <div className={styles.progressText}>
          Progress: {progress.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}