import { Component, ElementRef, HostListener, AfterViewInit, ViewChild } from '@angular/core';

import { TweenLite, TweenMax, TimelineMax } from 'gsap';
import { EXPERIMENTS } from './mock-experiments';

@Component({
    selector: 'experiments',
    templateUrl: './experiments.component.html',
    styleUrls: ['./experiments.component.scss'],
})

export class ExperimentsComponent implements AfterViewInit {

    public experiments = EXPERIMENTS;

    public currentVideo: number = 0;
    public previousVideo: number = 0;
    public sliderPosX: number = 0;
    public mousePosX = null;
    public minDragDistance: number = 40;
    public animating: boolean = false;
    public titleMenuExpanded: boolean = false;

    @ViewChild('slideshow__container') public slideshow__container: ElementRef;
    @ViewChild('slideshow__video_container') public slideshow__video_container: ElementRef;
    @ViewChild('showTitleBtn') public showTitleBtn: ElementRef;
    public slideshow__slide: HTMLCollectionOf<Element>;
    public slideshow__slideTitles: HTMLCollectionOf<Element>;
    public slideshow__videos: NodeListOf<HTMLVideoElement>;
    public sliderContainerWidth: number;
    public videoSize: number;
    public centerVideoOffset: number;

    /**
     * On resize event reset slider values to new screen size
     * @param event
     */
    onResize(event) {
        this.setSliderValues();
    }

    /**
     * Set the slider variables for the container, and the slides.
     */
    public setSliderValues() {
        let videoPadding = 40;

        // Set slider elements to variables
        this.slideshow__slide = document.getElementsByClassName('slideshow__slide');
        this.slideshow__slideTitles = document.getElementsByClassName('slideshow__title-elements');
        this.slideshow__videos = document.getElementsByTagName('video');

        // Set sizes from DOM elements
        this.sliderContainerWidth = this.slideshow__container.nativeElement.clientWidth;
        this.videoSize = this.slideshow__video_container.nativeElement.clientWidth + videoPadding;

        // Calculate offset to center video
        this.centerVideoOffset = (document.body.clientWidth - this.videoSize) / 2;

        // Set Slider position
        this.sliderPosX = (this.centerVideoOffset - (this.currentVideo * this.videoSize));

        // Apply styles to Container
        setTimeout(this.slideshow__container.nativeElement.removeAttribute('style'), 50);
        setTimeout(this.slideshow__container.nativeElement.setAttribute('style',
            'width: ' + (this.videoSize * this.experiments.length) + 'px; ' + 'transform: matrix(1, 0, 0, 1, ' + this.sliderPosX +
            ', 0); touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);'), 100);
    }

    /**
     * Switch through the videos based on the direction the user supplies.
     * @param direction
     * The user supplies a direction, and the container will move based on that.
     */
    public switchVideo(direction: string) {
        // True as long if video positioned at front is moving to next video,
        // currentVideo is within the 0 and total experiment limit,
        // and if currentvideo is last video and is moving backwards
        if ((this.currentVideo === 0 && direction === '-'
            || (0 < this.currentVideo && this.currentVideo < this.experiments.length - 1)
            || this.currentVideo === this.experiments.length - 1 && direction === '+')
            && !this.animating) {

            this.previousVideo = this.currentVideo;

            if (direction === '-') {
                this.currentVideo++;
                this.sliderPosX -= this.videoSize;
            } else if (direction === '+') {
                this.currentVideo--;
                this.sliderPosX += this.videoSize;
            }

            let switchVideoTimeLine = new TimelineMax();
            switchVideoTimeLine.to(this.slideshow__slideTitles[this.previousVideo].children, 1, {
                y: function (index) {
                    return (index + 1) * 105;
                }, onComplete: this.slideshow__slideTitles[this.currentVideo].classList.remove('slideshow__title-elements--hidden')
            })
                .to(this.slideshow__container.nativeElement, .75, { x: this.sliderPosX, delay: .25 }, '-=.5')
                .fromTo(this.slideshow__slideTitles[this.currentVideo].children, .75, {
                    y: function (index) {
                        return (index + 1) * 105;
                    }
                },
                {
                    y: function (index) {
                        return (index + 1) * 0;
                    }
                }, '-=.2');

            setTimeout(() => this.setActiveSlide(), 300);

            // Using setTimeout to prevent users from scrolling through slides fast
            // and remove the hidden class from the title element.
            this.animating = true;
            setTimeout(() => this.animating = false,
            this.slideshow__slideTitles[this.previousVideo].classList.remove('slideshow__title-elements--hidden')
            , 1500);
        }
    }

    /**
     * Toggle the title menu when the View All button is clicked.
     */
    public toggleTitleMenu() {
        this.titleMenuExpanded = !this.titleMenuExpanded;

        if (this.titleMenuExpanded) {
            this.showTitleBtn.nativeElement.classList.add('slideshow__view-all--active');
        } else {
            this.showTitleBtn.nativeElement.classList.remove('slideshow__view-all--active');
        }
    }

    /**
     * Set the current slide to be active, and previous slide to unactive.
     */
    public setActiveSlide() {
        this.slideshow__slide[this.previousVideo].classList.remove('active');
        this.slideshow__slide[this.currentVideo].classList.add('active');
        this.playActiveVideo();
    }

    /**
     * Once the page has loaded start the load in animation.
     */

    // https://codepen.io/anon/pen/KRmaxZ remember
    public pageLoadedAnimation() {
        let pageLoadTimeLine = new TimelineMax({ onComplete: this.setActiveSlide() });

        this.slideshow__slideTitles[this.currentVideo].classList.remove('slideshow__title-elements--hidden');
        pageLoadTimeLine.fromTo(this.slideshow__container.nativeElement, .5, { x: window.innerWidth }, { x: this.centerVideoOffset, delay: .5 })
            .from(this.slideshow__slideTitles[this.currentVideo].children, 1, {
                y: function (index) {
                    return (index + 1) * 105;
                }
            });

    }

    /**
     * Set event listeners for slider
     */
    public setEventListeners() {

        // Event listener for scrolling through slides
        this.slideshow__container.nativeElement.addEventListener('wheel', event => this.findScrollDirection(event), false);

        this.slideshow__container.nativeElement.addEventListener('mousedown', event => this.lock(event), false);
        this.slideshow__container.nativeElement.addEventListener('touchstart', event => this.lock(event), false);

        this.slideshow__container.nativeElement.addEventListener('mouseup', event => this.move(event), false);
        this.slideshow__container.nativeElement.addEventListener('touchend', event => this.move(event), false);
    }

    /**
     * Check for changed touches, and if there are change touches
     * switch to that touch and if not use event.
     * @param event
     */
    public unify(event) { return event.changedTouches ? event.changedTouches[0] : event };

    /**
     * set the x coordinate of the mouse.
     * @param event
     */
    public lock(event) { this.mousePosX = this.unify(event).clientX };

    /**
     * This is where the magic happens.
     * @param event
     */
    public move(event) {
        if (this.mousePosX || this.mousePosX === 0) {
            let dx = this.unify(event).clientX - (this.mousePosX as any), s = Math.sign(dx);

            if (dx !== 0) {
                if (dx < this.minDragDistance) {
                    this.switchVideo('-');
                } else if (dx > -(this.minDragDistance)) {
                    this.switchVideo('+');
                }
            }

            this.mousePosX = null;
        }
    };

    /**
     * Calculate the direction the user scrolled, and then
     * switch the video to the next video or previous.
     * @param event
     */
    public findScrollDirection(event) {
        let delta;
        let direction;

        if (event.wheelDelta) {
            delta = event.wheelDelta;
        } else {
            delta = -1 * event.deltaY;
        }

        if (delta < 0) {
            direction = '-';
        } else if (delta > 0) {
            direction = '+';
        }

        this.switchVideo(direction);
        event.preventDefault();
    }

    /**
     * Pause previous video if playing, and play current video.
     */
    public playActiveVideo() {

        if (this.slideshow__videos[this.previousVideo].paused != true) {
            this.slideshow__videos[this.previousVideo].pause();
        }

        setTimeout(() => this.slideshow__videos[this.currentVideo].play(), 1000);
    }

    /**
     * Pause active video
     */
    public pauseActiveVideo() {

        this.slideshow__videos[this.currentVideo].pause();
    }

    /**
     * After view has been initialized call onResize to set styles,
     * and then start page Loaded animation to slide the slider in.
     */
    ngAfterViewInit() {
        this.onResize(event);
        this.setEventListeners();
        this.pageLoadedAnimation();

    }
}
