"""Brand the generated deck for people who keep editing it in PowerPoint.

pptxgenjs writes a stock Office theme, so this pass:
  * sets the theme palette to the deck colours, so PowerPoint's colour picker offers them first;
  * sets the theme fonts (Latin and East Asian) to Microsoft JhengHei, so new text boxes match;
  * maps the master to a dark scheme, so new text defaults to ivory instead of black;
  * gives the slide layouts their Chinese names in the 「新增投影片」 menu, zero insets and bulleted text areas;
  * removes the repeated paragraph properties pptxgenjs writes inside mixed-format paragraphs;
  * turns slide numbers on for new slides and links them to the layout placeholder.

Usage: python3 finalize.py deck.pptx
"""

import re
import sys
import zipfile
from pathlib import Path

FONT = "Microsoft JhengHei"

COLOR_SCHEME = (
    '<a:clrScheme name="BCT Dark">'
    '<a:dk1><a:srgbClr val="0A0D12"/></a:dk1>'
    '<a:lt1><a:srgbClr val="F4EDE3"/></a:lt1>'
    '<a:dk2><a:srgbClr val="131A24"/></a:dk2>'
    '<a:lt2><a:srgbClr val="9AA3AE"/></a:lt2>'
    '<a:accent1><a:srgbClr val="4D9DFF"/></a:accent1>'
    '<a:accent2><a:srgbClr val="9AB4D2"/></a:accent2>'
    '<a:accent3><a:srgbClr val="5A6470"/></a:accent3>'
    '<a:accent4><a:srgbClr val="1F3A5F"/></a:accent4>'
    '<a:accent5><a:srgbClr val="0F141B"/></a:accent5>'
    '<a:accent6><a:srgbClr val="F4EDE3"/></a:accent6>'
    '<a:hlink><a:srgbClr val="4D9DFF"/></a:hlink>'
    '<a:folHlink><a:srgbClr val="9AA3AE"/></a:folHlink>'
    "</a:clrScheme>"
)

DARK_CLRMAP = (
    '<p:clrMap bg1="dk1" tx1="lt1" bg2="dk2" tx2="lt2" accent1="accent1" accent2="accent2" '
    'accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" '
    'hlink="hlink" folHlink="folHlink"/>'
)

LAYOUT_NAMES = {
    "COVER": "封面",
    "CONTENT": "內容頁",
    "CONTENT_TEXT": "內容頁（含文字區）",
    "CLOSING": "結尾",
    "DEFAULT": "空白",
}


def brand_theme(xml: str) -> str:
    xml, n = re.subn(r"<a:clrScheme\b.*?</a:clrScheme>", COLOR_SCHEME, xml, count=1, flags=re.S)
    assert n == 1, "theme has no colour scheme"
    xml = re.sub(
        r'<a:latin typeface="[^"]*"( panose="[^"]*")?/>',
        f'<a:latin typeface="{FONT}"/>',
        xml,
    )
    xml = xml.replace('<a:ea typeface=""/>', f'<a:ea typeface="{FONT}"/>')
    xml = re.sub(r'<a:font script="Hant" typeface="[^"]*"/>', f'<a:font script="Hant" typeface="{FONT}"/>', xml)
    return xml.replace('name="Office Theme"', 'name="BCT Dark"', 1)


def darken_master(xml: str) -> str:
    xml, n = re.subn(r"<p:clrMap\b[^>]*/>", DARK_CLRMAP, xml, count=1)
    assert n == 1, "master has no colour map"
    # Let PowerPoint carry the page number onto slides added from a layout.
    return xml.replace('<p:hf sldNum="0"', '<p:hf sldNum="1"', 1)


def link_slide_number(xml: str) -> str:
    # pptxgenjs gives slide-number placeholders idx 0xFFFFFFFF, which never links slide to layout.
    return xml.replace('type="sldNum" sz="quarter" idx="4294967295"', 'type="sldNum" sz="quarter" idx="12"')


def drop_stray_paragraph_props(xml: str) -> str:
    # pptxgenjs repeats <a:pPr> before later runs of a mixed-format paragraph; OOXML allows it only first.
    return re.sub(r"(?<=</a:r>)<a:pPr\b[^>]*?(?:/>|>(?:(?!</a:p>).)*?</a:pPr>)", "", xml, flags=re.S)


BODY_LEVELS = (
    '<a:lvl1pPr marL="228600" indent="-228600"><a:spcBef><a:spcPts val="900"/></a:spcBef>'
    '<a:buClr><a:srgbClr val="4D9DFF"/></a:buClr><a:buFont typeface="Arial"/><a:buChar char="&#8226;"/>'
)
BODY_LEVEL2 = (
    '<a:lvl2pPr marL="457200" indent="-228600"><a:spcBef><a:spcPts val="600"/></a:spcBef>'
    '<a:buClr><a:srgbClr val="5A6470"/></a:buClr><a:buFont typeface="Arial"/><a:buChar char="&#8211;"/>'
    '<a:defRPr sz="1400"><a:solidFill><a:srgbClr val="9AA3AE"/></a:solidFill></a:defRPr></a:lvl2pPr>'
)


def tune_placeholder(sp: str) -> str:
    ph = re.search(r"<p:ph\b[^>]*>", sp)
    if not ph:
        return sp
    kind = re.search(r'type="(\w+)"', ph.group(0))
    kind = kind.group(1) if kind else ""
    if kind not in ("title", "body"):
        return sp
    # Layout placeholders need the same zero insets the generated slides use, or new slides drift.
    anchor = "ctr" if kind == "title" else "t"
    def zero_insets(m: re.Match) -> str:
        attrs = re.sub(r' (?:[lrtb]Ins|anchor)="[^"]*"', "", m.group(1))
        return f'<a:bodyPr{attrs} lIns="0" tIns="0" rIns="0" bIns="0" anchor="{anchor}"{m.group(2)}>'

    sp = re.sub(r"<a:bodyPr\b([^>]*?)(/?)>", zero_insets, sp, count=1)
    if kind == "body":
        # Give the text area real bullets instead of pptxgenjs's buNone.
        sp = sp.replace('<a:lvl1pPr indent="0" marL="0"><a:buNone/>', BODY_LEVELS, 1)
        sp = sp.replace("</a:lvl1pPr></a:lstStyle>", "</a:lvl1pPr>" + BODY_LEVEL2 + "</a:lstStyle>", 1)
        sp = sp.replace('<a:pPr indent="0" marL="0"><a:buNone/></a:pPr>', "", 1)
    return sp


def rename_layout(xml: str) -> str:
    def swap(m: re.Match) -> str:
        name = m.group(1)
        return f'<p:cSld name="{LAYOUT_NAMES.get(name, name)}"'

    xml = re.sub(r'<p:cSld name="([^"]*)"', swap, xml, count=1)
    return re.sub(r"<p:sp>.*?</p:sp>", lambda m: tune_placeholder(m.group(0)), xml, flags=re.S)


def main(path: str) -> None:
    deck = Path(path)
    with zipfile.ZipFile(deck) as zin:
        entries = [(info, zin.read(info.filename)) for info in zin.infolist()]

    changed = []
    out = []
    for info, data in entries:
        name = info.filename
        if re.fullmatch(r"ppt/theme/theme\d+\.xml", name):
            data = brand_theme(data.decode("utf-8")).encode("utf-8")
            changed.append(name)
        elif re.fullmatch(r"ppt/slideMasters/slideMaster\d+\.xml", name):
            data = link_slide_number(darken_master(data.decode("utf-8"))).encode("utf-8")
            changed.append(name)
        elif re.fullmatch(r"ppt/slides/slide\d+\.xml", name):
            fixed = link_slide_number(drop_stray_paragraph_props(data.decode("utf-8")))
            if fixed.encode("utf-8") != data:
                data = fixed.encode("utf-8")
                changed.append(name)
        elif re.fullmatch(r"ppt/slideLayouts/slideLayout\d+\.xml", name):
            data = link_slide_number(rename_layout(data.decode("utf-8"))).encode("utf-8")
            changed.append(name)
        out.append((name, data))

    # [Content_Types].xml goes first; some readers expect it there.
    out.sort(key=lambda item: item[0] != "[Content_Types].xml")
    tmp = deck.with_suffix(".tmp")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for name, data in out:
            zout.writestr(name, data)
    tmp.replace(deck)
    print(f"finalized {deck.name}: {len(changed)} parts updated")


if __name__ == "__main__":
    main(sys.argv[1])
