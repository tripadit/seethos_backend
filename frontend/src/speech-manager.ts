import { utils } from '@ricky0123/vad-react';

let source: AudioBufferSourceNode;
let sourceIsStarted = false;

export const onSpeechStart = () => {
  stopSourceIfNeeded();
};
export const stopSpeech = () => {
  stopSourceIfNeeded();
};

export const onSpeechEnd = async (audio: any, callback: (blob: Blob) => void) => {
  await processAudio(audio, callback);
};

export const onMisfire = () => {};

const stopSourceIfNeeded = () => {
  if (source && sourceIsStarted) {
    source.stop(0);
    sourceIsStarted = false;
  }
};

const processAudio = async (audio: any, callback: (blob: Blob) => void) => {
  const blob = createAudioBlob(audio);
  await validate(blob);
  callback(blob);
};

const createAudioBlob = (audio: any) => {
  const wavBuffer = utils.encodeWAV(audio);
  return new Blob([wavBuffer], { type: 'audio/wav' });
};

export const handleSuccess = async (blob: any) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  stopSourceIfNeeded();

  source = audioContext.createBufferSource();
  source.buffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
  source.connect(audioContext.destination);
  source.start(0);
  sourceIsStarted = true;
};

const validate = async (data: any) => {
  const decodedData = await new AudioContext().decodeAudioData(await data.arrayBuffer());
  const duration = decodedData.duration;
  const minDuration = 0.4;

  if (duration < minDuration)
    throw new Error(`Duration is ${duration}s, which is less than minimum of ${minDuration}s`);
};
