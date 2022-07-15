import byteSize from 'byte-size';
import AvailableFiles from './availableFiles';

export default class DownloadManager {
  constructor() {
    this.el = document.createElement('div');
    this.el.classList.add('download-manager');

    this.availableFiles = new AvailableFiles(this.addLoadSize.bind(this));
    this.availableFiles.bindToDOM(this.el);

    this.currentDownloadBytes = 0;
    this.alreadyDownloadElement = document.createElement('span');
    this.alreadyDownloadElement.classList.add(
      'align-self-start',
      'badge',
      'bg-warning',
      'my-1'
    );

    this.alreadyDownloadElement.textContent = "You've already download: 0 b";

    this.el.insertAdjacentElement('beforeEnd', this.alreadyDownloadElement);
  }

  addLoadSize(blob) {
    this.currentDownloadBytes += blob.size;

    this.alreadyDownloadElement.textContent = `You've already download: ${byteSize(
      this.currentDownloadBytes
    )}`;
  }

  bindToDOM(parentElement) {
    parentElement.insertAdjacentElement('beforeEnd', this.el);
  }
}
