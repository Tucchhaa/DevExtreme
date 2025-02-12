/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-lookup-hide-event',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoLookupHideEventComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get delay(): number | undefined {
        return this._getOption('delay');
    }
    set delay(value: number | undefined) {
        this._setOption('delay', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }


    protected get _optionPath() {
        return 'hideEvent';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoLookupHideEventComponent
  ],
  exports: [
    DxoLookupHideEventComponent
  ],
})
export class DxoLookupHideEventModule { }
