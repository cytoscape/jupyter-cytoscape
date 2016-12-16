default:
	(cd js; npm update)
	(cd js; webpack --config webpack.config.js)
	pip install -e .
	(cd js; npm install)
	jupyter nbextension install --user --py cyjs
	jupyter nbextension enable --user --py --sys-prefix cyjs
	(cd examples/smallNetwork; jupyter notebook smallNetwork.ipynb)

clean:
	- rm -rf js/node_modules/*
	- rm -rf js/dist/*
	- rm -rf cyjs/static/*
	- rm -rf cyjs/__pycache__
