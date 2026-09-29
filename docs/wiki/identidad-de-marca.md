# Brand Identity and Design System — Creatorly

This page specifies Creatorly's **brand identity** and **design system (Brand Kit)**. It is the visual and component source of truth for the whole team (view development, reusable components, charts, and styles).

---

## 1. Strategy and Positioning

| Dimension | Definition |
|---|---|
| **Category** | Internal B2B operations dashboard — management for a UGC creator agency |
| **Audience** | Agency internal staff: administrators and coordinators (not the external public, not brands, not creators) |
| **Personality** | Precise, connective, trustworthy, and modern — a professional work tool |
| **Central metaphor** | The agency as connective tissue between **Brands** and **Creators**; each **Order** is the bridge that joins them across its 5-status lifecycle |
| **Tagline** | *"The bridge between brands and creators."* |
| **To avoid** | Social-media / influencer aesthetics, generic iconography (cameras, hearts, play buttons), and magic colors |

> **Note:** The domain's canonical glossary lives in `CONTEXT.md` (Agency, UGC, Creator, Brand, Order, roles, and lifecycle).

---

## 2. Logo

### 2.1 Concept
Monogram of the **C** in Creatorly, built with the *Monogram + Meaning* method combined with *Negative Space*:
- The stroke of the **C** opens into two ends: the top end represents the **Brand** and the bottom end the **Creator**.
- A **diamond** (a square rotated 45°) occupies the central opening: it represents the **Order**, the node that always connects both parties.
- The shape never closes into a full circle because the relationship always passes through an active order managed by the agency.

![Creatorly Logo](assets/logo-creatorly.png)

### 2.2 Design process

The logo was built through visual iteration until reaching its final form: we started from the idea of the open C with the Order's diamond in the opening (section 2.1), and kept adjusting the arc and the central node until the proportion looked right — no extra colors, no decorative fill, aiming for the minimalist, technical line the brand personality in section 1 calls for.

The wordmark uses the `Unbounded 600` typeface.

The final result has already been verified without clipping (see the PNG above). The implementation code lives in `NavBar.vue`.

### 2.3 Usage rules
- **Icon only:** favicon, avatar, and small sizes (≥16px).
- **Logomark + Wordmark:** `[SVG icon] Creatorly` for the navigation bar (`NavBar.vue`), headers, and main screens.
- **Stroke color:** `--brand-primary` (`#7c3aed`) in light mode; `--brand-primary-dark` (`#a78bfa`) in dark mode.
- **Immutable:** the central diamond **always** keeps high contrast (white or a contrasting light background), the arc is never deformed or closed.

---

## 3. Color System and Tokens

All application styles must strictly use the CSS variables defined in `src/assets/base.css`. Burning hardcoded hex or `rgb/hsl` values into views and components is forbidden.

### 3.1 Brand and Surface Tokens

| Token | Value (Light / Dark) | UI Usage |
|---|---|---|
| `--color-background` | `#ffffff` / `#14121a` | Base background of the app and pages |
| `--color-background-soft` | `#f8f7fb` / `#1e1b26` | Card, panel, and navigation bar backgrounds (`NavBar`) |
| `--color-background-mute` | `#f1f0f5` / `#26222f` | Alternating table rows, disabled inputs |
| `--color-border` | `rgba(60, 50, 70, 0.12)` / `rgba(160, 150, 180, 0.48)` | Subtle borders of cards, inputs, tables, and dividers |
| `--color-border-hover` | `rgba(60, 50, 70, 0.29)` / `rgba(160, 150, 180, 0.65)` | Borders on hover or focus |
| `--color-heading` | `#2c2340` / `#ffffff` | `h1`, `h2`, `h3` titles and headings |
| `--color-text` | `#2c2340` / `rgba(237, 233, 245, 0.64)` | General body text and descriptions |

### 3.2 Semantic Tokens vs. Brand

* **Brand accent (`--color-primary`, `--color-primary-soft`):**
  * Light: `#7c3aed` (`rgba(124, 58, 237, 0.12)`).
  * Dark: `#a78bfa` (`rgba(167, 139, 250, 0.16)`).
  * *Use:* Primary buttons, active links, selection borders, and interactive focus.
* **Success (`--color-success`):** `#2fae60` (Light) / `#3dd68c` (Dark).
  * *Use:* Order's `approved` status, successful confirmations.
* **Danger / Warning (`--color-danger`):** `#e0575b` (Light) / `#f28b82` (Dark).
  * *Use:* Logout button, delete actions, error messages.

> ⚠️ **Rule:** Violet is the identity accent; green and red are status semantics. Don't use violet to indicate success or green for decoration.

---

## 4. Typography: Three-Role System

To give the dashboard a modern, technical visual character, the identity uses 3 typefaces with clearly differentiated purposes:

```
Google Fonts import:
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Unbounded:wght@500;600;700&display=swap
```

| Role | Typeface | Weight | Mandatory use |
|---|---|---|---|
| **Display / Brand** | `Unbounded` | `600`, `700` | Logo / Wordmark, large numbers in KPI cards |
| **Interface / Reading** | `Inter` | `400`, `500`, `600` | UI text, buttons, form fields, table cells |
| **Data / Code** | `JetBrains Mono` | `400`, `500` | UUID ids (generated with `generateId()`), uppercase labels, status chips, role badges (`ADMIN`, `COORDINATOR`) |

---

## 5. UI Component Guidelines (Implementation Guide)

### 5.1 Metric Cards (KPI Cards)
- **Structure:** Clean grid.
- **Metric number:** Large size (`1.75rem` - `2.25rem`), `font-family: 'Unbounded', sans-serif`, `font-weight: 600`, color `--color-primary`.
- **Label:** `font-family: 'JetBrains Mono', monospace`, `text-transform: uppercase`, size `0.75rem` (`12px`), `letter-spacing: 0.05em`, color `--color-text`.
- **Container:** Background `--color-background-soft`, border `1px solid var(--color-border)`, `border-radius: 8px`, `padding: 1.25rem`.

### 5.2 User Role Badges
- **Text:** `ADMIN` or `COORDINATOR`.
- **Style:** `font-family: 'JetBrains Mono', monospace`, `font-size: 0.75rem`, `font-weight: 500`.
- **Colors:** Background `--color-primary-soft`, text `--color-primary`, `border-radius: 4px`, `padding: 2px 8px`.

### 5.3 Order Status Chips (Lifecycle)
The lifecycle consists of exactly 5 statuses in this order:
`requested → assigned → in_production → delivered → approved`

| Status | Background token | Text token | Note |
|---|---|---|---|
| `requested` | `--color-background-mute` | `--color-text` | Neutral initial status |
| `assigned` | `--color-primary-soft` | `--color-primary` | Assigned to a creator |
| `in_production` | `--color-primary-soft` | `--color-primary` | Being produced |
| `delivered` | `rgba(59, 130, 246, 0.12)` | `#3b82f6` (info blue) | Awaiting review |
| `approved` | `rgba(47, 174, 96, 0.15)` | `--color-success` | **Always green**, never violet |

### 5.4 Charts with Chart.js (`BaseChart.vue`)
For the orders and reports charts owned by Felipe:
- **Series palette for charts:**
  - Primary series (e.g. total orders / budgets): `rgba(124, 58, 237, 0.85)` (brand violet).
  - Secondary series or comparative bars: `rgba(167, 139, 250, 0.5)`.
  - Approved / completed statuses: `rgba(47, 174, 96, 0.85)` (green).
  - Pending / canceled statuses: `rgba(224, 87, 91, 0.85)` (red).
- **Axis and legend style:**
  - `color`: `var(--color-text)`.
  - `font.family`: `'Inter', sans-serif`.
  - `grid.color`: `var(--color-border)`.

### 5.5 Buttons, Forms, and Navigation
- **Standard border radius:** `6px` for buttons and inputs; `8px` for cards; `20px` for pills/chips.
- **Primary button:** Background `--color-primary`, white text (`#ffffff`), hover with a slight elevation or opacity change.
- **Active navigation (`router-link-active`):** Weight `600`, color `--color-primary`, and a bottom or side visual border/accent.

---

## 6. Anti-Generic Rules of the Project

1. **No generic social-media aesthetics:** Camera, play-button, reel, or "influencer" heart iconography is off the table. Creatorly is a B2B operational and budget management tool.
2. **A single brand accent color:** Violet is the only institutional accent. Green and red are reserved exclusively for semantic meaning (success and danger).
3. **Don't literalize the bridge:** The "bridge" metaphor is expressed in the architecture and in the logo's monogram (the open C with its node), not with illustrations of physical bridges.
4. **Respect the tokens:** Every visual rule must be consumed from `src/assets/base.css` to guarantee full dark-mode compatibility and avoid design inconsistencies.
