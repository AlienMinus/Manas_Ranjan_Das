// src/context/TourContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TOUR_STEPS } from "../components/tour/tourSteps";
import VirtualCursor from "../components/tour/VirtualCursor";
import TourSpotlight from "../components/tour/TourSpotlight";
import TourHUD from "../components/tour/TourHUD";

const TourContext = createContext(null);

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return ctx;
}

// React controlled component value setter helper
function setNativeValue(element, value) {
  if (!element) return;
  const valueSetter = Object.getOwnPropertyDescriptor(element, "value")?.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

// Helper to poll for visible DOM element
function waitForElement(selector, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const checkElement = () => {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) return el;
      }
      return elements[0] || null;
    };

    const initial = checkElement();
    if (initial) return resolve(initial);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const found = checkElement();
      if (found) {
        clearInterval(interval);
        resolve(found);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        resolve(null);
      }
    }, 60);
  });
}

export function TourProvider({ children }) {
  const navigate = useNavigate();

  const [isTourActive, setIsTourActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dynamicStepData, setDynamicStepData] = useState(null);

  // Text-To-Speech (TTS) Voice Narration
  const [isTtsEnabled, setIsTtsEnabled] = useState(() => {
    try {
      return localStorage.getItem("portfolio_tour_tts") !== "false";
    } catch {
      return true;
    }
  });

  const [cursorPos, setCursorPos] = useState({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
    isClicking: false,
    isHovering: false,
    isVisible: false,
  });

  const [targetRect, setTargetRect] = useState(null);

  const stepTimerRef = useRef(null);
  const speechUtteranceRef = useRef(null);
  const totalSteps = TOUR_STEPS.length;
  const currentStep = TOUR_STEPS[currentStepIndex] || null;

  // Cleanup timers
  const clearStepTimer = useCallback(() => {
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      speechUtteranceRef.current = null;
    }
  }, []);

  // Text-To-Speech Audio Voice Output with natural completion callback
  const speakNarration = useCallback((title, description, onComplete) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel();
    speechUtteranceRef.current = null;

    const fullText = `${title ? title + ". " : ""}${description || ""}`.trim();
    if (!fullText) {
      if (onComplete) onComplete();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(fullText);
      speechUtteranceRef.current = utterance;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.95;

      const assignVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const preferredVoice =
            voices.find(
              (v) =>
                v.lang.startsWith("en") &&
                (v.name.includes("Google") ||
                  v.name.includes("Natural") ||
                  v.name.includes("Samantha") ||
                  v.name.includes("Jenny") ||
                  v.name.includes("Guy") ||
                  v.name.includes("Microsoft"))
            ) ||
            voices.find((v) => v.lang.startsWith("en")) ||
            voices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        utterance.onend = () => {
          speechUtteranceRef.current = null;
          if (onComplete) onComplete();
        };

        utterance.onerror = (e) => {
          speechUtteranceRef.current = null;
          if (e.error !== "canceled" && e.error !== "interrupted") {
            if (onComplete) onComplete();
          }
        };

        window.speechSynthesis.speak(utterance);
      };

      const currentVoices = window.speechSynthesis.getVoices();
      if (!currentVoices || currentVoices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          assignVoiceAndSpeak();
        };
      } else {
        assignVoiceAndSpeak();
      }
    } catch {
      speechUtteranceRef.current = null;
      if (onComplete) onComplete();
    }
  }, []);

  // Toggle TTS Audio
  const toggleTts = useCallback(() => {
    setIsTtsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("portfolio_tour_tts", String(next));
      } catch {
        // Ignored
      }
      if (!next) {
        stopAudio();
      }
      return next;
    });
  }, [stopAudio]);

  // Stop Tour
  const stopTour = useCallback(() => {
    clearStepTimer();
    stopAudio();
    setIsTourActive(false);
    setIsPaused(false);
    setTargetRect(null);
    setDynamicStepData(null);
    setCursorPos((prev) => ({ ...prev, isVisible: false }));

    // Close any open simulated modals / lightboxes
    const openCloseBtns = document.querySelectorAll(
      ".chatbot-close, .lightbox-close, .experience-lightbox__close, .cert-lightbox__close"
    );
    openCloseBtns.forEach((b) => b.click());

    const themeDropdown = document.querySelector(".navbar__theme-dropdown");
    if (themeDropdown) {
      const themeBtn = document.querySelector(".navbar__theme-btn");
      if (themeBtn) themeBtn.click();
    }
  }, [clearStepTimer, stopAudio]);

  // Start Tour
  const startTour = useCallback(
    (startIndex = 0) => {
      clearStepTimer();
      stopAudio();

      // Prime and unlock speech synthesis immediately inside user gesture
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const primeUtterance = new SpeechSynthesisUtterance("");
          primeUtterance.volume = 0;
          window.speechSynthesis.speak(primeUtterance);
        } catch {
          // Ignored
        }
      }

      setIsTourActive(true);
      setIsPaused(false);
      setCurrentStepIndex(startIndex);
      setDynamicStepData(null);

      setCursorPos({
        x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
        y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
        isClicking: false,
        isHovering: false,
        isVisible: true,
      });
    },
    [clearStepTimer, stopAudio]
  );

  // Advance Next Step
  const nextStep = useCallback(() => {
    clearStepTimer();
    stopAudio();
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      stopTour();
      return prev;
    });
  }, [totalSteps, clearStepTimer, stopTour, stopAudio]);

  // Step Backward
  const prevStep = useCallback(() => {
    clearStepTimer();
    stopAudio();
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, [clearStepTimer, stopAudio]);

  // Toggle Pause / Resume
  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (next) {
          window.speechSynthesis.pause();
        } else {
          window.speechSynthesis.resume();
        }
      }
      return next;
    });
  }, []);

  // Jump to specific page
  const jumpToPage = useCallback(
    (targetPath) => {
      clearStepTimer();
      stopAudio();
      const firstStepIdx = TOUR_STEPS.findIndex((s) => s.page === targetPath);
      if (firstStepIdx !== -1) {
        setCurrentStepIndex(firstStepIdx);
      }
    },
    [clearStepTimer, stopAudio]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        stopTour();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePause();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTourActive, stopTour, togglePause, nextStep, prevStep]);

  // Pre-load voices on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      };
    }
  }, []);

  // Main Step Execution Engine
  useEffect(() => {
    if (!isTourActive || isPaused || !currentStep) return;

    let isCancelled = false;

    const runStep = async () => {
      // -------------------------------------------------------------
      // 1. Smooth Visual Route Transition across Pages
      // -------------------------------------------------------------
      if (window.location.pathname !== currentStep.page) {
        // Find navbar tab for the target page
        const navLink = document.querySelector(
          `a.navbar__link[href="${currentStep.page}"], a[href="${currentStep.page}"]`
        );

        if (navLink) {
          const navRect = navLink.getBoundingClientRect();
          // Glide cursor to navbar tab
          setCursorPos({
            x: navRect.left + navRect.width / 2,
            y: navRect.top + navRect.height / 2,
            isHovering: true,
            isClicking: false,
            isVisible: true,
          });
          setTargetRect({
            top: navRect.top,
            left: navRect.left,
            width: navRect.width,
            height: navRect.height,
          });

          // Wait for cursor glide to reach the tab
          await new Promise((r) => setTimeout(r, 600));
          if (isCancelled) return;

          // Perform visible click ripple on the navbar tab
          setCursorPos((prev) => ({ ...prev, isClicking: true }));
          await new Promise((r) => setTimeout(r, 220));
          if (isCancelled) return;
          setCursorPos((prev) => ({ ...prev, isClicking: false }));
        }

        // Navigate via react router
        navigate(currentStep.page);
        window.scrollTo({ top: 0, behavior: "instant" });

        // Wait for page route to mount
        await new Promise((r) => setTimeout(r, 450));
        if (isCancelled) return;
      }

      // -------------------------------------------------------------
      // 2. Find target DOM element
      // -------------------------------------------------------------
      const element = await waitForElement(currentStep.selector);
      if (isCancelled) return;
      if (!element) {
        stepTimerRef.current = setTimeout(nextStep, 2000);
        return;
      }

      // -------------------------------------------------------------
      // 3. Smooth scroll viewport to position element in view
      // -------------------------------------------------------------
      const isFixedHeader = element.closest(".navbar, .music-toggle, .chatbot-toggler");
      if (!isFixedHeader) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        await new Promise((r) => setTimeout(r, 400));
        if (isCancelled) return;
      }

      // -------------------------------------------------------------
      // 4. Calculate accurate element coordinates & position spotlight
      // -------------------------------------------------------------
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      // Glide virtual cursor to target
      setCursorPos((prev) => ({
        ...prev,
        x: targetX,
        y: targetY,
        isHovering: true,
        isClicking: false,
        isVisible: true,
      }));

      // -------------------------------------------------------------
      // 5. Dynamic Content Extraction (Skills, Projects, Experience, Certs)
      // -------------------------------------------------------------
      let activeTitle = currentStep.title;
      let activeDescription = currentStep.description;

      if (currentStep.dynamicExtract) {
        // Skill cards
        const skillCat = element.querySelector(".skills__category-title");
        const skillItems = Array.from(element.querySelectorAll(".skills__item"))
          .map((s) => s.textContent.trim())
          .filter(Boolean);

        if (skillCat && skillCat.textContent.trim()) {
          activeTitle = skillCat.textContent.trim();
          if (skillItems.length > 0) {
            activeDescription = `Comprehensive competencies in ${skillItems.slice(0, 6).join(", ")}.`;
          }
        }

        // Project / Experience / Cert cards
        const titleNode = element.querySelector(
          ".project-card__title, .experience-card__role, .cert-card__title"
        );
        const descNode = element.querySelector(
          ".project-card__desc, .experience-card__company, .cert-card__desc"
        );

        if (titleNode && titleNode.textContent.trim()) {
          activeTitle = titleNode.textContent.trim();
        }
        if (descNode && descNode.textContent.trim()) {
          activeDescription = descNode.textContent.trim();
        }
      }

      // Update state for HUD display
      setDynamicStepData({
        ...currentStep,
        title: activeTitle,
        description: activeDescription,
      });

      // -------------------------------------------------------------
      // 6. Execute step-specific simulated interactive action
      // -------------------------------------------------------------
      if (currentStep.action === "toggleThemeMenu") {
        await new Promise((r) => setTimeout(r, 400));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: true }));
        await new Promise((r) => setTimeout(r, 220));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: false }));
        element.click();

        await new Promise((r) => setTimeout(r, 800));
        if (isCancelled) return;
        const opt = document.querySelector(".navbar__theme-option:nth-child(2)");
        if (opt) {
          const optRect = opt.getBoundingClientRect();
          setCursorPos((prev) => ({
            ...prev,
            x: optRect.left + optRect.width / 2,
            y: optRect.top + optRect.height / 2,
          }));
        }

        await new Promise((r) => setTimeout(r, 1200));
        if (isCancelled) return;
        const dropdown = document.querySelector(".navbar__theme-dropdown");
        if (dropdown) element.click();
      } else if (currentStep.action === "previewChatbot") {
        await new Promise((r) => setTimeout(r, 400));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: true }));
        await new Promise((r) => setTimeout(r, 220));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: false }));
        element.click();

        await new Promise((r) => setTimeout(r, 1000));
        if (isCancelled) return;
        const promptBtn = document.querySelector(".chatbot-messages button, .chatbot-close");
        if (promptBtn) {
          const pRect = promptBtn.getBoundingClientRect();
          setCursorPos((prev) => ({
            ...prev,
            x: pRect.left + pRect.width / 2,
            y: pRect.top + pRect.height / 2,
          }));
        }

        await new Promise((r) => setTimeout(r, 1500));
        if (isCancelled) return;
        const closeBtn = document.querySelector(".chatbot-close");
        if (closeBtn) closeBtn.click();
      } else if (currentStep.action === "previewLightbox") {
        await new Promise((r) => setTimeout(r, 400));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: true }));
        await new Promise((r) => setTimeout(r, 220));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: false }));
        element.click();

        await new Promise((r) => setTimeout(r, 1600));
        if (isCancelled) return;
        const closeBtn = document.querySelector(".experience-lightbox__close, .cert-lightbox__close");
        if (closeBtn) closeBtn.click();
      } else if (currentStep.action === "filterDemo") {
        await new Promise((r) => setTimeout(r, 400));
        if (isCancelled) return;
        const filterChip = document.querySelector(".projects__filter-btn:nth-child(2)");
        if (filterChip) {
          const fRect = filterChip.getBoundingClientRect();
          setCursorPos((prev) => ({
            ...prev,
            x: fRect.left + fRect.width / 2,
            y: fRect.top + fRect.height / 2,
            isClicking: true,
          }));
          await new Promise((r) => setTimeout(r, 200));
          if (isCancelled) return;
          setCursorPos((prev) => ({ ...prev, isClicking: false }));
          filterChip.click();

          await new Promise((r) => setTimeout(r, 1400));
          if (isCancelled) return;
          const allChip = document.querySelector(".projects__filter-btn:first-child");
          if (allChip) allChip.click();
        }
      } else if (currentStep.action === "autoTypeMessage") {
        // Contact Page Automation: Focus and type "Hello" into message input
        await new Promise((r) => setTimeout(r, 300));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: true }));
        await new Promise((r) => setTimeout(r, 220));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: false }));
        element.focus();

        const messageText = "Hello! Let's connect and discuss collaboration opportunities.";
        for (let i = 1; i <= messageText.length; i++) {
          if (isCancelled) return;
          setNativeValue(element, messageText.slice(0, i));
          await new Promise((r) => setTimeout(r, 32));
        }
      } else if (currentStep.action === "focusUserInputs") {
        // Contact Page Automation: Focus circles for Name & Email
        await new Promise((r) => setTimeout(r, 300));
        if (isCancelled) return;
        element.focus();

        // Spotlight name input
        const nameRect = element.getBoundingClientRect();
        setTargetRect({
          top: nameRect.top,
          left: nameRect.left,
          width: nameRect.width,
          height: nameRect.height,
        });

        // After 2.2s, glide cursor and spotlight to email input
        await new Promise((r) => setTimeout(r, 2200));
        if (isCancelled) return;
        const emailInput = document.querySelector("#contact-email");
        if (emailInput) {
          emailInput.focus();
          const emailRect = emailInput.getBoundingClientRect();
          setTargetRect({
            top: emailRect.top,
            left: emailRect.left,
            width: emailRect.width,
            height: emailRect.height,
          });
          setCursorPos((prev) => ({
            ...prev,
            x: emailRect.left + emailRect.width / 2,
            y: emailRect.top + emailRect.height / 2,
          }));
        }
      } else if (currentStep.action === "clickSubmit") {
        // Contact Page Automation: Cursor clicks on submit button
        await new Promise((r) => setTimeout(r, 400));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: true }));
        await new Promise((r) => setTimeout(r, 240));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: false }));
      } else if (currentStep.action === "returnHome") {
        // Finale: click logo to return home
        await new Promise((r) => setTimeout(r, 300));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: true }));
        await new Promise((r) => setTimeout(r, 220));
        if (isCancelled) return;
        setCursorPos((prev) => ({ ...prev, isClicking: false }));
        navigate("/");
      }

      // -------------------------------------------------------------
      // 7. TTS Audio Voice Narration & Completion-Driven Advance
      // -------------------------------------------------------------
      const handleAdvanceAfterNarration = () => {
        if (!isCancelled) {
          stepTimerRef.current = setTimeout(() => {
            if (currentStep.action === "returnHome") {
              stopTour();
            } else {
              nextStep();
            }
          }, 1200);
        }
      };

      if (isTtsEnabled) {
        speakNarration(activeTitle, activeDescription, handleAdvanceAfterNarration);
      } else {
        const wordCount = `${activeTitle} ${activeDescription}`.split(/\s+/).length;
        const readingMs = Math.max(3800, wordCount * 280);
        stepTimerRef.current = setTimeout(handleAdvanceAfterNarration, readingMs);
      }
    };

    runStep();

    return () => {
      isCancelled = true;
      clearStepTimer();
      stopAudio();

      const themeDropdown = document.querySelector(".navbar__theme-dropdown");
      if (themeDropdown) {
        const themeBtn = document.querySelector(".navbar__theme-btn");
        if (themeBtn) themeBtn.click();
      }
    };
  }, [
    isTourActive,
    isPaused,
    currentStepIndex,
    currentStep,
    isTtsEnabled,
    navigate,
    nextStep,
    stopTour,
    speakNarration,
    stopAudio,
    clearStepTimer,
  ]);

  // Recalculate targetRect on scroll and resize
  useEffect(() => {
    if (!isTourActive || !currentStep) return;

    const handleUpdateRect = () => {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    window.addEventListener("scroll", handleUpdateRect, { passive: true });
    window.addEventListener("resize", handleUpdateRect, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleUpdateRect);
      window.removeEventListener("resize", handleUpdateRect);
    };
  }, [isTourActive, currentStep]);

  const value = {
    isTourActive,
    isPaused,
    currentStepIndex,
    currentStep: dynamicStepData || currentStep,
    totalSteps,
    isTtsEnabled,
    toggleTts,
    startTour,
    stopTour,
    togglePause,
    nextStep,
    prevStep,
    jumpToPage,
  };

  return (
    <TourContext.Provider value={value}>
      {children}

      {/* Virtual Cursor */}
      <VirtualCursor
        x={cursorPos.x}
        y={cursorPos.y}
        isVisible={isTourActive && cursorPos.isVisible}
        isClicking={cursorPos.isClicking}
        isHovering={cursorPos.isHovering}
      />

      {/* Target Spotlight Outline */}
      <TourSpotlight
        targetRect={targetRect}
        isVisible={isTourActive && !isPaused && Boolean(targetRect)}
      />

      {/* Floating Director HUD */}
      {isTourActive && (
        <TourHUD
          currentStepData={dynamicStepData || currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          isPaused={isPaused}
          isTtsEnabled={isTtsEnabled}
          onToggleTts={toggleTts}
          onTogglePause={togglePause}
          onNext={nextStep}
          onPrev={prevStep}
          onExit={stopTour}
          onJumpToPage={jumpToPage}
        />
      )}
    </TourContext.Provider>
  );
}
