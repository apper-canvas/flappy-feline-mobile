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
  
  // Game tick
  useEffect(() => {
    const images = [
      { ref: catImageRef, src: "https://pixabay.com/get/g5f6c93bb1a9033fb36dafb4fa8e0c09e56dd3dd6fbecd0c1f38c84e2bc70e0e9f78c4abfca2ea95b68b7a97878c2b8eb_640.png" },
      { ref: skyImageRef, src: "https://pixabay.com/get/g62e19f9c9f6f3ebf06f26c1caa1f0c50aaef8c7204b9a444de12f5dc2bfa6d53ab879b5b7e6cd3ff77a9e7f07cb9cb70_640.jpg" },
      { ref: groundImageRef, src: "https://pixabay.com/get/g69af580b1bce583bbe10d6d8a7c45bcafbc3c7d40fb9c9b0fe2e6e3da32f1303fe96bec2fde8a9a2caa3a6d8eeee3f83_640.jpg" },
      { ref: pipeTopImageRef, src: "https://burst.shopifycdn.com/photos/green-plant-in-small-pot.jpg?width=1000&format=pjpg&exif=0&iptc=0" },
      { ref: pipeBottomImageRef, src: "https://burst.shopifycdn.com/photos/green-plant-in-small-pot.jpg?width=1000&format=pjpg&exif=0&iptc=0" }
    ];
    
    // Preload all images
    images.forEach(img => {
      img.ref.current = new Image();
      img.ref.current.src = img.src;
    });
    
    // Initialize canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.drawImage(skyImageRef.current, 0, 0, canvas.width, canvas.height);
      
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
      
      // Draw ground
      ctx.drawImage(groundImageRef.current, 0, canvas.height - 80, canvas.width, 80);
      
      // Draw pipes
      pipes.forEach(pipe => {
        // Draw top pipe (flipped)
        ctx.save();
        ctx.translate(pipe.x + PIPE_WIDTH / 2, pipe.topHeight);
        ctx.scale(1, -1);
        ctx.drawImage(pipeTopImageRef.current, -PIPE_WIDTH / 2, 0, PIPE_WIDTH, 320);
        ctx.restore();
        
        // Draw bottom pipe
        ctx.drawImage(pipeBottomImageRef.current, pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.topHeight - PIPE_GAP);
      });
      
      // Draw cat
      ctx.save();
      ctx.translate(100, cat.y);
      
      // Rotate cat based on velocity
      const rotation = Math.min(Math.max(cat.velocity * 0.08, -0.5), 0.5);
      ctx.rotate(rotation);
      
      ctx.drawImage(catImageRef.current, -CAT_WIDTH / 2, -CAT_HEIGHT / 2, CAT_WIDTH, CAT_HEIGHT);
      ctx.restore();
      
      // Draw score
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
      ctx.font = '30px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.strokeText(gameState.score.toString(), canvas.width / 2, 50);
      ctx.fillText(gameState.score.toString(), canvas.width / 2, 50);
      
      // Draw lives
      for (let i = 0; i < livesLeft; i++) {
        ctx.drawImage(catImageRef.current, 20 + i * 30, 20, 25, 20);
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState.isActive, gameState.isPaused, gameState.isOver, cat, pipes, livesLeft, soundEnabled]);
  
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
        };
      });
      
      toast.error("Game Over!", {
        icon: "🙀"
      });
    }
  };
  
  const jump = () => {
    if (!gameState.isActive) {
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
          {!gameState.isActive && !gameState.isOver && (
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