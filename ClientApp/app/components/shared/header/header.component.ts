import { Component, trigger, state, animate, transition, style } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'shared-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']

})

export class HeaderComponent {
    // All possible routes for a user
    navigationURLS = ['home', 'about', 'portfolio', 'blog', 'contact'];

    constructor() {
    }
}