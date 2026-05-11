# Design Spec: Procurement Item Table Form

## Overview
Refactor the item input section in `PengadaanEventForm.tsx` from a vertical list of cards to a compact, responsive table layout. This will improve usability for requests with many items and provide a more professional "dashboard" feel.

## Architecture & Components

### 1. `PengadaanEventForm.tsx` (Update)
- **State Management**: Continue using `react-hook-form` with `useFieldArray`.
- **UI Update**: 
    - Replace the `.map` over cards with a `<table>` structure.
    - Wrap the table in a scrollable `div` for responsiveness.
    - Implement inline input styling for table cells.

### 2. Table Column Specification
| Column | Width | Component/Input |
| :--- | :--- | :--- |
| **#** | Auto | Index + 1 |
| **Nama Barang*** | 30% | `Input` (Required) |
| **Merek** | 15% | `Input` |
| **Kategori** | 15% | `select` |
| **Jumlah** | 10% | `Input (number)` |
| **Satuan** | 10% | `Input` |
| **Media** | 15% | Compact Image Link + Upload button |
| **Aksi** | 5% | Delete Button (Trash icon) |

## Data Flow
- **Addition**: "Tambah Barang" button calls `append()` from `useFieldArray`.
- **Removal**: Delete button in the "Aksi" column calls `remove(index)`.
- **Validation**: Zod schema remains largely the same, but error messages will be displayed inline or as tooltips within the table cells.

## Visual Design
- **Table Style**: Clean, modern table with sticky header if possible.
- **Input Style**: Borderless or "ghost" style inputs that only show borders/focus rings when interacted with.
- **Animations**: Use `stagger-1` or `stagger-2` classes for row entry if supported by the existing CSS.

## Success Criteria
- [ ] Items can be added and removed correctly.
- [ ] All input fields map correctly to the `items` array in the form state.
- [ ] The table is responsive and doesn't break on smaller screens.
- [ ] Visual design is consistent with the `PengadaanEventDetail` table.
