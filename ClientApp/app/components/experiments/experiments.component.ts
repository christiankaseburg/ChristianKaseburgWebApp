import { Component, ElementRef } from '@angular/core';

const godraysVideo= require('../../assets/videos/godrays.mp4');

@Component({
    selector: 'experiments',
    templateUrl: './experiments.component.html',
    styleUrls: ['./experiments.component.scss']
})

export class ExperimentsComponent {
    private godrays = godraysVideo;

    public videoWidth: number;
    public videoHeight: number;
    public videoContainerWidth: number;
    public videoContainerHeight: number;

    constructor(private element: ElementRef) {
    }

    onResize(event: Event) {
        let windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;
        let windowAspectRatio = windowHeight / windowWidth;

        let video = document.getElementById('godrays');
        let videoWidth = video!.clientWidth;
        let videoHeight = video!.clientHeight;
        let videoAspectRatio = videoHeight / videoWidth;

        //compare window ratio to image ratio so you know which way the image should fill
        if (windowAspectRatio < videoAspectRatio) {
            // we are fill width
            video!.style.width = windowWidth + "px";
            // and applying the correct aspect to the height now
            video!.style.height = (windowWidth * videoAspectRatio) + "px";
            // this can be margin if your element is not positioned relatively, absolutely or fixed
            // make sure image is always centered
            video!.style.left = "0px";
            video!.style.top = (windowHeight - (windowWidth * videoAspectRatio)) / 2 + "px";
        } else { // same thing as above but filling height instead
            video!.style.height = windowHeight + "px";
            video!.style.width = (windowHeight / videoAspectRatio) + "px";
            video!.style.left = (windowWidth - (windowHeight / videoAspectRatio)) / 2 + "px";
            video!.style.top = "0px";
        }
    }

    ngOnInit() {
        //this.videoWidth = window.innerWidth * 1;
        //this.videoHeight = window.innerHeight * .7;
        //this.videoContainerWidth = window.innerWidth - (window.innerWidth * .03);
        //this.videoContainerHeight = window.innerHeight - (window.innerHeight * .03);
    }
}
