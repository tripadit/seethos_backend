import logging
import os
import shutil
import time
import uuid

import ffmpeg
import openai

from util import delete_file

LANGUAGE = os.getenv("LANGUAGE", "en")
os.environ["OPENAI_API_KEY"] = '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'
openai.api_key = os.getenv("OPENAI_API_KEY", "'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")

async def transcribe(filename,):
    openai.api_key = os.getenv("OPENAI_API_KEY", "'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")
    start_time = time.time()
    # initial_filepath = f"/tmp/{uuid.uuid4()}{filename}"

    # with open(initial_filepath, "wb+") as file_object:
    #     shutil.copyfileobj(audio, file_object)

    converted_filepath = f"/tmp/ffmpeg-{uuid.uuid4()}{filename}"

    # logging.debug("running through ffmpeg")
    # (
    #     ffmpeg
    #     .input(initial_filepath)
    #     .output(converted_filepath, loglevel="error")
    #     .run()
    # )
    # logging.debug("ffmpeg done")

    #delete_file(initial_filepath)

    read_file = open(filename, "rb")

    logging.debug("calling whisper")
    transcription = (await openai.Audio.atranscribe("whisper-1", read_file, language=LANGUAGE))["text"]
    logging.info("STT response received from whisper in %s %s", time.time() - start_time, 'seconds')
    logging.info('user prompt: %s', transcription)

    delete_file(filename)

    return transcription
