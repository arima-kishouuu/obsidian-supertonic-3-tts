var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TTSSelectionPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_node_child_process = require("node:child_process");
var import_node_util = require("node:util");
var path = __toESM(require("node:path"));
var execFileAsync = (0, import_node_util.promisify)(import_node_child_process.execFile);
var DEFAULT_SETTINGS = {
  pythonPath: "python",
  scriptPath: "",
  audioFolder: "audio",
  voiceName: "M1",
  lang: "ru"
};
var TTSSelectionPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "tts-selected-text",
      name: "TTS: tts current text",
      editorCallback: async (editor) => {
        await this.generateForSelection(editor);
      }
    });
    this.addSettingTab(new TTSSelectionSettingTab(this.app, this));
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  async generateForSelection(editor) {
    const selected = editor.getSelection();
    if (!selected || !selected.trim()) {
      new import_obsidian.Notice("firstly select text.");
      return;
    }
    if (!this.settings.scriptPath.trim()) {
      new import_obsidian.Notice("path to tts.py in settings of plagin.");
      return;
    }
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      new import_obsidian.Notice("no active note.");
      return;
    }
    const vaultBase = this.app.vault.adapter.basePath;
    if (!vaultBase) {
      new import_obsidian.Notice("cant find path to vault. only desktop.");
      return;
    }
    const noteStem = activeFile.basename.replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g, "-");
    const ts = Date.now();
    const relAudioPath = (0, import_obsidian.normalizePath)(`${this.settings.audioFolder}/${noteStem}-${ts}.wav`);
    const absAudioPath = path.join(vaultBase, relAudioPath);
    new import_obsidian.Notice("generating sound...");
    try {
      const { stdout, stderr } = await execFileAsync(
        this.settings.pythonPath,
        [
          this.settings.scriptPath,
          "--text",
          selected,
          "--output",
          absAudioPath,
          "--voice",
          this.settings.voiceName,
          "--lang",
          this.settings.lang
        ],
        { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
      );
      if (stderr && stderr.trim()) console.warn(stderr);
      if (stdout && stdout.trim()) console.log(stdout);
      await this.app.vault.adapter.exists(relAudioPath);
      const embed = `

![[${relAudioPath}]]`;
      editor.replaceSelection(`${selected}${embed}`);
      new import_obsidian.Notice(`done: ${relAudioPath}`);
    } catch (err) {
      console.error(err);
      new import_obsidian.Notice(`error TTS: ${err?.message || err}`);
    }
  }
};
var TTSSelectionSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "TTS Selection settings" });
    new import_obsidian.Setting(containerEl).setName("Python path").setDesc("for example: python or C:\\Users\\you\\miniconda3\\python.exe").addText(
      (text) => text.setPlaceholder("python").setValue(this.plugin.settings.pythonPath).onChange(async (value) => {
        this.plugin.settings.pythonPath = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("TTS script path").setDesc("path to tts.py").addText(
      (text) => text.setPlaceholder("D:\\scripts\\tts.py").setValue(this.plugin.settings.scriptPath).onChange(async (value) => {
        this.plugin.settings.scriptPath = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Audio folder in vault").setDesc("folder inside vault, when we save wav").addText(
      (text) => text.setPlaceholder("audio").setValue(this.plugin.settings.audioFolder).onChange(async (value) => {
        this.plugin.settings.audioFolder = value.trim() || "audio";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Voice name").addText(
      (text) => text.setPlaceholder("M1").setValue(this.plugin.settings.voiceName).onChange(async (value) => {
        this.plugin.settings.voiceName = value.trim() || "M1";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Language").addText(
      (text) => text.setPlaceholder("ru").setValue(this.plugin.settings.lang).onChange(async (value) => {
        this.plugin.settings.lang = value.trim() || "ru";
        await this.plugin.saveSettings();
      })
    );
  }
};
//# sourceMappingURL=main.js.map
