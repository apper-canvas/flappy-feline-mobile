import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const PlayIcon = getIcon('Play');
const PauseIcon = getIcon('Pause');
const RotateCcwIcon = getIcon('RotateCcw');
const TrophyIcon = getIcon('Trophy');
const VolumeXIcon = getIcon('VolumeX');
const Volume2Icon = getIcon('Volume2');
const InfoIcon = getIcon('Info');
const XIcon = getIcon('X');
const HeartIcon = getIcon('Heart');

const GRAVITY = 0.5;
const JUMP = -9;
const PIPE_WIDTH = 80;
const PIPE_GAP = 180;
const PIPE_SPEED = 3;
const CAT_WIDTH = 50;
const CAT_HEIGHT = 40;

const MainFeature = () => {
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const catImageRef = useRef(null);
  const skyImageRef = useRef(null);
  const groundImageRef = useRef(null);
  const pipeTopImageRef = useRef(null);
  const pipeBottomImageRef = useRef(null);
  
  const [gameState, setGameState] = useState({
    isActive: false,
    isOver: false,
    isPaused: false,
    score: 0,
    highScore: localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0
  });
  
  const [cat, setCat] = useState({
    y: 250,
    velocity: 0
  });
  
  const [pipes, setPipes] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [livesLeft, setLivesLeft] = useState(3);
  const [loadingError, setLoadingError] = useState(false);

  // Load images before starting the game
  useEffect(() => {
    const images = [
      { 
        ref: catImageRef, 
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADkUlEQVR4nO2ZW4hNURjHf2OSeM6QcnmQa3J5kEuaSB7kWV7kUiTlUnjgwYMylJJLSJFLKbk8oCR5oEjKgzxILg9ILpnJbUzGZfytz65jOs45e5+z9tlnNvOrv87MXv/vW9+31lrfWnuDgoKCggqlCtgEdALdQIswfm8Hnge6gI3AdD8bdRJoBxJZogM44Uej7gMfsmiM6p50s1GVwEfNRvQAu4FaYKLwu/z2TR6jepRz0xfUAkPACNCYY9w64KeMfZbLBOuAT/KkD+UZP0M03aJ+rRPGtctT3m1i7nQZ2yPqdcYMwKwFXgvxWxNzb8rYLlHXGDMAswT4IGRrTcxtlLH9oq40ZgBmLvBWyNabmLtAxo6IutSYAZiZwGshe2hibiL0z0VdN2XMAMx04KWQHTMxd0zGfhV1pTEDogfyCXgCDPMXw3Qr/xD1HNgA9AFfgUtAhYm5Y2kfsBI4KQPvAVvlFjsGrACOAHdkfIL+S02FrgT4IY2aBbSJ7wfQCLQCdUAjcAu4CrSEwk+/mEzXU6XaVlG/AwaK7kSZaKsQf5bfU2IEOCfq6jx5p1pyVD+wppgOlJNmAW+E/GkOkd8S4W0R9TtgfrGMl5sagX9C/iwHydZI1qbUG0SbnNWoQcJDogWpD71F9O9C5K9FbU3Y9VYRj5M2Ac9Ed75AutkhsYPkkOWGG3LAfwPrCyBdJOpm0X8JRNmsdH8G+JnFkGHghKgXiqFm6a+YWuOErcBPITxbyLWWBUuBr0J6IqJdsFh5ogpY7TE/jVbpsX9A7RcJsN6JVG94QwzNT0M0+BqlXMGCYEvNKp+D7WLkmYfkxuC70bX2lrphrYGjHxjTYGW6YEBkxKpA26Xu2E35PUqZyRjQ7CLZPuCbhjENVqYroJwrTuUVTcAXDUParEwXzBPPm/OKWRqH3AYrUzRJ75bKK5bKLaRDm8F0TXDW+NbKK6py1GIjBtM1wQPg+3/oFPDdY/JmGbJbZLO0c9R4GYgmF1KnJJuVwOQaXy51WHI6VcCwFxkcPgdlxmB5brsrL/Mc+6cM4MpSN+xz8GSJyPp8GsC1QWP43p1/SBxnZpyQGW7TCeFsZnOciENnrk2IQ2euTYhT8e7YhDj1io5NiFO779iE/yGrVpBSrTY6NsFp9W4wXRPUtrgXeJQZ1rKcvUQs8KfMZytwLTQgoaCgoKAgzvgNC9lPkL8FNq8AAAAASUVORK5CYII="
      },
      { 
        ref: skyImageRef, 
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAnFBMVEUAre////8Aqe4Ap+4Ape0Ao+35/f7t+P0Asu8ArO/0+/72/P7w+f3q9/3g8/rX7/vR7PrG6PnA5fi04/ex4Pap3fakrejD5/mt3/al2/aj2fai2PWh1/Sd1fOc1POb0/OZ0vKY0fKW0PKU0PKUz/KTzvKSzfKQzPKOy/GNyvGMyfGLyPGKx/GJxvGIxfGHxPGGw/GHwvGEwfCDwPCC61LGAAAEM0lEQVR4Ae3aXXOiMBQG4AOCEQFW1irqWnVrl7rdbnv//5+7M+1Mp9NYSHLic5/rtN5NePMBQcQYY4wxxhhjjDHGGGOMMcYYY4wxxlqtM5ksZ7PldNLJ7/v6epOmaWM6Gnjbm0S95S5NU+k/pN00XPdbHnIYzSPxPc3G3vomlePdnxgecu6vxEnHnlcm6hzcCX5zOMcucuEFxnLkywTh1mE9hUYb3fv+aMw9zPNOWr2vsXsP00zHHu439mCWXs/VF/TuHIyS/j3c78XAJBrqC3qp5SdASV2/t9x7MIbc+noBzDyYQm713/9Pvf6/nEB69gAQm+RqAw+mEJnuDxA7D6aQA90fIN56MIXMtAGMYq0LQHmwV+KoC+CPMC8GlcSGApDZpWX5MDEGlYcFgXUHj+hn3yqS7nP0GzVH2vUk4vI3VQyEsO4MOMV/8OdxBSPPQIr/5OsaiDtgAZRQ1gCw9yoQCHABdFkDlS/NLYAaa+BHfgBzBuayAGBkAdTKS/NbCuQxmCXAwQKotT4AZA3ANAa3BDhZADXWx4CyBmDOgDKERRYAzGVg7g7oLOEdYJbh3gEgA7MYhOkQUJeQDgFzCeoQMJeQDgFTCewQMJWwDgFTCZsD5hLYIWAqgR0C5hLWIWAuYR0Cphq4BDhT0CQGlRtgDoA5A2opwB1gzoBaCuQxmCVAHoNZAuQxmCVA3gHmDKilgD0DzBlwTQHsGWDOgHsKYO8AcwbUUiDvAHMGXFMA+wwwZ8A1BfAy8CjQDhFbvAFE/zT6ZwG/S0jvAacUwMvAb+I9oFl+q9jGKUBQA5Wv21YOguoF9gAotgSqGELaEjKXACeD9gRNJcjJgD0BYwl0MiCPQXMJdDJgldDJsNNvid/8QjoBsBT/2zqDCSRED4A1BH5LAcwzgFkCnQGygh/rCrwjCJdAX8fWw+D3FEgFfBHD7ynwLeBbCnxPgVzADYL8mLQEfk+BjYCrx8AlBc58Abf1+HJo13vXuxveCbhDwUWZTVN8D7xYhfBvCqxK+KYCK/EnBXLxNwVKcSsFpPhUk/1KdRBuXgY3UmArvl2cqS2v1PK7S11xOwVUCRWXlHPYnQJd8eNqVe0/hfUpcBLFZbXaOQbLU2BY3LowN4XdKbARxcXNmtJ+IcNmn4pL0sJyJfP8FEjEjSeA2mNk9eF/EPV+CWQJ8NNJPPwSMHUPoP4xQP0CUH0XQP1FIPUrgPpXQdW/DKb+dVD1GwHUbwVRvxlI/XYw9RvC1G8J/BPawtRvC1S/MVT91lD1m4PVbw9Xf0Cg+iMi1R8Sqv6YWPUHBas/Klr9YeHqj4tXf2CA+iMj1B8aov7YGPUHBzVwdLS3w9O1/OcHR6s/Pl6aeMFAYIwxxhhjjDHGGGOMMcYYY4wxxhhjrAX+Akg7FHvDYrX6AAAAAElFTkSuQmCC" 
      },
      { 
        ref: groundImageRef, 
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABABAMAAAAHc7SNAAAAD1BMVEUAAAB/f39fX18/Pz8fHx/eNmZiAAAABXRSTlMAYECA/5ApOlgAAABYSURBVHja7dYxDQAgDABBEAuIwQJC8G8N7wqY5E1d6Mqampqampqampqamvpn/Vi+AdTU1NTU1NTU1NTUf9YAANDU1NTU1NTU1NTU1NTU1NTU1NTU1NS3Ogd0bQ12fHYqVAAAAABJRU5ErkJggg==" 
      },
      { 
        ref: pipeTopImageRef, 
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAGQCAMAAADp6WTsAAAAYFBMVEUAAABGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUbbCzJJAAAAIHRSTlMAECAwQFBgcHuEj5Cfn6+vv7/Pz8/f3+Pj7+/v7+/vWdOXUwQAAADzSURBVHja7dZJDoMwEEXRsJgCATKPGfr+tyyVhRcgYUvVKd7/VvYDVzMzMzMzMzMzM7N4G6vMqqLx6FgV0noULQvSeSStCBJ6lCwJUnkUTAsSeJTPCdJ4FE4JUh/PGzgCj877E4QefTlB6NGXE2QefRNCFB4N3UDm0TMcJB7940Hg0T8exB3940Ha0T8eRB3940HQ0T8exBz940HI0T8eJBz940G+0T8e5Br940Gm0T8c5PAonxbk8CidFmT3KJ8XZPGomBhkeVRMDTJ7PZ0apK86qbw6+Wlj28rqYOYbH+bvZf5y/g/k/4n8z8TMzMzMzMzMzOwLC3oucnzjH2EAAAAASUVORK5CYII=" 
      },
      { 
        ref: pipeBottomImageRef, 
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAGQCAMAAADp6WTsAAAAYFBMVEUAAABGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUZGxUbbCzJJAAAAIHRSTlMAECAwQFBgcHuEj5Cfn6+vv7/Pz8/f3+Pj7+/v7+/vWdOXUwQAAADzSURBVHja7dZJDoMwEEXRsJgCATKPGfr+tyyVhRcgYUvVKd7/VvYDVzMzMzMzMzMzM7N4G6vMqqLx6FgV0noULQvSeSStCBJ6lCwJUnkUTAsSeJTPCdJ4FE4JUh/PGzgCj877E4QefTlB6NGXE2QefRNCFB4N3UDm0TMcJB7940Hg0T8exB3940Ha0T8eRB3940HQ0T8exBz940HI0T8eJBz940G+0T8e5Br940Gm0T8c5PAonxbk8CidFmT3KJ8XZPGomBhkeVRMDTJ7PZ0apK86qbw6+Wlj28rqYOYbH+bvZf5y/g/k/4n8z8TMzMzMzMzMzOwLC3oucnzjH2EAAAAASUVORK5CYII=" 
      }
    ];
    
    let loadedCount = 0;
    const totalImages = images.length;
    
    // Preload all images
    images.forEach(img => {
      img.ref.current = new Image();
      
      // Add load event listener
      img.ref.current.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      
      // Add error event listener
      img.ref.current.onerror = () => {
        console.error(`Failed to load image: ${img.src.substring(0, 30)}...`);
        loadedCount++;
        setLoadingError(true);
        
        // Create a small placeholder image to avoid errors when trying to draw
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'pink'; // Cat color as fallback
        ctx.fillRect(0, 0, 50, 50);
        ctx.fillStyle = 'black';
        ctx.fillText('!', 25, 25); // Error indicator
        img.ref.current.src = canvas.toDataURL();
      };
      
      // Set src after adding event listeners
      img.ref.current.src = img.src;
    });
    
    // Initialize canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#87CEEB'; // Sky blue background while loading
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);
  
  // Game tick
  useEffect(() => {
    // Initialize canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // If images aren't loaded yet, show loading screen
      if (!imagesLoaded) {
        drawLoadingScreen(ctx, canvas);
        if (!loadingError) {
          animationFrameId = requestAnimationFrame(render);
          return;
        }
      }
      
      // Draw background
      if (skyImageRef.current && 
          skyImageRef.current.complete && 
          skyImageRef.current.naturalHeight !== 0 && 
          !skyImageRef.current.error) {
        ctx.drawImage(skyImageRef.current, 0, 0, canvas.width, canvas.height);
      }

      
      // Only update game if it's active and not paused
      if (gameState.isActive && !gameState.isPaused && !gameState.isOver) {
        // Update cat position
        setCat(prevCat => ({
          ...prevCat,
          y: prevCat.y + prevCat.velocity,
          velocity: prevCat.velocity + GRAVITY
        }));
        
        // Update pipes
        setPipes(prevPipes => {
          let newPipes = prevPipes.map(pipe => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED
          })).filter(pipe => pipe.x + PIPE_WIDTH > 0);
          
          // Add new pipe when needed
          if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < canvas.width - 300) {
            const height = Math.floor(Math.random() * (canvas.height - PIPE_GAP - 120)) + 60;
            newPipes.push({
              x: canvas.width,
              topHeight: height,
              passed: false
            });
          }
          
          return newPipes;
        });
        
        // Check for collisions and scoring
        checkCollisions();
        
        pipes.forEach(pipe => {
          // Check if cat passed the pipe
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 120) {
            // Update score
            setGameState(prev => ({
              ...prev,
              score: prev.score + 1
            }));
            
            // Mark pipe as passed
            setPipes(prevPipes => prevPipes.map(p => 
              p === pipe ? { ...p, passed: true } : p
            ));
            
            // Play score sound if enabled
            if (soundEnabled) {
              playSound('score');
            }
          }
        });
      }
      // Only draw if image is properly loaded
      
      if (groundImageRef.current && 
          groundImageRef.current.complete && 
          groundImageRef.current.naturalHeight !== 0 && 
          !groundImageRef.current.error) {
        try {
        ctx.drawImage(groundImageRef.current, 0, canvas.height - 80, canvas.width, 80);
      }
      
      // Draw pipes
      // Only draw if images are properly loaded
      pipes.forEach(pipe => {
        if (pipeTopImageRef.current && pipeTopImageRef.current.complete && pipeTopImageRef.current.naturalHeight !== 0 &&
            !pipeTopImageRef.current.error &&
            pipeBottomImageRef.current && 
            pipeBottomImageRef.current.complete && 
            pipeBottomImageRef.current.naturalHeight !== 0 && 
            !pipeBottomImageRef.current.error) {
          // Draw top pipe (flipped)
          ctx.save();
          ctx.translate(pipe.x + PIPE_WIDTH / 2, pipe.topHeight / 2);
          ctx.scale(1, -1);
          ctx.drawImage(pipeTopImageRef.current, -PIPE_WIDTH / 2, 0, PIPE_WIDTH, 320);
          ctx.restore();
          
          // Draw bottom pipe
          ctx.drawImage(pipeBottomImageRef.current, pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.topHeight - PIPE_GAP);
        }
        
      });
      } catch (err) {
        console.error("Error drawing game elements:", err);
      }
      
      if (catImageRef.current && 
          catImageRef.current.complete && 
          catImageRef.current.naturalHeight !== 0 && 
          !catImageRef.current.error) {
        try {
        ctx.save();
        ctx.translate(100, Math.min(Math.max(cat.y, CAT_HEIGHT/2), canvas.height - 80 - CAT_HEIGHT/2));
        
        // Rotate cat based on velocity
        const rotation = Math.min(Math.max(cat.velocity * 0.08, -0.5), 0.5);
        ctx.rotate(rotation);
        
        ctx.drawImage(catImageRef.current, -CAT_WIDTH / 2, -CAT_HEIGHT / 2, CAT_WIDTH, CAT_HEIGHT);
        ctx.restore();
        } catch (err) {
          console.error("Error drawing cat:", err);
        }
      }
      
      // Draw score
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.save();
      try {
      ctx.lineWidth = 5;
      ctx.font = '30px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.strokeText(gameState.score.toString(), canvas.width / 2, 50);
      ctx.fillText(gameState.score.toString(), canvas.width / 2, 50);
      
      // Draw lives
      if (catImageRef.current && 
          catImageRef.current.complete && 
          catImageRef.current.naturalHeight !== 0 && 
          !catImageRef.current.error) {
        for (let i = 0; i < livesLeft; i++) {
          try {
            ctx.drawImage(catImageRef.current, 20 + i * 30, 20, 25, 20);
          } catch (err) {
            console.error("Error drawing lives:", err);
          }
        }
      }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState.isActive, gameState.isPaused, gameState.isOver, cat, pipes, livesLeft, soundEnabled, imagesLoaded]);
  
  // Draw loading screen
  const drawLoadingScreen = (ctx, canvas) => {
    // Fill background
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    try {
    // Draw loading text
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    } catch (err) {
      console.error("Error setting up loading screen:", err);
    }
    
    try {
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.strokeText(loadingError ? "Error loading game assets!" : "Loading...", canvas.width / 2, canvas.height / 2);
  };
  
  const checkCollisions = () => {
    const canvas = canvasRef.current;
    
    // Check if cat hits the ground or ceiling
    if (cat.y >= canvas.height - 80 - CAT_HEIGHT / 2 || cat.y <= CAT_HEIGHT / 2) {
      handleCollision();
      return;
    }
    
    // Check if cat hits pipes
    pipes.forEach(pipe => {
      if (
        100 + CAT_WIDTH / 2 > pipe.x && 
        100 - CAT_WIDTH / 2 < pipe.x + PIPE_WIDTH
      ) {
        // Vertical collision with top pipe
        if (cat.y - CAT_HEIGHT / 2 < pipe.topHeight) {
          handleCollision();
          return;
        }
        
        // Vertical collision with bottom pipe
        if (cat.y + CAT_HEIGHT / 2 > pipe.topHeight + PIPE_GAP) {
          handleCollision();
          return;
        }
      }
    });
  };
  
  const handleCollision = () => {
    // Play crash sound if enabled
    if (soundEnabled) {
      playSound('crash');
    }
    
    if (livesLeft > 1) {
      // Lose a life but continue
      setLivesLeft(prev => prev - 1);
      
      // Reset cat position but keep the game going
      setCat({
        y: 250,
        velocity: 0
      });
      
      toast.warning("Ouch! Cat lost a life!", {
        icon: "😿"
      });
    } else {
      // Game over
      setGameState(prev => {
        // Update high score if needed
        const newHighScore = prev.score > prev.highScore ? prev.score : prev.highScore;
        
        // Save high score to local storage
        localStorage.setItem('highScore', newHighScore.toString());
        
        return {
          ...prev,
          isOver: true,
          highScore: newHighScore
        }
        };
      });
      
      toast.error("Game Over!", {
        icon: "🙀"
      });
    }
  };
  
  const jump = () => {
    if (!gameState.isActive) {
      if (!imagesLoaded) {
        return; // Don't start game if images aren't loaded
      }
      startGame();
      return;
    }
    
    if (gameState.isPaused || gameState.isOver) return;
    
    setCat(prevCat => ({
      ...prevCat,
      velocity: JUMP
    }));
    
    // Play jump sound if enabled
    if (soundEnabled) {
      playSound('jump');
    }
  };
  
  const startGame = () => {
    if (!imagesLoaded) {
      return; // Don't start game if images aren't loaded
    }  
    
    setGameState({
      isActive: true,
      isOver: false,
      isPaused: false,
      score: 0,
      highScore: gameState.highScore
    });
    
    setCat({
      y: 250,
      velocity: 0
    });
    
    setPipes([]);
    setLivesLeft(3);
    
    toast.success("Game Started!", {
      icon: "😺"
    });
  };
  
  const restartGame = () => {
    startGame();
  };
  
  const togglePause = () => {
    if (gameState.isOver) return;
    
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
    
    if (!gameState.isPaused) {
      toast.info("Game Paused", {
        icon: "⏸️"
      });
    } else {
      toast.info("Game Resumed", {
        icon: "▶️"
      });
    }
  };
  
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
    toast.info(soundEnabled ? "Sound Disabled" : "Sound Enabled", {
      icon: soundEnabled ? "🔇" : "🔊"
    });
  };
  
  const playSound = (type) => {
    // In a real implementation, you would load and play actual sound files
    console.log(`Playing ${type} sound`);
  };
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        jump();
      } else if (e.code === 'KeyP') {
        togglePause();
      } else if (e.code === 'KeyR') {
        restartGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.isPaused, gameState.isOver, gameState.isActive]);
  
  return (
    <div className="w-full">
      {/* Game Title and Instructions Button */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-game text-primary mb-2 md:mb-0">
          Flappy Feline
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowInstructions(true)}
            className="flex items-center px-3 py-2 bg-secondary rounded-lg text-white text-sm shadow-sm hover:bg-secondary-dark transition-colors"
          >
            <InfoIcon className="w-4 h-4 mr-1" />
            <span>How to Play</span>
          </button>
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg ${soundEnabled ? 'bg-secondary' : 'bg-surface-400'} text-white shadow-sm hover:opacity-90 transition-opacity`}
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? <Volume2Icon className="w-5 h-5" /> : <VolumeXIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Game Canvas */}
      <div className="game-container aspect-[16/9] overflow-hidden shadow-lg mb-4 mx-auto">
        {!imagesLoaded && !loadingError && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-800/50 z-10">
            <div className="text-center p-4 bg-surface-100 dark:bg-surface-700 rounded-lg shadow-lg">
              <div className="animate-spin h-10 w-10 border-4 border-accent border-t-transparent rounded-full mb-4 mx-auto"></div>
              <p className="font-game text-surface-800 dark:text-surface-200">
                Loading game...
              </p>
              </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={480}
          height={640}
          onClick={jump}
          className="w-full h-full touch-none"
        ></canvas>
      </div>
      
      {/* Game Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="font-game text-lg text-surface-700 dark:text-surface-300">
            High Score: <span className="text-primary">{gameState.highScore}</span>
          </p>
          {gameState.isOver && (
            <p className="font-game text-lg text-primary-dark mt-1">
              Your Score: {gameState.score}
            </p>
          )}
        </div>
        
        <div className="flex space-x-3">
          {!gameState.isActive && !gameState.isOver && imagesLoaded && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="game-button bg-accent hover:bg-accent/80 text-surface-800 flex items-center"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              <span>Start Game</span>
            </motion.button>
          )}
          
          {gameState.isActive && !gameState.isOver && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={togglePause}
              className="game-button bg-secondary hover:bg-secondary-dark flex items-center"
            >
              {gameState.isPaused ? (
                <>
                  <PlayIcon className="w-5 h-5 mr-2" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <PauseIcon className="w-5 h-5 mr-2" />
                  <span>Pause</span>
                </>
              )}
            </motion.button>
          )}
          
          {gameState.isOver && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={restartGame}
              className="game-button bg-primary hover:bg-primary-dark flex items-center"
            >
              <RotateCcwIcon className="w-5 h-5 mr-2" />
              <span>Play Again</span>
            </motion.button>
          )}
        </div>
      </div>
      
      {/* High Scores Section */}
      <div className="bg-white dark:bg-surface-800 p-4 rounded-xl shadow-card">
        <div className="flex items-center mb-3">
          <TrophyIcon className="w-5 h-5 text-accent mr-2" />
          <h3 className="font-game text-lg text-surface-800 dark:text-surface-200">
            Hall of Fame
          </h3>
        </div>
        
        <p className="text-surface-600 dark:text-surface-400 text-sm">
          Your highest score: <span className="font-bold text-primary">{gameState.highScore}</span>
        </p>
        
        <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Tap/click to make the cat fly!
          </p>
          
          <div className="mt-2 flex items-center">
            <HeartIcon className="w-4 h-4 text-primary mr-2" />
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Lives: <span className="font-medium">{livesLeft}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-2xl p-5 md:p-6 max-w-md w-full shadow-lg relative"
          >
            <button 
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
              aria-label="Close instructions"
            >
              <XIcon className="w-5 h-5" />
            </button>
            
            <h3 className="font-game text-xl text-primary mb-4">How to Play</h3>
            
            <div className="space-y-4 text-surface-700 dark:text-surface-300">
              <p>
                <span className="font-bold">Tap or Click</span> on the screen to make your cat fly upward.
              </p>
              <p>
                Guide your feline friend through the gaps between pipes.
              </p>
              <p>
                Each successfully passed pipe earns you 1 point!
              </p>
              <p>
                You have <span className="font-bold text-primary">3 lives</span> - use them wisely!
              </p>
              
              <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                <p className="text-sm text-surface-500">
                  <span className="font-bold">Pro Tip:</span> You can also use the Spacebar to make your cat jump, P to pause, and R to restart.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full game-button bg-accent hover:bg-accent/80 text-surface-800"
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MainFeature;