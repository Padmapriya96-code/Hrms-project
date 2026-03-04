import React, { useState } from "react";
import { motion } from "framer-motion";

const AnimatedGallery = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [feedbackText, setFeedbackText] = useState("");

  // Function to toggle the main animation
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    setFeedbackText(isAnimating ? "Animation Paused!" : "Animation Resumed!");
  };

  // Function to apply random animation (e.g., rotation, scaling)
  const applyRandomAnimation = () => {
    const randomFeedbacks = [
      "Blob is Spinning!",
      "Blob is Pulsing!",
      "Blob is Wiggling!",
    ];
    const randomFeedback =
      randomFeedbacks[Math.floor(Math.random() * randomFeedbacks.length)];
    setFeedbackText(randomFeedback);
  };

  // Main blob animation variants
  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      borderRadius: ["50%", "30%", "70%", "50%"],
      backgroundColor: [
        "#ff9a9e",
        "#fad0c4",
        "#a18cd1",
        "#fbc2eb",
        "#f6d365",
      ],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Placeholder for a pulsing animation
  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)",
        overflow: "hidden",
      }}
    >
      {/* Feedback */}
      <motion.div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#fff",
          marginBottom: "10px",
        }}
        animate={{ opacity: [0, 1], y: [-10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {feedbackText}
      </motion.div>

      {/* Blob */}
      <motion.div
        variants={blobVariants}
        initial="hidden"
        animate={isAnimating ? "animate" : "hidden"}
        style={{
          width: "300px",
          height: "300px",
          position: "relative",
          borderRadius: "50%",
          background: "#ff9a9e",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <motion.div
          variants={pulseVariants}
          animate={isAnimating ? "animate" : "hidden"}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#fff",
            textShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          Smooth Morph
        </motion.div>
      </motion.div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        <motion.button
          onClick={toggleAnimation}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            background:
              "linear-gradient(135deg, #6c63ff, #4a47ff, #9c9aff, #6c63ff)",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          {isAnimating ? "Pause Animation" : "Resume Animation"}
        </motion.button>

        <motion.button
          onClick={applyRandomAnimation}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            background:
              "linear-gradient(135deg, #16a085, #1abc9c, #2ecc71, #16a085)",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          Random Animation
        </motion.button>
      </div>
    </div>
  );
};

export default AnimatedGallery;
