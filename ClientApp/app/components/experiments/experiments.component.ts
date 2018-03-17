import { Component, ElementRef, HostListener } from '@angular/core';

const godraysVideo = require('../../assets/videos/godrays.mp4');

@Component({
    selector: 'experiments',
    templateUrl: './experiments.component.html',
    styleUrls: ['./experiments.component.scss']
})

export class ExperimentsComponent {

    private projectVideo = { godrays: godraysVideo };

    private experiments;
    private videos;

    private experimentContainer;
    private experimentSpans;
    private prevArrow;
    private nextArrow;

    private currentActiveExperiment: number = 0;
    private prevActiveExperiment: number = 0;
    private totalExperiments: number;

    private experimentNameCarouselHeight: number;

    constructor(private element: ElementRef) {
    }

    /**
     * Call onResize when a window resize event is detected.
     */
    private onResize() {

        setTimeout(this.setProperties(), 200);

    }

    /**
     * Set the positioning for all the elements to be responsive to the device.
     */
    private setProperties() {

        //video container
        let videoRect = document.getElementsByClassName('experiment')[this.currentActiveExperiment].getBoundingClientRect();

        //counter
        let counter = document.getElementById('counter');

        // Carousel slider
        let experimentNameCarousel = document.getElementById('experiment-name-carousel');
        let experimentName = document.getElementsByClassName('experiment-name');
        let experimentSpan = document.getElementsByClassName('experiment-span');
        let prevButton = document.getElementById('prev-button');
        let nextButton = document.getElementById('next-button');

        this.experimentNameCarouselHeight = (((window.innerHeight - videoRect.bottom) - 5) / 3);
        let experimentNameLineHeight = ((window.innerHeight - videoRect.bottom) / 3);

        experimentNameCarousel!.style.height = (videoRect.top - 5) + "px";
        experimentNameCarousel!.style.width = ((videoRect.right - videoRect.left)) + 'px';

        counter!.style.top = (videoRect.top - 25) + 'px';
        counter!.style.left = videoRect.left + 'px';

        prevButton!.style.top = (window.innerHeight / 2) - 31 + 'px';
        prevButton!.style.left = videoRect.right + 'px';
        nextButton!.style.top = (window.innerHeight / 2) + 31 + 'px';
        nextButton!.style.left = videoRect.right + 'px';

        this.experimentContainer.style.transform = 'translate3d(0px,' + this.experimentNameCarouselHeight + 'px' + ', 0px)';

        for (let i = 0; i < experimentName.length; i++) {
            (experimentName[i] as any)!.style.height = this.experimentNameCarouselHeight + 'px';
            (experimentSpan[i] as any)!.style.lineHeight = experimentNameLineHeight + 'px';
        }

    }

    /**
     * Transform slider to center the current experiment in the slider.
     * @param experimentNum
     */
    private transformSlider(experimentNum) {

        this.experimentContainer.style.transform = 'translate3d(0px,' + -(this.experimentNameCarouselHeight * (experimentNum - 1)) + 'px' + ', 0px)';

    }

    /**
     * Swap previousActiveExperiment with current Active experiment and then add and remove active.
     * swap the prevActiveExperiment video with the active experiments video.
     * @param event
     */
    private setActiveProject(experimentNum: number) {

        if (experimentNum < this.totalExperiments) {
            this.prevActiveExperiment = this.currentActiveExperiment;
            this.currentActiveExperiment = experimentNum;

            this.experimentSpans[this.prevActiveExperiment].classList.remove('active');
            this.experimentSpans[this.currentActiveExperiment].classList.add('active');

            this.experiments[this.prevActiveExperiment].classList.add('hidden');
            this.experiments[this.currentActiveExperiment].classList.remove('hidden');

            this.transformSlider(experimentNum);
            this.disableArrow();
            this.playActiveVideo();
        } else {
            console.log('There is only ' + this.totalExperiments + ' experiments.');
        }

    }

    /**
     *  Arrows that are out of the totalExperiments range will have the not-clickable class added and vice versa.
     */
    private disableArrow() {

        if (this.currentActiveExperiment != 0 && this.prevArrow!.classList.contains('disable')) {
            this.prevArrow!.classList.remove('disable');
        } else if (this.currentActiveExperiment == 0 && !this.prevArrow!.classList.contains('disable')) {
            this.prevArrow!.classList.add('disable');
        } else if (this.currentActiveExperiment == this.totalExperiments - 1 && !this.nextArrow!.classList.contains('disable')) {
            this.nextArrow!.classList.add('disable');
        } else if (this.currentActiveExperiment != this.totalExperiments - 1 && this.nextArrow!.classList.contains('disable')) {
            this.nextArrow!.classList.remove('disable');
        }

    }

    /**
     * When the next or previous button is clicked this method will
     * either iterate down the experiments 1 or -1.
     * @param iterate
     */
    private switchExperiment(iterate: number) {

        let nextExperiment = this.currentActiveExperiment + iterate;

        if (nextExperiment >= 0 && nextExperiment < this.totalExperiments) {
            this.setActiveProject(nextExperiment);
            this.disableArrow();
        }

    }

    /**
     * Pause previous video if playing, and play current video.
     */
    private playActiveVideo() {

        if (this.videos[this.prevActiveExperiment].paused != true) {
            this.videos[this.prevActiveExperiment].pause();
        }

        this.videos[this.currentActiveExperiment].play();

    }

    /**
     * Pause active video
     */
    private pauseActiveVideo() {

        this.videos[this.currentActiveExperiment].pause();

    }

    /**
     * Fix for autoplay on devices : DOMException: The play() request was interrupted error.
     */
    private loadVideo() {

        // Show loading animation.
        var playPromise = this.videos[this.currentActiveExperiment].play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Automatic playback started!
                // Show playing UI.
            })
                .catch(error => {
                    // Auto-play was prevented
                    // Show paused UI.
                    this.videos[this.currentActiveExperiment].play();
                });
        }

    }

    /**
     * Server side pre rendering work around to set variables, and positioning.
     */
    ngOnInit() {

        this.videos = document.getElementsByTagName('video');
        this.experiments = document.getElementsByClassName('experiment');
        this.experimentSpans = document.getElementsByClassName('experiment-span');
        this.experimentContainer = document.getElementById('experiment-container');
        this.totalExperiments = this.experimentSpans.length;
        this.prevArrow = document.getElementById('prev-button');
        this.nextArrow = document.getElementById('next-button');

        this.loadVideo();
        this.setProperties();

    }
}
