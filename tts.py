import argparse
from pathlib import Path
from supertonic import TTS


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--text', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--voice', default='M1')
    parser.add_argument('--lang', default='ru')
    args = parser.parse_args()

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    tts = TTS(auto_download=True)
    style = tts.get_voice_style(voice_name=args.voice)
    wav, _duration = tts.synthesize(args.text, voice_style=style, lang=args.lang)
    tts.save_audio(wav, str(output_path))
    print(str(output_path))


if __name__ == '__main__':
    main()
