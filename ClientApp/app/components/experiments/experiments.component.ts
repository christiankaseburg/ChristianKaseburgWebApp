import { Component, ElementRef, HostListener } from '@angular/core';

const godraysVideo = require('../../assets/videos/godrays.mp4');

@Component({
    selector: 'experiments',
    templateUrl: './experiments.component.html',
    styleUrls: ['./experiments.component.scss']
})

export class ExperimentsComponent {

    private videoRef = { godrays: godraysVideo };
    private video;

    constructor(private element: ElementRef) {
    }

    onResize() {
        setTimeout(this.resizeVideo(), 500);
    }

    onScroll() {
        setTimeout(this.isVideoVisible(), 200);
    }

    /*
    * Fix for loading mp4's on iOS, and android devices.
    */
    loadVideo() {

        for (let i = 0; i < 0; i++) {
            let playPromise = this.video[i].play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                    // We can now safely pause video...
                    this.video[i].pause();
                })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                    });
            }
        }
    }

    /*
    * Resize videos to keep a consistent scale across all screen sizes.
    */
    resizeVideo() {
        let windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;
        let windowAspectRatio = windowHeight / windowWidth;

        let videos = document.getElementsByTagName('video');
        let carouselSlider = document.getElementById('carousel-slider');
        let carouselSliderContainer = document.getElementById('carousel-Slider-Container');
        let seperator = document.getElementById('seperator');
        let carouselSliderHeight = Math.round(window.innerHeight * .138);
        let seperatorBottom = Math.round(window.innerHeight * .03);

        for (let i = 0; i < videos.length; i++) {
            let video = videos[i];
            let videoWidth = video!.clientWidth + Math.random();
            let videoHeight = video!.clientHeight;
            let videoAspectRatio = videoHeight / videoWidth;

            //compare window ratio to image ratio so you know which way the image should fill
            if (windowAspectRatio < videoAspectRatio) {
                // we are fill width
                video!.style.width = windowWidth + "px";
                // and applying the correct aspect to the height now
                video!.style.height = (windowWidth * videoAspectRatio) + "px";
            } else { // same thing as above but filling height instead
                carouselSlider!.style.height = carouselSliderHeight + "px";
                carouselSliderContainer!.style.height = carouselSliderHeight + "px";
                seperator!.style.bottom = seperatorBottom + "px";
                video!.style.height = windowHeight + "px";
                video!.style.width = (windowHeight / videoAspectRatio) + "px";
            }
        }
    }

    /*
    * Play the video that is in the current viewport.
    * getBoundingClientRect is supported across all browsers, and intersectobserver is not.
    */
    isVideoVisible() {

        for (let i = 0; i < this.video.length; i++) {

            let videoRect = this.video[i].getBoundingClientRect();
            let offset = Math.ceil(videoRect.height / 2);
            let videoTop = videoRect.top + offset, videoBottom = videoRect.bottom - offset;

            let isVisible = (videoTop >= 0) && (videoBottom <= window.innerHeight);

            if (isVisible) {
                this.video[i].play();
            } else {
                this.video[i].pause();
            }
        }
    }

    /*
    * Pause videos when viewport is not in focus.
    */
    pauseVideos() {
        Object.keys(this.video).forEach(i => {
            this.video[i].pause();
        });
    }

    horizontalScroll(event: Event) {

        let delta = (<any>event).detail ? (<any>event).detail * (-60) : (<any>event).wheelDelta * (.5); //+60 scroll up, -60 scroll down (Wheel delta returns 120)
        (<any>event).currentTarget.scrollLeft -= delta;

        event.preventDefault();
    }

    horizontalDragScroll(event: Event) {

        console.log('mousedown');
        event.preventDefault();
    }

    expandCarouselSlider() {
        let carouselSlider = document.getElementById('carousel-slider');
        if (carouselSlider!.style.display == "block") {
            carouselSlider!.style.display = "none";
        } else {
            carouselSlider!.style.display = "block";
        }

    }

    // Server side pre rendering work around
    ngOnInit() {
        let slider = document.getElementById('carousel-slider');

        //mouse scroll
        if ((slider as any)!.attachEvent) (slider as any)!.attachEvent("on" + (/Gecko\//i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel", this.horizontalScroll);
        else if (slider!.addEventListener) slider!.addEventListener((/Gecko\//i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel", this.horizontalScroll, false);

        // Drag scroll horizontal. (CONVERT ALL HORIZONTAL SCROLLING INTO A MODULE IN HELPER LIBRARY)
        let curXPos: number = 0;
        let prevChangeInX: number = 0;
        let curDown: boolean = false;

        slider!.addEventListener('mousemove', function(event){ 
            if (curDown === true) {
                // not really needed
                //let delta = prevChangeInX > (curXPos - event.pageX) ? -3 : 3;
                slider!.scrollLeft -= prevChangeInX - (curXPos - event.pageX);
                prevChangeInX = (curXPos - event.pageX);
            }
        });
        slider!.addEventListener('mousedown', function (event) { curDown = true; curXPos = event.pageX; prevChangeInX = (curXPos - event.pageX)});
        document.addEventListener('mouseup', function (event){ curDown = false; }); 

        this.video = document.getElementsByTagName('video');
        this.resizeVideo();
        this.loadVideo();
    }
}
