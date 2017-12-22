import { Component, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';
import '../../../../../wwwroot/assets/js/bundle.js';

declare var webGlObject: any;

@Component({
    selector: 'shared-background',
    templateUrl: './background.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./background.component.less']
})
export class BackgroundComponent {

    constructor() {
        
    }

    ngAfterViewInit(): void {
        /* invoke init() function from bundle.js file to build background
        webGlObject.init();
        */
    }
}
