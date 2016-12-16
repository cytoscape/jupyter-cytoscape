var widgets = require('jupyter-js-widgets');
var _ = require('underscore');
var cytoscape = require('cytoscape');

var CyjsModel = widgets.DOMWidgetModel.extend({

    defaults: _.extend({}, widgets.DOMWidgetModel.prototype.defaults, {
        _model_name:   'CyjsModel',
        _view_name:    'CyjsView',
        _model_module: 'cyjs',
        _view_module:  'cyjs',
        msg:  "empty in javascript",
        msgFromKernel: "",
        defaultHeight: "800px",
        defaultWidth:  "1000px"
        })
     });


    var CyjsView = widgets.DOMWidgetView.extend({

        createDiv: function(){
            var outerDiv = $("<div id='cyOuterDiv' style='border:1px solid gray; height: 800px; width: 97%'></div>");
            var toolbarDiv = $("<div id='cyToolbarDiv' style='height: 30px; width: 97%'></div>");
            var cyDiv = $("<div id='cyDiv' style='height: 100%; width: 97%'></div>");
            outerDiv.append(toolbarDiv);
            outerDiv.append(cyDiv);
            var cyWidget = this;
            var fitButton = $("<button>Fit</button>").click(function(){
                console.log("Fit!");
                console.log("fitButton's notion of this:")
                console.log(cyWidget.cy);
                cyWidget.cy.fit(50);
                cyWidget.cy.resize();
               });
            toolbarDiv.append(fitButton);
            var fitSelectedButton = $("<button>Fit Selected</button>").click(function(){
                var selectedNodes = cyWidget.cy.filter('node:selected');
                if(selectedNodes.length > 0){
                   cyWidget.cy.fit(selectedNodes, 50);
                   }
               });
            toolbarDiv.append(fitSelectedButton);
            var sfnButton = $("<button>SFN</button>").click(function(){
               cyWidget.cy.nodes(':selected').neighborhood().nodes().select()
               });
            toolbarDiv.append(sfnButton);
            var clearButton = $("<button>Clear</button>").click(function(){
               cyWidget.cy.nodes().unselect();
               cyWidget.cy.edges().unselect();
               });
            toolbarDiv.append(clearButton);
            return(outerDiv);
           },
 
        
        createCanvas: function(){
            var cyjsWidget = this;
            console.log("createCanvas notion of this:")
            console.log(cyjsWidget);
            this.cy = cytoscape({
               container: document.getElementById('cyDiv'),
               layout: {name: 'preset'},
          ready: function(){
            console.log("small cyjs network ready");
            console.log("ready's notion of this:")
            console.log(this);
            cyjsWidget.cy = this;
            window.cy = this;  // for easy debugging
            console.log("ready's notion of cyjsWidget:")
            console.log(cyjsWidget);
            console.log("calling this.fit")
            //cyWidget.cy.fit(100);
            console.log("--- about to call loadGraph")
            //cyjsWidget.loadGraph("priyanka.json");
            //cyjsWidget.loadStyle("style.js");
            //cyjsWidget.cy.layout({"name": "grid"});
            console.log("    back from loadGraph")
            cyjsWidget.cy.on("select", function(){
               console.log("calling updateSelectionToKernel, on select");
               cyjsWidget.updateSelectionToKernel(cyjsWidget);
               });
            cyjsWidget.cy.on("unselect", function(){
               console.log("calling updateSelectionToKernel, on unselect");
               cyjsWidget.updateSelectionToKernel(cyjsWidget);
               });
            } // ready
           })},

        updateSelectionToKernel: function(cyjsWidget){
           console.log("*** entering updateSelectionToKernel") 
           var selectedNodes = cyjsWidget.cy.nodes(":selected");
           var selectedNodeIDs = selectedNodes.map(function(n){return (n.data("name") )})
           var selectedEdges = cyjsWidget.cy.edges(":selected");
           var selectedNodeCount = selectedNodes.length;
           var selectedEdgeCount = selectedEdges.length;
           console.log("selected nodes: " + selectedNodeCount);
           console.log("selected edGes:" + selectedEdgeCount);
           var jsonString = JSON.stringify({cmd: "updateSelectedNodes",
                                            status: "request",
                                            callback: "",
                                            payload: selectedNodeIDs});
           console.log(" *** jsonString: ")
           console.log(jsonString);
           cyjsWidget.model.set("msgFromBrowser", jsonString);
           console.log("    after setting 'msgFromBrowser");
           cyjsWidget.touch();
           },
        
        loadStyle: function(filename){
           var cyObj = this.cy;
           console.log("cyjsWidget.loadStyle: " + filename)
           console.log("loadStyle's notion of this:");
           console.log(this);
           console.log("loadStyle's notion of cy:");
           console.log(cyObj);
           var str = window.location.href;
           var url = str.substr(0, str.lastIndexOf("/")) + "/" + filename;
           url = url.replace("/notebooks/", "/files/");
           console.log("about to getScript: " + url);
           $.getScript(url)
              .done(function(script, textStatus) {
                 console.log(textStatus);
                 cyObj.style(vizmap);
                 })
             .fail(function( jqxhr, settings, exception ) {
                console.log("getScript error trying to read " + filename);
                console.log("exception: ");
                console.log(exception);
                });
          },
        
        loadGraph: function(filename){
           console.log("entering loadGraph");
           var cyObj = this.cy;
              // the robust url of a file in the same directory as the notebook is
              // str.substring(0, str.lastIndexOf("/"));
           var str = window.location.href;
           var url = str.substr(0, str.lastIndexOf("/")) + "/" + filename;
           url = url.replace("/notebooks/", "/files/");
           console.log("=== about to getScript on " + url);
           $.getScript(url)
              .done(function(script, textStatus) {
                 console.log("getScript: " + textStatus);
                 console.log("nodes: " + network.elements.nodes.length);
                 if(typeof(network.elements.edges) != "undefined")
                    console.log("edges: " + network.elements.edges.length);
                cyObj.add(network.elements);  // no positions yet
                cyObj.nodes().map(function(node){node.data({degree: node.degree()})});
                cyObj.layout({"name": "grid"});
                cyObj.fit(150);
                }) // .done
            .fail(function(jqxhr, settings, exception) {
               console.log("addNetwork getscript error trying to read " + filename);
               });
           },
        
        render: function() { 
            console.log("entering render")
            this.$el.append(this.createDiv());
            this.listenTo(this.model, 'change:frameHeight', this.frameDimensionsChanged, this);
            this.listenTo(this.model, 'change:msgFromKernel', this.dispatchRequest, this);
            var cyjsWidget = this;
            function myFunc(){
               cyjsWidget.createCanvas()
               }
            setTimeout(myFunc, 500);
            },

        setNodeAttributes: function(attributeName, nodeNames, values){
          console.log("entering setNodeAttributes")
          console.log("have " + nodeNames.length + " values for attribute " + attributeName);
          for(var i=0; i < nodeNames.length; i++){
             var name = nodeNames[i];
             var newValue = values[i];
             var filterString = "[name='" + name + "']";
             console.log("filterString: " + filterString);
             console.log("nodeName: " + name + "   value: " + newValue);
             var dataObj = this.cy.nodes().filter(filterString).data();
             Object.defineProperty(dataObj, attributeName, {value: newValue});
             }// for i
         }, // setNodeAttributes
        
        setEdgeAttributes: function(attributeName, sourceNodes, targetNodes, edgeTypes, attributeValues){
            for(var i=0; i < sourceNodes.length; i++){
              var selectorString = "edge[source='" + sourceNodes[i] + "'][target='" + targetNodes[i] +
                                   "'][edgeType='" + edgeTypes[i] + "']";
              console.log(selectorString);
              console.log("eda value: " + attributeValues[i]);
              var dataObj = cy.edges().filter(selectorString).data();
              if(dataObj != undefined){
                 Object.defineProperty(dataObj, attributeName, 
                                       {value: attributeValues[i], configurable: true});
                 }                  
             } // for i
          }, // setEdgeAttributes
       
        dispatchRequest: function(){
           console.log("dispatchRequest");
           var msgRaw = this.model.get("msgFromKernel");
           var msg = JSON.parse(msgRaw);
           console.log(msg);
           console.log("========================");
           console.log(this);
           switch(msg.cmd) {
              case 'deleteGraph':
                this.cy.edges().remove();
                this.cy.nodes().remove();
                break;
              case 'addGraph':
                 var g = msg.payload;
                 console.log("addGraph request")
                 console.log(g)
                 this.cy.add(g.elements)
                 break;
              case 'layout':
                 var layoutName = msg.payload;
                 this.cy.layout({"name": layoutName})
                 break;
              case 'setPosition':
                var positionObjects = msg.payload;
                console.log("calling setPosition map");
                positionObjects.map(function(e){
                  var tag="[id='" + e.id + "']";
                  cy.$(tag).position({x: e.x, y:e.y});
                  });
                break;
              case 'setNodeAttributes':
                var attributeName = msg.payload.attributeName;
                var nodeNames = msg.payload.nodeNames;
                var values = msg.payload.values;
                this.setNodeAttributes(attributeName, nodeNames, values);
                this.cy.style().update();
                break;
                   
              case 'setEdgeAttributes':
                var attributeName = msg.payload.attributeName;
                var sourceNames = msg.payload.sourceNames;
                var targetNames = msg.payload.targetNames;
                var edgeTypes = msg.payload.edgeTypes;
                var attributeValues = msg.payload.values;
                console.log("js setEdgeAttributes, count = " + sourceNames.length);
                if(typeof(sourceNames) == "string") sourceNames = [sourceNames];
                if(typeof(targetNames) == "string") targetNames = [targetNames];
                if(typeof(edgeTypes) == "string") edgeTypes = [edgeTypes];
                this.setEdgeAttributes(attributeName, sourceNames, targetNames, edgeTypes, attributeValues);
                this.cy.style().update()
                break;
                   
              case 'loadStyleFile':
                var styleFile = msg.payload;
                this.loadStyle(styleFile);
                break;
              case 'fit':
                 var margin = msg.payload;
                 console.log("fit with margin: " + margin)
                 this.cy.fit(margin);
                 break;

               case 'fitSelected':
                 var margin = msg.payload;
                 console.log("fit with margin: " + margin)
                 this.cy.fit(this.cy.nodes(":selected"), margin);
                 break;

              case 'getSelectedNodes':
                 var selectedNodes = this.cy.filter("node:selected").map(function(node){ 
                     return node.data().id});
                  console.log("-- found these selected nodes: ");
                  console.log(selectedNodes);
                  var jsonString = JSON.stringify({cmd: "storeSelectedNodes",
                                                status: "reply",
                                                callback: "",
                                                payload: selectedNodes})
                  console.log(" *** jsonString: ")
                  console.log(jsonString);
                  this.model.set("msgFromBrowser", jsonString);
                  console.log("    after setting 'msgFromBrowser");
                  this.touch();
                  break;
               case 'selectNodes':
                  var nodeNames = msg.payload;
                  console.log("--- selecting these nodes: " + nodeNames);
                  if(typeof(nodeNames) == "string")
                     nodeNames = [nodeNames];
                 var filterStrings = [];
                 for(var i=0; i < nodeNames.length; i++){
                   var s = '[name="' + nodeNames[i] + '"]';
                   filterStrings.push(s);
                   } // for i
                var nodesToSelect = this.cy.nodes(filterStrings.join());
                nodesToSelect.select()
                break;
              case 'clearSelection':
                 this.cy.nodes().unselect();
                 break;
            default:
               console.log("unrecognized msg.cmd: " + msg.cmd);
             } // switch
           console.log("CONCLUDING dispatchRequest")
           }, 
        
        frameDimensionsChanged: function(){
           console.log("frameDimensionsChanged");
           var newHeight = this.model.get("frameHeight");
           console.log("frameHeight: "  + newHeight);
           $("#cyOuterDiv").height(newHeight);
           this.cy.resize();
           }, 
        
        events: {
           //"click #svg": "changeHandler"
           }

    });

module.exports = {
   CyjsModel: CyjsModel,
   CyjsView:  CyjsView
   };

