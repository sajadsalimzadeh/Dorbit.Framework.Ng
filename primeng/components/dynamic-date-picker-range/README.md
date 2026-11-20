# Dynamic date picker range

Independent standalone sibling of `DynamicDatePickerComponent`. Added under the owner's explicit, component-specific Framework exception; existing components, module exports and application screens are unchanged. Import the standalone component directly in the consuming component's `imports`.

```ts
import { DynamicDatePickerRangeComponent, DynamicDatePickerRangeValue }
    from '@primeng/components/dynamic-date-picker-range/dynamic-date-picker-range.component';

// Add DynamicDatePickerRangeComponent to the component's imports.
range: DynamicDatePickerRangeValue | null = null;
```

```html
<p-dynamic-date-picker-range [(ngModel)]="range" locale="fa"
    displayFormat="jYYYY/jMM/jDD" valueFormat="YYYY-MM-DD"
    [showClear]="true" label="بازه تاریخی" />
```

Reactive forms use the same `NG_VALUE_ACCESSOR` through `formControl` or `formControlName`.

- One text input, one popover and one calendar. First click emits `{ from: date, to: null }`, second click completes `{ from, to }`, third click clears the old end and begins another range. The popover stays open until dismissed outside or with Escape. Click order is preserved, including reverse-order dates; consumers can validate ordering and completeness if required. Same-day endpoints are allowed.
- Empty/reset/clear uses `null`, matching the existing picker. `writeValue` accepts `null`, `undefined` or a partial/complete object without emitting a change. It does not mutate the supplied object.
- Supports all original configuration inputs: `placeholder`, `label`, `locale`, `size`, `showClear`, `displayFormat`, `valueFormat`, `min`, `max`, `showTimePicker`, `inputStyleClass` and inherited `name`. Also supports inherited disabled state, `focus()` and `onSelect` (emits the current range or `null` for user selections/clear).
- Display uses the configured locale; stored endpoints use English/Gregorian formatting. Defaults match the original picker: `YYYY/MM/DD` and `YYYY-MM-DD`, extended with `HH:mm:ss` when time is enabled. Explicit `locale` takes precedence over `date.locale` translation; Persian is the fallback. Weekday order follows the active locale.
- External model writes and min/max accept the configured `valueFormat`, with strict ISO 8601 fallback (including timestamps) so report shortcuts such as `2026-11-20T23:59:59` also display in date-only mode. Display formatting remains independent. A model write preserves the supplied form value and does not emit a replacement or strip its times; user selections are still emitted in `valueFormat`. Manual display parsing remains strict. Regression tests cover repeated `setValue`/`patchValue`, reset and Jalali display for external timestamps.
- Manual entry uses `from — to` (em dash), with Persian/Arabic digit normalization. A single valid date represents an incomplete start. Invalid input emits `null` and remains visible for correction. Min/max apply to both typed and selected endpoints, in `valueFormat`. In time mode a boundary day is selectable and its initial time is clamped to the permitted part of that day.
- Year/month navigation and Today browse without changing the model. Time arrows edit the chosen start/end independently without advancing the click cycle. They do not silently reorder dates. `onSelect` is not fired by model writes, calendar navigation or manual text editing.
- Uses PrimeNG InputText, InputGroup, Button and Popover APIs and theme tokens. The custom grid is necessary to preserve the sibling's Jalali calendar; CSS handles calendar layout and range highlighting, without private PrimeNG selectors or deep overrides. The year-scroll timer is local to the instance and cleaned up on destruction.
- Endpoint summary cards use matching PrimeNG info (start) and success (end) tags. Selected day buttons use those same filled severities; a same-day start/end uses primary. Endpoints remain fully opaque when outside the displayed month. Day cells use the reactive `p-button` component so switching from text to filled selection removes the previous variant correctly. There is no start/end instructional text under the calendar.

Focused regression tests live beside the component; they use Angular forms and do not modify any application screen.
