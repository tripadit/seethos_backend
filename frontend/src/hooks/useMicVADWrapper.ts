import { useMicVAD } from '@ricky0123/vad-react';
import { useEffect, useRef, useState } from 'react';

import { onMisfire, onSpeechEnd, onSpeechStart } from '@/speech-manager';

export const useMicVADWrapper = (callback: (blob: any) => void) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [enableVoice, setEnableVoice] = useState(false);
  const micVAD = useMicVAD({
    preSpeechPadFrames: 5,
    positiveSpeechThreshold: 0.9,
    negativeSpeechThreshold: 0.75,
    minSpeechFrames: 4,
    onSpeechStart: () => {
      setTimeLeft(60);
      onSpeechStart();
    },
    startOnLoad: false,
    onSpeechEnd: (audio) => onSpeechEnd(audio, callback),
    onVADMisfire: () => {
      setTimeLeft(60);
      onMisfire();
    },
  });

  const loadingRef = useRef(micVAD.loading);

  useEffect(() => {
    if (loadingRef.current !== micVAD.loading) {
      loadingRef.current = micVAD.loading;
    }
  });

  useEffect(() => {
    if (timeLeft <= 0 && enableVoice) {
      micVAD.pause();
      onSpeechStart();
      setEnableVoice(false);
    }

    if (timeLeft <= 0 || !enableVoice) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [timeLeft, enableVoice]);

  return { micVAD, timeLeft, enableVoice, setEnableVoice, setTimeLeft };
};
