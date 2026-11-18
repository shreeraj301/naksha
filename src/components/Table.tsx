import type { ReactNode } from "react";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface TableColumn<Row> {
  id: string;
  label: string;
  /** What a cell shows. Defaults to `row[id]`. */
  cell?: (row: Row) => ReactNode;
  /** Numbers: right-aligned, mono, tabular. */
  isNumeric?: boolean;
  /** Secondary text in `fg-muted` (dates, references). */
  isMuted?: boolean;
  /** Mono and tabular, but left-aligned (dates). */
  isMono?: boolean;
}

export interface TableProps<Row extends { id: string }> {
  /** Names the table for screen readers when no caption is visible. */
  label: string;
  columns: TableColumn<Row>[];
  rows: Row[];
  /** A totals row, in column order. */
  footer?: ReactNode[];
  /** The row to mark as chosen. */
  selectedId?: string;
  /** Preview only: the row id to draw in each state, e.g. `{ hover: … }`. */
  forceState?: { hover?: string };
  /** @deprecated Use `forceState={{ hover }}`. Removed in 0.6.0. */
  forceHover?: string;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/**
 * Rows of facts to read and compare. A real `<table>` with column headers, so screen readers announce the column
 * with every cell. For rows people select, sort or act on, a grid comes in Phase 2.
 */
export function Table<Row extends { id: string }>({ label, columns, rows, footer, selectedId, forceState, forceHover: legacyHover, styles }: TableProps<Row>) {
  const forceHover = forceState?.hover ?? legacyHover;
  const cls = (c: TableColumn<Row>) => cx(c.isNumeric && "num", c.isMuted && "muted", c.isMono && "num") || undefined;
  return (
    <table className="nk-table" aria-label={label} style={layoutStyle(styles)}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.id} scope="col" className={c.isNumeric ? "num" : undefined}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className={forceHover === r.id ? "is-hover" : undefined} aria-selected={selectedId === r.id ? true : undefined}>
            {columns.map((c) => (
              <td key={c.id} className={cls(c)} style={c.isMono && !c.isNumeric ? { textAlign: "left" } : undefined}>
                {c.cell ? c.cell(r) : ((r as Record<string, unknown>)[c.id] as ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {footer && (
        <tfoot>
          <tr>
            {footer.length < columns.length ? (
              <>
                <td colSpan={columns.length - footer.length + 1}>{footer[0]}</td>
                {footer.slice(1).map((f, i) => (
                  <td key={i} className={columns[columns.length - footer.length + 1 + i]?.isNumeric ? "num" : undefined}>
                    {f}
                  </td>
                ))}
              </>
            ) : (
              footer.map((f, i) => (
                <td key={i} className={columns[i]?.isNumeric ? "num" : undefined}>
                  {f}
                </td>
              ))
            )}
          </tr>
        </tfoot>
      )}
    </table>
  );
}
