FROM ubuntu

ADD . /workdir
WORKDIR /workdir
RUN apt update && apt install -y make python-igraph npm nodejs-legacy wget python python-dev && \
    wget https://bootstrap.pypa.io/get-pip.py && python get-pip.py && pip2 install -U pandas jupyter && npm install webpack -g && \
    cd js && npm update && webpack --config webpack.config.js && \
    cd .. && pip2 install -e . && \
    cd js && npm install && \
    python -m jupyter nbextension install --user --py cyjs && \
    python -m jupyter nbextension enable --py --sys-prefix widgetsnbextension && \
    python -m jupyter nbextension enable --user --py --sys-prefix cyjs

ENV TINI_VERSION v0.6.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /usr/bin/tini
RUN chmod +x /usr/bin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

EXPOSE 8888
CMD ["jupyter", "notebook", "--port=8888", "--no-browser", "--ip=0.0.0.0"]
