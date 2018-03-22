import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    private title: HTMLElement|null;
    private subTitle: HTMLElement | null;

    slideInTitle() {
        //(this.infoBox[this.currentActiveExperiment] as any).removeAttribute('style');
        setTimeout(() => {
            this.title!.setAttribute('style', 'opacity: 1; transform: translate3d(0px, 0px, 0px);');
        }, 650); 
    }

    slideInSubTitle() {
        //(this.infoBox[this.currentActiveExperiment] as any).removeAttribute('style');
        setTimeout(() => {
            this.subTitle!.setAttribute('style', 'opacity: .4; transform: translate3d(0px, 0px, 0px);');
        }, 900);
    }

    ngOnInit() {

        this.title = document.getElementById('title');
        this.subTitle = document.getElementById('subtitle');

        this.slideInTitle();
        this.slideInSubTitle();
    }
}
