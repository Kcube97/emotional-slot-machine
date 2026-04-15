import './App.css'
import { useState, useRef } from 'react';

// Assets
import handlerPlatform from './assets/handler-platform.svg'
import handler from './assets/handler.svg';
import gym from './assets/gym.svg';
import dating from './assets/dating.svg';
import food from './assets/food.svg';
import friedChicken from './assets/fried_chicken.svg';
import meditation from './assets/meditation.svg';
import jogging from './assets/jogging.svg';
import playGames from './assets/play-games.svg';

function App() {
  const [isSpinning, setIsSpinning] = useState(false);

  const reel1Ref = useRef<HTMLDivElement>(null);
  const reel2Ref = useRef<HTMLDivElement>(null);
  const reel3Ref = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<HTMLImageElement>(null);

  const Images = [gym, dating, food, friedChicken, meditation, jogging, playGames];
  const LoopImages = [...Images, ...Images, ...Images, ...Images, ...Images, ...Images];

  const ITEM_HEIGHT_REM = 6;

  const currentIndexRef = useRef(0); // track where we are

  function spin() {
    if (isSpinning) return;
    setIsSpinning(true);

    // Add spinning class to handler
    if (handlerRef.current) {
      handlerRef.current.classList.add('handler-spinning');
    }

    // Disable transition for instant reset later
    const spinWithDelay = (ref: React.RefObject<HTMLDivElement | null>, delay: number) => {
      if (!ref.current) return;

      const extraSpins = Images.length * 3;
      const landingIndex = Math.floor(Math.random() * Images.length);
      const targetIndex = extraSpins + landingIndex;    // always a big positive number

      setTimeout(() => {
        if (!ref.current) return;

        ref.current.style.transition = `top 3.0s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        ref.current.style.top = `${-(targetIndex * ITEM_HEIGHT_REM)}rem`;

        // 2. After animation ends, silently reset to index 0 equivalent
        setTimeout(() => {
          if (!ref.current) return;

          // Pop first N items, push to back
          const children = Array.from(ref.current.children);
          children.slice(0, targetIndex % Images.length).forEach(child => {
            ref.current!.appendChild(child);
          });

          // Instantly snap back to top — user sees nothing
          ref.current.style.transition = 'none';
          ref.current.style.top = '0rem';
        }, 1600);

      }, delay);
    };

    spinWithDelay(reel1Ref, 0);
    spinWithDelay(reel2Ref, 150);
    spinWithDelay(reel3Ref, 300);

    // Unlock after all reels finish (longest delay + animation)
    setTimeout(() => {
      setIsSpinning(false);
      if (handlerRef.current) {
        handlerRef.current.classList.remove('handler-spinning');
      }
    }, 300 + 1600);
  }

  return (
    <div id="center">
      <div className="title">
        <p>Your Emotional Slot Machine 🎰</p>
      </div>
      <div className="container">
        <div className="machine-body">
          <div className="slot-mask">
            <div className="first-slot" ref={reel1Ref}>
              {LoopImages.map((src, i) => (
                <div className="cell" key={i}>
                  <img src={src} alt={`symbol-${i}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="slot-mask">
            <div className="second-slot" ref={reel2Ref}>
              {LoopImages.map((src, i) => (
                <div className="cell" key={i}>
                  <img src={src} alt={`symbol-${i}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="slot-mask">
            <div className="third-slot" ref={reel3Ref}>
              {LoopImages.map((src, i) => (
                <div className="cell" key={i}>
                  <img src={src} alt={`symbol-${i}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="handler-platform">
          <img src={handlerPlatform} alt="handler_platform"></img>
          <img src={handler} alt="handler" className="handler" ref={handlerRef} onClick={spin}></img>
        </div>
      </div>
    </div>
  );
}

export default App
