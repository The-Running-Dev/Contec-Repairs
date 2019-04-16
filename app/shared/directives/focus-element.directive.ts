import {Directive, Renderer, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[focusElement]'
})

export class FocusElement implements OnInit {
    constructor(public _renderer: Renderer, public _elementRef: ElementRef) {

    }

    // It won't work at construction time
    ngOnInit() {
        this.setFocus();
    }

    setFocus() {
        this._renderer.invokeElementMethod(
            this._elementRef.nativeElement, 'focus', []
        );
    }
}
