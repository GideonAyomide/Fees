# Shadow System: Elevation & Depth

### Overview
In the Fees design system, elevation shadows are built using the brand primary color (`#2563EB`) rather than a generic neutral black (`#000000`). This ensures elevated elements integrate organically into the page without creating dirty or muddy borders.

### Shadow Specifications

| Elevation Level | X Offset | Y Offset | Blur (Radius) | Spread | Color Value | Opacity | Direct CSS Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Soft** | `1px` | `4px` | `30px` | `0px` | `#2563eb1f` | 12.1% (`0x1F / 255`) | `1px 4px 30px 0px #2563eb1f` |
| **Medium** | `4px` | `6px` | `24px` | `0px` | `#2563eb2e` | 18.0% (`0x2E / 255`) | `4px 6px 24px 0px #2563eb2e` |
| **Hard** | `6px` | `10px` | `20px` | `0px` | `#2563eb33` | 20.0% (`0x33 / 255`) | `6px 10px 20px 0px #2563eb33` |

### Why Brand-Tinted Shadows Read Differently from Black Shadows

Pure black shadows create a desaturated, muddy halo because optical shadows in the real world absorb and reflect ambient environmental chroma rather than dead grayscale darkness. By tinting the shadows with Crown Heights Academy's primary blue (`#2563EB`) at controlled low opacities (12% to 20%), elevated surfaces—such as fee payment cards and receipt slips—feel vibrant, crisp, and anchored to the school's visual identity.

