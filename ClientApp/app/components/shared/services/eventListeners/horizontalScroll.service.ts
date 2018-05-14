export class HorizontalScrollService {

    private horizontalScroll(event: Event) {

        let delta = (<any>event).detail ? (<any>event).detail * (-60) : (<any>event).wheelDelta * (.5); //+60 scroll up, -60 scroll down (Wheel delta returns 120)
        (<any>event).currentTarget.scrollLeft -= delta;

        event.preventDefault();
    }

    public setElement(elementID: string) {

        let element = document.getElementById(elementID);
        let curXPos: number = 0;
        let prevXPos: number = 0;
        let curDown: boolean = false;

        if (element != null) {
            if ((element as any)!.attachEvent) (element as any)!.attachEvent("on" + (/Gecko\//i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel", this.horizontalScroll, true);
            else if (element!.addEventListener) element!.addEventListener((/Gecko\//i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel", this.horizontalScroll, false);

            element!.addEventListener('mousemove', function (event) {
                if (curDown === true) {
                    // not really needed
                    //let delta = prevChangeInX > (curXPos - event.pageX) ? -3 : 3;
                    element!.scrollLeft -= prevXPos - (curXPos - event.pageX);
                    prevXPos = (curXPos - event.pageX);
                }
            });

            element!.addEventListener('mousedown', function (event) { curDown = true; curXPos = event.pageX; prevXPos = (curXPos - event.pageX) });
            document.addEventListener('mouseup', function (event) { curDown = false; });
        }

    }
}