import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import type EditorJS from '@editorjs/editorjs';
import type {
  BlockTool,
  BlockToolConstructorOptions,
  BlockToolData,
  OutputData,
  ToolConstructable,
} from '@editorjs/editorjs';

type AudioBlockData = {
  url?: string;
  caption?: string;
};

type ImageUploadResponse = {
  success: 1;
  file: {
    url: string;
  };
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Could not read file.'));
    });
    reader.addEventListener('error', () =>
      reject(reader.error ?? new Error('Could not read file.')),
    );
    reader.readAsDataURL(file);
  });
}

class AudioTool implements BlockTool {
  private data: Required<AudioBlockData>;
  private wrapper: HTMLDivElement | null = null;

  static get toolbox() {
    return {
      title: 'Audio',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l10-2v13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="3" stroke="currentColor" stroke-width="2"/></svg>',
    };
  }

  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get sanitize() {
    return {
      url: true,
      caption: true,
    };
  }

  constructor({ data }: BlockToolConstructorOptions<AudioBlockData>) {
    this.data = {
      url: data?.url ?? '',
      caption: data?.caption ?? '',
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-audio-card';
    this.renderContent();

    return this.wrapper;
  }

  save(): BlockToolData<AudioBlockData> {
    const caption = this.wrapper?.querySelector<HTMLInputElement>('[data-audio-caption]')?.value;

    return {
      url: this.data.url,
      caption: caption ?? this.data.caption,
    };
  }

  validate(savedData: BlockToolData<AudioBlockData>): boolean {
    return Boolean(savedData.url?.trim());
  }

  private renderContent(): void {
    if (!this.wrapper) {
      return;
    }

    this.wrapper.innerHTML = '';

    if (this.data.url) {
      this.renderPlayer();
      return;
    }

    this.renderPicker();
  }

  private renderPlayer(): void {
    if (!this.wrapper) {
      return;
    }

    const player = document.createElement('audio');
    player.className = 'editorjs-audio-player';
    player.controls = true;
    player.src = this.data.url;

    const caption = document.createElement('input');
    caption.className = 'editorjs-audio-caption';
    caption.dataset['audioCaption'] = 'true';
    caption.placeholder = 'Audio caption';
    caption.value = this.data.caption;
    caption.addEventListener('input', () => {
      this.data.caption = caption.value;
    });

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'editorjs-audio-remove';
    remove.textContent = 'Replace audio';
    remove.addEventListener('click', () => {
      this.data.url = '';
      this.renderContent();
    });

    this.wrapper.append(player, caption, remove);
  }

  private renderPicker(): void {
    if (!this.wrapper) {
      return;
    }

    const label = document.createElement('div');
    label.className = 'editorjs-audio-label';
    label.textContent = 'Audio block';

    const fileInput = document.createElement('input');
    fileInput.className = 'editorjs-audio-file';
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];

      if (!file) {
        return;
      }

      this.data.url = await readFileAsDataUrl(file);
      this.data.caption = file.name;
      this.renderContent();
    });

    const urlRow = document.createElement('div');
    urlRow.className = 'editorjs-audio-url-row';

    const urlInput = document.createElement('input');
    urlInput.className = 'editorjs-audio-url-input';
    urlInput.type = 'url';
    urlInput.placeholder = 'Paste audio URL';

    const addUrl = document.createElement('button');
    addUrl.type = 'button';
    addUrl.className = 'editorjs-audio-url-button';
    addUrl.textContent = 'Add';
    addUrl.addEventListener('click', () => {
      const url = urlInput.value.trim();

      if (!url) {
        return;
      }

      this.data.url = url;
      this.renderContent();
    });

    urlRow.append(urlInput, addUrl);
    this.wrapper.append(label, fileInput, urlRow);
  }
}

@Component({
  selector: 'app-diary',
  standalone: true,
  templateUrl: './diary.html',
  styleUrl: './diary.css',
})
export class Diary implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private editor: EditorJS | null = null;
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('editorHolder') private editorHolder?: ElementRef<HTMLDivElement>;

  pageTitle = 'Daily notes';
  editorReady = false;
  savedAt = 'Draft';
  blockCount = 0;

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser || !this.editorHolder) {
      return;
    }

    const [
      { default: EditorJSConstructor },
      { default: Header },
      { default: List },
      { default: Quote },
      { default: Delimiter },
      { default: ImageTool },
      { default: Marker },
      { default: InlineCode },
    ] = await Promise.all([
      import('@editorjs/editorjs'),
      import('@editorjs/header'),
      import('@editorjs/list'),
      import('@editorjs/quote'),
      import('@editorjs/delimiter'),
      import('@editorjs/image'),
      import('@editorjs/marker'),
      import('@editorjs/inline-code'),
    ]);

    this.editor = new EditorJSConstructor({
      holder: this.editorHolder.nativeElement,
      autofocus: true,
      placeholder: 'Start writing...',
      data: this.initialData(),
      tools: {
        header: {
          class: Header as ToolConstructable,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+H',
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2,
            placeholder: 'Heading',
          },
        },
        list: {
          class: List as ToolConstructable,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        quote: {
          class: Quote as ToolConstructable,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+Q',
          config: {
            quotePlaceholder: 'Quote',
            captionPlaceholder: 'Source',
          },
        },
        delimiter: Delimiter as ToolConstructable,
        image: {
          class: ImageTool as ToolConstructable,
          config: {
            captionPlaceholder: 'Image caption',
            uploader: {
              uploadByFile: (file: File): Promise<ImageUploadResponse> =>
                this.uploadImageFile(file),
              uploadByUrl: (url: string): Promise<ImageUploadResponse> => this.uploadImageUrl(url),
            },
          },
        },
        audio: AudioTool as unknown as ToolConstructable,
        marker: Marker as ToolConstructable,
        inlineCode: InlineCode as ToolConstructable,
      },
      onReady: () => {
        this.editorReady = true;
        void this.captureEditorState();
      },
      onChange: () => {
        void this.captureEditorState();
      },
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
    this.editor = null;
  }

  updateTitle(event: Event): void {
    this.pageTitle = (event.target as HTMLInputElement).value;
  }

  insertTextBlock(): void {
    this.insertBlock('paragraph');
  }

  insertHeadingBlock(): void {
    this.insertBlock('header', { text: '', level: 2 });
  }

  insertListBlock(): void {
    this.insertBlock('list', { style: 'unordered', items: [] });
  }

  insertImageBlock(): void {
    this.insertBlock('image');
  }

  insertAudioBlock(): void {
    this.insertBlock('audio');
  }

  insertDividerBlock(): void {
    this.insertBlock('delimiter');
  }

  private insertBlock(type: string, data: BlockToolData = {}): void {
    if (!this.editor) {
      return;
    }

    const currentIndex = Math.max(this.editor.blocks.getCurrentBlockIndex(), 0);
    this.editor.blocks.insert(type, data, undefined, currentIndex + 1, true);
  }

  private async captureEditorState(): Promise<void> {
    if (!this.editor) {
      return;
    }

    const data = await this.editor.save();
    this.blockCount = data.blocks.length;
    this.savedAt = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  }

  private initialData(): OutputData {
    return {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: '',
          },
        },
      ],
    };
  }

  private async uploadImageFile(file: File): Promise<ImageUploadResponse> {
    return {
      success: 1,
      file: {
        url: await readFileAsDataUrl(file),
      },
    };
  }

  private async uploadImageUrl(url: string): Promise<ImageUploadResponse> {
    return {
      success: 1,
      file: {
        url,
      },
    };
  }
}
