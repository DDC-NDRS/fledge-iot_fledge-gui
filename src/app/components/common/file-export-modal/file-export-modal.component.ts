import { Component, HostListener, Input } from '@angular/core';
import { AlertService } from '../../../services';

@Component({
  selector: 'app-file-export-modal',
  templateUrl: './file-export-modal.component.html',
  styleUrls: ['./file-export-modal.component.css']
})
export class FileExportModalComponent {
  @Input() data;
  @Input() configuration;
  @Input() categoryName;
  format = 'csv';

  constructor(private alertService: AlertService) { }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.formReset();
  }

  public toggleModal(isOpen: boolean) {
    const modalName = <HTMLDivElement>document.getElementById('file-export-modal-' + this.configuration.key);
    if (isOpen) {
      modalName.classList.add('is-active');
      return;
    }
    modalName.classList.remove('is-active');
  }

  exportFile() {
    if (this.format == 'json') {
      let jsonData = JSON.stringify(this.data);
      let fileName = this.categoryName + '-' + this.configuration?.key;
      this.downloadFile(jsonData, fileName);
    }
    else {
      let csvData = this.jsonTocsv(this.data);
      let fileName = this.categoryName + '-' + this.configuration?.key;
      this.downloadFile(csvData, fileName);
    }
  }

  formReset() {
    this.setformat('csv');
    this.hideDropDown('format-dropdown');
    this.toggleModal(false);
  }

  toggleDropDown(id: string) {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      dropdown.classList.toggle('is-active');
    }
  }

  hideDropDown(id: string) {
    const dropdown = document.getElementById(id);
    if (dropdown && dropdown.classList.contains('is-active')) {
      dropdown.classList.toggle('is-active');
    }
  }

  setformat(format) {
    this.format = format;
  }

  downloadFile(data: any, filename: string) {
    const a: any = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    const blob = new Blob([data], { type: 'text/json' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    if (this.format == 'json') {
      a.download = filename + '.json';
    }
    else {
      a.download = filename + '.csv';
    }
    a.click();
    setTimeout(() => {
      this.alertService.closeMessage();
    }, 1000);
  }

  jsonTocsv(json) {
    if (this.configuration.type == 'list') {
      const header = Object.keys(json[0]);
      const rows = json.map((obj) => {
        return header.map((key) => {
          const value = obj[key];
          return `${value}`;
        }).join(',');
      });
      return [header.join(','), ...rows].join('\n');
    }
    else {
      let rows = [];
      let header;
      for (let [key, val] of Object.entries(json)) {
        header = Object.keys(val);
        let row = header.map((key) => {
          const value = val[key];
          return `${value}`;
        }).join(',');
        row = key + ',' + row;
        rows.push(row)
      }
      header = this.configuration.keyName + ',' + header.join(',');
      return [header, ...rows].join('\n');
    }
  }
}
