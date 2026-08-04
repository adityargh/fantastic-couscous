# Product Design System: Internal Operations Warehouse Apps

## 1. Introduction & Philosophy

### 1.1 Purpose
This Design System provides a unified language and visual framework for building internal warehouse operation applications (e.g., Inventory Management, Order Picking, Shipping Logistics, Workforce Management). It prioritizes **efficiency, clarity, speed, and error reduction** over aesthetic flair.

### 1.2 Core Principles
1.  **Speed First:** Interfaces must minimize clicks and cognitive load. Workers often operate under time pressure.
2.  **High Contrast & Legibility:** Designed for varied lighting conditions (dim warehouses to bright loading docks) and potential glare.
3.  **Touch & Scanner Friendly:** Large touch targets for gloved hands; clear integration points for barcode/QR scanners.
4.  **Error Prevention:** Critical actions require confirmation; destructive actions are distinct; success/failure states are unambiguous.
5.  **Data Density:** Optimized to show maximum relevant information without clutter, supporting rapid decision-making.

---

## 2. Brand Identity & Color Palette

### 2.1 Primary Colors
Used for primary actions, branding, and active states.

| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Ops Blue** | `#0052CC` | Primary buttons, active links, focus states. |
| **Ops Blue Dark** | `#003E99` | Hover states for primary elements. |
| **Ops Blue Light** | `#DEEBFF` | Backgrounds for selected rows or active tabs. |

### 2.2 Neutral Colors
Used for text, borders, backgrounds, and structural elements.

| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Slate 900** | `#172B4D` | Primary text (high contrast). |
| **Slate 700** | `#42526E` | Secondary text, labels. |
| **Slate 500** | `#6B778C` | Disabled text, icons. |
| **Slate 200** | `#DFE1E6` | Borders, dividers. |
| **Slate 50** | `#F4F5F7` | App background, card backgrounds. |
| **White** | `#FFFFFF` | Card surfaces, input backgrounds. |

### 2.3 Semantic Colors (Status & Feedback)
Critical for inventory status, alerts, and workflow states.

| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Success Green** | `#00875A` | In Stock, Order Complete, Shift Started. |
| **Warning Amber** | `#FFAB00` | Low Stock, Pending Review, Paused. |
| **Error Red** | `#DE350B` | Out of Stock, Scan Error, Shift Ended, Critical Alert. |
| **Info Cyan** | `#00BFFF` | In Transit, Processing, Informational Toast. |

### 2.4 Accessibility Standards
-   **Contrast Ratio:** All text/background combinations must meet WCAG AA (4.5:1) minimum; AAA (7:1) preferred for body text.
-   **Color Blindness:** Never rely solely on color to convey meaning. Always pair status colors with icons or text labels (e.g., "Low Stock" + Amber Background).

---

## 3. Typography

Designed for quick scanning and readability on handheld devices and desktop monitors.

### 3.1 Font Family
-   **Primary:** `Inter`, `Roboto`, or System UI (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`).
-   **Monospace (for IDs/Barcodes):** `JetBrains Mono`, `Roboto Mono`, or `Courier New`.

### 3.2 Type Scale

| Style | Size (px) | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | 24 | Bold (700) | 1.2 | Page Titles, Dashboard Headers. |
| **H2** | 20 | Semi-Bold (600) | 1.3 | Section Headers, Modal Titles. |
| **H3** | 16 | Semi-Bold (600) | 1.4 | Card Titles, Group Labels. |
| **Body L** | 16 | Regular (400) | 1.5 | Standard text, form descriptions. |
| **Body M** | 14 | Regular (400) | 1.5 | Table content, list items (Default). |
| **Body S** | 12 | Medium (500) | 1.4 | Metadata, timestamps, helper text. |
| **Mono** | 14 | Regular (400) | 1.5 | SKU numbers, Batch IDs, Coordinates. |

---

## 4. Iconography

-   **Style:** Stroke-based (outline) icons, 2px stroke width. Filled only for active states.
-   **Size:** Grid aligned (16x16, 20x20, 24x24).
-   **Library Recommendation:** Lucide Icons, Heroicons, or Material Symbols Outlined.

**Common Warehouse Icons:**
-   📦 Box/Package
-   🏭 Warehouse/Building
-   🚚 Truck/Shipping
-   📉 Chart/Analytics
-   🔍 Search/Scan
-   ⚠️ Warning/Triangle
-   ✅ Check/Circle
-   🖐️ Hand/Picking

---

## 5. Layout & Grid

### 5.1 Spacing System (4pt Grid)
Base unit: `4px`.
-   `xs`: 4px
-   `sm`: 8px
-   `md`: 16px
-   `lg`: 24px
-   `xl`: 32px
-   `xxl`: 48px

### 5.2 Responsive Breakpoints
-   **Mobile (Handheld Scanners):** < 600px (Single column, large touch targets).
-   **Tablet (Cart Mounts):** 600px - 1024px (Two columns, split view).
-   **Desktop (Admin/Stations):** > 1024px (Multi-column, data-dense tables).

### 5.3 Touch Targets
-   **Minimum Size:** 44x44px (iOS guideline) or 48x48px (Material guideline) for all interactive elements to accommodate gloves.
-   **Padding:** Adequate spacing between buttons to prevent mis-taps.

---

## 6. Core Components

### 6.1 Buttons
-   **Primary:** Solid Ops Blue background, White text. Used for main actions (e.g., "Confirm Pick", "Start Shift").
-   **Secondary:** White background, Slate 200 border, Slate 900 text. Used for secondary actions (e.g., "Cancel", "Back").
-   **Danger:** Solid Error Red background. Used for destructive actions (e.g., "Delete Record", "Void Order"). Requires confirmation modal.
-   **Disabled:** Slate 200 background, Slate 500 text. No hover state.

### 6.2 Data Tables (The Workhorse)
Critical for inventory lists and order manifests.
-   **Density:** Compact row height (40px-48px) to show more data.
-   **Headers:** Sticky header with Slate 50 background.
-   **Rows:** Zebra striping optional; clear hover state (Ops Blue Light).
-   **Alignment:** Text left-aligned; Numbers right-aligned; Actions centered.
-   **Features:** Sortable columns, resizable columns, bulk selection checkboxes.

### 6.3 Forms & Inputs
-   **Labels:** Top-aligned, bold, clear.
-   **Input Fields:** High contrast border (Slate 200), dark focus ring (Ops Blue).
-   **Validation:** Inline error messages below the field in Error Red with an icon.
-   **Auto-focus:** Critical inputs (like Scan fields) should auto-focus on page load.

### 6.4 Status Badges
Small pills indicating state.
-   **Style:** Colored background (light tint) with dark text (dark shade).
    -   *Example:* Low Stock = Background `#FFF3CD`, Text `#856404`.
-   **Usage:** Order Status, Inventory Level, User Role.

### 6.5 Cards
Container for grouped information (e.g., Worker Profile, Shipment Details).
-   **Shadow:** Subtle drop shadow for elevation.
-   **Padding:** `lg` (24px).
-   **Header:** Bold title, optional action menu on the right.

### 6.6 Feedback & Overlays
-   **Toasts:** Non-blocking notifications for success ("Item Scanned") or errors ("Invalid Barcode"). Auto-dismiss after 3-5s for success; manual dismiss for errors.
-   **Modals:** Used for confirmations or complex forms. Must have a clear "X" close button and backdrop blur.
-   **Skeleton Loaders:** Show placeholder shapes while data fetches to perceived performance.

---

## 7. Specific Patterns for Warehouse Ops

### 7.1 Barcode Scanning Interface
-   **Visual Cue:** Prominent scan icon in the input field.
-   **Feedback:** Immediate auditory beep (system level) + Visual flash (Green for success, Red for fail).
-   **Focus Management:** Cursor must return to the scan input immediately after a scan to allow rapid-fire scanning.

### 7.2 Pick Path Visualization
-   **Map/Grid:** Visual representation of warehouse aisles/shelves.
-   **Highlighting:** Current pick location highlighted in Ops Blue; completed picks in Success Green.
-   **Navigation:** Clear "Next" arrow indicators.

### 7.3 Offline Mode Indicator
-   Since warehouses often have dead zones, a persistent banner (Warning Amber) must appear when connectivity is lost, indicating data is queued for sync.

### 7.4 Shift Timer
-   Persistent widget showing clock-in time and duration. Clearly visible but not obstructive.

---

## 8. Voice & Tone

-   **Direct:** "Scan Item" instead of "Please scan the item now."
-   **Action-Oriented:** Verbs first. "Create Order", "Update Stock".
-   **Objective:** Avoid emotional language. Use "System Unavailable" instead of "Oops, something went wrong."
-   **Concise:** Minimize reading time.

---

## 9. Implementation Guidelines

### 9.1 Tech Stack Recommendations
-   **Framework:** React, Vue, or Angular.
-   **Component Library Base:** Material UI, Ant Design, or Chakra UI (heavily themed).
-   **State Management:** Redux, Zustand, or Pinia (for handling complex inventory states).
-   **Styling:** Tailwind CSS (for utility-first speed) or Styled Components.

### 9.2 Theming
-   Use CSS Variables (Custom Properties) for all colors and spacing to allow easy switching between "Light Mode" (default) and "High Contrast/Dark Mode" for night shifts.

### 9.3 Performance
-   **Virtualization:** Essential for tables/lists with >100 rows (e.g., `react-window`).
-   **Lazy Loading:** Load non-critical modules asynchronously.
-   **Asset Optimization:** SVG icons inline; minimal image usage.

---

## 10. Governance & Contribution

-   **Design Review:** All new components must be reviewed by the UX Lead and Engineering Lead.
-   **Documentation:** Updates to this system must be reflected in the Storybook documentation immediately.
-   **Versioning:** Semantic versioning (MAJOR.MINOR.PATCH) for the design system package.
-   **Feedback Loop:** Monthly review with warehouse floor staff to identify pain points.

---

*Last Updated: October 2023*
*Owner: Internal Product Design Team*
