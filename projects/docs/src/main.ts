import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { IndexModule } from './app/index.module';


platformBrowserDynamic().bootstrapModule(IndexModule)
  .catch(err => console.error(err));
