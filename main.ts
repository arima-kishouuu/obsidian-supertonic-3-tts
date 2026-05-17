import { App, Notice, Plugin, PluginSettingTab, Setting, TFile, normalizePath, Editor } from 'obsidian';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';

const execFileAsync = promisify(execFile);

interface TTSSelectionSettings {
	pythonPath: string;
	scriptPath: string;
	audioFolder: string;
	voiceName: string;
	lang: string;
}

const DEFAULT_SETTINGS: TTSSelectionSettings = {
	pythonPath: 'python',
	scriptPath: '',
	audioFolder: 'audio',
	voiceName: 'M1',
	lang: 'ru',
};

export default class TTSSelectionPlugin extends Plugin {
	settings: TTSSelectionSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'tts-selected-text',
			name: 'TTS: tts current text',
			editorCallback: async (editor: Editor) => {
				await this.generateForSelection(editor);
			},
		});

		this.addSettingTab(new TTSSelectionSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async generateForSelection(editor: Editor) {
		const selected = editor.getSelection();
		if (!selected || !selected.trim()) {
			new Notice('firstly select text.');
			return;
		}

		if (!this.settings.scriptPath.trim()) {
			new Notice('path to tts.py in settings of plagin.');
			return;
		}

		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice('no active note.');
			return;
		}

		const vaultBase = (this.app.vault.adapter as any).basePath;
		if (!vaultBase) {
			new Notice('cant find path to vault. only desktop.');
			return;
		}

		const noteStem = activeFile.basename.replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g, '-');
		const ts = Date.now();
		const relAudioPath = normalizePath(`${this.settings.audioFolder}/${noteStem}-${ts}.wav`);
		const absAudioPath = path.join(vaultBase, relAudioPath);

		new Notice('generating sound...');

		try {
			const { stdout, stderr } = await execFileAsync(
				this.settings.pythonPath,
				[
					this.settings.scriptPath,
					'--text', selected,
					'--output', absAudioPath,
					'--voice', this.settings.voiceName,
					'--lang', this.settings.lang,
				],
				{ windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
			);

			if (stderr && stderr.trim()) console.warn(stderr);
			if (stdout && stdout.trim()) console.log(stdout);

			await this.app.vault.adapter.exists(relAudioPath);
			const embed = `\n\n![[${relAudioPath}]]`;
			editor.replaceSelection(`${selected}${embed}`);
			new Notice(`done: ${relAudioPath}`);
		} catch (err: any) {
			console.error(err);
			new Notice(`error TTS: ${err?.message || err}`);
		}
	}
}

class TTSSelectionSettingTab extends PluginSettingTab {
	plugin: TTSSelectionPlugin;

	constructor(app: App, plugin: TTSSelectionPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'TTS Selection settings' });

		new Setting(containerEl)
			.setName('Python path')
			.setDesc('for example: python or C:\\Users\\you\\miniconda3\\python.exe')
			.addText((text) =>
				text
					.setPlaceholder('python')
					.setValue(this.plugin.settings.pythonPath)
					.onChange(async (value) => {
						this.plugin.settings.pythonPath = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('TTS script path')
			.setDesc('path to tts.py')
			.addText((text) =>
				text
					.setPlaceholder('D:\\scripts\\tts.py')
					.setValue(this.plugin.settings.scriptPath)
					.onChange(async (value) => {
						this.plugin.settings.scriptPath = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Audio folder in vault')
			.setDesc('folder inside vault, when we save wav')
			.addText((text) =>
				text
					.setPlaceholder('audio')
					.setValue(this.plugin.settings.audioFolder)
					.onChange(async (value) => {
						this.plugin.settings.audioFolder = value.trim() || 'audio';
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Voice name')
			.addText((text) =>
				text
					.setPlaceholder('M1')
					.setValue(this.plugin.settings.voiceName)
					.onChange(async (value) => {
						this.plugin.settings.voiceName = value.trim() || 'M1';
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Language')
			.addText((text) =>
				text
					.setPlaceholder('ru')
					.setValue(this.plugin.settings.lang)
					.onChange(async (value) => {
						this.plugin.settings.lang = value.trim() || 'ru';
						await this.plugin.saveSettings();
					})
			);
	}
}
