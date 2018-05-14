import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from '../shared/services/device-detector/device-detector.service'
import { TweenMax, Power0, Power4, TimelineMax } from 'gsap/TweenMax';

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
    public clockInterval;

    public splash: HTMLElement| null;
    public squareHolder: HTMLElement | null;
    public mainSquare: HTMLElement | null;
    public opacitySquare: HTMLElement | null;
    public splashState: HTMLElement | null;
    public border: HTMLElement | null;
    public duration = 1;
    public isDone = false;
    public mainAnim;

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

    /**
     * toggleNavMenu when navigation switched to the hamburger.
     */
    public toggleNavMenu() {
        if (window.innerWidth <= 768 && this.showMenu !== true) {
            this.showMenu = true;
        } else {
            this.showMenu = false;
        }
    }

    /**
     * Temp workaround  until I figure out subdomains for showing experiments
     * @param route
     */
    public checkRoute(route: string) {
        if (this.router.url.includes('/lab/')) {
            clearInterval(this.clockInterval);
            return false;
        }
        return true;
    }

    /**
     * app has loaded, so switch from loading to hold to continue
     */
    public hideSplashScreen() {
        this.splash = document.getElementById('splash');
        this.squareHolder = document.getElementById('splash__square-holder');
        this.mainSquare = document.getElementById('splash__square-1');
        this.opacitySquare = document.getElementById('splash__square-2');
        this.border = document.getElementById('main__border');
        this.splashState = document.getElementById('splash__state');

        this.splashState!.innerHTML = 'Welcome, please hold to continue';

        document.addEventListener('mousedown', () => this.holdingDown(event));
        document.addEventListener('touchstart', () => this.holdingDown(event));

        document.addEventListener('mouseup', () => this.holdingUp(event));
        document.addEventListener('touchend', () => this.holdingUp(event));

        this.holdToContinueSplashAnimation();
    }

    public holdToContinueSplashAnimation() {
        this.mainAnim = TweenMax.to(this.mainSquare, this.duration, {
            paused: true,
            strokeDashoffset: 10,
            ease: Power0.easeNone,
            onComplete: () => this.loadingAnimDone()
        });
    }

    public holdingDown(e) {
            e.preventDefault();
            this.mainAnim
                .timeScale(1)
                .play();
    }   

    public holdingUp(e) {
            this.mainAnim
                .timeScale(4)
                .reverse();
    }

    public loadingAnimDone() {
        this.isDone = true;

        let tL = new TimelineMax();

        tL.set(this.mainSquare, {
            strokeDashoffset: 0,
            strokeDasharray: 0
        })
            .to([this.mainSquare, this.opacitySquare, this.splashState], 0, { opacity: 0 })
            .set(this.border, { zIndex: 101 })
            .to(this.border, 1, { height: '100%' })
            .to(this.border, .5, { width: '100%' })
            .to(this.splash, .25, { opacity: 0, zIndex: -1 })
            .set(this.border, { zIndex: -1 });
    }

    ngAfterViewInit() {
        this._deviceDetector.setDeviceInfo();
        this.updateStatus();
        this.clockInterval = setInterval(() => this.updateClock(), 1000);
        this.hideSplashScreen();
    }
}