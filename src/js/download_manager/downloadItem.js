import byteSize from 'byte-size';

export default class DownloadItem {
  constructor(src, name, downloadName, downloadCallback) {
    this.downloadCallback = downloadCallback;
    this.src = src;
    this.downloadName = downloadName;
    this.el = document.createElement('tr');
    this.blob = null;

    this.el.innerHTML = `
    <td><span class="badge bg-primary">${name}</span></td>
    <td><span class="item-size badge bg-primary"></span></td>
    <td><button class="btn btn-success">download</button></td>
    `;

    this.sizeElement = this.el.querySelector('.item-size');
    this.downloadButton = this.el.querySelector('button');

    this.downloadRef = document.createElement('a');
    this.downloadRef.download = downloadName;
    this.downloadRef.href = src;

    this.setFileSize();
    this.setListeners();
  }

  setListeners() {
    this.downloadButton.addEventListener('click', (event) => {
      event.preventDefault();

      this.downloadRef.click();

      this.downloadCallback?.(this.blob);
    });
  }

  setFileSize() {
    fetch(this.src)
      .then((response) => response.blob())
      .then((blob) => {
        this.blob = blob;
        this.sizeElement.textContent = byteSize(blob.size);
      });
  }

  bindToDOM(parentElement) {
    parentElement.insertAdjacentElement('beforeEnd', this.el);
  }
}
