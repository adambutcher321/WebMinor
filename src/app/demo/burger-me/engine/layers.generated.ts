/* Written from scripts/burger-me/split_original.py and extract_extra.py output.
   Units: the top bun's width = 1000; cx is the layer's centre offset from the
   top bun's centre. Do not hand-tune these; tune `seat` in ingredients.ts. */
export const LAYERS = {
  "bun-top": { w: 1000.0, h: 403.2, cx: 0.0, src: "/demo/burger-me/layers/bun-top.webp" },
  "pickles": { w: 918.4, h: 140.1, cx: -11.6, src: "/demo/burger-me/layers/pickles.webp" },
  "onion": { w: 933.0, h: 185.1, cx: -4.3, src: "/demo/burger-me/layers/onion.webp" },
  "cheese": { w: 1021.9, h: 194.9, cx: 0.0, src: "/demo/burger-me/layers/cheese.webp" },
  "patty": { w: 1017.1, h: 235.1, cx: 1.2, src: "/demo/burger-me/layers/patty.webp" },
  "sauce": { w: 944.0, h: 137.6, cx: 0.0, src: "/demo/burger-me/layers/sauce.webp" },
  "bun-bottom": { w: 1006.1, h: 343.5, cx: 5.5, src: "/demo/burger-me/layers/bun-bottom.webp" },
  "bacon": { w: 1058.4, h: 194.6, cx: -1.2, src: "/demo/burger-me/layers/bacon.webp" },
  "jalapenos": { w: 918.5, h: 203.2, cx: 7.9, src: "/demo/burger-me/layers/jalapenos.webp" },
  "lettuce": { w: 1045.0, h: 243.3, cx: 1.8, src: "/demo/burger-me/layers/lettuce.webp" },
  "tomato": { w: 952.4, h: 195.1, cx: -5.5, src: "/demo/burger-me/layers/tomato.webp" },
  "crispy-onions": { w: 998.8, h: 378.3, cx: -1.8, src: "/demo/burger-me/layers/crispy-onions.webp" },
} as const;
