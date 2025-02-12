The DataGrid includes an integrated toolbar that displays predefined and custom controls. To add or remove toolbar items, declare the [toolbar](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/).[items[]](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/items/) array.

[note] If **toolbar.items[]** is specified, DataGrid does not display controls missing from the array. Ensure this array includes controls for all enabled features.
<!--split-->

This demo illustrates how to add the following items to the toolbar:

* **Predefined Controls**            
Create an object and specify the [name](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/items/#name) and [properties](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/items/) that you want to customize. If a control does not need customization, include its **name** in the **items[]** array. Ensure that **items[]** contain controls for all features that you enabled in your DataGrid. In this demo, we enable the [columnChooser](/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columnChooser/) and add the *"columnChooserButton"* to the **items[]** array.

* **DevExtreme Components**           
Specify a [widget](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/items/#widget) that you want to add and its [options](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/items/#options). In this demo, we extended the toolbar's item collection with a [Button](/Demos/WidgetsGallery/Demo/Button/PredefinedTypes/) and a [SelectBox](/Demos/WidgetsGallery/Demo/SelectBox/Overview/).

* **Custom Elements**             
Specify a [template](/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/toolbar/items/#template) for your custom element. In this demo, the custom element displays the total group count.