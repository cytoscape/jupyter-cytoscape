
import ipywidgets as widgets
import json
import time
import os.path
import igraph
from IPython.display import display
from traitlets import Int, Unicode, Tuple, CInt, Dict, validate, observe

@widgets.register('cyjs.cyjs')

class cyjs(widgets.DOMWidget):
    
    _view_name = Unicode('CyjsView').tag(sync=True)
    _view_module = Unicode('cyjs').tag(sync=True)
    frameWidth = Int(400).tag(sync=True)
    frameHeight = Int(300).tag(sync=True)
    msgFromKernel = Unicode("{}").tag(sync=True)
    msgFromBrowser = Unicode("{}").tag(sync=True)
    _incomingMessage = {};
    status = "initial status message\n"
    _selectedNodes = [];
    
        
    def addGraph(self, g):
      self._resetMessage();
      gjson = self.from_igraph(g)
      self.msgFromKernel = json.dumps({"cmd": "addGraph", "status": "request",
                                       "callback": "",    "payload": gjson});
     
    def addGraphWithLayout(self, g, layout):
      self._resetMessage();
      gjson = self.from_igraph(g, layout)
      self.msgFromKernel = json.dumps({"cmd": "addGraph", "status": "request",
                                       "callback": "",    "payload": gjson});
     
    def deleteGraph(self):
      self._resetMessage();
      self.msgFromKernel = json.dumps({"cmd": "deleteGraph", "status": "request", "callback": "", "payload": ""});
     
    def from_igraph(self, igraph_network, layout=None, scale=100.0):
        new_graph = {}
        network_data = {}
        elements = {}
        nodes = []
        edges = []
        network_attr = igraph_network.attributes() # Convert network attributes
        for key in network_attr:
            network_data[key] = igraph_network[key]
        edges_original = igraph_network.es # get network as a list of edges
        nodes_original = igraph_network.vs
        node_attr = igraph_network.vs.attributes()
        for idx, node in enumerate(nodes_original):
            new_node = {}
            data = {}
            data['id'] = str(node.index)
            data['name'] = str(node.index)
            for key in node_attr:
                data[key] = node[key]
            new_node['data'] = data
            if layout is not None:
                position = {}
                position['x'] = layout[idx][0] * scale
                position['y'] = layout[idx][1] * scale
                new_node['position'] = position
            nodes.append(new_node)
        edge_attr = igraph_network.es.attributes()  # Add edges to the elements
        for edge in edges_original:
            new_edge = {}
            data = {}
            data['source'] = str(edge.source)
            data['target'] = str(edge.target)
            for key in edge_attr:
                data[key] = edge[key]
            new_edge['data'] = data
            edges.append(new_edge)
        elements['nodes'] = nodes
        elements['edges'] = edges
        new_graph['elements'] = elements
        new_graph['data'] = network_data
        return new_graph

    
    def setHeight(self, newHeight):
      self.frameHeight = newHeight
        
    def fitSelected(self, margin=50):
      self.status += "entering fitSelected (%d)\n" % margin
      self.msgFromKernel = json.dumps({"cmd": "fitSelected", "status": "request", "callback": "", "payload": margin});
        
    def fit(self, margin=50):
      self.status += "entering fit (%d)\n" % margin
      self.msgFromKernel = json.dumps({"cmd": "fit", "status": "request", "callback": "", "payload": margin});
        
    def getSelectedNodes(self):
       return(self._selectedNodes);

    def selectNodes(self, nodes):
      self.msgFromKernel = json.dumps({"cmd": "selectNodes", "status": "request",
                                       "callback": "", "payload": nodes});

    def _resetMessage(self):   # ensures that any ensuing message is seen as novel in the browser
       self.msgFromKernel = json.dumps({"cmd": "cleanSlate", "status": "nop", "callback": "", "payload": ""});


    def availableLayouts(self):
        return(["grid", "null", "random", "cose", "circle", "concentric", "breadthfirst"]);
    
    def setPosition(self, igraph_layout):   # the somewhat cryptic object created by igraph layouts
      tblPos = []
      for i in range(0, len(igraph_layout)):
         x = igraph_layout[i][0] * 100
         y = igraph_layout[i][1] * 100
         tblPos.append({"id": i, "x": x, "y": y})
      self._resetMessage();
      self.msgFromKernel = json.dumps({"cmd": "setPosition", "status": "request", "callback": "", 
                                       "payload": tblPos});
       
    def loadStyleFile(self, filename):
      if(not os.path.isfile(filename)):
        print("file '%s' not found" % filename)
        return;
      self._resetMessage();
      self.msgFromKernel = json.dumps({"cmd": "loadStyleFile", "status": "request", "callback": "", 
                                       "payload": filename});
        
    def layout(self, name):
      self._resetMessage();
      self.msgFromKernel = json.dumps({"cmd": "layout", "status": "request", "callback": "", "payload": name});
        
        
    def clearSelection(self):
      self._resetMessage();
      self. msgFromKernel = json.dumps({"cmd": "clearSelection", "status": "request",
                                        "callback": "", "payload": ""});
        
       # g parameter unused, temporarily establishes symmetry with setEdgeAttributes
    def setNodeAttributes(self, g, attributeName, nodeNames, values):
      self._resetMessage();
      self. msgFromKernel = json.dumps({"cmd": "setNodeAttributes", "status": "request",
                                        "callback": "", 
                                        "payload": {"attributeName": attributeName,
                                                    "nodeNames": nodeNames,
                                                    "values": values}})

    def setEdgeAttributes(self, g, attributeName, sourceNames, targetNames, edgeTypes, values):
        # g to be a class member variable?
        # nodeMap also, with vigilance for modification of underlying graph?
        # id lookup a member function?
      names = g.vs['name']
      ids = [g.vs.find(name).index for name in g.vs['name']]
      nodeMap = dict(zip(names, ids))
      sourceIDs = [nodeMap[name] for name in sourceNames]
      targetIDs = [nodeMap[name] for name in targetNames]
      self._resetMessage(); 
      self. msgFromKernel = json.dumps({"cmd": "setEdgeAttributes", "status": "request",
                                        "callback": "", 
                                        "payload": {"attributeName": attributeName,
                                                    "sourceNames": sourceIDs,
                                                    "targetNames": targetIDs,
                                                    "edgeTypes": edgeTypes,
                                                    "values": values}})

    @observe('msgFromBrowser')
    def msg_arrived(self, change):
       self.status += "msgFromBrowser has arrived: %f\n" % time.time()
       rawMessage = change['new']
       self._incomingMessage = json.loads(rawMessage)
       cmd = self._incomingMessage["cmd"]
       self.status += "msg: %s\n"  % cmd
       if(cmd == "updateSelectedNodes"):
          self._selectedNodes = self._incomingMessage["payload"]
         
    def getResponse(self):
       return(self._incomingMessage["payload"])

    def getFullResponse(self):
       return(self._incomingMessage)

