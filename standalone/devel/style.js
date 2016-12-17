vizmap = [

   {selector: "node", css: {
      "shape": "ellipse",
      "text-valign":"center",
      "text-halign":"center",
      "content": "data(name)",
      "background-color": "#FFFFFF",
      "border-color":"black","border-width":"1px",
      "width": "mapData(degree, 0.0, 5.0, 20.0, 200.0)",
      "height":"mapData(degree, 0.0, 5.0, 20.0, 200.0)",
      "font-size":"8px"}},


   {selector: 'node[type="info"]', css: {
       "shape": "roundrectangle",
       "font-size": "72px",
       "width": "360px",
       "height": "120px",
       "border-width": "3px",
       "background-color": "beige"
       }},

   {selector: 'node[type="metabolite"]', css: {
       "shape": "roundrectangle",
       "width": "80px",
       "height": "30px",
       "font-size": "6px"
       }},

   {selector: 'node[type="reaction"]', css: {
      "shape": "roundrectangle",
      "background-color":"mapData(flux, 0, 1000, white, red)",
      "width":  "60px",
      "height": "60px"
       }},

   {selector: 'node[type="tf"]', css: {
       "shape": "rectangle"
       }},
   
   {selector: 'edge', css: {
      "line-color": "mapData(flux, 0, 1000, lightgray, red)",
      width: "2px"
      }},

   {selector: 'edge[edgeType="consumes"]', css: {
      "line-color": "mapData(flux, 0, 1000, #EDEDED, blue)",
      "source-arrow-shape": "triangle",
      "source-arrow-color": "rgb(0, 0, 0)",
      "width": "2px",
      "curve-style":"bezier",   // bezier, haystack
      }},

   {selector: 'edge[edgeType="produces"]', css: {
      "line-color": "mapData(flux, 0, 1000, #EDEDED, red)",
      "target-arrow-shape": "triangle",
      "target-arrow-color": "rgb(0, 0, 0)",
      width: "2px",
      "curve-style":"bezier",   // bezier, haystack
      }},

   {selector: 'edge[edgeType="catalyzes"]', css: {
      "line-color": "green",
      "target-arrow-shape": "circle",
      "target-arrow-color": "rgb(0, 0, 0)",
      width: "2px",
      "curve-style":"bezier",   // bezier, haystack
      }},

   {selector:"node:selected", css: {
       "text-valign":"center",
       "text-halign":"center",
       //"content": "data(id)",
       "border-color": "black",
       "overlay-opacity": 0.2,
       "overlay-color": "gray"
       }},
       
   {selector:"edge:selected", css: {
       "overlay-opacity": 0.2,
       "overlay-color": "gray"
       }}
   ];
