import { Component, ElementRef, HostListener } from '@angular/core';
import { VerticalScrollService } from '../../services/shared/eventListeners/verticalScroll.service';

const godraysVideo = require('../../assets/videos/godrays.mp4');

@Component({
    selector: 'experiments',
    templateUrl: './experiments.component.html',
    styleUrls: ['./experiments.component.scss'],
    providers: [VerticalScrollService] 
})

export class ExperimentsComponent {

    private projectVideo = { godrays: godraysVideo };

    private videos;
    private projects;
    private experiments;
    private carouselSliderContainer;

    private currentActiveExperiment: number = 0;
    private prevActiveExperiment: number = 0;
    private totalExperiments: number;

    private carouselNameContainerHeight: number;

    constructor(private element: ElementRef, private _verticalScroll : VerticalScrollService) {
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
        let videoRect = document.getElementsByClassName('project')[this.currentActiveExperiment].getBoundingClientRect();

        //counter
        let counter = document.getElementById('counter');

        // Carousel slider
        let carouselSlider = document.getElementById('carousel-slider');
        let carouselNameContainer = document.getElementsByClassName('project-name-container');
        let carouselNameContainerSpan = document.getElementsByClassName('proj-span');
        let prevButton = document.getElementById('prev-button');
        let nextButton = document.getElementById('next-button');

        this.carouselNameContainerHeight = (((window.innerHeight - videoRect.bottom) - 5) / 3);
        let carouselNameContainerSpainLineHeight = ((window.innerHeight - videoRect.bottom) / 3);

        carouselSlider!.style.height = (videoRect.top - 5) + "px";
        carouselSlider!.style.width = ((videoRect.right - videoRect.left)) + 'px';

        counter!.style.top = (videoRect.top - 25) + 'px';
        counter!.style.left = videoRect.left + 'px';

        prevButton!.style.top = (window.innerHeight / 2) - 31 + 'px';
        prevButton!.style.left = videoRect.right + 'px';
        nextButton!.style.top = (window.innerHeight / 2) + 31 + 'px';
        nextButton!.style.left = videoRect.right + 'px';

        this.carouselSliderContainer.style.transform = 'translate3d(0px,' + this.carouselNameContainerHeight + 'px' + ', 0px)';

        for (let i = 0; i < carouselNameContainer.length; i++) {
            (carouselNameContainer[i] as any)!.style.height = this.carouselNameContainerHeight + 'px';
            (carouselNameContainerSpan[i] as any)!.style.lineHeight = carouselNameContainerSpainLineHeight + 'px';
        }

    }

    /**
     * Transform slider to center the current experiment in the slider.
     * @param experimentNum
     */
    private transformSlider(experimentNum) {

        this.carouselSliderContainer.style.transform = 'translate3d(0px,' + -(this.carouselNameContainerHeight * (experimentNum - 1)) + 'px' + ', 0px)';

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

            this.experiments[this.prevActiveExperiment].classList.remove('active');
            this.experiments[this.currentActiveExperiment].classList.add('active');

            this.projects[this.prevActiveExperiment].classList.add('hidden');
            this.projects[this.currentActiveExperiment].classList.remove('hidden');

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

        let prevArrow = document.getElementById('prev-button');
        let nextArrow = document.getElementById('next-button');

        if (this.currentActiveExperiment != 0 && prevArrow!.classList.contains('not-clickable')) {
            prevArrow!.classList.remove('not-clickable');
        } else if (this.currentActiveExperiment == 0 && !prevArrow!.classList.contains('not-clickable')) {
            prevArrow!.classList.add('not-clickable');
        } else if (this.currentActiveExperiment == this.totalExperiments - 1 && !nextArrow!.classList.contains('not-clickable')) {
            nextArrow!.classList.add('not-clickable');
        } else if (this.currentActiveExperiment != this.totalExperiments - 1 && nextArrow!.classList.contains('not-clickable')) {
            nextArrow!.classList.remove('not-clickable');
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
     * DOMException: The play() request was interrupted error fix for autoplay on mobile devices.
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
        this.projects = document.getElementsByClassName('project');
        this.experiments = document.getElementsByClassName('proj-span');
        this.carouselSliderContainer = document.getElementById('carousel-slider-container');
        this.totalExperiments = this.experiments.length;

        this.loadVideo();
        this.setProperties();

    }
}
