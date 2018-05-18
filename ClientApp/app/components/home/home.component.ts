import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TweenLite, TimelineLite } from 'gsap';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

    @ViewChild('title') public title: ElementRef;
    @ViewChild('subtitle') public subtitle: ElementRef;
    @ViewChild('test') public test: ElementRef;

    public startPageLoadedAnimations() {
        let tl = new TimelineLite();
        tl
            .fromTo(this.title.nativeElement, .75, { y: 105, opacity: 0 }, { y: 0, opacity: 1 })
            .fromTo(this.subtitle.nativeElement, .75, { y: 105, opacity: 0 }, { y: 0, opacity: .5}, "-=0.5");
    }

    ngAfterViewInit() {
        this.startPageLoadedAnimations();
    }
}
