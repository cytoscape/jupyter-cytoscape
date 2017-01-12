FROM jupyter/base-notebook
ADD . /home/jovyan/work
WORKDIR /home/jovyan/work

USER root
RUN chown -R jovyan:users /home/jovyan/work && wget https://deb.nodesource.com/setup_6.x && \
    bash setup_6.x && apt-get install -y nodejs pkg-config gcc libigraph0-dev

USER $NB_USER
RUN conda update -y pip && conda install -y pandas && \
    npm install webpack -g && pip install python-igraph && \
    cd js && npm update && webpack --config webpack.config.js && \
    cd .. && pip install -e . && \
    cd js && npm install && \
    jupyter nbextension install --user --py cyjs && \
    jupyter nbextension enable --py --sys-prefix widgetsnbextension && \
    jupyter nbextension enable --user --py --sys-prefix cyjs
