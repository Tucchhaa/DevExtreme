import $ from '@js/core/renderer';
import type * as SortableTypes from '@js/ui/sortable_types';
import type { ComponentType, InfernoNode } from 'inferno';
import { Component, render } from 'inferno';

import type { Column } from '../../grid_core/columns_controller/types';
import type { Props as SortableProps } from '../../grid_core/inferno_wrappers/sortable';
import { Sortable } from '../../grid_core/inferno_wrappers/sortable';

export type Status = 'forbid' | 'show' | 'moving' | 'none';

export type Source = 'header-panel-main' | 'column-chooser';

export interface Props extends Omit<SortableProps, 'onAdd' | 'onReorder' | 'dragTemplate'> {
  source: Source;

  visibleColumns: Column[];

  allowColumnReordering: boolean;

  columnChooserDragModeOpened?: boolean;

  onMove: (column: Column, toIndex: number, source: Source) => void;

  dragTemplate?: ComponentType<{ column: Column; status?: Status }>;
}

interface ItemData {
  column: Column;
  status: Status;
  source: Source;
}

const ALLOWED_DRAGGING_DISTANCE = 64;

export class ColumnSortable extends Component<Props> {
  private dragItemContainer?: Element;

  private readonly onDragStart = (e: SortableTypes.DragStartEvent): void => {
    const column = this.props.visibleColumns[e.fromIndex];
    const isDraggable = this.isColumnDraggable(column);

    if (!isDraggable) {
      e.cancel = true;
      return;
    }

    e.itemData = {
      column,
      status: 'moving',
      source: this.props.source,
    } as ItemData;
  };

  private readonly onDragMove = (e: SortableTypes.DragMoveEvent): void => {
    e.itemData.status = this.getDraggableStatus(e);

    this.renderDragTemplate(e.itemData);
  };

  private readonly onDragChange = (e: SortableTypes.DragChangeEvent): void => {
    if (e.itemData.status === 'forbid') {
      e.cancel = true;
    }
  };

  private readonly onMove = (e: SortableTypes.AddEvent | SortableTypes.ReorderEvent): void => {
    if (e.itemData.status === 'forbid') {
      return;
    }

    this.props.onMove(
      e.itemData.column,
      e.toIndex,
      e.itemData.source,
    );
  };

  // TODO: move all none-native approaches to sortable wrapper
  private readonly renderDragTemplate = (itemData: ItemData): void => {
    if (!itemData || !this.dragItemContainer) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const DragTemplate = this.props.dragTemplate!;
    render(
        <DragTemplate
          column={itemData.column}
          status={itemData.status}
        />,
        this.dragItemContainer,
    );
  };

  render(): InfernoNode {
    const {
      source,
      visibleColumns,
      dragTemplate,
      dropFeedbackMode,
      allowColumnReordering,
      columnChooserDragModeOpened,
      ...restProps
    } = this.props;

    const needSortable = allowColumnReordering || columnChooserDragModeOpened;

    if (!needSortable) {
      return this.props.children;
    }

    const sortableDragTemplate = dragTemplate ? (e, container): void => {
      this.dragItemContainer = $(container).get(0);

      this.renderDragTemplate(e.itemData);
    } : undefined;

    return (
      <Sortable
        {...restProps}
        dropFeedbackMode={dropFeedbackMode ?? 'indicate'}
        onDragStart={this.onDragStart}
        group='dx-cardview-columns'
        onAdd={this.onMove}
        onReorder={this.onMove}
        onDragMove={this.onDragMove}
        onDragChange={this.onDragChange}
        dragTemplate={sortableDragTemplate}
        // @ts-expect-error
        _source={source}
      >
      {this.props.children}
    </Sortable>
    );
  }

  private isColumnDraggable(column: Column): boolean {
    if (this.props.source === 'header-panel-main') {
      const canBeHidden = column.allowHiding && !!this.props.columnChooserDragModeOpened;

      return column.allowReordering || canBeHidden;
    }

    if (this.props.source === 'column-chooser') {
      return true;
    }

    return false;
  }

  private getDraggableStatus(e: SortableTypes.DragMoveEvent): Status {
    const { column } = e.itemData as { column: Column };

    // @ts-expect-error
    const source = e.fromComponent.option('_source') as Source;
    // @ts-expect-error
    const destination = e.toComponent.option('_source') as Source;

    const containerRect = $(e.element).get(0).getBoundingClientRect();
    // @ts-expect-error
    const mouseX = e.event.clientX;
    // @ts-expect-error
    const mouseY = e.event.clientY;

    const yDistance = Math.min(
      Math.abs(mouseY - containerRect.y),
      Math.abs(mouseY - (containerRect.y + containerRect.height)),
    );
    const isMouseOnSourceContainer = mouseX >= containerRect.x
      && mouseX <= containerRect.x + containerRect.width
      && mouseY >= containerRect.y
      && mouseY <= containerRect.y + containerRect.height;

    if (source === 'column-chooser' && destination === 'header-panel-main') {
      return 'moving';
    }

    if (source === 'header-panel-main' && destination === 'column-chooser') {
      return column.allowHiding ? 'moving' : 'forbid';
    }

    if (destination === 'header-panel-main') {
      const canReorder = column.allowReordering;
      const isDragCloseEnough = yDistance <= ALLOWED_DRAGGING_DISTANCE;

      const isMoving = isDragCloseEnough && canReorder;

      return isMoving ? 'moving' : 'forbid';
    }

    if (destination === 'column-chooser') {
      const isMoving = isMouseOnSourceContainer;

      return isMoving ? 'moving' : 'forbid';
    }

    return 'forbid';
  }
}
