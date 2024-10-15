import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import Confetti from "react-confetti";
import backgroundImage from '../assets/background.jpg'; // Import the background image

const DrawPage = ({ sequences, monthYear }) => {
  const [rollingDigits, setRollingDigits] = useState(Array(10).fill(<FontAwesomeIcon icon={faGift} />));
  const [finalSequence, setFinalSequence] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const startDraw = () => {
    if (!sequences || sequences.length === 0) {
      alert("No sequences available. Please upload a file."); // Alert if sequences are not found
      return;
    }

    // Start the rolling
    setIsRolling(true);
    setFinalSequence(null); // Reset final sequence for the new draw
    setRollingDigits(Array(10).fill(<FontAwesomeIcon icon={faGift} />));

    // Select a random sequence
    const selectedSequence = sequences[Math.floor(Math.random() * sequences.length)];
    const digits = String(selectedSequence).split("");
    let currentIndex = 0;

    const rollForBox = (index) => {
      const interval = setInterval(() => {
        setRollingDigits((prev) => {
          const newDigits = [...prev];
          newDigits[index] = Math.floor(Math.random() * 10).toString();
          return newDigits;
        });
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setRollingDigits((prev) => {
          const newDigits = [...prev];
          newDigits[index] = digits[index];
          return newDigits;
        });

        if (index < rollingDigits.length - 1) {
          rollForBox(index + 1);
        } else {
          setFinalSequence(selectedSequence);
          setIsRolling(false); // Allow button to be clickable again
          triggerConfetti();
        }
      }, 2000);
    };

    rollForBox(currentIndex);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowConfetti(false);
        setFadeOut(false);
      }, 1000);
    }, 15000);
  };

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`, // Set background image
      backgroundSize: 'cover', // Cover the entire page
      backgroundPosition: 'center', // Center the image
      backgroundRepeat: 'no-repeat', // Prevent image repetition
      height: '100vh', // Full viewport height
      display: 'flex', // Flexbox to center the card
      justifyContent: 'center', // Center horizontally
      alignItems: 'center' // Center vertically
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.9)", // Slightly transparent white background for the card
        borderRadius: "10px",
        maxWidth: "550px",
        width: '100%', // Make card responsive
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        color: '#333', // Darker text color for contrast
        marginTop: "100px",
        marginRight: "10px"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>{monthYear}</h1>
        <div style={{ textAlign: "center" }}>
          <button 
            onClick={startDraw} 
            disabled={isRolling || finalSequence} 
            style={{
              ...buttonStyle,
              backgroundColor: isRolling || finalSequence ? "rgb(149 149 149)" : "#4CAF50", // Grey when disabled
              cursor: isRolling || finalSequence ? "not-allowed" : "pointer"
            }}
          >
            Start Draw
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", fontSize: "1.5em", margin: "20px 0" }}>
          {rollingDigits.map((digit, index) => (
            <div key={index} style={digitStyle}>{digit}</div>
          ))}
        </div>
        {finalSequence && (
          <>
            {showConfetti && (
              <Confetti 
                width={window.innerWidth} 
                height={window.innerHeight} 
                className={fadeOut ? "fade-out" : ""} 
                style={{ opacity: fadeOut ? 0 : 1, transition: "opacity 1s ease" }} // Fade-out effect
              />
            )}
            <p style={{ textAlign: 'center', color: "rgb(76 131 78)", fontSize: '1.5rem',fontWeight:"bold" }}>Congratulations!</p>
          </>
        )}
      </div>
    </div>
  );
};

const digitStyle = {
  width: "40px", height: "40px", backgroundColor: "rgba(255, 255, 255, 0.8)", margin: "5px", 
  borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center"
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "5px",
  color: "white", // White text color
  border: "none", // Remove default border
  transition: "background-color 0.3s ease", // Smooth transition for hover effect
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Box shadow for depth
};

export default DrawPage;
