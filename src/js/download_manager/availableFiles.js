import STORAGE_STANDARD from '../../files/Storage Standard.pdf';
import STREAMS_STANDARD from '../../files/Streams Standard.pdf';
import XMLH_STANDARD from '../../files/XMLHttpRequest Standard.pdf';
import DownloadItem from './downloadItem';

export default class AvailableFiles {
  constructor(downloadCallback) {
    this.downloadCallback = downloadCallback;
    this.el = document.createElement('div');
    this.el.classList.add('available-files');

    const title = 'Available files';

    this.el.innerHTML = `
    <span class="align-self-start badge bg-secondary my-1">${title}</span>
    <table class="table">
      <thead>
      </thead>
      <tbody>
      </tbody>
    </table>
    `;

    this.files = [
      ['storage standard', STORAGE_STANDARD, 'storage_standard.pdf'],
      ['streams standard', STREAMS_STANDARD, 'streams_standard.pdf'],
      ['XMLHttpRequest standard', XMLH_STANDARD, 'XMLHttpRequest_standard.pdf'],
    ].map(
      ([name, src, downloadName]) =>
        new DownloadItem(src, name, downloadName, downloadCallback)
    );

    const tbody = this.el.querySelector('tbody');

    this.files.forEach((item) => {
      item.bindToDOM(tbody);
    });
  }

  bindToDOM(parentElement) {
    parentElement.insertAdjacentElement('beforeEnd', this.el);
  }
}
