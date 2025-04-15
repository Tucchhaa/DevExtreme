import type { Column, VisibleColumn } from '@ts/grids/new/grid_core/columns_controller/types';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import type { ComponentType } from 'inferno';
import { Component } from 'inferno';

import type { DraggingColumnData } from './column_sortable';
import { ColumnSortable } from './column_sortable';
import { CLASSES as itemClasses, Item } from './item';
import type { DraggingOptions } from './options';

export const CLASSES = {
  headers: 'dx-cardview-headers',
  content: 'dx-cardview-headerpanel-content',
};

export interface HeaderPanelProps {
  visibleColumns: VisibleColumn[];

  onColumnMove: (column: Column, toIndex: number, draggingData: DraggingColumnData) => void;

  allowColumnReordering: boolean;

  columnChooserDragModeOpened: boolean;

  showSortIndexes: boolean;

  onSortClick: (column: Column, e: MouseEvent) => void;

  onFilterClick?: (
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
  ) => void;

  itemTemplate?: ComponentType<{ column: Column }>;

  itemCssClass?: string;

  visible: boolean;

  draggingOptions?: DraggingOptions;

  showContextMenu: (e: MouseEvent, column?: Column, columnIndex?: number) => void;
}

export class HeaderPanel extends Component<HeaderPanelProps> {
  public render(): JSX.Element {
    if (!this.props.visible) {
      return <></>;
    }

    return (
      <div
        className={CLASSES.headers}
        onContextMenu={this.props.showContextMenu}
      >
        <ColumnSortable
          {...this.props.draggingOptions}
          source="header-panel-main"
          visibleColumns={this.props.visibleColumns}
          getColumnByIndex={(index) => this.props.visibleColumns[index]}
          allowDragging={this.props.allowColumnReordering}
          columnChooserDragModeOpened={this.props.columnChooserDragModeOpened}
          onColumnMove={this.props.onColumnMove}
          columnDragTemplate={Item}
          itemOrientation="horizontal"
          filter={`.${itemClasses.item}`}
        >
          <Scrollable
            direction='horizontal'
            showScrollbar='never'
            useNative={false}
            scrollByContent={true}
          >
            <div className={CLASSES.content}>
              {this.props.visibleColumns.map((column, index) => (
                <Item
                  showSortIndexes={this.props.showSortIndexes}
                  column={column}
                  onSortClick={(e): void => { this.props.onSortClick(column, e); }}
                  template={this.props.itemTemplate}
                  cssClass={this.props.itemCssClass}
                  onFilterClick={(
                    element: Element,
                    callback?: () => void,
                  ) => this.props.onFilterClick?.(element, column, callback)}
                  onContextMenu={(e) => {
                    this.props.showContextMenu(e, column, index);
                  }}
                />
              ))}
            </div>
          </Scrollable>
        </ColumnSortable>
      </div>
    );
  }
}
