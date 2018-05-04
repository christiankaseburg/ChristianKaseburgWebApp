import { Component, ElementRef, HostListener, AfterViewInit } from '@angular/core';

import { TweenLite, TweenMax } from 'gsap';
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

    public slideShowContainer: HTMLCollectionOf<Element>;
    public videoContainer: HTMLCollectionOf<Element>;
    public slides: HTMLCollectionOf<Element>;
    public videos: NodeListOf<HTMLVideoElement>;
    public slidesVideoInfo: HTMLCollectionOf<Element>;
    public sliderContainerWidth: number;
    public videoSize: number;
    public centerVideoOffset: number;

    // @HostListener('window:resize', ['$event']) <-- Another solution besdies adding into inline html
    onResize(event) {
        this.setSliderValues();
    }

    /**
     * Set the slider variables for the container, and the slides.
     */
    public setSliderValues() {
        // video padding
        let videoPadding = 40;

        // Set slider elements to variables
        this.slideShowContainer = document.getElementsByClassName('slideshow__container');
        this.videoContainer = document.getElementsByClassName('slideshow__video-container');
        this.slides = document.getElementsByClassName('slideshow__slide');
        this.videos = document.getElementsByTagName('video');
        this.slidesVideoInfo = document.getElementsByClassName('slide-video-info');
        this.sliderContainerWidth = (this.slideShowContainer[0] as HTMLElement).clientWidth;
        this.videoSize = (this.videoContainer[0] as HTMLElement).clientWidth + videoPadding;

        // Calculate offset to center video
        this.centerVideoOffset = (window.innerWidth - this.videoSize) / 2;

        // Set Slider position
        this.sliderPosX = (this.centerVideoOffset - (this.currentVideo * this.videoSize));

        // Apply styles to Container
        setTimeout((this.slideShowContainer[0] as HTMLElement).removeAttribute('style'), 50);
        setTimeout((this.slideShowContainer[0] as HTMLElement).setAttribute('style',
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
            || this.currentVideo === this.experiments.length - 1 && direction === '+') && !this.animating) {

            // Set previous Video to currentVideo
            this.previousVideo = this.currentVideo;

            // If direction is backwards - from slider position
            // else if add to the sliderPosX
            if (direction === '-') {
                this.currentVideo++;
                this.sliderPosX -= this.videoSize;
            } else if (direction === '+') {
                this.currentVideo--;
                this.sliderPosX += this.videoSize;
            }

            // Start Tween, and then set activeslides for animation
            TweenLite.to(this.slideShowContainer, .75, { x: this.sliderPosX, delay: .25 });
            this.setActiveSlide();

            // Prevent user from scrolling through fast
            this.animating = true;
            setTimeout(() => this.animating = false, 1500);
        }

    }

    /**
     * Set the current slide to be active, and previous slide to unactive.
     */
    public setActiveSlide() {
        this.slides[this.previousVideo].classList.remove('active');
        this.slides[this.currentVideo].classList.add('active');
        this.playActiveVideo();
    }

    /**
     * Once the page has loaded start the load in animation.
     */

    // https://codepen.io/anon/pen/KRmaxZ remember
    public pageLoadedAnimation() {

        // Set Active slide
        this.setActiveSlide();

        // Start tween to push slider in
        TweenLite.fromTo(this.slideShowContainer, .5, { x: window.innerWidth }, { x: this.centerVideoOffset, delay: .5 });
    }

    /**
     * Set event listeners for slider
     */
    public setEventListeners() {

        // Event listener for scrolling through slides
        (this.slideShowContainer[0] as HTMLElement).addEventListener('wheel', event => this.findScrollDirection(event), false);

        (this.slideShowContainer[0] as HTMLElement).addEventListener('mousedown', event => this.lock(event), false);
        (this.slideShowContainer[0] as HTMLElement).addEventListener('touchstart', event => this.lock(event), false);

        (this.slideShowContainer[0] as HTMLElement).addEventListener('mouseup', event => this.move(event), false);
        (this.slideShowContainer[0] as HTMLElement).addEventListener('touchend', event => this.move(event), false);
    }

    /**
     * Check for changed touches, and if there are change touches
     * switch to that touch and if not return the regular event.
     * @param event
     */
    public unify(event) { return event.changedTouches ? event.changedTouches[0] : event };

    /**
     * set the x coordinate of the mouse.
     * @param event
     */
    public lock(event) { this.mousePosX = this.unify(event).clientX };

    /**
     * This is where the magic happens :D
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

        if (this.videos[this.previousVideo].paused != true) {
            this.videos[this.previousVideo].pause();
        }

        setTimeout(() => this.videos[this.currentVideo].play(), 1000);
    }

    /**
     * Pause active video
     */
    public pauseActiveVideo() {

        this.videos[this.currentVideo].pause();
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
