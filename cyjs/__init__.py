from ._version import version_info, __version__

from .cyjs import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'cyjs',
        'require': 'cyjs/extension'
    }]
