# TTS Selection for Obsidian

A desktop-only minimal Obsidian plugin that:

* Takes the selected text;
* Runs a Python script with supertonic;
* Saves the `.wav` file to a folder inside the vault;
* Inserts `![[relative/path.wav]]` immediately below the selected text.

## Structure

Copy the `main.ts`, `manifest.json`, and `tts.py` files into the following folder:

```text
<your-vault>/.obsidian/plugins/tts-selection/

```

## Quick Start

1. Create a test vault (do not use your main one).
2. Place `main.ts` and `manifest.json` inside `.../.obsidian/plugins/tts-selection/`.
3. The easiest way is to use the `obsidian-sample-plugin`, as according to the Obsidian documentation, plugins are built via Node.js using `npm install` and then `npm run dev`.
4. Replace `main.ts` with the code from this archive.
5. Ensure that `main.js` is generated after the build.
6. Enable Community plugins and turn on `TTS Selection`.
7. In the plugin settings, specify:
* `Python path` (e.g., `python` or the full path to `python.exe`);
* `TTS script path` (the full path to `tts.py`);
* `Audio folder in vault` (e.g., `audio`).


8. Select text in a note.
9. Run the command `TTS: text-to-speech for selection`.

## Command

The plugin adds the following command:

```text
TTS: text-to-speech for selection

```

You can bind this to a hotkey in Obsidian.

## How the Code Works

* It retrieves the selected text using `editor.getSelection()`;
* It launches Python via `child_process.execFile()`;
* It passes the following arguments:
* `--text`
* `--output`
* `--voice`
* `--lang`


* It saves the WAV file into the vault, for example:

```text
audio/task-s-1715910000000.wav

```

* It then replaces the selection with:

```md
your selected text

![[audio/task-s-1715910000000.wav]]

```

## Important

Currently, this is a minimal prototype:

* No duplicate checking;
* No progress bar;
* No right-click context menu;
* Desktop-only compatibility.

## Troubleshooting the Build

The standard path according to the official Obsidian documentation:

```bash
cd path/to/vault
mkdir .obsidian/plugins
cd .obsidian/plugins
git clone https://github.com/obsidianmd/obsidian-sample-plugin.git tts-selection
cd tts-selection
npm install
npm run dev

```

Afterward, replace `manifest.json` and `main.ts` with your own files and reload Obsidian.