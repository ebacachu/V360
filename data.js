var APP_DATA = {
  "scenes": [
    {
      "id": "0-embalse",
      "name": "Embalse",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 3000,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.007773159904873594,
          "pitch": 0.11918997784918339,
          "rotation": 6.283185307179586,
          "target": "1-presa"
        },
        {
          "yaw": -0.05324390760046782,
          "pitch": -0.062007966273947446,
          "rotation": 0,
          "target": "2-presa-aguas-abajo"
        },
        {
          "yaw": -0.0576711263777856,
          "pitch": 0.29688818702504705,
          "rotation": 3.141592653589793,
          "target": "3-presa-paramento"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-presa",
      "name": "Presa",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 3000,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.039143384161500094,
          "pitch": -0.1536723358002412,
          "rotation": 6.283185307179586,
          "target": "0-embalse"
        },
        {
          "yaw": -2.995726415943045,
          "pitch": 0.9302424265121729,
          "rotation": 3.141592653589793,
          "target": "3-presa-paramento"
        },
        {
          "yaw": -2.86885793011964,
          "pitch": 0.2567442772838877,
          "rotation": 0,
          "target": "2-presa-aguas-abajo"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-presa-aguas-abajo",
      "name": "Presa aguas abajo",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 3000,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.1460964059767349,
          "pitch": 0.4541799118032266,
          "rotation": 3.141592653589793,
          "target": "1-presa"
        },
        {
          "yaw": 0.1042784113043389,
          "pitch": 0.21137780144735885,
          "rotation": 3.141592653589793,
          "target": "0-embalse"
        },
        {
          "yaw": 0.1465573004956937,
          "pitch": 0.8104812490133142,
          "rotation": 0,
          "target": "3-presa-paramento"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-presa-paramento",
      "name": "Presa paramento",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        },
        {
          "tileSize": 512,
          "size": 4096
        }
      ],
      "faceSize": 3000,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.09448402650496845,
          "pitch": -0.1765828595877874,
          "rotation": 3.141592653589793,
          "target": "1-presa"
        },
        {
          "yaw": 0.11019029864026741,
          "pitch": -0.3197023657899223,
          "rotation": 3.141592653589793,
          "target": "2-presa-aguas-abajo"
        },
        {
          "yaw": -2.6838021643308902,
          "pitch": -0.2714301150177647,
          "rotation": 3.141592653589793,
          "target": "2-presa-aguas-abajo"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "V360",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": false,
    "fullscreenButton": true,
    "viewControlButtons": false
  }
};
