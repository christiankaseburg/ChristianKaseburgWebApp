import { Component, AfterViewInit } from '@angular/core';
import { TimelineMax } from 'gsap';

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements AfterViewInit {

    constructor() {
    }

    pageLoadedAnimation() {
        let tl = new TimelineMax();
        tl
            .fromTo('#profile_pic', 1.5, { 'filter': 'brightness(1000%)', '-webkit-filter': 'brightness(1000%)' }, { 'filter': 'brightness(100%)', '-webkit-filter': 'brightness(100%)' }, "start")
            .fromTo(['#bio__intro-heading', '#bio__intro-paragraph'], .75, { x: -(window.innerWidth / 2), opacity: 0 }, { x: 0, opacity: 1 }, 'start')
            .fromTo('#bio__img-container-social', .75, { y: 25, opacity: 0 }, { y: 0, opacity: 1 }, '-=.5');
    }

    ngAfterViewInit() {
        this.pageLoadedAnimation();
    }
}
