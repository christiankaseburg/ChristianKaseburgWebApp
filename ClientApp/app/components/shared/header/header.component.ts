import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'shared-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {

    // All possible routes for a user
    navigationURLS = ['home', 'about', 'portfolio', 'blog', 'contact'];

    constructor(private router: Router) {
    }

    /* NavigationToPage will re route the user based on the name of the page they clicked on in the header.
      Using one function that takes an argument prevents redundancy.
    */
    navigateToPage(route: string) {
        this.router.navigate([route]);
    }
}
