# Information Design: Head and Body Architecture

## 1. Context & Purpose
Per Step 10 of Task Two, information design separates configuration from content:
* **The Head**: Configuration that controls browser identity, search indexing, social previews, and navigation context.
* **The Body**: Content and visual hierarchy that directs user focus, collapses unnecessary decisions, and ensures fluid responsiveness without layout degradation.

---

## 2. The Head (Configuration)

### 1. Dynamic Page Titles
Static title strings (`Fees`) disorient users and break browser history navigation. We implemented Next.js dynamic title templating in [`app/layout.tsx`](file:///c:/Users/HP/Desktop/Fees/app/layout.tsx):
* **Root Template**: `%s | Crown Heights Academy`
* **Route 1 (Home `/`)**: `Home | Crown Heights Academy`
* **Route 2 (Enquiry `/enquiry`)**: `Ask the School | Crown Heights Academy`

### 2. Tagline Under Ten Words
* **Selected Copy**: *"Official school fee balances and receipts for registered families."*
* **Word Count**: Exactly **9 words** (complying strictly with the <10 word constraint).
* **Rationale**: Clear, authoritative institutional statement informing parents immediately what the portal delivers without marketing fluff.

### 3. SEO Tags on Marketing Page
Configured on the root landing page ([`app/page.tsx`](file:///c:/Users/HP/Desktop/Fees/app/page.tsx)) only:
* Keywords: `Crown Heights Academy`, `School Fees`, `Term Balance`, `Parent Portal`, `Official Receipts`.
* Sub-pages (such as private records and enquiry forms) do not spam search engines with redundant indexing tags.

### 4. Custom Favicon
Created [`app/icon.svg`](file:///c:/Users/HP/Desktop/Fees/app/icon.svg) featuring the Crown Heights Academy institutional crest:
* Royal blue square background (`#2563EB`) with a gold crown silhouette (`#FBBF24`).
* High contrast and recognizable at 16x16 and 32x32 favicon scales in browser tabs.

### 5. Open Graph Tags
Configured in `app/layout.tsx` so WhatsApp and SMS links unfurl into rich cards rather than bare URLs:
* `og:title`: "Crown Heights Academy Fees"
* `og:description`: "Official school fee balances and receipts for registered families."
* `og:url`: `https://fees.crownheights.edu.ng`
* `og:siteName`: "Crown Heights Academy"
* `og:locale`: `en_NG`

---

## 3. The Body (Information Design on the Screen)

### 1. Element Removed and Why
* **Element Removed**: The redundant uppercase text label `"CROWN HEIGHTS ACADEMY"` positioned above the main heading.
* **Why**: The visual crown crest logo was already added above the heading. Having both the logo and the text name stacked together created visual clutter and duplicate brand announcement. Removing the text label reduced vertical footprint and let the headline breathe.

### 2. Collapsed Choice & Growth Reasoning
* **Before**: Two competing primary buttons:
  1. `Sign In with Phone & PIN`
  2. `Activate Account with Slip Code`
* **After**: Collapsed into one unified primary action:
  **`Sign In or Activate with Phone`**
* **Growth Reasoning**: Forcing a first-time or returning parent to choose between "login" versus "activate" creates orientation friction. In our user brief, parents open the app 6–8 times a term on budget phones. A single entry point where the parent enters their phone number allows the server to intelligently branch: if the account is new, prompt for the activation slip code; if already active, prompt for their PIN.

### 3. Deliberate Heading Wrap
* **Problem (Bad Wrap)**: Without constraints, `"School Fees & Official Records"` wraps into an awkward shape on narrow mobile viewports, leaving the single word `"Records"` dangling as an orphan line.
* **Solution (Good Wrap)**: Applied `max-width: 20rem;` and `text-wrap: balance;` with `line-height: 1.2`. This forces the headline to break cleanly into two balanced, intentional lines:
  ```text
  School Fees &
  Official Records
  ```
  creating an authoritative pyramid shape that guides eye movement directly to the primary action.

### 4. Button Sizing in `rem` Units
Buttons are sized using relative `rem` padding rather than rigid pixel heights:
* `padding: 0.9375rem 1.5rem;` (15px vertical, 24px horizontal).
* `border-radius: 0.75rem;` (12px smooth institutional radius).
* **Why**: If a parent increases their operating system font size for readability, `rem`-sized padding expands proportionally with the text, preventing text clipping and illegible button boundaries.

### 5. Applied Token Label Style
All buttons strictly consume the design system typography class `text-label-large` (Inter 600 Semi-Bold, 14px size, 20px line-height).

---

## 4. Interaction & Responsiveness

### 1. Pointer Cursor & Hover Feedback
Every interactive element provides immediate visual feedback:
* `cursor: pointer` explicitly applied to buttons, links, and the home crest logo.
* Subtle hover transition (`transform: translateY(-1px)` and box-shadow elevation from `--shadow-soft` to `--shadow-medium`).
* The institutional crown logo links directly back to `/` with an accessible `aria-label`.

### 2. Responsive Clamp Typography
The main heading uses CSS `clamp()`:
```css
font-size: clamp(1.75rem, 5vw + 0.5rem, 2.375rem);
```
* **At 360px (Small Mobile)**: Renders at `1.75rem` (28px), ensuring the 2-line heading fits comfortably without horizontal scrolling.
* **At 768px (Tablet)**: Scales fluidly to `2.125rem` (34px).
* **At 1200px+ (Desktop)**: Caps cleanly at `2.375rem` (38px).
