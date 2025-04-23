import {Component} from '@angular/core';
import {getMock} from "./mock";

@Component({
    selector: 'doc-tree',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {

    selectionMode: any = 'multiple';
    expansionMode: any = 'single';
    itemsBasic = getMock();
    itemsPrepend = getMock();
    itemsAppend = getMock();
    itemsColored = getMock();
    itemsSelectable = getMock();
    itemsExpansion = getMock();
    filenames = ['index.component.html', 'index.component.ts'];
}
