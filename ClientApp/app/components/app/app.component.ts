import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from '../../services/shared/device-detector/device-detector.service'

var moment = require('moment-timezone');


@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['app.component.scss']
})

export class AppComponent implements AfterViewInit {

    @ViewChild('clock') public clock: ElementRef;
    @ViewChild('status') public status: ElementRef;
    @ViewChild('heart_rate_pulse') public heart_rate_pulse: ElementRef;
    public showMenu = false;

    constructor(private _deviceDetector: DeviceDetectorService, public router: Router) {

    }

    /**
     * Update users clock.
     */
    public updateClock() {
        this.clock.nativeElement.innerHTML = (moment as any).tz('America/Los_Angeles').format('h:mm:ss A');
    }


    /**
     * Update my status.
     * Can make it more precise, but not a priority lol.
     */
    public updateStatus() {

        let weekend,
        hour = (moment as any).tz('America/Los_Angeles').format('HH');
        //(moment as any).tz('America/Los_Angeles').format('dddd') == 'Friday' || 'Saturday' || 'Sunday' ? weekend = true : weekend = false;

        let currentStatus: string,
            heartRateColor: string;

        if (hour <= 5 || hour >= 22) {
            currentStatus = 'Snoozin\'';
        } else if (hour >= 6 && hour <= 16) {
            currentStatus = 'Workin\'';
        } else if (hour >= 17) {
            currentStatus = 'Hangin\'';
        } else {
            currentStatus = 'Eatin\'';
        }

        if (currentStatus === 'Snoozin\'' || currentStatus === 'Workin\'') {
            heartRateColor = 'header__heart-rate-pulse--red';
        } else {
            heartRateColor = 'header__heart-rate-pulse--green';
        }

        this.heart_rate_pulse.nativeElement.classList.add(heartRateColor);
        this.status.nativeElement.innerHTML = currentStatus + ' : ';
    }

    public toggleNavMenu() {
        if (window.innerWidth <= 768 && this.showMenu !== true) {
            this.showMenu = true;
        } else {
            this.showMenu = false;
        }
    }

    public checkRoute(route: string) {
        if (this.router.url.includes('/experiments/')) {
            return false;
        }
        return true;
    }

    ngAfterViewInit() {
        this._deviceDetector.setDeviceInfo();
        this.updateStatus();
        setInterval(() => this.updateClock(), 1000);
    }
}