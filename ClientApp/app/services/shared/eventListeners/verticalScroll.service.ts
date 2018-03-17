export class VerticalScrollService {

public setElement(elementID: string) {

    let element = document.getElementById(elementID);
    let elementTransforming = document.getElementById('carousel-slider-container');
    let curYPos: number = 0;
    let prevYPos: number = 0;
    let curDown: boolean = false;
    let matrix;

        element!.addEventListener('mousemove', function (event) {
            if (curDown === true) {
                if (matrix.f <= 0) {
                    let newPos = (-prevYPos + matrix.f);
                    elementTransforming!.style.transform = 'translate3d(0px,' + newPos +'px' + ', 0px)';
                    prevYPos = (curYPos - event.pageY);
                }
            }
        });

        element!.addEventListener('mousedown', function (event) {
            let style = window.getComputedStyle(elementTransforming as any);
            matrix = new WebKitCSSMatrix((style as any).webkitTransform);
            console.log('translateX: ', matrix.f);
            curDown = true; curYPos = event.pageY; prevYPos = (curYPos - event.pageY)
        });
        document.addEventListener('mouseup', function (event) { curDown = false; });
    }

}