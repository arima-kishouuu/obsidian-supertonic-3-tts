# TTS Selection for Obsidian

Desktop-only минимальный плагин для Obsidian:
- берет выделенный текст;
- запускает Python-скрипт с supertonic;
- сохраняет `.wav` в папку внутри vault;
- вставляет `![[relative/path.wav]]` сразу под выделенным текстом.

## Структура

Скопируй файлы `main.ts`, `manifest.json` и `tts.py` в папку:

```text
<your-vault>/.obsidian/plugins/tts-selection/
```

## Быстрый старт

1. Создай тестовый vault, не основной.
2. Внутри `.../.obsidian/plugins/tts-selection/` положи `main.ts` и `manifest.json`.
3. Проще всего взять `obsidian-sample-plugin`, потому что по документации Obsidian плагины собираются через Node.js и `npm install`, затем `npm run dev`.
4. Замени `main.ts` кодом из этого архива.
5. Убедись, что после сборки появился `main.js`.
6. Включи Community plugins и включи `TTS Selection`.
7. В настройках плагина укажи:
   - `Python path`, например `python` или полный путь к `python.exe`;
   - `TTS script path`, полный путь к `tts.py`;
   - `Audio folder in vault`, например `audio`.
8. Выдели текст в заметке.
9. Выполни команду `TTS: озвучить выделенный текст`.

## Команда

Плагин добавляет команду:

```text
TTS: озвучить выделенный текст
```

Её можно повесить на hotkey в Obsidian.

## Что делает код

- через `editor.getSelection()` получает выделенный текст;
- через `child_process.execFile()` запускает Python;
- передает аргументы:
  - `--text`
  - `--output`
  - `--voice`
  - `--lang`
- сохраняет WAV в vault, например:

```text
audio/task-s-1715910000000.wav
```

- затем заменяет выделение на:

```md
твой выделенный текст

![[audio/task-s-1715910000000.wav]]
```

## Важно

Сейчас это минимальный прототип:
- нет проверки дубликатов;
- нет прогресс-бара;
- нет контекстного меню правой кнопкой;
- работает только на desktop.

## Если сборка не идет

Базовый путь по официальной документации Obsidian:

```bash
cd path/to/vault
mkdir .obsidian/plugins
cd .obsidian/plugins
git clone https://github.com/obsidianmd/obsidian-sample-plugin.git tts-selection
cd tts-selection
npm install
npm run dev
```

Потом заменяешь `manifest.json` и `main.ts` своими файлами и перезагружаешь Obsidian.
