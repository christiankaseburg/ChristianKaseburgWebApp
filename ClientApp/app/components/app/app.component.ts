import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from '../../services/shared/device-detector/device-detector.service'
import { Router } from '@angular/router';
import { routerTransition } from '../shared/router.animations';

@Component({
    selector: 'app',
    animations: [ routerTransition ],
    templateUrl: './app.component.html',
    styleUrls: ['app.component.scss']
})

export class AppComponent {

    // All possible routes for a user
    navigationURLS = ['home', 'portfolio', 'experiments', 'contact'];
    // Check if hamburger button is clicked for manipulating scrolling behavior
    hamburgerClicked: boolean = false;
    showSocial: boolean = false;

    constructor(private _deviceDetector: DeviceDetectorService, public router: Router) {

    }

    getState(outlet) {
        return outlet.activatedRouteData.state;
    }

    //Toggles the overflow because when the hamburger expands you can still scroll in the background.
    hideOverflow(clicked: boolean) {
        this.hamburgerClicked = !this.hamburgerClicked;
        // Debugging purposes to return width, or check if value was true or false if checkbox was checked.
        //console.log(window.innerWidth);
        if (this.hamburgerClicked && window.innerWidth <= 812) {
            document.body.setAttribute("style", "overflow: hidden");
            this.showSocial = true;
        } else if (!this.hamburgerClicked && window.innerWidth <= 812) {
            document.body.removeAttribute("style");
            this.showSocial = false;
        }
    }

    experimentRoute(route: string) {
        if (this.router.url.includes('/experiments/')) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        this._deviceDetector.setDeviceInfo();
    }
}