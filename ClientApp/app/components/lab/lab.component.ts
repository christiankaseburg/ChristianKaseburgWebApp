import { Component, ElementRef, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TweenLite, TimelineMax } from 'gsap';

import { LabResolver } from './services/labResolver.service';
import { Experiment } from './models/experiment.model';
import { EXPERIMENTS } from './models/mock-experiments';

@Component({
    selector: 'lab',
    templateUrl: './lab.component.html',
    styleUrls: ['./lab.component.scss', '../shared/css/slideshow.scss'],
})

export class LabComponent implements AfterViewInit {

    public experiments: Experiment[];

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
    @ViewChild('slideTitlesBlock') public slideShowTitlesContainer: ElementRef;
    public slideshow__slide: HTMLCollectionOf<Element>;
    public slideshow__slideTitles: HTMLCollectionOf<Element>;
    public slideshow__videos: NodeListOf<HTMLVideoElement>;
    public sliderContainerWidth: number;
    public videoSize: number;
    public centerVideoOffset: number;


    constructor(private activatedRoute: ActivatedRoute) {
        this.activatedRoute.data.map(data => data.experiments).subscribe((resp) => {
            this.experiments = resp;
            console.log('Component fetched experiments from resolver');
            console.log(this.experiments);
        }).unsubscribe();
    }

    /**
     * On resize event reset slider values to new screen size
     * @param event
     */
    public onResize(event) {
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
        this.slideshow__container.nativeElement.removeAttribute('style');
        this.slideshow__container.nativeElement.setAttribute('style',
            'width: ' + (this.videoSize * this.experiments.length) + 'px; ' + 'transform: matrix(1, 0, 0, 1, ' + this.sliderPosX +
            ', 0); touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);');
    }

    /**
     * Switch through the videos based on the next video parameter
     * @param direction
     * The user supplies the next video, and it will switch to that video
     */
    public switchVideo(nextVideo: number) {
        let direction = this.currentVideo < nextVideo ? '-' : '+';
        
        // True as long if video positioned at front is moving to next video,
        // currentVideo is within the 0 and total experiment limit,
        // and if currentvideo is last video and is moving backwards
        if (this.experiments.length !== 1 && (this.currentVideo === 0 && direction === '-'
            || (0 < this.currentVideo && this.currentVideo < this.experiments.length - 1)
            || this.currentVideo === this.experiments.length - 1 && direction === '+')
            && !this.animating) {

            this.animating = true;
            this.previousVideo = this.currentVideo;
            this.currentVideo = nextVideo;

            this.currentVideo > this.previousVideo
                ? this.sliderPosX -= ((this.currentVideo - this.previousVideo) * this.videoSize)
                : this.sliderPosX += ((this.previousVideo - this.currentVideo) * this.videoSize);

            this.switchVideoAnimation();
        }
    }

    /**
     * Switch video animation
     */
    public switchVideoAnimation() {
        let switchVideoTimeLine = new TimelineMax();

        switchVideoTimeLine
            .call(() => this.slideshow__videos[this.previousVideo].pause())
            .to(this.slideshow__slideTitles[this.previousVideo].children, 1, {
                y: function (index) {
                    return (index + 1) * 105;
                }
            })
            .set(this.slideshow__slideTitles[this.previousVideo].children, { clearProps: "all" })
            .set(this.slideshow__slide[this.previousVideo], { className: "-=active" }, this.slideshow__slideTitles[this.previousVideo].children)
            .set(this.slideshow__slideTitles[this.previousVideo], { className: "+=slideshow__title-elements--hidden" })
            .set(this.slideshow__slideTitles[this.currentVideo], { className: "-=slideshow__title-elements--hidden" })
            .to(this.slideshow__container.nativeElement, .75, { x: this.sliderPosX }, '-=.5')
            .set(this.slideshow__slide[this.currentVideo], { className: "+=active" }, this.slideshow__container.nativeElement)
            .fromTo(this.slideshow__slideTitles[this.currentVideo].children, .75, {
                y: function (index) {
                    return (index + 1) * 105;
                }
            },
            {
                y: function (index) {
                    return 0;
                }
            })
            .call(() => this.slideshow__videos[this.currentVideo].play())
            .call(() => setTimeout(() => this.animating = false, 0));
    }

    /**
     * Toggle the title menu when the View All button is clicked.
     */
    public toggleTitleMenu() {
        let toggleTimeline = new TimelineMax({}),
            prevVid = this.slideshow__slide[this.currentVideo - 1] == null ? 0 : this.currentVideo - 1;

        if (!this.animating) {
            this.titleMenuExpanded = !this.titleMenuExpanded;
            if (this.titleMenuExpanded) {
                this.animating = true;
                this.toggleMenuOutAnimation(prevVid);

            } else if (!this.animating) {
                this.animating = true;
                this.toggleMenuInAnimation(prevVid);
            }
        }

    }

    /**
     * Slide to tile
     */
    public slideToTitleAnimation(videoNumber: number) {
        let toggleTimeline = new TimelineMax({}),
        prevVid = this.slideshow__slide[this.currentVideo - 1] == null ?  0 : this.currentVideo - 1;

        if (videoNumber == this.currentVideo) {
            this.toggleMenuInAnimation(prevVid);
        } else {
            toggleTimeline
                .set(this.showTitleBtn.nativeElement, { className: "-=slideshow__view-all--active" })
                .set(this.slideshow__slideTitles[this.currentVideo], { className: "+=slideshow__title-elements--hidden" })
                .fromTo([".slideshow__title-elements--hidden"], .5, {
                    y: function (index) {
                        return 0;
                    }, opacity: 1
                },
                {
                    y: function (index) {
                        return (index + 1) * 105;
                    }, opacity: 0, clearProps: "all"
                })
                .to([this.slideshow__slide[this.currentVideo], this.slideshow__slide[this.currentVideo + 1]], .5, { x: "0%" }, "slide-video")
                .to(this.slideshow__slide[prevVid], .5, { x: "0%" }, "slide-video")
                .set(this.slideShowTitlesContainer.nativeElement, { className: "-=slideshow__slides-titles--view-all" })
                .call(() => setTimeout(() => this.switchVideo(videoNumber), 0));
        }
    }

    /**
     * Toggle Menu expand in
     */
    public toggleMenuInAnimation(previousVideo: number) {

        let toggleTimeline = new TimelineMax({}),
            prevVid = previousVideo;

        toggleTimeline
            .set(this.showTitleBtn.nativeElement, { className: "-=slideshow__view-all--active" })
            .set(this.slideshow__slideTitles[this.currentVideo], { className: "+=slideshow__title-elements--hidden" })
            .fromTo([".slideshow__title-elements--hidden"], .5, {
                y: function (index) {
                    return 0;
                }, opacity: 1
            },
            {
                y: function (index) {
                    return (index + 1) * 105;
                }, opacity: 0, clearProps: "all"
            })
            .set(this.slideshow__slide[this.currentVideo], { className: "+=active" })
            .to([this.slideshow__slide[this.currentVideo], this.slideshow__slide[this.currentVideo + 1]], .5, { x: "0%" }, "slide-video")
            .to(this.slideshow__slide[prevVid], .5, { x: "0%" }, "slide-video")
            .set(this.slideShowTitlesContainer.nativeElement, { className: "-=slideshow__slides-titles--view-all" })
            .set(this.slideshow__slideTitles[this.currentVideo], { className: "-=slideshow__title-elements--hidden" })
            .from(this.slideshow__slideTitles[this.currentVideo].children, .5, {
                y: function (index) {
                    return (index + 1) * 105;
                }
            })
            .call(() => setTimeout(() => this.animating = false, 0));
    }

    /**
     * Toggle Menu expand in
     */
    public toggleMenuOutAnimation(previousVideo: number) {
        let toggleTimeline = new TimelineMax({}),
            prevVid = previousVideo;

        toggleTimeline
            .set(this.showTitleBtn.nativeElement, { className: "+=slideshow__view-all--active" })
            .set(this.slideshow__slide[this.currentVideo], { className: "-=active" })
            .to(this.slideshow__slideTitles[this.currentVideo].children, .5, {
                y: function (index) {
                    return (index + 1) * 105;
                }
            })
            .set(this.slideShowTitlesContainer.nativeElement, { className: "+=slideshow__slides-titles--view-all" })
            .to(this.slideshow__slide[prevVid], .5, { x: "-75%" }, "slide-video")
            .to([this.slideshow__slide[this.currentVideo], this.slideshow__slide[this.currentVideo + 1]], .5, { x: "75%" }, "slide-video")
            .to(this.slideshow__slideTitles[this.currentVideo].children, .5, {
                y: function (index) {
                    return 0;
                }
            }, "slide-video")
            .fromTo(".slideshow__title-elements--hidden", .5, {
                y: function (index) {
                    return (index + 1) * 105;
                }, opacity: 0, "font-weight": "300", cursor: "pointer"
            },
            {
                y: function (index) {
                    return 0;
                }, opacity: 1, visibility: "inherit"
            })
            .call(() => setTimeout(() => this.animating = false, 0));
    }

    /**
     * Once the page has loaded start the load in animation.
     */
    public pageLoadedAnimation() {
        let pageLoadTimeLine = new TimelineMax();

        pageLoadTimeLine
            .set(this.slideshow__slideTitles[this.currentVideo], { className: "-=slideshow__title-elements--hidden" }, 'start')
            .fromTo(this.showTitleBtn.nativeElement, 1, { x: 50, opacity: 0, visibility: "visible" }, { x: 0, opacity: 1 }, 'view-all')
            .fromTo("#route", 1, { y: -50, opacity: 0, visibility: "visible" }, { y: 0, opacity: 1 }, 'view-all')
            .set(this.slideshow__slide[this.currentVideo], { className: "+=active" }, '-=.25')
            .call(() => this.playActiveVideo())
            .fromTo(this.slideshow__container.nativeElement, .5, { x: window.innerWidth }, { x: this.centerVideoOffset }, 'start+=.5')
            .from(this.slideshow__slideTitles[this.currentVideo].children, .5, {
                y: function (index) {
                    return (index + 1) * 105;
                }
            })
            .set(this.slideshow__slideTitles[0].children, { clearProps: "all" });
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
     * Check for changed touches, and if there is a change
     * switch to that touch.
     * @param event
     */
    public unify(event) { return event.changedTouches ? event.changedTouches[0] : event };

    /**
     * set the x coordinate of the mouse.
     * @param event
     */
    public lock(event) { this.mousePosX = this.unify(event).clientX };

    /**
     * Take the mouse change in posX, and then check if the user swiped left or right.
     * @param event
     */
    public move(event) {
        if (this.mousePosX || this.mousePosX === 0) {
            let dx = this.unify(event).clientX - (this.mousePosX as any),
                s = Math.sign(dx);

            if (dx !== 0) {
                if (dx < this.minDragDistance) {
                    this.switchVideo((this.currentVideo + 1));
                } else if (dx > -(this.minDragDistance)) {
                    this.switchVideo((this.currentVideo - 1));
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
        let nextVideo;

        if (event.wheelDelta) {
            delta = event.wheelDelta;
        } else {
            delta = -1 * event.deltaY;
        }

        if (delta < 0) {
            nextVideo = (this.currentVideo + 1);
        } else if (delta > 0) {
            nextVideo = (this.currentVideo - 1)
        }

        this.switchVideo(nextVideo);
        event.preventDefault();
    }

    /**
     * Pause previous video if playing, and play current video.
     */
    public playActiveVideo() {

        if (this.slideshow__videos[this.previousVideo].paused != true) {
            this.slideshow__videos[this.previousVideo].pause();
        }

        this.slideshow__videos[this.currentVideo].play();
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
        console.log('Experiment Component AfterViewInit');
        this.onResize(event);
        this.setEventListeners();
        this.pageLoadedAnimation();
    }
}
