/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-responsive-box-row',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiResponsiveBoxRowComponent extends CollectionNestedOption {
    @Input()
    get baseSize(): number | string {
        return this._getOption('baseSize');
    }
    set baseSize(value: number | string) {
        this._setOption('baseSize', value);
    }

    @Input()
    get ratio(): number {
        return this._getOption('ratio');
    }
    set ratio(value: number) {
        this._setOption('ratio', value);
    }

    @Input()
    get screen(): string | undefined {
        return this._getOption('screen');
    }
    set screen(value: string | undefined) {
        this._setOption('screen', value);
    }

    @Input()
    get shrink(): number {
        return this._getOption('shrink');
    }
    set shrink(value: number) {
        this._setOption('shrink', value);
    }


    protected get _optionPath() {
        return 'rows';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiResponsiveBoxRowComponent
  ],
  exports: [
    DxiResponsiveBoxRowComponent
  ],
})
export class DxiResponsiveBoxRowModule { }
