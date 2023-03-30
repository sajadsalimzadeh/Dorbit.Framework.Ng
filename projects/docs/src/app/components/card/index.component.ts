import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

interface FileInfo {
  name: string;
  content: string;
}

@Component({
  selector: 'app-card',
  templateUrl: 'index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  @Input() header!: string;
  @Input() component!: string;
  @Input() filenames: string[] = ['index.component.html'];

  files: FileInfo[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  sourceCode() {
    if(!this.component) return;
    this.files = [];
    this.filenames.forEach(filename => {
      const file = {
        name: filename,
        content: ''
      } as FileInfo;
      this.files.push(file);

      this.http.get(`/assets/docs/${this.component}/${filename}`, { responseType: 'text' }).subscribe(res => {
        if(filename.includes('.html')) {
          const lines = res.split('\n');
          const startIndex = lines.findIndex(x => x.includes(`header="${this.header}"`));
          const endIndex = lines.findIndex((x, i) => i > startIndex && x.includes(`</app-card>`));
          const cardLines = lines.filter((x, i) => i > startIndex && i < endIndex);
          res = cardLines.join('\n');
        }
        file.content = res;
      });
    })
  }
}
