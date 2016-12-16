cyjs-jupyter
===============================

cytoscape.js in a Jupyter widget

Installation
------------

To install use pip:

    $ pip install cyjs
    $ jupyter nbextension enable --py --sys-prefix cyjs


For a development installation (requires npm),

    $ git clone https://github.com/jupyter/cyjs-jupyter.git
    $ cd cyjs-jupyter
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix cyjs
    $ jupyter nbextension enable --py --sys-prefix cyjs
