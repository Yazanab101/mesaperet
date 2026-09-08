# Wix Layout Model — Homepage 1440×900

## Section

```json
{
  "id": "comp-kbgaghri",
  "className": "ke5pl1 comp-kbgaghri-container comp-kbgaghri wixui-section undefined fwXYgt",
  "rect": {
    "x": 0,
    "y": 0,
    "w": 1440,
    "h": 1062
  },
  "css": {
    "position": "relative",
    "display": "grid",
    "width": "1440px",
    "height": "1062px",
    "maxWidth": "99999px",
    "minWidth": "0px",
    "transform": "none",
    "overflow": "visible",
    "gridTemplateColumns": "1440px",
    "gridTemplateRows": "1062px"
  },
  "styleAttr": null,
  "childPositions": [
    {
      "tag": "DIV",
      "id": "bgLayers_comp-kbgaghri",
      "className": "QG9w8P",
      "position": "absolute",
      "display": "block",
      "transform": "none",
      "width": "1440px",
      "height": "1062px"
    },
    {
      "tag": "DIV",
      "id": "comp-lzy6b7c6",
      "className": "i4P7Vt comp-lzy6b7c6 ZYZJBv wixui-image",
      "position": "relative",
      "display": "block",
      "transform": "matrix(1, 0, 0, 1, 0, 0)",
      "width": "117.844px",
      "height": "111.719px"
    },
    {
      "tag": "DIV",
      "id": "comp-meepdva1",
      "className": "i4P7Vt comp-meepdva1 ZYZJBv wixui-image",
      "position": "relative",
      "display": "block",
      "transform": "none",
      "width": "488.25px",
      "height": "606.766px"
    },
    {
      "tag": "DIV",
      "id": "comp-meepcjt5",
      "className": "i4P7Vt comp-meepcjt5 ZYZJBv wixui-image",
      "position": "relative",
      "display": "block",
      "transform": "none",
      "width": "372.438px",
      "height": "350.812px"
    },
    {
      "tag": "DIV",
      "id": "comp-luod3uiz",
      "className": "i4P7Vt comp-luod3uiz ZYZJBv wixui-image",
      "position": "relative",
      "display": "block",
      "transform": "matrix(1, 0, 0, 1, 0, 0)",
      "width": "233.875px",
      "height": "155.828px"
    }
  ]
}
```

## Layout model conclusion

- No whole-page scale() transform
- Section size: 1440×1062px (full viewport width)
- Section height 1062px > viewport 900px (scene taller than viewport; chairs extend below fold)
- Each object sits in a `position:relative` component wrapper inside a `position:relative` section
- Image wrappers use absolute wow-image layers; outer comps get placed by Wix responsive/mesh CSS
- Coordinates below are **absolute viewport** and **% of section 1440×1062**

## Objects relative to section

| Element | x | y | w | h | x% | y% | w% | h% | object-fit | object-position | natural |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| תמונה | 533.78 | 146.47 | 372.44 | 350.81 | 37.07% | 13.79% | 25.86% | 33.03% | cover | 50% 43% | 372×351 |
| עציץ | 232.38 | 189.78 | 204.45 | 170.75 | 16.14% | 17.87% | 14.2% | 16.08% | cover | 50% 50% | 204×171 |
| שובר מתנה | 967.06 | 235.89 | 124.84 | 15.19 | 67.16% | 22.21% | 8.67% | 1.43% |  |  |  |
| comp-mrtilwv4 | 943.31 | 243.89 | 94.5 | 84.13 | 65.51% | 22.97% | 6.56% | 7.92% |  |  |  |
| סדנאות | 1125.28 | 251.08 | 117.84 | 111.72 | 78.14% | 23.64% | 8.18% | 10.52% | cover | 50% 50% | 118×112 |
| שובר מתנה | 1015.27 | 275.34 | 99.92 | 99.84 | 70.5% | 25.93% | 6.94% | 9.4% | cover | 50% 50% | 100×100 |
| ייעוץ | 310.64 | 321.5 | 47.91 | 34.72 | 21.57% | 30.27% | 3.33% | 3.27% |  |  |  |
| כורסא  | 30.17 | 321.91 | 488.25 | 606.77 | 2.1% | 30.31% | 33.91% | 57.13% | cover | 50% 50% | 488×607 |
| כורסא  | 906.27 | 338.66 | 488.25 | 606.77 | 62.94% | 31.89% | 33.91% | 57.13% | cover | 50% 50% | 488×607 |
| צרו קשר | 486.11 | 486.2 | 233.88 | 155.83 | 33.76% | 45.78% | 16.24% | 14.67% | cover | 50% 50% | 234×156 |
| קישור להמלצות | 714.59 | 497.25 | 191.66 | 127.67 | 49.62% | 46.82% | 13.31% | 12.02% | cover | 50% 50% | 192×128 |
| מיטל גוטמן שקד - מספרת נומרולוגיה לוגו | 0 | 893.7 | 168.3 | 168.3 | 0% | 84.15% | 11.69% | 15.85% | cover | 50% 50% | 168×168 |

## Text labels

```json
[
  {
    "text": "ייעוץ",
    "tag": "DIV",
    "id": "comp-mebrbatl",
    "rect": {
      "x": 310.64,
      "y": 321.5,
      "w": 47.91,
      "h": 34.72
    },
    "rel": {
      "x": 310.64,
      "y": 321.5,
      "xPct": 21.57,
      "yPct": 30.27
    },
    "css": {
      "position": "relative",
      "fontFamily": "Arial, Helvetica, sans-serif",
      "fontSize": "10px",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal",
      "color": "rgb(0, 0, 0)",
      "transform": "none",
      "zIndex": "auto"
    }
  },
  {
    "text": "ייעוץ",
    "tag": "P",
    "id": "comp-mebrbatl",
    "rect": {
      "x": 310.64,
      "y": 321.5,
      "w": 47.91,
      "h": 34.72
    },
    "rel": {
      "x": 310.64,
      "y": 321.5,
      "xPct": 21.57,
      "yPct": 30.27
    },
    "css": {
      "position": "static",
      "fontFamily": "almoni-dl-aaa-400, sans-serif",
      "fontSize": "21.6971px",
      "fontWeight": "400",
      "lineHeight": "34.7153px",
      "letterSpacing": "normal",
      "color": "rgb(255, 255, 255)",
      "transform": "none",
      "zIndex": "auto"
    }
  },
  {
    "text": "מיטל גוטמן שקד נומרולוגית",
    "tag": "DIV",
    "id": "comp-mkvjy95i",
    "rect": {
      "x": 0,
      "y": 1062,
      "w": 1440,
      "h": 155.28
    },
    "rel": {
      "x": 0,
      "y": 1062,
      "xPct": 0,
      "yPct": 100
    },
    "css": {
      "position": "relative",
      "fontFamily": "Arial, Helvetica, sans-serif",
      "fontSize": "10px",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal",
      "color": "rgb(0, 0, 0)",
      "transform": "none",
      "zIndex": "auto"
    }
  },
  {
    "text": "מיטל גוטמן שקד נומרולוגית",
    "tag": "DIV",
    "id": "comp-mkvjqmhm",
    "rect": {
      "x": 448.05,
      "y": 1084.83,
      "w": 543.91,
      "h": 109.63
    },
    "rel": {
      "x": 448.05,
      "y": 1084.83,
      "xPct": 31.11,
      "yPct": 102.15
    },
    "css": {
      "position": "relative",
      "fontFamily": "Arial, Helvetica, sans-serif",
      "fontSize": "10px",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal",
      "color": "rgb(0, 0, 0)",
      "transform": "none",
      "zIndex": "auto"
    }
  },
  {
    "text": "מיטל גוטמן שקד נומרולוגית",
    "tag": "H1",
    "id": "comp-mkvjqmhm",
    "rect": {
      "x": 448.05,
      "y": 1084.83,
      "w": 543.91,
      "h": 109.63
    },
    "rel": {
      "x": 448.05,
      "y": 1084.83,
      "xPct": 31.11,
      "yPct": 102.15
    },
    "css": {
      "position": "static",
      "fontFamily": "gulash-w26-regular, cursive",
      "fontSize": "91.356px",
      "fontWeight": "400",
      "lineHeight": "109.627px",
      "letterSpacing": "normal",
      "color": "rgb(0, 0, 0)",
      "transform": "none",
      "zIndex": "auto"
    }
  },
  {
    "text": "שובר מתנה",
    "tag": "DIV",
    "id": null,
    "rect": {
      "x": 828.97,
      "y": 1343.66,
      "w": 142,
      "h": 31.59
    },
    "rel": {
      "x": 828.97,
      "y": 1343.66,
      "xPct": 57.57,
      "yPct": 126.52
    },
    "css": {
      "position": "relative",
      "fontFamily": "Arial, Helvetica, sans-serif",
      "fontSize": "10px",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal",
      "color": "rgb(0, 0, 0)",
      "transform": "none",
      "zIndex": "auto"
    }
  },
  {
    "text": "שובר מתנה",
    "tag": "SPAN",
    "id": null,
    "rect": {
      "x": 828.97,
      "y": 1343.66,
      "w": 142,
      "h": 31.59
    },
    "rel": {
      "x": 828.97,
      "y": 1343.66,
      "xPct": 57.57,
      "yPct": 126.52
    },
    "css": {
      "position": "relative",
      "fontFamily": "Arial, Helvetica, sans-serif",
      "fontSize": "10px",
      "fontWeight": "400",
      "lineHeight": "normal",
      "letterSpacing": "normal",
      "color": "rgb(0, 0, 0)",
      "transform": "none",
      "zIndex": "auto"
    }
  }
]
```

## Socials in viewport

```json
[
  {
    "label": "Facebook",
    "href": "https://www.facebook.com/meytal.guttmanshaked",
    "rect": {
      "x": 0,
      "y": 383.91,
      "w": 57.09,
      "h": 57.09
    },
    "position": "static",
    "transform": "none",
    "zIndex": "auto"
  },
  {
    "label": "Whatsapp",
    "href": "https://wa.me/+972527500098",
    "rect": {
      "x": 0,
      "y": 459,
      "w": 57.09,
      "h": 57.09
    },
    "position": "static",
    "transform": "none",
    "zIndex": "auto"
  }
]
```