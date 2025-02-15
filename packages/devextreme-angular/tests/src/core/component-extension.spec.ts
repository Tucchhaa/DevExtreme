/* tslint:disable:component-selector */
import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  PLATFORM_ID,
  Inject,
  TransferState,
} from '@angular/core';

import {
  TestBed,
} from '@angular/core/testing';

import {
  DxComponentExtension,
  DxTemplateHost,
  WatcherHelper,
} from 'devextreme-angular';

import DxButton from 'devextreme/ui/button';

const DxTestExtension = DxButton;

DxTestExtension.defaultOptions({
  options: {
    elementAttr: { class: 'dx-test-extension' },
  },
});

@Component({
  selector: 'dx-test-extension',
  template: '',
  providers: [DxTemplateHost, WatcherHelper],
})
export class DxTestExtensionComponent extends DxComponentExtension {
  constructor(
    elementRef: ElementRef,
    ngZone: NgZone,
    templateHost: DxTemplateHost,
    _watcherHelper: WatcherHelper,
    transferState: TransferState,
    @Inject(PLATFORM_ID) platformId: any,
  ) {
    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
  }

  protected _createInstance(element, options) {
    return new DxTestExtension(element, options);
  }
}

@Component({
  selector: 'test-container-component',
  template: '',
})
export class TestContainerComponent {
  @ViewChild(DxTestExtensionComponent) innerWidget: DxTestExtensionComponent;
}

describe('DevExtreme Angular component extension', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        imports: [],
        declarations: [TestContainerComponent, DxTestExtensionComponent],
      },
    );
  });

  function getWidget(element) {
    return DxTestExtension.getInstance(element);
  }
  // spec
  it('should not create widget instance by itself', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-extension></dx-test-extension>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const instance = getWidget(fixture.nativeElement);
    expect(instance).toBe(undefined);
  });

  it('should instantiate widget with the createInstance() method', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-extension></dx-test-extension>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const outerComponent = fixture.componentInstance;
    const innerComponent = outerComponent.innerWidget;
    const targetElement = document.createElement('div');

    innerComponent.createInstance(targetElement);
    const instance = getWidget(targetElement);
    expect(instance).not.toBe(undefined);
    expect(innerComponent.instance).not.toBe(undefined);
  });
});
