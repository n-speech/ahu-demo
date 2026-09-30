const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, file) {
    if (file.endsWith('.glb')) res.setHeader('Content-Type', 'model/gltf-binary');
    if (file.endsWith('.usdz')) res.setHeader('Content-Type', 'model/vnd.usdz+zip');
  }
}));

app.listen(PORT, () => console.log(`AHU demo running on port ${PORT}`));
