import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import ProgressBar, { Properties } from "devextreme/ui/progress_bar";
import {
 CompleteEvent,
 ContentReadyEvent,
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
 ValueChangedEvent,
} from "devextreme/ui/progress_bar";
import {
 ValidationMessageMode,
 Position,
 ValidationStatus,
} from "devextreme/common";

type AccessibleOptions = Pick<Properties,
  "disabled" |
  "elementAttr" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "isDirty" |
  "isValid" |
  "max" |
  "min" |
  "onComplete" |
  "onContentReady" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "readOnly" |
  "rtlEnabled" |
  "showStatus" |
  "statusFormat" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "visible" |
  "width"
>;

interface DxProgressBar extends AccessibleOptions {
  readonly instance?: ProgressBar;
}

const componentConfig = {
  props: {
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    isValid: Boolean,
    max: Number,
    min: Number,
    onComplete: Function as PropType<((e: CompleteEvent) => void)>,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onValueChanged: Function as PropType<((e: ValueChangedEvent) => void)>,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showStatus: Boolean,
    statusFormat: [Function, String] as PropType<(((ratio: number, value: number) => string)) | string>,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<ValidationMessageMode>,
    validationMessagePosition: String as PropType<Position>,
    validationStatus: String as PropType<ValidationStatus>,
    value: {},
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:max": null,
    "update:min": null,
    "update:onComplete": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showStatus": null,
    "update:statusFormat": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): ProgressBar {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = ProgressBar;
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxProgressBar = defineComponent(componentConfig);

export default DxProgressBar;
export {
  DxProgressBar
};
import type * as DxProgressBarTypes from "devextreme/ui/progress_bar_types";
export { DxProgressBarTypes };
