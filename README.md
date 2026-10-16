# Angular Custom Drag-and-Drop Feature Samples

Angular 20 and TypeScript samples demonstrating pointer-based dragging, shared drag state, drop-target registration, and consumer-owned state updates.

## Purpose

These samples show how I separate drag-and-drop interaction into a shared service, a draggable wrapper component, and a drop-target directive. A CV-to-folder example demonstrates how a consuming feature handles dropped items. The example contains fictional CV labels and keeps its state in memory.

## Drag-and-Drop Service

**Source:** [drag-drop-service.ts](./features/drag-drop-service.ts)

- Defines the `DragItem` contract with an item type and identifier, and the `DropZone` contract with acceptance and drop callbacks.
- Tracks the active drag and hovered target with signals and computed state.
- Waits for six pixels of pointer movement before starting a drag, preserving ordinary clicks.
- Creates a preview from the source element, copies its computed appearance, and preserves the pointer's original grab offset.
- Marks the preview as inert and hidden from assistive technology.
- Finds an accepting target by hit testing the pointer position and walking up the element's ancestors.
- Cleans up listeners, preview elements, and drag state after release or cancellation.
- Cancels on Escape, pointer cancellation, or window blur, and suppresses the click following an active drag.

**What this demonstrates:** centralizing pointer interaction and drag lifecycle management while leaving domain operations to the consuming feature.

## Draggable Component

**Source:** [draggable-component.ts](./features/draggable-component.ts)

Wraps projected content in `app-draggable` and accepts signal inputs for `dragId`, `dragType`, and `disabled`. It delegates pointer tracking to the shared service, exposes a `dragging` host class, and prevents native browser dragging.

Nested buttons, form controls, editable content, and elements marked `data-no-drag` do not start a drag. Disabling or destroying the component cancels its pending or active drag.

**What this demonstrates:** providing a reusable interaction wrapper through content projection, signal inputs, and lifecycle cleanup.

## Drop-Target Directive

**Source:** [drop-target-directive.ts](./features/drop-target-directive.ts)

Registers its host element as a drop zone. The `appDropTarget` input specifies the accepted item type, and `dropDisabled` controls whether it accepts drops. The directive exposes a `drop-target` class while hovered and emits the dropped `{ type, id }` through `itemDropped`. It unregisters the zone when destroyed.

**What this demonstrates:** attaching drop behavior to existing markup through a directive with explicit acceptance rules and a typed output.

## CV-to-Folder Example

**Sources:** [drag-and-drop-example-component.ts](./features/drag-and-drop-example-component.ts), [drag-and-drop-example.html](./features/drag-and-drop-example.html)

- Renders a draggable CV list and an Applications folder drop target.
- Uses matching item types to connect draggable items with the target.
- Stores CVs in a signal and derives the available and folder lists with `computed()`.
- Updates folder membership immutably when a CV is dropped.
- Provides a Move to Applications button as an alternative to pointer dragging and a Return to list button for reversing the move.
- Uses `@for` with stable identifiers and `@empty` for empty lists.

**What this demonstrates:** composing reusable drag-and-drop primitives while keeping feature state and the resulting domain operation in the consuming component.

## Technologies

Angular 20 standalone components and directives, dependency injection, signals and computed state, signal inputs and outputs, `DestroyRef`, `OnPush` change detection, TypeScript, and browser Pointer Events and DOM APIs.

## Excerpt Context and Behavior Boundaries

The service, component, and directive are copied from `src/app/shared/ui/draggable`. Filenames describe their roles, local imports are updated, and the component's SCSS reference is removed. Exported class names and selectors are retained. The consuming example is adapted from the project's CV collection.

These files are grouped for portfolio review and are outside the application's normal build configuration. To use the example, import `DragAndDropExample` into a standalone component and render `<app-drag-and-drop-example />`. Route registration and application bootstrap are not included.

No SCSS is included. The consuming application must supply the styling needed for correct drag behavior:

- `app-draggable`: `display: flex`, `min-width: 0`, and `touch-action: none`.
- `app-draggable.dragging`: `display: none` to hide the source during dragging.
- `.app-drag-preview`: `position: fixed`, `top: 0`, `left: 0`, a z-index above your
  dialogs, `pointer-events: none`, `opacity: 1`, `filter: none`, and `user-select: none`.
- `.app-dragging` and `.app-drag-preview`: `cursor: grabbing`.
- `.app-dragging`: `user-select: none`.
- Hide `.app-drag-preview` when printing.
- Style `.drop-target` for the hovered target's visual feedback.

Preview styles must be global because the service appends the preview to `body`. Runtime inline styles for dimensions, pointer position updates, and copying the source's computed appearance remain in the service.

The service coordinates one pointer drag at a time. It does not implement list reordering, automatic scrolling, native file drops, or keyboard dragging. The example's buttons provide keyboard-accessible move actions. Persistence, API coordination, and application-specific validation belong to the consuming feature.

The example was compiled with Angular's compiler. The application build and all 11 existing source drag-and-drop tests passed when these samples were prepared. Those tests exercise the original implementation; the copied example has not been exercised as a standalone browser application.

## Portfolio Message

I can organize Angular drag-and-drop features around reusable components and directives, signal-based interaction state, explicit item contracts, and lifecycle cleanup while keeping domain updates in the consuming feature.
