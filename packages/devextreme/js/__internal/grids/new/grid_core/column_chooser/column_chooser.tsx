import type { ColumnChooserMode } from '@js/common/grids';
import $ from '@js/core/renderer';
import messageLocalization from '@js/localization/message';
import type { Properties as PopupProperties, ShownEvent, ToolbarItem } from '@js/ui/popup';
import type dxPopup from '@js/ui/popup';
import { current, isGeneric, isMaterial } from '@js/ui/themes';
import type { Properties as TreeViewProperties } from '@js/ui/tree_view';
import type dxTreeView from '@js/ui/tree_view';
import {
  Component, type RefObject, render,
} from 'inferno';

import { ColumnSortable } from '../../card_view/header_panel/column_sortable';
import { Item } from '../../card_view/header_panel/item';
import type { Column } from '../columns_controller/types';
import { Popup } from '../inferno_wrappers/popup';
import { TreeView } from '../inferno_wrappers/tree_view';

export const CLASS = {
  root: 'column-chooser',
  toolbarBtn: 'column-chooser-button',
  list: 'column-chooser-list',
  plain: 'column-chooser-plain',
  dragMode: 'column-chooser-mode-drag',
  selectMode: 'column-chooser-mode-select',
  item: 'dx-column-chooser-item',
  hidden: 'dx-hidden',
};

export interface ColumnChooserProps {
  popupRef: RefObject<dxPopup>;

  treeViewRef: RefObject<dxTreeView>;

  visible: boolean;

  title: string;

  mode: ColumnChooserMode;

  chooserColumns: Column[];

  onMove: (column: Column) => void;

  popupConfig: PopupProperties;

  treeViewConfig: TreeViewProperties;

  treeViewSelectModeConfig: TreeViewProperties;

  treeViewDragAndDropModeConfig: TreeViewProperties;
}

export class ColumnChooser extends Component<ColumnChooserProps> {
  public render(): JSX.Element {
    const { visible, popupConfig, popupRef } = this.props;

    if (!visible) {
      return <></>;
    }

    const treeView = this.getTreeView();

    return (
      <Popup
        componentRef={popupRef}
        visible={true}
        shading={false}
        dragEnabled={true}
        resizeEnabled={true}
        // @ts-expect-error
        _loopFocus={true}

        showCloseButton={this.isMaterialOrGeneric()}
        toolbarItems={this.getPopupToolbarItems()}
        wrapperAttr={{ class: this.getPopupWrapperClass() }}

        width={popupConfig.width}
        height={popupConfig.height}
        container={popupConfig.container}
        rtlEnabled={popupConfig.rtlEnabled}
        position={popupConfig.position}
        onHidden={popupConfig.onHidden}
        onShowing={(e: ShownEvent) => { this.setPopupAttributes(e?.component); }}
      >
        <ColumnSortable
          height='100%'
          source='column-chooser'
          filter={`.${CLASS.item}, .dx-cardview-header-item`}
          visibleColumns={this.props.chooserColumns}
          allowColumnReordering={!this.isSelectMode()}
          dragTemplate={Item}
          onMove={this.props.onMove}
          // @ts-expect-error
          onPlaceholderPrepared={this.onSortablePlaceholderPrepared}
        >
          { treeView }
        </ColumnSortable>
      </Popup>
    );
  }

  private isMaterialOrGeneric(): boolean {
    return isMaterial(current()) || isGeneric(current());
  }

  private isSelectMode(): boolean {
    return this.props.mode === 'select';
  }

  // TODO: move it to the other place
  private addWidgetPrefix(cssClass: string): string {
    return `dx-cardview-${cssClass}`;
  }

  private getPopupToolbarItems(): ToolbarItem[] {
    const items: ToolbarItem[] = [
      {
        text: this.props.title,
        toolbar: 'top',
        location: this.isMaterialOrGeneric() ? 'before' : 'center',
      },
    ];

    if (!this.isMaterialOrGeneric()) {
      // @ts-expect-error
      items.push({ shortcut: 'cancel' });
    }

    return items;
  }

  private getPopupWrapperClass(): string {
    const modeSpecificClass = this.isSelectMode() ? CLASS.selectMode : CLASS.dragMode;

    return [this.addWidgetPrefix(CLASS.root), this.addWidgetPrefix(modeSpecificClass)].join(' ');
  }

  private setPopupAttributes(popup: dxPopup): void {
    // TODO: band columns aren't yet implemented in cardview
    const isBandColumnsUsed = false;
    const isPlain = this.isSelectMode() && !isBandColumnsUsed;

    // @ts-expect-error
    popup.setAria({
      label: messageLocalization.format('dxDataGrid-columnChooserTitle'),
    });

    // @ts-expect-error
    popup.$content().addClass(this.addWidgetPrefix(CLASS.list));

    // @ts-expect-error
    popup.$content().toggleClass(this.addWidgetPrefix(CLASS.plain), isPlain);
  }

  private getTreeView(): JSX.Element {
    const {
      treeViewRef,
      treeViewConfig,
      treeViewSelectModeConfig,
      treeViewDragAndDropModeConfig,
    } = this.props;

    const itemTemplate = this.isSelectMode()
      ? 'item'
      : (item, index, $element): void => {
        render(<Item column={item.column}></Item>, $($element).get(0));
      };

    return (
      <TreeView
        componentRef={treeViewRef}
        dataStructure='plain'
        activeStateEnabled={true}
        focusStateEnabled={true}
        hoverStateEnabled={true}
        disabled={false}
        rootValue={null}

        rtlEnabled={treeViewConfig.rtlEnabled}
        searchEditorOptions={treeViewConfig.searchEditorOptions}
        searchEnabled={treeViewConfig.searchEnabled}
        searchTimeout={treeViewConfig.searchTimeout}
        noDataText={treeViewConfig.noDataText}

        items={treeViewConfig.items}
        itemTemplate={itemTemplate}
        {
          ...(
            this.isSelectMode()
              ? treeViewSelectModeConfig
              : treeViewDragAndDropModeConfig
          )
        }
      ></TreeView>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly onSortablePlaceholderPrepared = (e: any): void => {
    $(e.placeholderElement).addClass(CLASS.hidden);
  };
}
