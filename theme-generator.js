/**
 * Gestiona la creación y aplicación automática de temas,
 * inyectando un botón y los estilos base necesarios.
 * @version 5.2 - Lógica de iconos corregida
 * @author HECTOR DANIEL AYARACHI FUENTES
 */

const COLOR_MAP = {
  "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
  "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff",
  "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887", "cadetblue": "#5f9ea0", "chartreuse": "#7fff00",
  "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c",
  "cyan": "#00ffff", "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9",
  "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f", "darkorange": "#ff8c00",
  "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b",
  "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1", "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff",
  "dimgray": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22",
  "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520",
  "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f", "honeydew": "#f0fff0", "hotpink": "#ff69b4",
  "indianred": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c", "lavender": "#e6e6fa",
  "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080",
  "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2", "lightgray": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1",
  "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
  "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6", "magenta": "#ff00ff",
  "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370db",
  "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee", "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc",
  "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
  "navajowhite": "#ffdead", "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23",
  "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6", "palegoldenrod": "#eee8aa", "palegreen": "#98fb98",
  "paleturquoise": "#afeeee", "palevioletred": "#db7093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f",
  "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080", "rebeccapurple": "#663399",
  "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513", "salmon": "#fa8072",
  "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0",
  "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f",
  "steelblue": "#4682b4", "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347",
  "turquoise": "#40e0d0", "violet": "#ee82ee", "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
  "yellow": "#ffff00", "yellowgreen": "#9acd32"
};

// --- Iconos SVG ---
const MOON_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3304.85 3304.44" style="width:28px; height:28px;">
<defs>
<clipPath id="clip-0"><path clip-rule="nonzero" d="M 116 116 L 3189 116 L 3189 3189 L 116 3189 Z M 116 116 "/></clipPath>
<clipPath id="clip-1"><path clip-rule="evenodd" d="M 116.199219 1652.199219 C 116.199219 2062.488281 275.957031 2448.21875 566.109375 2738.371094 C 856.238281 3028.5 1241.980469 3188.269531 1652.269531 3188.269531 C 2062.570312 3188.269531 2448.320312 3028.5 2738.449219 2738.371094 C 3031.46875 2445.378906 3189.949219 2057.761719 3188.609375 1651.03125 C 3143.621094 1723.660156 3090.140625 1791.109375 3028.53125 1852.730469 C 2817.929688 2063.328125 2537.96875 2179.308594 2240.148438 2179.308594 C 1942.351562 2179.308594 1662.371094 2063.328125 1451.78125 1852.730469 C 1241.179688 1642.121094 1125.191406 1362.160156 1125.191406 1064.351562 C 1125.191406 766.539062 1241.179688 486.539062 1451.78125 275.980469 C 1513.25 214.511719 1580.480469 161.128906 1652.898438 116.238281 L 1652.179688 116.179688 C 1241.890625 116.179688 856.15625 275.921875 566.109375 566.011719 C 275.957031 856.160156 116.199219 1241.898438 116.199219 1652.199219 Z M 772.675781 2531.800781 C 1001.410156 2760.570312 1305.558594 2886.511719 1629.078125 2886.511719 C 1952.589844 2886.511719 2256.71875 2760.511719 2485.488281 2531.800781 C 2508.179688 2509.101562 2544.949219 2509.101562 2567.648438 2531.800781 C 2590.339844 2554.488281 2590.339844 2591.230469 2567.648438 2613.949219 C 2316.921875 2864.660156 1983.640625 3002.730469 1629.078125 3002.730469 C 1274.53125 3002.730469 941.191406 2864.660156 690.515625 2613.949219 C 667.820312 2591.230469 667.820312 2554.488281 690.515625 2531.800781 C 713.210938 2509.101562 749.96875 2509.101562 772.675781 2531.800781 "/></clipPath>
<linearGradient id="linear-pattern-0" gradientUnits="userSpaceOnUse" x1="-0.000100981" y1="0" x2="1.000401" y2="0" gradientTransform="matrix(-0.000134218, -3070.55, 3070.55, -0.000134218, 1652.41, 3187.96)">
<stop offset="0" stop-color="rgb(89.802551%, 90.194702%, 89.802551%)"/><stop offset="0.03125" stop-color="rgb(89.64386%, 90.023804%, 89.637756%)"/><stop offset="0.0625" stop-color="rgb(89.324951%, 89.680481%, 89.306641%)"/><stop offset="0.09375" stop-color="rgb(89.006042%, 89.337158%, 88.975525%)"/><stop offset="0.125" stop-color="rgb(88.687134%, 88.993835%, 88.644409%)"/><stop offset="0.15625" stop-color="rgb(88.368225%, 88.650513%, 88.313293%)"/><stop offset="0.1875" stop-color="rgb(88.050842%, 88.30719%, 87.982178%)"/><stop offset="0.21875" stop-color="rgb(87.731934%, 87.963867%, 87.651062%)"/><stop offset="0.25" stop-color="rgb(87.413025%, 87.620544%, 87.319946%)"/><stop offset="0.28125" stop-color="rgb(87.094116%, 87.277222%, 86.988831%)"/><stop offset="0.3125" stop-color="rgb(86.775208%, 86.933899%, 86.659241%)"/><stop offset="0.34375" stop-color="rgb(86.456299%, 86.590576%, 86.328125%)"/><stop offset="0.375" stop-color="rgb(86.13739%, 86.247253%, 85.997009%)"/><stop offset="0.40625" stop-color="rgb(85.818481%, 85.903931%, 85.665894%)"/><stop offset="0.4375" stop-color="rgb(85.499573%, 85.560608%, 85.334778%)"/><stop offset="0.46875" stop-color="rgb(85.180664%, 85.217285%, 85.003662%)"/><stop offset="0.5" stop-color="rgb(84.861755%, 84.873962%, 84.672546%)"/><stop offset="0.53125" stop-color="rgb(84.542847%, 84.53064%, 84.341431%)"/><stop offset="0.5625" stop-color="rgb(84.223938%, 84.187317%, 84.010315%)"/><stop offset="0.59375" stop-color="rgb(83.906555%, 83.843994%, 83.679199%)"/><stop offset="0.625" stop-color="rgb(83.587646%, 83.500671%, 83.348083%)"/><stop offset="0.65625" stop-color="rgb(83.268738%, 83.157349%, 83.016968%)"/><stop offset="0.6875" stop-color="rgb(82.949829%, 82.814026%, 82.685852%)"/><stop offset="0.71875" stop-color="rgb(82.63092%, 82.470703%, 82.354736%)"/><stop offset="0.75" stop-color="rgb(82.312012%, 82.12738%, 82.023621%)"/><stop offset="0.78125" stop-color="rgb(81.993103%, 81.784058%, 81.692505%)"/><stop offset="0.8125" stop-color="rgb(81.674194%, 81.440735%, 81.361389%)"/><stop offset="0.84375" stop-color="rgb(81.355286%, 81.097412%, 81.030273%)"/><stop offset="0.875" stop-color="rgb(81.036377%, 80.754089%, 80.699158%)"/><stop offset="0.90625" stop-color="rgb(80.717468%, 80.410767%, 80.368042%)"/><stop offset="0.9375" stop-color="rgb(80.39856%, 80.067444%, 80.036926%)"/><stop offset="0.96875" stop-color="rgb(80.081177%, 79.724121%, 79.705811%)"/><stop offset="1" stop-color="rgb(79.763794%, 79.38385%, 79.377747%)"/></linearGradient>
</defs>
<path fill-rule="evenodd" fill="rgb(0%, 0%, 0.784302%)" d="M 1652.179688 116.179688 C 1241.890625 116.179688 856.15625 275.921875 566.109375 566.011719 C 275.957031 856.160156 116.199219 1241.898438 116.199219 1652.199219 C 116.199219 2062.488281 275.957031 2448.21875 566.109375 2738.371094 C 856.238281 3028.5 1241.980469 3188.269531 1652.269531 3188.269531 C 2062.570312 3188.269531 2448.320312 3028.5 2738.449219 2738.371094 C 3031.46875 2445.378906 3189.949219 2057.761719 3188.609375 1651.03125 C 3143.621094 1723.660156 3090.140625 1791.109375 3028.53125 1852.730469 C 2817.929688 2063.328125 2537.96875 2179.308594 2240.148438 2179.308594 C 1942.351562 2179.308594 1662.371094 2063.328125 1451.78125 1852.730469 C 1241.179688 1642.121094 1125.191406 1362.160156 1125.191406 1064.351562 C 1125.191406 766.539062 1241.179688 486.539062 1451.78125 275.980469 C 1513.25 214.511719 1580.480469 161.128906 1652.898438 116.238281 C 1652.648438 116.179688 1652.421875 116.179688 1652.179688 116.179688 Z M 1652.261719 3304.441406 C 1210.921875 3304.441406 796.011719 3132.558594 483.953125 2820.5 C 171.878906 2508.449219 0 2093.53125 0 1652.171875 C 0 1210.820312 171.867188 795.921875 483.953125 483.851562 C 795.984375 171.851562 1210.851562 0 1652.179688 0 C 1728.308594 0 1805.058594 5.308594 1880.421875 15.75 C 1906.761719 19.398438 1927.300781 40.511719 1930.191406 66.988281 C 1933.078125 93.480469 1917.578125 118.519531 1892.628906 127.738281 C 1757.339844 177.859375 1636.660156 255.328125 1533.941406 358.089844 C 1345.269531 546.738281 1241.410156 797.53125 1241.410156 1064.320312 C 1241.410156 1331.128906 1345.28125 1581.941406 1533.941406 1770.570312 C 1722.558594 1959.238281 1973.390625 2063.121094 2240.148438 2063.121094 C 2506.921875 2063.121094 2757.730469 1959.238281 2946.390625 1770.570312 C 3049.121094 1667.851562 3126.628906 1547.160156 3176.738281 1411.851562 C 3185.988281 1386.898438 3210.910156 1371.5 3237.46875 1374.289062 C 3263.941406 1377.171875 3285.109375 1397.699219 3288.738281 1424.070312 C 3360.601562 1942.21875 3189.980469 2451.191406 2820.640625 2820.53125 C 2508.5 3132.558594 2093.609375 3304.441406 1652.261719 3304.441406 "/>
<path fill-rule="evenodd" fill="rgb(0%, 0%, 0.784302%)" d="M 1629.078125 3002.730469 C 1274.53125 3002.730469 941.191406 2864.660156 690.515625 2613.949219 C 667.820312 2591.230469 667.820312 2554.488281 690.515625 2531.800781 C 713.210938 2509.101562 749.96875 2509.101562 772.675781 2531.800781 C 1001.410156 2760.570312 1305.558594 2886.511719 1629.078125 2886.511719 C 1952.589844 2886.511719 2256.71875 2760.511719 2485.488281 2531.800781 C 2508.179688 2509.101562 2544.949219 2509.101562 2567.648438 2531.800781 C 2590.339844 2554.488281 2590.339844 2591.230469 2567.648438 2613.949219 C 2316.921875 2864.660156 1983.640625 3002.730469 1629.078125 3002.730469 "/>
<g clip-path="url(#clip-0)"><g clip-path="url(#clip-1)"><path fill-rule="nonzero" fill="url(#linear-pattern-0)" d="M 116.199219 3188.269531 L 3189.949219 3188.269531 L 3189.949219 116.179688 L 116.199219 116.179688 Z M 116.199219 3188.269531 "/></g></g>
</svg>
`;

const SUN_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2886 2872" style="width:28px; height:28px;">
<defs>
<clipPath id="clip-0-sun"><path d="M 416.398438 861.828125 L 415.0625 853.238281 C 413.410156 831.519531 404.132812 805.019531 387.238281 773.71875 C 256.101562 613.371094 191.25 517.929688 192.6875 487.390625 C 167.007812 422.039062 170.550781 313.738281 203.320312 162.5 C 281.894531 288.328125 350.515625 365.179688 409.175781 393.058594 C 426.335938 402.191406 451.207031 408.910156 483.789062 413.210938 C 613.597656 405.519531 724.617188 412.851562 816.839844 435.230469 C 832.136719 284.828125 924.019531 140.570312 1092.480469 2.46875 C 1051.191406 105.789062 1036.851562 174.269531 1049.46875 207.878906 C 1056.160156 244.71875 1099.460938 281.929688 1179.378906 319.519531 C 1242 222.820312 1307.769531 157.359375 1376.691406 123.109375 C 1438.890625 86.351562 1569.789062 45.308594 1769.398438 0 C 1699.828125 82.238281 1665.601562 144.910156 1666.699219 188.011719 C 1668.429688 203.261719 1673.578125 217.289062 1682.171875 230.121094 L 1751.53125 320.640625 C 1763.359375 342.070312 1774.171875 370.308594 1783.960938 405.359375 C 1823.308594 352.589844 1868.179688 321.128906 1918.589844 310.960938 C 1913.28125 303.589844 1985.449219 307.410156 2135.121094 322.449219 C 2164.558594 323.019531 2191.519531 318.480469 2216.011719 308.828125 C 2269.960938 284.738281 2321.070312 228.78125 2369.328125 140.949219 C 2385.539062 226.019531 2392.460938 292.660156 2390.089844 340.871094 C 2394.589844 356.160156 2376.730469 419.160156 2336.519531 529.871094 C 2331.628906 552.21875 2330.96875 589.308594 2334.53125 641.109375 C 2423.558594 647.75 2487.71875 661.441406 2527.011719 682.199219 C 2561.28125 697.191406 2621.078125 741.941406 2706.429688 816.460938 C 2726.058594 830.699219 2747.589844 843.789062 2771.019531 855.730469 C 2673.5 840.761719 2609.820312 844.351562 2580.011719 866.5 C 2548.449219 883.261719 2523.429688 937.859375 2504.929688 1030.269531 C 2569.089844 1058.898438 2617.378906 1087.710938 2649.789062 1116.699219 C 2663.910156 1129.871094 2676.261719 1144.238281 2686.820312 1159.820312 L 2760.429688 1275.429688 C 2773.679688 1291.648438 2797.78125 1309.171875 2832.75 1327.980469 L 2756.988281 1319.96875 L 2629.429688 1266.660156 C 2605.710938 1259.871094 2588.980469 1258.601562 2579.25 1262.828125 C 2561.980469 1265.371094 2538.75 1283.808594 2509.589844 1318.148438 C 2514.308594 1352.878906 2520.820312 1380 2529.109375 1399.5 C 2567.429688 1473.488281 2629.851562 1525.230469 2716.378906 1554.710938 C 2766.390625 1576.800781 2822.769531 1556.019531 2885.519531 1492.371094 C 2858.878906 1578.148438 2830.570312 1635.5 2800.609375 1664.429688 C 2786.96875 1676.480469 2771.75 1684.21875 2754.980469 1687.648438 C 2677.609375 1693.21875 2637.511719 1699.679688 2634.691406 1707.039062 C 2606.320312 1723.78125 2580.820312 1759.691406 2558.171875 1814.769531 C 2646.378906 1862.089844 2702.191406 1905.519531 2725.609375 1945.050781 C 2752.71875 1981.75 2772.691406 2052.667969 2785.519531 2157.808594 C 2730.851562 2126.984375 2685.300781 2112.527344 2648.878906 2114.425781 C 2640.410156 2114.589844 2627.808594 2117.882812 2611.078125 2124.308594 L 2495.019531 2181.152344 C 2473.660156 2189.144531 2433.128906 2192.539062 2373.429688 2191.335938 C 2365.808594 2250.777344 2353.660156 2297.503906 2336.980469 2331.507812 L 2244.558594 2464.136719 C 2207.25 2595.519531 2289.949219 2630.308594 2492.648438 2568.5 C 2446.96875 2620.179688 2413.390625 2651.648438 2391.921875 2662.910156 C 2221.660156 2750.996094 2005.128906 2699.953125 1742.300781 2509.78125 C 1696.238281 2557.398438 1659.371094 2587.167969 1631.699219 2599.09375 C 1624.679688 2606.550781 1574.558594 2621.011719 1481.320312 2642.476562 C 1462.898438 2648.832031 1448.570312 2658.5 1438.339844 2671.480469 C 1415.390625 2695.445312 1417.828125 2761.992188 1445.660156 2871.125 C 1361.53125 2818.285156 1305.671875 2767.394531 1278.089844 2718.457031 C 1247.921875 2673.535156 1217.140625 2583.636719 1185.769531 2448.757812 C 1161.691406 2477.375 1137.539062 2499.734375 1113.320312 2515.832031 L 959.0625 2588.941406 C 939.777344 2600.078125 923.855469 2614.128906 911.289062 2631.089844 C 884.144531 2663.246094 875.222656 2736.589844 884.527344 2851.125 C 784.316406 2740.980469 722.019531 2656.15625 697.628906 2596.644531 C 687.984375 2570.566406 684.703125 2547.023438 687.789062 2526.015625 C 686.445312 2517.964844 696.199219 2485.636719 717.054688 2429.035156 C 720.992188 2408.242188 721.914062 2395.785156 719.828125 2391.664062 C 713.113281 2354.324219 681.90625 2308.488281 626.199219 2254.160156 C 574.957031 2260.183594 492.429688 2244.21875 378.621094 2206.253906 C 361.519531 2203.558594 344.195312 2204.160156 326.644531 2208.066406 C 279.332031 2220.453125 224.753906 2274.25 162.910156 2369.457031 C 159.070312 2239.574219 166.882812 2146.617188 186.34375 2090.582031 C 195.597656 2066.488281 207.941406 2047.386719 223.367188 2033.289062 L 345.894531 1950.277344 C 362.171875 1934.550781 375.410156 1900.964844 385.605469 1849.519531 C 307.542969 1750.238281 238.882812 1689.371094 179.617188 1666.898438 C 165.054688 1663.441406 152.304688 1664.25 141.367188 1669.328125 L 0 1740.320312 C 20.625 1601.75 52.3125 1504.28125 95.054688 1447.910156 C 132.011719 1389.25 219.875 1314.160156 358.648438 1222.648438 C 350.316406 1117.898438 325.160156 1055.929688 283.179688 1036.761719 C 241.835938 1011.359375 151.171875 1006.921875 11.1875 1023.410156 C 126.382812 937.089844 205.875 886.179688 249.667969 870.699219 C 295.710938 850.289062 351.289062 847.328125 416.398438 861.828125 "/></clipPath>
<radialGradient id="radial-pattern-0" gradientUnits="userSpaceOnUse" cx="259.485" cy="544.3305" r="1641.15" gradientTransform="matrix(1, 0, 0, 1, 1181.29, 874.55)"><stop offset="0" stop-color="rgb(99.606323%, 75.559998%, 2.333069%)"/><stop offset="0.25" stop-color="rgb(99.606323%, 71.476746%, 1.73645%)"/><stop offset="0.5" stop-color="rgb(99.606323%, 67.520142%, 1.156616%)"/><stop offset="0.75" stop-color="rgb(99.606323%, 63.500977%, 0.569153%)"/><stop offset="1" stop-color="rgb(99.606323%, 59.606934%, 0%)"/></radialGradient>
<clipPath id="clip-2-sun"><path d="M 465 458 L 2417 458 L 2417 2409 L 465 2409 Z M 465 458 "/></clipPath>
<clipPath id="clip-3-sun"><path d="M 2416.308594 1434.269531 L 2407.410156 1566.640625 C 2365.199219 1833.308594 2241.710938 2046.59375 2036.929688 2206.476562 C 1830.730469 2366.234375 1587.921875 2431.015625 1308.5 2400.820312 C 1041.820312 2358.617188 828.539062 2235.125 668.652344 2030.34375 C 617.425781 1964.148438 575.226562 1892.023438 542.0625 1813.960938 L 500.25 1693.589844 C 477.277344 1610.761719 465.664062 1524.320312 465.40625 1434.269531 C 472.378906 1157.941406 567.613281 928.019531 751.109375 744.53125 C 934.605469 561.03125 1164.519531 465.800781 1440.859375 458.820312 C 1717.191406 465.800781 1947.109375 561.03125 2130.609375 744.53125 C 2314.109375 928.019531 2409.339844 1157.941406 2416.308594 1434.269531 "/></clipPath>
<radialGradient id="radial-pattern-1" gradientUnits="userSpaceOnUse" cx="259.40025" cy="577.917" r="975.795" gradientTransform="matrix(1, 0, 0, 1, 1181.29, 874.55)"><stop offset="0" stop-color="rgb(99.606323%, 92.027283%, 22.584534%)"/><stop offset="0.25" stop-color="rgb(99.606323%, 87.940979%, 17.526245%)"/><stop offset="0.5" stop-color="rgb(99.606323%, 83.984375%, 12.626648%)"/><stop offset="0.75" stop-color="rgb(99.606323%, 80.059814%, 7.76825%)"/><stop offset="1" stop-color="rgb(99.606323%, 75.68512%, 2.352905%)"/></radialGradient>
</defs>
<g clip-path="url(#clip-0-sun)"><g clip-path="url(#clip-0-sun)"><path fill-rule="nonzero" fill="url(#radial-pattern-0)" d="M 0 0 L 0 2871.125 L 2885.519531 2871.125 L 2885.519531 0 Z M 0 0 "/></g></g>
<g clip-path="url(#clip-2-sun)"><g clip-path="url(#clip-3-sun)"><g clip-path="url(#clip-3-sun)"><path fill-rule="nonzero" fill="url(#radial-pattern-1)" d="M 465.40625 458.820312 L 465.40625 2431.015625 L 2416.308594 2431.015625 L 2416.308594 458.820312 Z M 465.40625 458.820312 "/></g></g></g>
</svg>
`;


class AutoTheme {
  #baseColors;
  #buttonOptions;
  #isDark = false;
  #isPageInitiallyDark = false;
  #colorCache = new Map();
  #toggleButton;

  constructor(baseColors, buttonOptions = {}) {
    this.#baseColors = baseColors || { surface: '#ffffff', text: '#2c3e50' };
    this.#validateColors();

    this.#buttonOptions = {
      position: { bottom: '20px', right: '20px' },
      exclude: [],
      transitionDuration: '0.3s',
      transitionTimingFunction: 'ease',
      ...buttonOptions
    };

    this.#init();
  }

  #validateColors() {
    for (const [name, color] of Object.entries(this.#baseColors)) {
      if (!/^#([A-Fa-f0-9]{3,4}){1,2}$/.test(color)) {
        console.error(`AutoTheme Error: Invalid HEX color format for "${name}": ${color}. Using default.`);
        this.#baseColors[name] = name === 'surface' ? '#ffffff' : '#2c3e50';
      }
    }
  }

  #hexToHsl(hex) {
    try {
      const fullHex = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      if (!result) throw new Error(`Invalid HEX color: ${hex}`);
      
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    } catch (error) {
      console.error(error.message);
      return { h: 0, s: 0, l: 100 }; // Default to white on error
    }
  }

  #generateDarkColors() {
    const darkColors = {};
    for (const [name, hex] of Object.entries(this.#baseColors)) {
      const hsl = this.#hexToHsl(hex);
      const invertedL = 100 - hsl.l;
      let adjustedS = hsl.s;
      if (invertedL > 50) adjustedS = Math.max(30, hsl.s * 0.8);
      else adjustedS = Math.min(90, hsl.s * 1.2);
      darkColors[name] = `hsl(${hsl.h}, ${adjustedS}%, ${invertedL}%)`;
    }
    return darkColors;
  }

  #getEffectiveBackgroundColor() {
    let element = document.body;
    while (element) {
      const bgColor = window.getComputedStyle(element).backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') return bgColor;
      element = element.parentElement;
    }
    return 'rgb(255, 255, 255)'; // Default to white
  }

  #colorNameToHex(color) {
    return COLOR_MAP[color.toLowerCase()] || null;
  }

  #isColorDark(colorString) {
    const sanitizedColor = colorString.toLowerCase().trim();
    if (this.#colorCache.has(sanitizedColor)) {
      return this.#isColorDark(this.#colorCache.get(sanitizedColor));
    }

    let r, g, b;
    let match;

    if ((match = sanitizedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/))) {
      [, r, g, b] = match.map(Number);
    } else if ((match = sanitizedColor.match(/#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/))) {
      [, r, g, b] = match.map(c => parseInt(c, 16));
    } else if ((match = sanitizedColor.match(/#([a-f\d])([a-f\d])([a-f\d])/))) {
      [, r, g, b] = match.map(c => parseInt(c + c, 16));
    } else if ((match = sanitizedColor.match(/hsla?\((\d+),\s*(\d+)%?,\s*(\d+)%?/))) {
      const [, h, s, l] = match.map(Number);
      const s_norm = s / 100, l_norm = l / 100;
      const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l_norm - c / 2;
      let r_temp = 0, g_temp = 0, b_temp = 0;
      if (h < 60) { [r_temp, g_temp, b_temp] = [c, x, 0]; }
      else if (h < 120) { [r_temp, g_temp, b_temp] = [x, c, 0]; }
      else if (h < 180) { [r_temp, g_temp, b_temp] = [0, c, x]; }
      else if (h < 240) { [r_temp, g_temp, b_temp] = [0, x, c]; }
      else if (h < 300) { [r_temp, g_temp, b_temp] = [x, 0, c]; }
      else { [r_temp, g_temp, b_temp] = [c, 0, x]; }
      r = Math.round((r_temp + m) * 255);
      g = Math.round((g_temp + m) * 255);
      b = Math.round((b_temp + m) * 255);
    } else {
      const hexColor = this.#colorNameToHex(sanitizedColor);
      if (hexColor) {
        this.#colorCache.set(sanitizedColor, hexColor);
        return this.#isColorDark(hexColor);
      }
      return false; // Cannot determine
    }

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 128;
  }

  recalculatePageTheme() {
    const bodyBgColor = this.#getEffectiveBackgroundColor();
    this.#isPageInitiallyDark = this.#isColorDark(bodyBgColor);
    this.setTheme(this.#isDark);
  }

  setTheme(isDark, manualToggle = false) {
    try {
      if (this.#isDark === isDark && document.documentElement.hasAttribute('data-theme-initialized')) return;

      this.#isDark = isDark;
      
      // Añadimos una clase para la animación y la removemos cuando termina
      if (this.#toggleButton) {
        this.#toggleButton.classList.add('is-switching');
        this.#toggleButton.addEventListener('animationend', () => this.#toggleButton.classList.remove('is-switching'), { once: true });
      }
      this.#toggleButton?.setAttribute('aria-pressed', String(isDark));

      if (document.startViewTransition) {
        document.startViewTransition(() => this.#applyThemeChanges(manualToggle));
      } else {
        this.#applyThemeChanges(manualToggle);
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }

  #applyThemeChanges(manualToggle) {
    if (manualToggle) {
      localStorage.setItem('theme-preference', this.#isDark ? 'dark' : 'light');
    }

    const liveRegion = document.getElementById('theme-announcer');
    if (liveRegion) liveRegion.textContent = `Tema cambiado a modo ${this.#isDark ? 'oscuro' : 'claro'}.`;

    if (this.#isPageInitiallyDark !== this.#isDark) {
      document.documentElement.setAttribute('data-theme', 'inverted');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    document.documentElement.setAttribute('data-theme-initialized', 'true');

    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { isDark: this.#isDark, manualToggle }
    }));

    this.#updateToggleButton();
  }

  #createToggleButton() {
    const button = document.createElement('button');
    button.id = 'theme-toggle-button';
    button.setAttribute('aria-label', 'Cambiar entre tema claro y oscuro');

    let initialPositionStyles = this.#buttonOptions.position;
    try {
      const savedPosition = JSON.parse(localStorage.getItem('theme-button-position') ?? '{}');
      if (typeof savedPosition.left === 'number' && typeof savedPosition.top === 'number') {
        initialPositionStyles = { left: `${savedPosition.left}px`, top: `${savedPosition.top}px` };
      }
    } catch (error) {
      console.error('Error parsing saved button position:', error);
      localStorage.removeItem('theme-button-position');
    }

    Object.assign(button.style, {
      position: 'fixed',
      ...initialPositionStyles,
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.3)',
      zIndex: '9999',
      transition: 'transform 0.2s ease, background-color 0.3s ease, color 0.3s ease'
    });

    button.addEventListener('mouseover', () => button.style.transform = 'scale(1.1)');
    button.addEventListener('mouseout', () => button.style.transform = 'scale(1)');
    button.addEventListener('click', () => this.setTheme(!this.#isDark, true));
    
    this.#makeDraggable(button);

    document.body.appendChild(button);
    this.#toggleButton = button;
  }

  #makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    const onMouseDown = (e) => {
      if (e.button !== 0) return;

      isDragging = true;
      const rect = element.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      element.style.cursor = 'grabbing';
      element.style.transition = 'none';

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp, { once: true });
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const x = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, e.clientX - offsetX));
      const y = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, e.clientY - offsetY));
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      element.style.cursor = 'pointer';
      element.style.transition = 'transform 0.2s ease, background-color 0.3s ease, color 0.3s ease';
      document.removeEventListener('mousemove', onMouseMove);
      
      localStorage.setItem('theme-button-position', JSON.stringify({ left: element.offsetLeft, top: element.offsetTop }));
    };

    element.addEventListener('mousedown', onMouseDown);
  }

  #injectLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'theme-announcer';
    liveRegion.setAttribute('aria-live', 'polite');
    Object.assign(liveRegion.style, { position: 'absolute', width: '1px', height: '1px', margin: '-1px', padding: '0', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: '0' });
    document.body.appendChild(liveRegion);
  }

  #updateToggleButton() {
    if (!this.#toggleButton) return;
    // --- CORREGIDO: Muestra el icono del tema actual ---
    this.#toggleButton.innerHTML = this.#isDark ? MOON_ICON : SUN_ICON;
    this.#toggleButton.style.backgroundColor = 'var(--color-surface)';
    this.#toggleButton.style.color = 'var(--color-text)';
  }

  #injectBaseStyles() {
    const style = document.createElement('style');
    const baseExclusions = ['img', 'video', 'iframe', '#theme-toggle-button', '[data-theme-exclude]', '[style*="background-image"]'];
    const userExclusions = this.#buttonOptions.exclude.filter(e => typeof e === 'string');
    const allExclusionSelectors = [...new Set([...baseExclusions, ...userExclusions])];
    const exclusionSelector = allExclusionSelectors.map(sel => `[data-theme="inverted"] ${sel}`).join(',\n');

    const exclusionFunctions = this.#buttonOptions.exclude.filter(e => typeof e === 'function');
    if (exclusionFunctions.length > 0) {
      document.querySelectorAll('*').forEach(el => {
        if (exclusionFunctions.some(fn => fn(el))) {
          el.setAttribute('data-theme-exclude', '');
        }
      });
    }

    const highContrast = window.matchMedia('(prefers-contrast: more)').matches;
    const contrastValue = highContrast ? '110%' : '90%';
    const brightnessValue = highContrast ? '100%' : '95%';
    const { transitionDuration, transitionTimingFunction } = this.#buttonOptions;
    const darkColors = this.#generateDarkColors();

    style.textContent = `
      :root {
        --color-surface: ${this.#baseColors.surface || '#ffffff'};
        --color-text: ${this.#baseColors.text || '#2c3e50'};
      }

      [data-theme="inverted"] {
        --color-surface: ${darkColors.surface || '#2c3e50'};
        --color-text: ${darkColors.text || '#ffffff'};
      }

      html {
        transition: filter ${transitionDuration} ${transitionTimingFunction};
      }

      [data-theme="inverted"] {
        filter: invert(1) hue-rotate(180deg) contrast(${contrastValue}) brightness(${brightnessValue});
        background-color: #fff;
      }

      ${exclusionSelector} {
        filter: invert(1) hue-rotate(180deg);
      }

      @keyframes rotate-icon {
        0% { transform: rotate(-90deg) scale(0); opacity: 0; }
        70% { transform: rotate(20deg) scale(1.2); opacity: 1; }
        100% { transform: rotate(0deg) scale(1); opacity: 1; }
      }

      #theme-toggle-button.is-switching svg {
        animation: rotate-icon 0.4s ${transitionTimingFunction};
      }

    `;
    document.head.appendChild(style);
  }

  #init() {
    this.#injectBaseStyles();
    this.#injectLiveRegion();
    this.#createToggleButton();

    this.#isPageInitiallyDark = this.#isColorDark(this.#getEffectiveBackgroundColor());

    const savedPreference = localStorage.getItem('theme-preference');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    const initialThemeIsDark = savedPreference ? savedPreference === 'dark' : systemPreference.matches;

    this.setTheme(initialThemeIsDark);

    let debounceTimer;
    systemPreference.addEventListener('change', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (!localStorage.getItem('theme-preference')) {
          this.setTheme(e.matches);
        }
      }, 100);
    });

    const observer = new MutationObserver(() => this.recalculatePageTheme());
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
  }
}

/**
 * Punto de entrada de la aplicación.
 * Define los colores base y activa el sistema de temas autónomo.
 * @author HECTOR DANIEL AYARACHI FUENTES
 */
const myBrandColors = {
  surface: '#ffffff',
  text: '#2c3e50'
};

// Crea una nueva instancia de la clase y le pasa los colores base.
new AutoTheme(myBrandColors, {
  // Ejemplo de exclusiones:
  // exclude: [
  //   '.logo', // Selector CSS
  //   (el) => el.id === 'map-container' // Función de callback
  // ]
});
