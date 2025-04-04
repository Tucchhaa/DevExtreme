/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';
import { HeaderFilterController } from '@ts/grids/new/grid_core/filtering/header_filter/index';

import { ColumnChooserView } from '../../grid_core/column_chooser';
import type { Column } from '../../grid_core/columns_controller/types';
import { SortingController } from '../../grid_core/sorting_controller/sorting_controller';
import { ContextMenuController } from '../context_menu/controller';
import { OptionsController } from '../options_controller';
import type { Source as ColumnSortableSource } from './column_sortable';
import type { HeaderPanelProps } from './header_panel';
import { HeaderPanel } from './header_panel';

export class HeaderPanelView extends View<HeaderPanelProps> {
  protected component = HeaderPanel;

  public static dependencies = [
    SortingController,
    ColumnsController,
    OptionsController,
    HeaderFilterController,
    ContextMenuController,
    ColumnChooserView,
  ] as const;

  constructor(
    private readonly sortingController: SortingController,
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
    private readonly headerFilterController: HeaderFilterController,
    private readonly contextMenuController: ContextMenuController,
    private readonly columnChooserView: ColumnChooserView,
  ) {
    super();
  }

  protected override getProps(): SubsGets<HeaderPanelProps> {
    return combined({
      visibleColumns: computed(
        (columns) => [...columns].sort((a, b) => a.visibleIndex - b.visibleIndex),
        [this.columnsController.visibleColumns],
      ),
      onMove: this.onMove.bind(this),
      onRemove: this.onRemove.bind(this),
      allowColumnReordering: this.columnsController.allowColumnReordering,
      columnChooserDragModeOpened: this.columnChooserView.dragModeOpened,
      showSortIndexes: this.sortingController.showSortIndexes,
      onSortClick: this.onSortClick.bind(this),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemTemplate: this.options.template('headerPanel.itemTemplate') as any,
      onFilterClick: this.onFilterClick.bind(this),
      itemCssClass: this.options.oneWay('headerPanel.itemCssClass'),
      visible: this.options.oneWay('headerPanel.visible'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draggingOptions: this.options.oneWay('headerPanel.dragging') as any,
      showContextMenu: this.showContextMenu.bind(this),
    });
  }

  public onRemove(column: Column): void {
    this.columnsController.columnOption(column, 'visible', false);
  }

  public onMove(movedColumn: Column, toIndex: number, source: ColumnSortableSource): void {
    const visibleColumns = this.columnsController.visibleColumns.unreactive_get();

    const getColumnAfter = (): Column | undefined => {
      if (source === 'header-panel-main' && toIndex < visibleColumns.length - 1) {
        const index = visibleColumns.findIndex((visibleColumn) => visibleColumn === movedColumn);
        const isMovingLeft = toIndex < index;

        return isMovingLeft
          ? visibleColumns[toIndex]
          : visibleColumns[toIndex + 1];
      }

      if (source === 'column-chooser' && toIndex < visibleColumns.length) {
        return visibleColumns[toIndex];
      }

      return undefined;
    };

    const needPreserveOrder = !movedColumn.allowReordering;
    const columnAfter = getColumnAfter();

    if (needPreserveOrder) {
      this.columnsController.columnOption(movedColumn, 'visible', true);
      return;
    }

    if (columnAfter === undefined) {
      const columnsCount = this.columnsController.columns.unreactive_get().length;

      this.columnsController.columnOption(movedColumn, 'visible', true);
      this.columnsController.columnOption(movedColumn, 'visibleIndex', columnsCount);

      return;
    }

    this.columnsController.updateColumns((columns) => {
      const newColumns = [...columns];

      newColumns.forEach((column, index) => {
        const updatedColumn = { ...column };

        if (column.name === movedColumn.name) {
          updatedColumn.visibleIndex = columnAfter.visibleIndex;
          updatedColumn.visible = true;
        } else if (column.visibleIndex >= columnAfter.visibleIndex) {
          updatedColumn.visibleIndex = column.visibleIndex + 1;
        }

        newColumns[index] = updatedColumn;
      });

      return newColumns;
    });
  }

  public onSortClick(column: Column, e: MouseEvent): void {
    const mode = this.sortingController.mode.unreactive_get();
    switch (mode) {
      case 'none':
        return;
      case 'single':
        this.sortingController.onSingleModeSortClick(column, e);
        return;
      case 'multiple':
        this.sortingController.onMultipleModeSortClick(column, e);
        return;
      default:
        throw new Error('Unsupported sorting state');
    }
  }

  private onFilterClick(
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
  ): void {
    this.headerFilterController.openPopup(element, column, onFilterCloseCallback);
  }

  private showContextMenu(e: MouseEvent, column?: Column, columnIndex?: number): void {
    this.contextMenuController.show(e, 'headerPanel', { column, columnIndex });
  }
}
