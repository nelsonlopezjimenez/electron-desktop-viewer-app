# Basic Computer &amp; Technology Tutorials

## Overview

This app will open the directory "C:\websites\edu.gcfglobal.org" and display a list of the tutorial pages. The user may then navigate
to the tutorial of their choice within that category.

### Setup
**Note:** In order to ensure the app functions correctly, ensure the gcfglobal directory is located in the C:\websites directory and the desired 
zip files are extracted.

Then run the following script:

```sh 
npm run extract
```

This will extract the node modules archive and you will be ready to cotinue with the rest of the  fun!

To run the appin dev mode, run :
```sh
npm start
```

### Preparing for production

The powers that be should run the following script:

```sh
npm run package
```

This will compile the executable that can then be supplied to the end users.