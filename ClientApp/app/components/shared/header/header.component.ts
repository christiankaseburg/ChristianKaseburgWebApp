import { Component } from '@angular/core';

@Component({
    selector: 'shared-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']

})

export class HeaderComponent {
    // All possible routes for a user
    navigationURLS = ['home', 'about', 'portfolio', 'blog', 'contact'];

    // Check if hamburger button is clicked for manipulating scrolling behavior
    hamburgerClicked: boolean = false;

    constructor() {
    }

    //Toggles the overflow because when the hamburger expands you can still scroll in the background.
    hideOverflow(clicked: boolean) {
        this.hamburgerClicked = !this.hamburgerClicked;
        console.log(this.hamburgerClicked);
        if (this.hamburgerClicked && screen.width <= 414) {
            document.body.setAttribute("style", "overflow: hidden")
        } else if (!this.hamburgerClicked && screen.width <= 414) {
            document.body.removeAttribute("style")
        }
    }

}