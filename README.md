jupyter-cytoscape
===============================

cytoscape.js in a Jupyter notebook widget

![demo notebook](screenshot.png)

Installation
------------

This is an early alpha release, best suited to developers. To install:

* [install anaconda](https://www.continuum.io/downloads) (or update if it is already installed: `conda update anaconda`)
* install npm and webpack
* cd to your local github repo root directory
* `git clone https://github.com/cytoscape/jupyter-cytoscape.git`
* cd jupyter-cytoscape
* make
    
A stand-alone version, useful for quick developer experiments, and <b><i>not</i></b> packaged up into a jupyter nbextension, is found in <i>./standalone/devel/</i>

Docker Notes
------------
Kozo Nishida contributed a Dockerfile, very useful for secure and reproducible execution of a notebook.
Here are my notes - an amalgam of Kozo's instructions, Mike Smoot's suggestions, and my own experiments:

````
docker build -t jupytercy .  # in repo's root directory, where Dockerfile is located
docker images
docker run -d -p 8888:8888 jupytercy
docker ps   # reports the image name 
docker exec -it <image name> jupyter notebook list
````
Now browse to the url reported by `docker exec`
