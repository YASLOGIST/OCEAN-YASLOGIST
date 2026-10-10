#!/usr/bin/env python3
"""Render the README-only YASLOGIST Ocean visual system.

Outputs (all local to this directory):
  yaslogist-hero.gif             1920x720, 9.6-second, 12.5 fps seamless loop
  yaslogist-hero.png             matching 1920x720 poster
  yaslogist-signal-divider.gif   restrained kinetic section divider
  yaslogist-signature.gif        animated YASLOGIST closing signature

The artwork is original and schematic. It depicts the repository's Egyptian
port-scenario / reference-stitching concepts; it is not live vessel telemetry,
a live map, or an operational shipment feed. Regeneration requires Pillow and
DejaVu Sans fonts. No application dependency or runtime asset is changed.
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).resolve().parent
W, H = 1920, 720
FPS = 12.5  # GIF delays are 10 ms units; 120 × 80 ms = 9.6 seconds.
HERO_FRAMES = 120
HERO_DURATION_MS = round(1000 / FPS)

# The official current YL monogram is drawn with the exact paths in
# src/components/Brand.tsx (the retired globe-line mark is intentionally not used).
INK = (3, 9, 16)
DEEP = (5, 14, 23)
PANEL = (7, 19, 30)
PANEL_LIFT = (10, 29, 42)
GRID = (52, 92, 109)
GRID_DIM = (36, 70, 86)
ICE = (226, 241, 241)
MIST = (153, 183, 192)
MUTED = (109, 143, 156)
CYAN = (81, 220, 233)
CYAN_BRIGHT = (121, 239, 246)
BLUE = (63, 157, 197)
SEA = (14, 54, 70)
LAND = (11, 31, 37)

FONT_DIRS = (
    Path("/usr/share/fonts/truetype/dejavu"),
    Path("/usr/local/share/fonts"),
)


def font(size: int, *, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    name = "DejaVuSansMono-Bold.ttf" if mono and bold else \
        "DejaVuSansMono.ttf" if mono else \
        "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    for directory in FONT_DIRS:
        candidate = directory / name
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.truetype(name, size=size)


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    t = max(0.0, min(1.0, t))
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def tracked_width(text: str, face: ImageFont.FreeTypeFont, tracking: float) -> float:
    if not text:
        return 0.0
    return sum(face.getlength(ch) for ch in text) + tracking * (len(text) - 1)


def tracked_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    text: str,
    face: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int] | tuple[int, int, int, int],
    tracking: float = 0,
    *,
    align: str = "left",
    stroke_width: int = 0,
    stroke_fill: tuple[int, int, int] | tuple[int, int, int, int] | None = None,
) -> None:
    x, y = xy
    width = tracked_width(text, face, tracking)
    if align == "center":
        x -= width / 2
    elif align == "right":
        x -= width
    for char in text:
        draw.text(
            (round(x), round(y)), char, font=face, fill=fill,
            stroke_width=stroke_width, stroke_fill=stroke_fill,
        )
        x += face.getlength(char) + tracking


def composite_layer(base: Image.Image, painter) -> Image.Image:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    painter(ImageDraw.Draw(layer, "RGBA"))
    base.alpha_composite(layer)
    return base


def polyline(draw: ImageDraw.ImageDraw, points, fill, width=1, joint="curve") -> None:
    if len(points) > 1:
        draw.line([(round(x), round(y)) for x, y in points], fill=fill, width=width, joint=joint)


def bezier(p0, p1, p2, p3, steps=36):
    result = []
    for i in range(steps + 1):
        t = i / steps
        u = 1 - t
        x = u**3 * p0[0] + 3 * u**2 * t * p1[0] + 3 * u * t**2 * p2[0] + t**3 * p3[0]
        y = u**3 * p0[1] + 3 * u**2 * t * p1[1] + 3 * u * t**2 * p2[1] + t**3 * p3[1]
        result.append((x, y))
    return result


def route_geometry():
    segments = [
        ((1112, 482), (1095, 450), (1070, 415), (1064, 377)),
        ((1064, 377), (1058, 338), (1045, 302), (1054, 265)),
        ((1054, 265), (1062, 229), (1040, 199), (1028, 172)),
    ]
    points = []
    for segment in segments:
        curve = bezier(*segment)
        points.extend(curve if not points else curve[1:])
    return points


def point_on_path(points, progress: float):
    progress = max(0.0, min(1.0, progress))
    lengths = []
    total = 0.0
    for a, b in zip(points, points[1:]):
        length = math.hypot(b[0] - a[0], b[1] - a[1])
        lengths.append(length)
        total += length
    target = progress * total
    travelled = 0.0
    for i, length in enumerate(lengths):
        if travelled + length >= target or i == len(lengths) - 1:
            local = 0 if length == 0 else (target - travelled) / length
            a, b = points[i], points[i + 1]
            return (a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local)
        travelled += length
    return points[-1]


def dashed_path(draw: ImageDraw.ImageDraw, points, color, width=1, dash=7, gap=9):
    for a, b in zip(points, points[1:]):
        dx, dy = b[0] - a[0], b[1] - a[1]
        length = math.hypot(dx, dy)
        if length <= 0:
            continue
        position = 0.0
        while position < length:
            end = min(length, position + dash)
            p0 = (a[0] + dx * position / length, a[1] + dy * position / length)
            p1 = (a[0] + dx * end / length, a[1] + dy * end / length)
            draw.line((p0, p1), fill=color, width=width)
            position += dash + gap


def make_background() -> Image.Image:
    base = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    d = ImageDraw.Draw(base)
    for y in range(H):
        p = y / (H - 1)
        c = mix((7, 19, 30), (3, 8, 15), p)
        d.line((0, y, W, y), fill=(*c, 255))

    haze = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    hd = ImageDraw.Draw(haze)
    hd.ellipse((470, -185, 1435, 745), fill=(18, 74, 91, 62))
    hd.ellipse((695, 34, 1400, 635), fill=(20, 93, 108, 31))
    hd.ellipse((1060, 40, 1550, 520), fill=(16, 91, 122, 23))
    haze = haze.filter(ImageFilter.GaussianBlur(115))
    base.alpha_composite(haze)

    # A quiet edge vignette keeps the title and instrument field in the same world.
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    vd.rectangle((0, 0, W, 34), fill=(0, 3, 8, 55))
    vd.rectangle((0, H - 30, W, H), fill=(0, 3, 8, 70))
    vd.rectangle((0, 0, 26, H), fill=(0, 3, 8, 45))
    vd.rectangle((W - 26, 0, W, H), fill=(0, 3, 8, 45))
    vignette = vignette.filter(ImageFilter.GaussianBlur(32))
    base.alpha_composite(vignette)
    return base


def draw_brand_glyph(draw: ImageDraw.ImageDraw, cx: float, cy: float, diameter: float, color, alpha=245):
    # Canonical YL-in-circle geometry, transcribed from Brand.tsx exactly.
    scale = diameter / 64
    line_color = (*color, alpha)
    ring = 29 * scale
    draw.ellipse(
        (cx - ring, cy - ring, cx + ring, cy + ring),
        outline=line_color, width=max(1, round(2.2 * scale)),
    )
    w = max(1, round(5 * scale))
    paths = [
        [(16, 16), (27.5, 31.5), (27.5, 49)],
        [(39, 16), (30, 28)],
        [(40.5, 20), (40.5, 48), (53, 48)],
    ]
    for path in paths:
        polyline(draw, [(cx + (x - 32) * scale, cy + (y - 32) * scale) for x, y in path], line_color, w)


def draw_port(draw: ImageDraw.ImageDraw, name: str, point, label, *, anchor="left", prominent=False):
    x, y = point
    lx, ly = label
    radius = 5 if prominent else 4
    # Fine leader, low enough to retain the map's negative space.
    label_end = lx - 8 if lx > x else lx + 8
    if abs(lx - x) + abs(ly - y) > 36:
        draw.line((x, y, label_end, ly + 8), fill=(74, 142, 158, 145), width=1)
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(*CYAN_BRIGHT, 255))
    draw.ellipse((x - radius - 4, y - radius - 4, x + radius + 4, y + radius + 4), outline=(77, 205, 219, 115), width=1)
    face = font(15 if prominent else 14, mono=True, bold=True)
    tracked_text(
        draw, (lx, ly), name, face,
        (*ICE, 255) if prominent else (*MIST, 255),
        tracking=0.9, align=anchor,
        stroke_width=2, stroke_fill=(*PANEL, 235),
    )


def make_static_scene() -> tuple[Image.Image, list[tuple[float, float]]]:
    base = make_background()

    def fixed(draw: ImageDraw.ImageDraw):
        # Outer registration marks: precise, architectural, and intentionally quiet.
        accent = (85, 205, 218, 122)
        for x, y, sx, sy in ((22, 24, 1, 1), (W - 22, 24, -1, 1), (22, H - 24, 1, -1), (W - 22, H - 24, -1, -1)):
            draw.line((x, y, x + 58 * sx, y), fill=accent, width=1)
            draw.line((x, y, x, y + 42 * sy), fill=accent, width=1)
        draw.line((80, 530, 1840, 530), fill=(49, 91, 108, 110), width=1)
        draw.line((590, 82, 590, 511), fill=(49, 91, 108, 90), width=1)
        draw.line((1465, 82, 1465, 511), fill=(49, 91, 108, 90), width=1)

        # LEFT: clear project identity; all copy remains fixed throughout the loop.
        draw.rounded_rectangle((88, 86, 98, 96), radius=3, fill=(*CYAN, 255))
        tracked_text(draw, (116, 79), "YASLOGIST  /  OCEAN SURFACE", font(17, mono=True, bold=True), (*MIST, 255), tracking=1.4)
        tracked_text(draw, (86, 116), "OCEAN", font(108, bold=True), (*ICE, 255), tracking=1.2)
        draw.line((91, 250, 215, 250), fill=(*CYAN, 230), width=3)
        draw.line((220, 250, 487, 250), fill=(53, 103, 121, 130), width=1)
        tracked_text(draw, (90, 280), "ONE SHIPMENT RECORD", font(30, bold=True), (*ICE, 255), tracking=0.25)
        tracked_text(draw, (90, 323), "QUAY  →  GATE", font(31, bold=True), (*CYAN_BRIGHT, 255), tracking=0.6)
        draw.text((92, 387), "Sea-freight scenarios across five", font=font(20), fill=(*MIST, 255))
        draw.text((92, 416), "Egyptian gateway ports.", font=font(20), fill=(*MIST, 255))

        # Provenance is explicit, not hidden in a tooltip.
        draw.rounded_rectangle((90, 465, 478, 504), radius=8, fill=(9, 30, 42, 230), outline=(54, 116, 132, 165), width=1)
        draw.ellipse((106, 480, 114, 488), fill=(*CYAN, 255))
        tracked_text(draw, (127, 473), "SCENARIO MODEL  ·  NOT LIVE DATA", font(14, mono=True, bold=True), (*ICE, 245), tracking=0.45)

        # MAP PANEL: schematic route field, not a live map or a claim of vessel positions.
        map_box = (615, 78, 1445, 514)
        draw.rounded_rectangle(map_box, radius=15, fill=(5, 15, 25, 155), outline=(56, 103, 122, 150), width=1)
        draw.rounded_rectangle((628, 91, 1432, 501), radius=11, outline=(37, 73, 91, 102), width=1)

        # Cartographic grid and long arcs establish depth without implying a coordinate feed.
        for x in range(660, 1435, 76):
            draw.line((x, 104, x, 493), fill=(50, 88, 105, 50), width=1)
        for y in range(120, 498, 54):
            draw.line((635, y, 1420, y), fill=(50, 88, 105, 50), width=1)
        draw.arc((790, 112, 1320, 600), 193, 345, fill=(54, 99, 115, 38), width=1)
        draw.arc((850, 78, 1380, 557), 196, 343, fill=(54, 99, 115, 34), width=1)
        draw.arc((663, 165, 1130, 570), 204, 338, fill=(54, 99, 115, 31), width=1)

        # Two understated shore masses frame a luminous, schematic Red Sea corridor.
        egypt = [(635, 220), (668, 180), (718, 162), (767, 168), (815, 189), (866, 187),
                 (906, 166), (955, 160), (1005, 172), (1035, 202), (1037, 240), (1021, 278),
                 (1041, 323), (1064, 366), (1083, 414), (1110, 478), (1110, 507), (635, 507)]
        arabia = [(1193, 185), (1229, 163), (1273, 169), (1324, 192), (1388, 220), (1430, 257),
                  (1430, 507), (1153, 507), (1164, 470), (1182, 423), (1202, 375), (1210, 333),
                  (1201, 293), (1172, 254), (1171, 220)]
        draw.polygon(egypt, fill=(11, 29, 35, 92))
        draw.polygon(arabia, fill=(10, 28, 35, 92))
        polyline(draw, [(668, 180), (718, 162), (767, 168), (815, 189), (866, 187), (906, 166), (955, 160), (1005, 172), (1035, 202)], (80, 137, 148, 112), 2)
        polyline(draw, [(1193, 185), (1229, 163), (1273, 169), (1324, 192), (1388, 220), (1430, 257)], (80, 137, 148, 96), 2)
        polyline(draw, [(1110, 478), (1083, 414), (1064, 366), (1041, 323), (1021, 278), (1037, 240)], (71, 121, 137, 80), 1)

        tracked_text(draw, (644, 96), "EGYPT  /  RED SEA CORRIDOR", font(14, mono=True, bold=True), (*CYAN, 245), tracking=1.1)
        tracked_text(draw, (1410, 96), "SCHEMATIC · NOT TO SCALE", font(12, mono=True), (*MUTED, 235), tracking=0.25, align="right")
        tracked_text(draw, (702, 123), "MEDITERRANEAN", font(13, mono=True), (126, 161, 173, 175), tracking=1.2)
        tracked_text(draw, (1155, 366), "RED SEA", font(15, mono=True, bold=True), (139, 182, 190, 208), tracking=1.0, align="center")
        tracked_text(draw, (1150, 461), "GULF OF SUEZ", font(12, mono=True), (120, 158, 170, 180), tracking=0.8, align="center")
        tracked_text(draw, (1091, 246), "SUEZ", font(12, mono=True, bold=True), (*ICE, 235), tracking=0.8)

        route = route_geometry()
        # The main corridor is intentionally schematic and stays dim beneath its moving signal.
        polyline(draw, route, (33, 123, 148, 150), 5)
        polyline(draw, route, (72, 177, 193, 155), 2)

        # Local scenario connections from the northbound corridor to the named Egyptian gateways.
        branches = [
            [(1028, 172), (978, 165), (914, 161), (858, 165), (760, 169)],
            [(1028, 172), (975, 170), (930, 169)],
            [(1028, 172), (1007, 172)],
            [(1060, 277), (1082, 294), (1094, 315)],
            [(1028, 172), (1016, 195), (1050, 226), (1057, 262)],
        ]
        for branch in branches:
            dashed_path(draw, branch, (66, 144, 162, 132), width=1, dash=8, gap=11)

        # Gateway labels and node positions mirror the five scenarios in the application.
        ports = [
            ("ALEXANDRIA", (760, 169), (665, 142), "left", False),
            ("EL DEKHEILA", (812, 184), (688, 208), "left", False),
            ("DAMIETTA", (930, 169), (890, 133), "left", False),
            ("EAST PORT SAID", (1028, 172), (1051, 143), "left", True),
            ("SOKHNA", (1094, 315), (1132, 298), "left", False),
        ]
        for name, point, label, align, prominent in ports:
            draw_port(draw, name, point, label, anchor=align, prominent=prominent)

        # Fine chart ticks and a north cue; no fabricated numeric telemetry.
        for i in range(8):
            x = 654 + i * 98
            draw.line((x, 490, x, 497 if i % 2 == 0 else 494), fill=(90, 139, 153, 105), width=1)
        draw.line((1388, 122, 1388, 154), fill=(92, 144, 158, 160), width=1)
        draw.polygon([(1388, 112), (1383, 124), (1393, 124)], fill=(107, 175, 188, 190))
        tracked_text(draw, (1388, 158), "N", font(12, mono=True, bold=True), (*MIST, 220), tracking=0, align="center")

        # RIGHT: permanent parent identity. The glyph follows the in-repo canonical mark.
        draw.rounded_rectangle((1485, 78, 1834, 514), radius=15, fill=(5, 15, 25, 145), outline=(56, 103, 122, 142), width=1)
        draw.rounded_rectangle((1500, 93, 1819, 499), radius=11, outline=(37, 73, 91, 92), width=1)
        tracked_text(draw, (1659, 121), "PARENT ENGINEERING IDENTITY", font(12, mono=True, bold=True), (*MUTED, 240), tracking=0.55, align="center")
        draw_brand_glyph(draw, 1659, 226, 108, CYAN_BRIGHT, 248)
        tracked_text(draw, (1659, 315), "YASLOGIST", font(31, bold=True), (*ICE, 255), tracking=3.0, align="center")
        draw.line((1547, 347, 1771, 347), fill=(65, 117, 134, 165), width=1)
        tracked_text(draw, (1659, 372), "OCEAN  ·  LAND  ·  AIR", font(14, mono=True, bold=True), (*CYAN, 245), tracking=0.9, align="center")
        tracked_text(draw, (1659, 403), "ONE CONNECTED PLATFORM", font(12, mono=True), (*MIST, 215), tracking=0.65, align="center")
        draw.ellipse((1649, 450, 1669, 470), outline=(63, 134, 151, 145), width=1)
        draw.ellipse((1655, 456, 1663, 464), fill=(*CYAN, 235))
        tracked_text(draw, (1659, 475), "ENGINEERED BY YASLOGIST", font(11, mono=True), (*MUTED, 215), tracking=0.45, align="center")

        # LOWER TRACE: representative references converge into one record.
        tracked_text(draw, (88, 543), "REFERENCE TRACE  /  SCENARIO", font(13, mono=True, bold=True), (*MIST, 235), tracking=0.9)
        draw.line((88, 570, 1832, 570), fill=(48, 91, 108, 100), width=1)
        labels = ["BOOKING", "B / L", "CONTAINER", "ACID", "GATE PASS", "TRUCK PLATE"]
        start_x, chip_y, chip_w, chip_h, gap = 88, 591, 142, 61, 18
        chip_centers = []
        for index, label in enumerate(labels):
            x = start_x + index * (chip_w + gap)
            draw.rounded_rectangle((x, chip_y, x + chip_w, chip_y + chip_h), radius=8,
                                   fill=(7, 21, 32, 230), outline=(48, 92, 108, 150), width=1)
            draw.ellipse((x + 13, chip_y + 25, x + 19, chip_y + 31), fill=(*CYAN, 225))
            tracked_text(draw, (x + 29, chip_y + 21), label, font(13, mono=True, bold=True), (*ICE, 238), tracking=0.25)
            chip_centers.append((x + chip_w, chip_y + chip_h / 2))
            if index < len(labels) - 1:
                midx = x + chip_w + gap / 2
                draw.line((x + chip_w + 2, chip_y + chip_h / 2, x + chip_w + gap - 5, chip_y + chip_h / 2),
                          fill=(70, 126, 143, 150), width=1)
                draw.line((midx + 2, chip_y + chip_h / 2 - 3, midx + 5, chip_y + chip_h / 2,
                           midx + 2, chip_y + chip_h / 2 + 3), fill=(82, 157, 172, 180), width=1)

        output_x = 1088
        draw.line((1035, 621, output_x, 621), fill=(67, 119, 137, 160), width=1)
        draw.rounded_rectangle((output_x, 585, 1832, 661), radius=10,
                               fill=(8, 29, 40, 242), outline=(68, 153, 169, 188), width=1)
        draw.line((output_x + 16, 598, output_x + 16, 648), fill=(*CYAN, 235), width=2)
        tracked_text(draw, (output_x + 38, 597), "ONE SHIPMENT RECORD", font(19, bold=True), (*ICE, 255), tracking=0.35)
        tracked_text(draw, (output_x + 39, 628), "SEA → PORT → ROAD  /  MODELLED HANDOFF", font(12, mono=True), (*MIST, 228), tracking=0.45)

    composite_layer(base, fixed)
    return base, route_geometry()


BASE_SCENE, ROUTE = make_static_scene()


def alpha_fade(progress: float) -> float:
    # Fade moving markers invisibly at the open ends of the route for a clean wrap.
    edge = min(progress, 1 - progress)
    return min(1.0, max(0.0, edge / 0.12))


def paint_signal(draw: ImageDraw.ImageDraw, point, color, strength: float, trail=()) -> None:
    x, y = point
    for index, (tx, ty) in enumerate(trail):
        a = max(0, round(125 * strength * (1 - (index + 1) / (len(trail) + 1))))
        r = max(1, 5 - index // 3)
        draw.ellipse((tx - r, ty - r, tx + r, ty + r), fill=(*color, a))
    draw.ellipse((x - 11, y - 11, x + 11, y + 11), fill=(*color, round(30 * strength)))
    draw.ellipse((x - 5, y - 5, x + 5, y + 5), fill=(*color, round(150 * strength)))
    draw.ellipse((x - 2, y - 2, x + 2, y + 2), fill=(*ICE, round(255 * strength)))


def render_hero_frame(progress: float) -> Image.Image:
    frame = BASE_SCENE.copy()
    motion = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(motion, "RGBA")
    phase = math.tau * progress

    # The scan is a slow, bounded pass through the route field; the sine join is seamless.
    scan_y = 302 + 114 * math.sin(phase - math.pi / 2)
    d.line((630, round(scan_y), 1430, round(scan_y)), fill=(83, 212, 221, 24), width=1)
    d.line((630, round(scan_y) - 2, 1430, round(scan_y) - 2), fill=(83, 212, 221, 8), width=1)

    # A restrained atmospheric bloom breathes behind the exact, stationary YASLOGIST signature.
    breath = (math.sin(phase) + 1) / 2
    halo_alpha = round(10 + 9 * breath)
    d.ellipse((1589, 156, 1729, 296), fill=(26, 162, 180, halo_alpha))

    # Port rings expand and dissolve in a shared clock, tying each gateway to the route.
    nodes = [(760, 169), (812, 184), (930, 169), (1028, 172), (1094, 315)]
    for i, (x, y) in enumerate(nodes):
        phase = math.tau * (progress + i * 0.173)
        pulse = (1 - math.cos(phase)) / 2
        radius = 9 + 24 * pulse
        alpha = round(18 + 48 * (1 - pulse))
        d.ellipse((x - radius, y - radius, x + radius, y + radius), outline=(87, 222, 232, alpha), width=2)

    # Two signal packets travel north through the schematic Red Sea/Suez path.
    for offset, color in ((0.02, CYAN_BRIGHT), (0.52, BLUE)):
        p = (progress + offset) % 1.0
        strength = alpha_fade(p)
        point = point_on_path(ROUTE, p)
        trail = [point_on_path(ROUTE, max(0, p - step * 0.013)) for step in range(1, 7)]
        paint_signal(d, point, color, strength, trail)

    # A small light pulse passes from the sample reference set toward the one-record card.
    p = (progress + 0.06) % 1.0
    strength = alpha_fade(p)
    x = 1016 + p * 72
    y = 621
    d.ellipse((x - 10, y - 10, x + 10, y + 10), fill=(64, 200, 216, round(22 * strength)))
    d.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(*CYAN_BRIGHT, round(190 * strength)))

    frame.alpha_composite(motion)
    return frame.convert("RGB")


def make_palette(frames: list[Image.Image], colors=256):
    # A representative contact strip yields one stable palette for every frame,
    # avoiding per-frame palette shimmer in the smooth dark gradients.
    count = min(12, len(frames))
    indices = sorted({round(i * (len(frames) - 1) / max(1, count - 1)) for i in range(count)})
    thumbs = [frames[i].resize((480, 180), Image.Resampling.LANCZOS) for i in indices]
    rows = math.ceil(len(thumbs) / 4)
    sheet = Image.new("RGB", (480 * 4, 180 * rows))
    for index, thumb in enumerate(thumbs):
        sheet.paste(thumb, ((index % 4) * 480, (index // 4) * 180))
    return sheet.quantize(colors=colors, method=Image.Quantize.MEDIANCUT)


def save_gif(frames: list[Image.Image], path: Path, duration: int, loop=0):
    palette = make_palette(frames)
    indexed = [frame.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG) for frame in frames]
    indexed[0].save(
        path,
        save_all=True,
        append_images=indexed[1:],
        duration=duration,
        loop=loop,
        # Keep each delta over the previous frame. The background and typography
        # are immutable, so disposal=1 preserves detail while avoiding 120 full canvases.
        disposal=1,
        optimize=True,
    )


def render_divider_frame(progress: float, width=1280, height=32) -> Image.Image:
    frame = Image.new("RGBA", (width, height), (4, 12, 20, 255))
    d = ImageDraw.Draw(frame, "RGBA")
    y = height // 2
    d.line((24, y, width - 24, y), fill=(39, 83, 100, 170), width=1)
    for x in range(32, width - 24, 44):
        d.line((x, y - 4, x, y + 4), fill=(57, 107, 122, 132), width=1)
        d.ellipse((x - 1, y - 1, x + 1, y + 1), fill=(88, 158, 172, 155))

    # Three packets move on one rail, preserving a continuous, low-amplitude rhythm.
    for offset, color in ((0.0, CYAN_BRIGHT), (0.37, BLUE), (0.72, (66, 168, 187))):
        phase = math.tau * (progress + offset)
        # Sinusoidal travel returns to the same position and zero velocity at the loop seam.
        p = (1 - math.cos(phase)) / 2
        direction = 1 if math.sin(phase) >= 0 else -1
        fade = 0.78 + 0.22 * (0.5 + 0.5 * math.sin(phase))
        x = 24 + p * (width - 48)
        trail_strength = abs(math.sin(phase))
        for trail in range(1, 8):
            tx = x - direction * trail * 7
            if not 24 <= tx <= width - 24:
                continue
            alpha = round(100 * fade * trail_strength * (1 - trail / 8))
            d.ellipse((tx - 2, y - 2, tx + 2, y + 2), fill=(*color, alpha))
        d.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(*color, round(34 * fade)))
        d.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(*color, round(210 * fade)))
    return frame.convert("RGB")


def render_signature_frame(progress: float, width=720, height=160) -> Image.Image:
    # Opaque midnight backing keeps this small brand panel legible in both GitHub themes.
    frame = Image.new("RGBA", (width, height), (5, 15, 25, 255))
    d = ImageDraw.Draw(frame, "RGBA")
    d.rounded_rectangle((2, 2, width - 3, height - 3), radius=17, fill=(5, 15, 25, 255), outline=(48, 101, 120, 235), width=2)
    d.rounded_rectangle((10, 10, width - 11, height - 11), radius=12, outline=(31, 70, 86, 175), width=1)

    # Canonical mark and wordmark remain legible and fixed for the complete loop.
    breath = (math.sin(math.tau * progress) + 1) / 2
    draw_brand_glyph(d, 91, 80, 80, CYAN_BRIGHT, round(232 + 18 * breath))
    d.line((157, 36, 157, 124), fill=(55, 108, 126, 190), width=1)
    tracked_text(d, (192, 38), "YASLOGIST", font(35, bold=True), (*ICE, 255), tracking=3.1)
    tracked_text(d, (195, 91), "CREATIVE ENGINEERING SIGNATURE", font(13, mono=True), (*MIST, 245), tracking=1.25)

    # A travelling light traces the baseline but never crosses the wordmark.
    x = 194 + ((1 - math.cos(math.tau * progress)) / 2) * 440
    rail_y = 125
    d.line((193, rail_y, 638, rail_y), fill=(39, 81, 96, 160), width=1)
    d.ellipse((x - 19, rail_y - 8, x + 19, rail_y + 8), fill=(38, 158, 176, 33))
    d.ellipse((x - 4, rail_y - 4, x + 4, rail_y + 4), fill=(*CYAN, 225))
    return frame.convert("RGB")


def main():
    print("Rendering the 1920×720 YASLOGIST Ocean poster and 9.6-second hero loop …")
    hero = [render_hero_frame(i / HERO_FRAMES) for i in range(HERO_FRAMES)]
    poster = render_hero_frame(0.375)
    poster.save(OUT / "yaslogist-hero.png", format="PNG", optimize=True)
    save_gif(hero, OUT / "yaslogist-hero.gif", HERO_DURATION_MS)

    print("Rendering the supporting signal divider and closing signature …")
    divider_count = 80
    divider = [render_divider_frame(i / divider_count) for i in range(divider_count)]
    save_gif(divider, OUT / "yaslogist-signal-divider.gif", 83)

    signature_count = 60
    signature = [render_signature_frame(i / signature_count) for i in range(signature_count)]
    save_gif(signature, OUT / "yaslogist-signature.gif", 83)

    for name in ("yaslogist-hero.gif", "yaslogist-hero.png", "yaslogist-signal-divider.gif", "yaslogist-signature.gif"):
        item = OUT / name
        print(f"  {name}: {item.stat().st_size / 1024:.1f} KiB")
    print("Done. The hero loop and all supporting motion are pre-rendered image assets.")


if __name__ == "__main__":
    main()
