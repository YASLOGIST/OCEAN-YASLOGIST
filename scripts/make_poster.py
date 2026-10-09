"""
Pure-Python PNG poster generator for YASLOGIST Ocean README hero.
Uses only stdlib (struct, zlib) — no PIL / cairosvg / sharp required.
Output: assets/readme/yaslogist-hero.png  (1920 × 720, sRGB)
"""

import struct
import zlib
import math
import os

W, H = 1920, 720
OUT  = os.path.join(os.path.dirname(__file__), "..", "assets", "readme", "yaslogist-hero.png")

# ── helpers ────────────────────────────────────────────────────────────────
def clamp(v): return max(0, min(255, int(round(v))))

def lerp(a, b, t): return a + (b - a) * t

def lerp_col(c1, c2, t):
    return tuple(lerp(c1[i], c2[i], t) for i in range(3))

def rad_glow(cx, cy, rx, ry, t_x, t_y):
    """Approx radial α from centre (cx,cy) with radii (rx,ry)."""
    dx = (t_x - cx) / rx
    dy = (t_y - cy) / ry
    d  = dx*dx + dy*dy
    if d > 1.0:
        return 0.0
    return 1.0 - d   # linear falloff

# ── colour palette (matching the SVG) ──────────────────────────────────────
C_BG_CORE    = (1,   4,  12)
C_BG_GRAD_A  = (11, 26, 58)
C_BG_GRAD_B  = (6,  16, 42)
C_BG_GRAD_C  = (3,  8,  26)
C_GLOW_A_R   = (200, 235, 255)   # right-side atmospheric glow
C_GLOW_B_R   = (10,  58, 106)
C_SEA_TOP    = (10, 26, 53)
C_SEA_BOT    = (2,  10, 24)
C_NEON       = (34, 228, 255)
C_NEON_SKY   = (34, 211, 238)
C_NEON_BLUE  = (14, 165, 233)
C_NEON_DIM   = (34, 211, 238)
C_TEXT_CORE  = (224, 245, 255)
C_TEXT_DIM   = (120, 180, 215)
C_NODE_CORE  = (34, 228, 255)
C_NODE_GLOW  = (34, 228, 255)
C_GATEWAY    = (34, 211, 238)
C_RING       = (34, 228, 255)
C_GRID       = (26, 74, 122)
C_TEXT_GRAD_0 = (224, 245, 255)
C_TEXT_GRAD_1 = (200, 240, 255)
C_TEXT_GRAD_2 = (138, 212, 255)
C_WHITE      = (255, 255, 255)
C_OFFWHITE   = (230, 242, 252)

# ── background fill ────────────────────────────────────────────────────────
def bg_pixel(x, y):
    # radial gradient core
    cx, cy, rx, ry = W * 0.50, H * 0.48, W * 0.52, H * 0.52
    d = rad_glow(cx, cy, rx, ry, x, y)
    col = lerp_col(C_BG_CORE, C_BG_GRAD_A, d)
    # blend in glow-a (left-ish)
    ga = rad_glow(W * 0.38, H * 0.58, W * 0.38, H * 0.38, x, y)
    col = lerp_col(col, (26, 92, 138), ga * 0.32)
    # glow-b (top-right)
    gb = rad_glow(W * 0.74, H * 0.28, W * 0.42, H * 0.42, x, y)
    col = lerp_col(col, (10, 58, 106), gb * 0.22)
    # volumetric haze band
    haze_dx = (x - W * 0.50) / 860
    haze_dy = (y - 380) / 170
    haze_d  = haze_dx * haze_dx + haze_dy * haze_dy
    if haze_d < 1.0:
        col = lerp_col(col, (13, 42, 82), (1.0 - haze_d) * 0.14)
    # sea-grad at bottom
    if y > 520:
        t = (y - 520) / 200.0
        col = lerp_col(col, C_SEA_BOT, t * 0.60)
    # bottom fade
    if y > H * 0.72:
        t = (y - H * 0.72) / (H * 0.28)
        col = lerp_col(col, C_BG_GRAD_C, clamp(t * 100) / 100.0)
    return tuple(clamp(c) for c in col)

# ── draw helpers ───────────────────────────────────────────────────────────
def line_aa(buf, x1, y1, x2, y2, r, g, b, alpha):
    """Simple line with alpha blend at each integer point."""
    dx = float(x2 - x1)
    dy = float(y2 - y1)
    steps = max(int(abs(dx)), int(abs(dy)), 1)
    inv = 1.0 / steps if steps else 1.0
    a = alpha / 255.0
    for s in range(steps + 1):
        t  = s * inv
        px = clamp(int(x1 + dx * t))
        py = clamp(int(y1 + dy * t))
        if 0 <= px < W and 0 <= py < H:
            i = (py * W + px) * 3
            buf[i]   = int(buf[i]   * (1 - a) + r * a)
            buf[i+1] = int(buf[i+1] * (1 - a) + g * a)
            buf[i+2] = int(buf[i+2] * (1 - a) + b * a)

def dot(buf, cx, cy, r, cr, cg, cb, alpha=None):
    if alpha is None:
        alpha = 255
    for dy_ in range(-r, r + 1):
        for dx_ in range(-r, r + 1):
            if dx_*dx_ + dy_*dy_ <= r*r:
                px = clamp(cx + dx_)
                py = clamp(cy + dy_)
                if 0 <= px < W and 0 <= py < H:
                    a = alpha / 255.0
                    i = (py * W + px) * 3
                    buf[i]   = int(buf[i]   * (1 - a) + cr * a)
                    buf[i+1] = int(buf[i+1] * (1 - a) + cg * a)
                    buf[i+2] = int(buf[i+2] * (1 - a) + cb * a)

def circle_fill(buf, cx, cy, r, cr, cg, cb, alpha):
    dot(buf, cx, cy, r, cr, cg, cb, alpha)

def glow_blob(buf, cx, cy, rx, ry, cr, cg, cb, max_alpha):
    """Soft elliptical glow — per-pixel alpha from distance.
    max_alpha is a 0-255 value."""
    max_f = max_alpha / 255.0
    for dy_ in range(-int(ry * 1.6), int(ry * 1.6) + 1):
        for dx_ in range(-int(rx * 1.6), int(rx * 1.6) + 1):
            dx = dx_ / rx
            dy = dy_ / ry
            d  = dx*dx + dy*dy
            if d > 1.0:
                continue
            a = (1.0 - d) * max_f
            if a < 0.001:
                continue
            px = clamp(cx + dx_)
            py = clamp(cy + dy_)
            if 0 <= px < W and 0 <= py < H:
                i = (py * W + px) * 3
                buf[i]   = int(buf[i]   * (1 - a) + cr * a)
                buf[i+1] = int(buf[i+1] * (1 - a) + cg * a)
                buf[i+2] = int(buf[i+2] * (1 - a) + cb * a)

def text_glow_hires(buf, text, x, y, font_size, cr, cg, cb, glow_cr=34, glow_cg=228, glow_cb=255, glow_r=18, glow_alpha=80):
    """Stub: draw bright text core + soft glow halo.
    Since we can't use TTF fonts without PIL, we draw a simplified
    'mask' of the text using the specified glow + core colours.
    This function is a no-op placeholder; real text is drawn below
    using a manual bitmap approach for key strings."""
    pass

# ── Main render ────────────────────────────────────────────────────────────
print("Rendering 1920×720 poster …")
buf = bytearray(W * H * 3)

# 1. Background
print("  layer 1/6: background …")
for y in range(H):
    for x in range(W):
        i = (y * W + x) * 3
        c = bg_pixel(x, y)
        buf[i]   = c[0]
        buf[i+1] = c[1]
        buf[i+2] = c[2]

# 2. Grid lines
print("  layer 2/6: coordinate grid …")
for y in [80, 180, 290, 410, 540, 660]:
    line_aa(buf, 160, y, 1760, y, C_GRID[0], C_GRID[1], C_GRID[2], 60)
for x in [300, 500, 700, 900, 1100, 1300, 1500, 1680]:
    line_aa(buf, x, 60, x, 680, C_GRID[0], C_GRID[1], C_GRID[2], 50)

# 3. Suez Canal corridor
print("  layer 3/6: Suez Canal + shipping routes …")
# Suez path
suez_pts = [(628, 370), (680, 348), (740, 310), (782, 272), (870, 232), (1100, 200)]
for i in range(len(suez_pts) - 1):
    x1, y1 = suez_pts[i]
    x2, y2 = suez_pts[i + 1]
    line_aa(buf, x1, y1, x2, y2, C_NEON_SKY[0], C_NEON_SKY[1], C_NEON_SKY[2], 28)

# Full corridor: Gulf → Red Sea → Canal → Med
corridor = [
    (340, 555), (420, 510), (490, 458), (538, 440),
    (568, 430), (590, 418), (604, 412),
    (610, 408), (620, 398), (628, 370),
    (680, 348), (740, 310), (782, 272),
    (870, 232), (950, 218),
    (1050, 206), (1080, 203), (1100, 200),
    (1160, 194), (1200, 190), (1220, 188),
    (1260, 184), (1290, 183), (1300, 168),
    (1320, 150), (1328, 138), (1340, 128),
]
for i in range(len(corridor) - 1):
    x1, y1 = corridor[i]
    x2, y2 = corridor[i + 1]
    line_aa(buf, x1, y1, x2, y2,
             lerp_col(C_NEON, C_NEON_SKY, 0.5)[0],
             lerp_col(C_NEON, C_NEON_SKY, 0.5)[1],
             lerp_col(C_NEON, C_NEON_SKY, 0.5)[2],
             90)

# Gulf sub-route
gulf = [(340, 555), (362, 540), (374, 533), (388, 528),
        (402, 523), (410, 512), (420, 498),
        (448, 468), (470, 460), (490, 456), (510, 452), (524, 444), (538, 440)]
for i in range(len(gulf) - 1):
    x1, y1 = gulf[i]
    x2, y2 = gulf[i + 1]
    line_aa(buf, x1, y1, x2, y2,
             C_NEON_BLUE[0], C_NEON_BLUE[1], C_NEON_BLUE[2], 55)

# 4. Egypt column
print("  layer 4/6: Egypt 5-gateway column …")
# vertical line
line_aa(buf, 1560, 50, 1560, 680, C_GRID[0], C_GRID[1], C_GRID[2], 55)
# dashed version
dash_on = True
for yy in range(125, 546, 3):
    if dash_on:
        line_aa(buf, 1560, yy, 1560, min(yy + 6, 546),
                 C_NEON_SKY[0], C_NEON_SKY[1], C_NEON_SKY[2], 55)
    dash_on = not dash_on

gateways = [
    (128,  "ALEXANDRIA",   3.2,  9,  0.90, 0.40),
    (218,  "DEKHEILA",     2.8,  8,  0.85, 0.35),
    (310,  "SOHKNA",       3.0,  9,  0.90, 0.40),
    (418,  "DAMIETTA",     2.8,  8,  0.85, 0.35),
    (540,  "E. PORT SAID", 3.2, 10,  0.95, 0.45),
]
for gy, gname, gr, gr2, ga, gr_alpha in gateways:
    gy_abs = gy + 50
    # glow ring
    glow_blob(buf, 1560, gy_abs, gr2 * 1.5, gr2 * 1.5,
              C_GATEWAY[0], C_GATEWAY[1], C_GATEWAY[2], ga * 70)
    # core dot
    dot(buf, 1560, gy_abs, int(gr), C_GATEWAY[0], C_GATEWAY[1], C_GATEWAY[2], int(ga * 255))
    # label
    print(f"    gateway label: {gname} at y={gy_abs}")

# 5. Data nodes (port markers)
print("  layer 5/6: data nodes + rings …")
nodes = [
    # (x, y, ring_r, node_r, pulse)
    (340, 555, 18, 5, 0.30),   # Manama
    (538, 440, 20, 6, 0.35),   # Jeddah
    (388, 528, 16, 4, 0.22),   # Dammam
    (628, 370, 22, 6, 0.40),   # Suez (prominent)
    (1100, 200, 20, 5, 0.30),  # E. Port Said
    (1340, 128, 22, 6, 0.35),  # Alexandria
]
for nx, ny, ring_r, node_r, pulse in nodes:
    glow_blob(buf, nx, ny, node_r * 2.5, node_r * 2.5,
              C_NODE_GLOW[0], C_NODE_GLOW[1], C_NODE_GLOW[2], pulse * 160)
    dot(buf, nx, ny, int(node_r), C_NODE_CORE[0], C_NODE_CORE[1], C_NODE_CORE[2], 200)
    line_aa(buf, nx - ring_r, ny, nx + ring_r, ny, C_RING[0], C_RING[1], C_RING[2], 35)
    line_aa(buf, nx, ny - ring_r, nx, ny + ring_r, C_RING[0], C_RING[1], C_RING[2], 35)

# 6. YASLOGIST brand mark (top-right of scene)
print("  layer 6/6: YASLOGIST brand + title text …")
mark_cx, mark_cy = 1680, 72
glow_blob(buf, mark_cx, mark_cy, 36, 36,
          C_NEON[0], C_NEON[1], C_NEON[2], 80)
# Draw simplified YL mark as lines
def brand_liga(buf, cx, cy, scale=1.0, col=(34,228,255), alpha=220):
    s = scale
    # Y stem left
    line_aa(buf, cx-2* s, cy-2* s, cx, cy,     col[0], col[1], col[2], alpha)
    line_aa(buf, cx,      cy,     cx, cy+2* s, col[0], col[1], col[2], alpha)
    # Y stem right
    line_aa(buf, cx+2* s, cy-2* s, cx, cy,     col[0], col[1], col[2], alpha)
    # L top
    line_aa(buf, cx+6* s, cy-2* s, cx+0.5* s, cy-0.5* s, col[0], col[1], col[2], alpha)
    # L vertical
    line_aa(buf, cx+0.5* s, cy-0.5* s, cx+0.5* s, cy+2* s, col[0], col[1], col[2], alpha)
    # L bottom
    line_aa(buf, cx+0.5* s, cy+2* s, cx+6* s, cy+2* s, col[0], col[1], col[2], alpha)
    # Outer circle
    dot(buf, cx, cy, int(28*s), 0, 0, 0, 0)  # no-op placeholder for circle
    # circle outline approximated with dots at cardinal points
    for ang in range(0, 360, 8):
        rad = math.radians(ang)
        px = int(cx + 28 * s * math.cos(rad))
        py = int(cy + 28 * s * math.sin(rad))
        if 0 <= px < W and 0 <= py < H:
            i = (py * W + px) * 3
            buf[i]   = int(buf[i]   * 0.85 + col[0] * 0.15)
            buf[i+1] = int(buf[i+1] * 0.85 + col[1] * 0.15)
            buf[i+2] = int(buf[i+2] * 0.85 + col[2] * 0.15)

brand_liga(buf, mark_cx, mark_cy, scale=1.0)

# YASLOGIST wordmark text — draw as bright pixel columns (simplified)
def draw_wordmark(buf, cx, cy, text, col, letter_w=10, letter_h=14, gap=2):
    """Very simplified block-letter rendering for 'YASLOGIST'.
    Each letter is a 10×14 pixel block drawn at (cx, cy)."""
    x = cx - (len(text) * (letter_w + gap)) // 2 + letter_w // 2
    for ch in text:
        # Draw a bright rectangle as letter placeholder
        for dy in range(-letter_h//2, letter_h//2):
            for dx in range(-letter_w//2, letter_w//2):
                px = clamp(int(x + dx))
                py = clamp(int(cy + dy))
                if 0 <= px < W and 0 <= py < H:
                    i = (py * W + px) * 3
                    a = 0.85
                    buf[i]   = int(buf[i]   * (1-a) + col[0] * a)
                    buf[i+1] = int(buf[i+1] * (1-a) + col[1] * a)
                    buf[i+2] = int(buf[i+2] * (1-a) + col[2] * a)
        x += letter_w + gap

# Title block — left side
title_x = 160
title_y = 638

# Title line 1: "Every container."
draw_wordmark(buf, title_x + 80, title_y, "Every container.", C_TEXT_CORE, letter_w=8, letter_h=11, gap=1)

# Title line 2: "One record, quay to gate."  (neon cyan)
draw_wordmark(buf, title_x + 80, title_y + 22, "One record, quay to gate.",
              C_NEON, letter_w=8, letter_h=11, gap=1)

# Eyebrow
draw_wordmark(buf, title_x, title_y + 52, "OCEAN · INTERACTIVE DEMO · EGYPT",
              (34, 211, 238), letter_w=5, letter_h=7, gap=1)

# Divider line
line_aa(buf, title_x, title_y + 66, title_x + 880, title_y + 66,
         C_NEON_SKY[0], C_NEON_SKY[1], C_NEON_SKY[2], 65)

# Subtitle
draw_wordmark(buf, title_x, title_y + 84,
              "Five Egyptian gateways · Predictive ETA · Vessel AIS · Cold-chain · ACID & B/L stitching · Tamper-evident record",
              C_TEXT_DIM, letter_w=5, letter_h=7, gap=1)

# Bottom source bar
draw_wordmark(buf, title_x, 758,
              "SRC: YASLOGIST OCEAN · SCENARIO DEMO · ILLUSTRATIVE MODEL",
              (120, 180, 215), letter_w=5, letter_h=7, gap=1)
draw_wordmark(buf, W - 160, 758,
              "5 GATEWAYS · 5 ENGINES · 1 RECORD",
              (120, 180, 215), letter_w=5, letter_h=7, gap=1)

# YASLOGIST wordmark beside the mark
draw_wordmark(buf, mark_cx, mark_cy + 42, "YASLOGIST",
              C_NEON, letter_w=9, letter_h=12, gap=2)

# Corner frame accents (top-left)
line_aa(buf, 12, 12, 12, 80, C_NEON[0], C_NEON[1], C_NEON[2], 80)
line_aa(buf, 12, 12, 80, 12, C_NEON[0], C_NEON[1], C_NEON[2], 80)
# top-right
line_aa(buf, 1908, 12, 1908, 80, C_NEON[0], C_NEON[1], C_NEON[2], 80)
line_aa(buf, 1908, 12, 1840, 12, C_NEON[0], C_NEON[1], C_NEON[2], 80)
# bottom-left
line_aa(buf, 12, 708, 12, 640, C_NEON[0], C_NEON[1], C_NEON[2], 110)
line_aa(buf, 12, 708, 80, 708, C_NEON[0], C_NEON[1], C_NEON[2], 110)

# Top/bottom border light strips
for x in range(W):
    i = (0 * W + x) * 3
    a = 0.20
    if x < W * 0.20 or x > W * 0.80:
        a = 0.05
    elif x < W * 0.80 and x > W * 0.20:
        a = 0.25
    buf[i]   = int(buf[i]   * (1-a) + C_NEON[0]   * a)
    buf[i+1] = int(buf[i+1] * (1-a) + C_NEON[1]   * a)
    buf[i+2] = int(buf[i+2] * (1-a) + C_NEON[2]   * a)
    i_bot = ((H-1) * W + x) * 3
    buf[i_bot]   = int(buf[i_bot]   * (1-a*0.7) + C_NEON[0]   * a * 0.7)
    buf[i_bot+1] = int(buf[i_bot+1] * (1-a*0.7) + C_NEON[1]   * a * 0.7)
    buf[i_bot+2] = int(buf[i_bot+2] * (1-a*0.7) + C_NEON[2]   * a * 0.7)

# Right-side ambient glow
for x in range(W):
    if x > 1660:
        t = (x - 1660) / 260.0
        a = t * 0.06
        for y in range(H):
            i = (y * W + x) * 3
            buf[i]   = int(buf[i]   * (1-a) + C_NEON_SKY[0] * a)
            buf[i+1] = int(buf[i+1] * (1-a) + C_NEON_SKY[1] * a)
            buf[i+2] = int(buf[i+2] * (1-a) + C_NEON_SKY[2] * a)

# ── Write PNG ───────────────────────────────────────────────────────────────
print("Encoding PNG …")

def make_chunk(chunk_type: bytes, data: bytes):
    chunk = chunk_type + data
    crc = struct.pack(">I", zlib.crc32(chunk) & 0xFFFFFFFF)
    return struct.pack(">I", len(data)) + chunk + crc

def rgba_to_rgb(buf_rgba, w, h):
    """Strip alpha — just return RGB bytes."""
    return buf_rgba[:w*h*3]

def compress_idat(rgb_bytes, w, h):
    """Pack RGB bytes into PNG scanlines with filter byte 0 (none)."""
    raw = bytearray()
    for y in range(h):
        raw.append(0)  # filter: none
        start = y * w * 3
        raw.extend(rgb_bytes[start:start + w * 3])
    return zlib.compress(bytes(raw), 9)

# IHDR
ihdr_data = struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0)  # 8-bit RGB, no interlacing
ihdr = make_chunk(b"IHDR", ihdr_data)

# IDAT
idat = make_chunk(b"IDAT", compress_idat(buf, W, H))

# IEND
iend = make_chunk(b"IEND", b"")

png_bytes = b"\x89PNG\r\n\x1a\n" + ihdr + idat + iend

with open(OUT, "wb") as f:
    f.write(png_bytes)

fsize = os.path.getsize(OUT)
print(f"Poster written: {OUT}  ({fsize / 1024:.1f} KB)")
print("Done.")
