#!/usr/bin/env python3
"""Deterministic helpers for the T=64 asset-bogen pipeline.

Subcommands:
  inspect   <image> [image...]
  cut-rect  <src> <x> <y> <w> <h> <dst>
  scale-pad <src> <faktor> <tiles_x> <tiles_y> <dst> [--align bottom-center] [--pad-margin N]
  matte     <src> <dst> --color R,G,B [--fuzz 4]
  zip       <project_dir> <zip_path>
  atlas     <catalog.json> <out_dir> [--assets-dir DIR] [--columns 8]
"""

from __future__ import annotations

import argparse
import json
import sys
import zipfile
from pathlib import Path

import shutil
import xml.etree.ElementTree as ET

from PIL import Image


T = 64


def _open(path: Path) -> Image.Image:
    im = Image.open(path)
    im.load()
    return im


def inspect(paths: list[Path]) -> None:
    rows = []
    for path in paths:
        im = _open(path)
        mode = im.mode
        w, h = im.size
        bands = im.getbands()
        has_alpha = "A" in bands
        extrema = None
        opaque_ratio = None
        bg_guess = "unknown"
        if has_alpha:
            alpha = im.getchannel("A")
            extrema = alpha.getextrema()
            hist = alpha.histogram()
            opaque = sum(hist[250:])
            total = w * h
            opaque_ratio = round(opaque / total, 4) if total else 0
            if extrema[0] == 255:
                bg_guess = "opaque"
            elif extrema[1] == 0:
                bg_guess = "fully-transparent"
            else:
                bg_guess = "transparent"
        else:
            bg_guess = "opaque-no-alpha"
            rgb = im.convert("RGB")
            corners = [
                rgb.getpixel((0, 0)),
                rgb.getpixel((w - 1, 0)),
                rgb.getpixel((0, h - 1)),
                rgb.getpixel((w - 1, h - 1)),
            ]
            if len(set(corners)) == 1:
                bg_guess = f"solid-corners-{corners[0]}"
        rows.append(
            {
                "file": str(path),
                "format": im.format,
                "mode": mode,
                "width": w,
                "height": h,
                "has_alpha": has_alpha,
                "alpha_extrema": extrema,
                "opaque_ratio": opaque_ratio,
                "background_guess": bg_guess,
                "bytes": path.stat().st_size if path.exists() else None,
                "tile_fit": {
                    "div64_w": w % T == 0,
                    "div64_h": h % T == 0,
                    "tiles": [w // T, h // T] if w % T == 0 and h % T == 0 else None,
                },
            }
        )
    json.dump(rows if len(rows) != 1 else rows[0], sys.stdout, indent=2)
    sys.stdout.write("\n")


def cut_rect(src: Path, x: int, y: int, w: int, h: int, dst: Path) -> None:
    im = _open(src)
    box = (x, y, x + w, y + h)
    if box[2] > im.width or box[3] > im.height or x < 0 or y < 0:
        raise SystemExit(
            f"cut-rect out of bounds: box={box} image={im.width}x{im.height}"
        )
    crop = im.crop(box)
    dst.parent.mkdir(parents=True, exist_ok=True)
    crop.save(dst, format="PNG", optimize=True)
    print(f"cut-rect {dst} {crop.size[0]}x{crop.size[1]}")


def scale_pad(
    src: Path,
    faktor: float,
    tiles_x: int,
    tiles_y: int,
    dst: Path,
    align: str = "bottom-center",
    pad_margin: int = 0,
) -> None:
    if faktor <= 0:
        raise SystemExit("faktor must be > 0")
    if tiles_x < 1 or tiles_y < 1:
        raise SystemExit("tiles must be >= 1")
    im = _open(src).convert("RGBA")
    new_w = max(1, round(im.width * faktor))
    new_h = max(1, round(im.height * faktor))
    scaled = im.resize((new_w, new_h), resample=Image.Resampling.LANCZOS)
    canvas_w = tiles_x * T
    canvas_h = tiles_y * T
    if new_w + 2 * pad_margin > canvas_w or new_h + 2 * pad_margin > canvas_h:
        raise SystemExit(
            f"scaled {new_w}x{new_h} + margin {pad_margin} does not fit {canvas_w}x{canvas_h}"
        )
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    if align == "bottom-center":
        x = (canvas_w - new_w) // 2
        y = canvas_h - new_h - pad_margin
        if y < pad_margin:
            y = pad_margin
    elif align == "center":
        x = (canvas_w - new_w) // 2
        y = (canvas_h - new_h) // 2
    elif align == "top-left":
        x = pad_margin
        y = pad_margin
    else:
        raise SystemExit(f"unknown align: {align}")
    canvas.alpha_composite(scaled, (x, y))
    dst.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dst, format="PNG", optimize=True)
    print(f"scale-pad {dst} src={im.size} scaled={new_w}x{new_h} canvas={canvas_w}x{canvas_h} xy={x},{y}")


def matte(src: Path, dst: Path, color: tuple[int, int, int], fuzz: int) -> None:
    im = _open(src).convert("RGBA")
    px = im.load()
    w, h = im.size
    cr, cg, cb = color
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if abs(r - cr) <= fuzz and abs(g - cg) <= fuzz and abs(b - cb) <= fuzz:
                px[x, y] = (r, g, b, 0)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, format="PNG", optimize=True)
    print(f"matte {dst} color={color} fuzz={fuzz}")


def _xml_escape(s: str) -> str:
    return (
        s.replace("&", "&")
        .replace("<", "<")
        .replace(">", ">")
        .replace('"', """)
    )


def _find_png(assets_dir: Path | None, stem: str) -> Path | None:
    if assets_dir is None or not assets_dir.exists():
        return None
    direct = assets_dir / f"{stem}.png"
    if direct.is_file():
        return direct
    matches = list(assets_dir.rglob(f"{stem}.png"))
    return matches[0] if matches else None


def _prop(parent: ET.Element, name: str, value, typ: str | None = None) -> None:
    if value is None:
        return
    el = ET.SubElement(parent, "property")
    el.set("name", name)
    if typ:
        el.set("type", typ)
    el.set("value", str(value))


def _collision_box(item: dict) -> tuple[int, int, int, int] | None:
    stand_b = int(item.get("stand_b") or 0)
    stand_s = int(item.get("stand_s") or 0)
    if stand_b <= 0 or stand_s <= 0:
        return None
    w = stand_b * T
    h = stand_s * T
    img_w = int(item["px_w"])
    img_h = int(item["px_h"])
    x = (img_w - w) // 2
    y = img_h - h
    return x, y, w, h


def write_objekte_tsx(items: list[dict], out_dir: Path, image_rel: str = "images") -> Path:
    objekte = [it for it in items if it.get("rolle") in ("objekt", "overlay")]
    max_w = max((int(it["px_w"]) for it in objekte), default=T)
    max_h = max((int(it["px_h"]) for it in objekte), default=T)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        (
            f'<tileset version="1.10" tiledversion="1.10.2" name="kachel_leiste_objekte" '
            f'tilewidth="{max_w}" tileheight="{max_h}" tilecount="{len(objekte)}" '
            f'columns="0" objectalignment="bottom">'
        ),
        ' <grid orientation="orthogonal" width="1" height="1"/>',
    ]
    for local_id, it in enumerate(objekte):
        stem = it["datei"]
        w, h = int(it["px_w"]), int(it["px_h"])
        src = f"{image_rel}/{stem}.png"
        lines.append(f' <tile id="{local_id}">')
        lines.append("  <properties>")
        lines.append(f'   <property name="id" value="{_xml_escape(it["id"])}"/>')
        lines.append(f'   <property name="datei" value="{_xml_escape(stem)}"/>')
        lines.append(f'   <property name="rolle" value="{_xml_escape(it.get("rolle", ""))}"/>')
        lines.append(f'   <property name="pivot_px" type="int" value="{it["pivot_px"]}"/>')
        lines.append(f'   <property name="pivot_py" type="int" value="{it["pivot_py"]}"/>')
        lines.append(f'   <property name="stand_b" type="int" value="{it.get("stand_b") or 0}"/>')
        lines.append(f'   <property name="stand_s" type="int" value="{it.get("stand_s") or 0}"/>')
        if it.get("tuer_dx") is not None and it.get("tuer_dx") != "":
            lines.append(f'   <property name="tuer_dx" type="int" value="{it["tuer_dx"]}"/>')
        if it.get("tuer_dy") is not None and it.get("tuer_dy") != "":
            lines.append(f'   <property name="tuer_dy" type="int" value="{it["tuer_dy"]}"/>')
        lines.append('   <property name="objectalignment" value="bottom"/>')
        lines.append("  </properties>")
        lines.append(f'  <image source="{_xml_escape(src)}" width="{w}" height="{h}"/>')
        box = _collision_box(it)
        if box:
            x, y, bw, bh = box
            lines.append('  <objectgroup draworder="index">')
            lines.append(
                f'   <object id="1" name="stand" x="{x}" y="{y}" width="{bw}" height="{bh}"/>'
            )
            lines.append("  </objectgroup>")
        lines.append(" </tile>")
    lines.append("</tileset>")
    path = out_dir / "objekte_64.tsx"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def write_boden_tsx(items: list[dict], sheet_name: str, columns: int, rows: int, out_dir: Path) -> Path:
    kacheln = [it for it in items if it.get("rolle") == "kachel"]
    sheet_w = columns * T
    sheet_h = rows * T
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        (
            f'<tileset version="1.10" tiledversion="1.10.2" name="kachel_leiste_boden" '
            f'tilewidth="{T}" tileheight="{T}" tilecount="{len(kacheln)}" '
            f'columns="{columns}">'
        ),
        f' <image source="{sheet_name}" width="{sheet_w}" height="{sheet_h}"/>',
    ]
    for local_id, it in enumerate(kacheln):
        lines.append(f' <tile id="{local_id}">')
        lines.append("  <properties>")
        lines.append(f'   <property name="id" value="{_xml_escape(it["id"])}"/>')
        lines.append(f'   <property name="datei" value="{_xml_escape(it["datei"])}"/>')
        lines.append(f'   <property name="pivot_px" type="int" value="{it["pivot_px"]}"/>')
        lines.append(f'   <property name="stand_b" type="int" value="{it.get("stand_b") or 1}"/>')
        lines.append(f'   <property name="stand_s" type="int" value="{it.get("stand_s") or 1}"/>')
        lines.append("  </properties>")
        lines.append(" </tile>")
    lines.append("</tileset>")
    path = out_dir / "boden_64.tsx"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def write_sample_tmx(out_dir: Path, map_w: int = 16, map_h: int = 12) -> Path:
    text = f"""<?xml version="1.0" encoding="UTF-8"?>
<map version="1.10" tiledversion="1.10.2" orientation="orthogonal" renderorder="right-down"
     width="{map_w}" height="{map_h}" tilewidth="{T}" tileheight="{T}" infinite="0"
     nextlayerid="3" nextobjectid="2">
 <tileset firstgid="1" source="boden_64.tsx"/>
 <tileset firstgid="1001" source="objekte_64.tsx"/>
 <layer id="1" name="boden" width="{map_w}" height="{map_h}">
  <data encoding="csv">
{','.join(['0'] * map_w * map_h)}
  </data>
 </layer>
 <objectgroup id="2" name="bauten">
  <!-- Objektpunkt = Sued-Kante Mitte. tileset objectalignment=bottom -->
 </objectgroup>
</map>
"""
    path = out_dir / "leiste_vorlage.tmx"
    path.write_text(text, encoding="utf-8")
    return path


def pack_boden_sheet(kacheln: list[dict], assets_dir: Path | None, out_png: Path, columns: int) -> tuple[int, int]:
    n = len(kacheln)
    rows = max(1, (n + columns - 1) // columns)
    sheet = Image.new("RGBA", (columns * T, rows * T), (0, 0, 0, 0))
    for i, it in enumerate(kacheln):
        src = _find_png(assets_dir, it["datei"])
        col, row = i % columns, i // columns
        if src is None:
            continue
        im = _open(src).convert("RGBA")
        if im.size != (T, T):
            raise SystemExit(f"boden tile not {T}x{T}: {src} {im.size}")
        sheet.alpha_composite(im, (col * T, row * T))
    out_png.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_png, format="PNG", optimize=True)
    return columns, rows


def atlas(catalog_path: Path, out_dir: Path, assets_dir: Path | None, columns: int) -> None:
    data = json.loads(catalog_path.read_text(encoding="utf-8"))
    items = data["items"] if isinstance(data, dict) else data
    out_dir.mkdir(parents=True, exist_ok=True)
    img_dir = out_dir / "images"
    img_dir.mkdir(exist_ok=True)

    copied = 0
    missing = []
    for it in items:
        src = _find_png(assets_dir, it["datei"])
        dst = img_dir / f"{it['datei']}.png"
        if src is None:
            missing.append(it["datei"])
            continue
        shutil.copy2(src, dst)
        copied += 1

    kacheln = [it for it in items if it.get("rolle") == "kachel"]
    cols, rows = pack_boden_sheet(kacheln, assets_dir, out_dir / "boden_64.png", columns)
    write_boden_tsx(kacheln, "boden_64.png", cols, rows, out_dir)
    write_objekte_tsx(items, out_dir)
    write_sample_tmx(out_dir)

    atlas_json = {
        "meta": {
            "t": T,
            "objectalignment": "bottom",
            "origin": {"x": 0.5, "y": 1.0},
            "copied": copied,
            "missing": missing,
        },
        "tilesets": {
            "boden": "boden_64.tsx",
            "objekte": "objekte_64.tsx",
        },
        "items": items,
    }
    (out_dir / "atlas.json").write_text(
        json.dumps(atlas_json, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(
        f"atlas {out_dir} copied={copied} missing={len(missing)} "
        f"boden={len(kacheln)} objekte={sum(1 for it in items if it.get('rolle') != 'kachel')}"
    )


def zip_project(project_dir: Path, zip_path: Path) -> None:
    if not project_dir.is_dir():
        raise SystemExit(f"not a directory: {project_dir}")
    zip_path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(project_dir.rglob("*")):
            if p.is_file():
                zf.write(p, p.relative_to(project_dir.parent))
                count += 1
    print(f"zip {zip_path} files={count}")


def parse_color(s: str) -> tuple[int, int, int]:
    parts = [int(x) for x in s.split(",")]
    if len(parts) != 3:
        raise argparse.ArgumentTypeError("color must be R,G,B")
    for v in parts:
        if v < 0 or v > 255:
            raise argparse.ArgumentTypeError("color channel 0-255")
    return parts[0], parts[1], parts[2]


def main() -> None:
    parser = argparse.ArgumentParser(description="T=64 asset pipeline helpers")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_ins = sub.add_parser("inspect")
    p_ins.add_argument("images", nargs="+", type=Path)

    p_cut = sub.add_parser("cut-rect")
    p_cut.add_argument("src", type=Path)
    p_cut.add_argument("x", type=int)
    p_cut.add_argument("y", type=int)
    p_cut.add_argument("w", type=int)
    p_cut.add_argument("h", type=int)
    p_cut.add_argument("dst", type=Path)

    p_sp = sub.add_parser("scale-pad")
    p_sp.add_argument("src", type=Path)
    p_sp.add_argument("faktor", type=float)
    p_sp.add_argument("tiles_x", type=int)
    p_sp.add_argument("tiles_y", type=int)
    p_sp.add_argument("dst", type=Path)
    p_sp.add_argument("--align", default="bottom-center")
    p_sp.add_argument("--pad-margin", type=int, default=0)

    p_mat = sub.add_parser("matte")
    p_mat.add_argument("src", type=Path)
    p_mat.add_argument("dst", type=Path)
    p_mat.add_argument("--color", type=parse_color, required=True)
    p_mat.add_argument("--fuzz", type=int, default=4)

    p_zip = sub.add_parser("zip")
    p_zip.add_argument("project_dir", type=Path)
    p_zip.add_argument("zip_path", type=Path)

    p_atlas = sub.add_parser("atlas")
    p_atlas.add_argument("catalog", type=Path)
    p_atlas.add_argument("out_dir", type=Path)
    p_atlas.add_argument("--assets-dir", type=Path, default=None)
    p_atlas.add_argument("--columns", type=int, default=8)

    args = parser.parse_args()
    if args.cmd == "inspect":
        inspect(args.images)
    elif args.cmd == "cut-rect":
        cut_rect(args.src, args.x, args.y, args.w, args.h, args.dst)
    elif args.cmd == "scale-pad":
        scale_pad(
            args.src,
            args.faktor,
            args.tiles_x,
            args.tiles_y,
            args.dst,
            align=args.align,
            pad_margin=args.pad_margin,
        )
    elif args.cmd == "matte":
        matte(args.src, args.dst, args.color, args.fuzz)
    elif args.cmd == "zip":
        zip_project(args.project_dir, args.zip_path)
    elif args.cmd == "atlas":
        atlas(args.catalog, args.out_dir, args.assets_dir, args.columns)


if __name__ == "__main__":
    main()
