let ags;
function createModelsByThreejs(agsParam) {
  ags = agsParam;
  ags.meshArray4threejs = [];
  ags.meshArray14threejs = [];
  // ags.spatialReference4sightLine = SpatialReference.WGS84;
  ags.spatialReference4sightLine = ags.spatialReference4549;
  // 白模模型的key
  // ags.key_model1_localStorage = 'modelWhiteFlag'; // 白模
  ags.key_model1_localStorage = 'modelProgram1Flag4threejs'; // 方案1模型
  localStorage.setItem(ags.key_model1_localStorage, true);
  console.log(
    '模型1的状态：' + localStorage.getItem(ags.key_model1_localStorage),
  );
  let count4model = 0;
  let model1Array4threejs = [];
  // let modelWhiteArray4threejs = [];
  if (count4model !== 0) {
    count4model = 0;
  }
  const model1Flag = localStorage.getItem(ags.key_model1_localStorage);
  if (model1Flag) {
    // 如果文件缓存中有顶点数据，直接读取，保证只解析一次，不重复解析
    console.log('文件缓存有数据，threejs直接读取顶点数据');
    // 先取文件缓存中的顶点数据
    model1VertexDataLoader().then((response1) => {
      // model1Array4threejs = JSON.parse(response.data);
      model1Array4threejs = response1.data;
      console.log(
        'threejs获取到模型1顶点数据,模型个数：' + model1Array4threejs.length,
      );
      drawModelStart(model1Array4threejs);
    });
  } else {
    // 如果文件缓存中没有顶点数据，则解析顶点数据，只解析一次，解析完写入文件
    console.log('文件缓存没有数据，开始解析...');
    // resolveVertexDataPrepare(nodeNameArray[count4model]);
  }
}
// threejs正式开始绘制模型
function drawModelStart(model1Array) {
  // const modelOpacity = 1;
  const modelOpacity = 0;
  const modelExternalRenderer = {
    renderer: null, // three.js renderer
    camera: null, // three.js camera
    scene: null, // three.js scene
    ambient: null, // three.js ambient light source
    sun: null, // three.js sun light source
    /**
     * Setup function, called once by the ArcGIS JS API.
     */
    setup: (context4webscene) => {
      // initialize the three.js renderer
      modelExternalRenderer.renderer = {};
      modelExternalRenderer.renderer = new THREE.WebGLRenderer({
        context: context4webscene.gl,
        premultipliedAlpha: false,
      });
      modelExternalRenderer.renderer.setPixelRatio(window.devicePixelRatio);
      modelExternalRenderer.renderer.setViewport(
        0,
        0,
        ags.view.width,
        ags.view.height,
      );

      // prevent three.js from clearing the buffers provided by the ArcGIS JS API.
      modelExternalRenderer.renderer.autoClearDepth = false;
      modelExternalRenderer.renderer.autoClearStencil = false;
      modelExternalRenderer.renderer.autoClearColor = false;

      // this.renderer.autoClearDepth = true;
      // this.renderer.autoClearStencil = true;
      // this.renderer.autoClearColor = true;

      // The ArcGIS JS API renders to custom offscreen buffers, and not to the default framebuffers.
      // We have to inject this bit of code into the three.js runtime in order for it to bind those
      // buffers instead of the default ones.
      const originalSetRenderTarget = modelExternalRenderer.renderer.setRenderTarget.bind(
        modelExternalRenderer.renderer,
      );
      modelExternalRenderer.renderer.setRenderTarget = (target) => {
        originalSetRenderTarget(target);
        if (target === null) {
          context4webscene.bindRenderTarget();
        }
      };

      // setup the three.js scene

      modelExternalRenderer.scene = new THREE.Scene();
      ags.scene4threejs = modelExternalRenderer.scene;

      // setup the camera
      modelExternalRenderer.camera = new THREE.PerspectiveCamera();

      // setup scene lighting
      modelExternalRenderer.ambient = new THREE.AmbientLight(0xffffff, 0.5);
      modelExternalRenderer.scene.add(modelExternalRenderer.ambient);
      modelExternalRenderer.sun = new THREE.DirectionalLight(0xffffff, 0.5);
      modelExternalRenderer.scene.add(modelExternalRenderer.sun);

      // 创建 解析后的立方体 start 20180723
      // 为几何体设置faces属性，用于设置顶点的连接规则 start
      // var colorRed = new THREE.Color(0xff0000); // 顶点1颜色——红色
      // var colorGreen = new THREE.Color(0x00ff00); // 顶点2颜色——绿色
      // var colorBlue = new THREE.Color(0x0000ff); // 顶点3颜色——蓝色
      var colorYellow = new THREE.Color(0xffff00); // 顶点3颜色——黄色
      const colorWhite = new THREE.Color(0xffffff); // 顶点3颜色——白色

      let coordinateArrayTemp = [];
      let coordinateTemp;
      let transform;
      // 第一个模型绘制 start
      const length4model1Array = model1Array.length;
      console.log('length4model1Array:' + length4model1Array);
      let verticesArray;
      let verticesUvArray;
      let nodeName;
      for (let m1 = 0; m1 < length4model1Array; m1 += 1) {
        // 获取模型的顶点数组
        verticesArray = model1Array[m1].positionArray;
        verticesUvArray = model1Array[m1].uvArray;
        nodeName = model1Array[m1].nodeName;
        // 声明一个空几何体
        const geometry = new THREE.Geometry();
        const length4verticesArray = verticesArray.length - 8;
        // 设置顶点坐标
        for (let i1 = 0; i1 < length4verticesArray; i1 += 9) {
          // 为几何体设置第1个顶点（即：构造骨架） start
          coordinateArrayTemp = [];
          coordinateTemp = verticesArray[i1];
          coordinateArrayTemp.push(coordinateTemp);
          coordinateTemp = verticesArray[i1 + 1];
          coordinateArrayTemp.push(coordinateTemp);
          coordinateTemp = verticesArray[i1 + 2];
          coordinateArrayTemp.push(coordinateTemp);

          transform = new THREE.Matrix4();
          transform.fromArray(
            externalRenderers.renderCoordinateTransformAt(
              ags.view,
              coordinateArrayTemp,
              ags.spatialReference4sightLine,
              new Array(16),
            ),
          );

          geometry.vertices.push(
            new THREE.Vector3(
              transform.elements[12],
              transform.elements[13],
              transform.elements[14],
            ),
          );
          // 为几何体设置第1个顶点（即：构造骨架） end
          // 为几何体设置第2个顶点（即：构造骨架） start
          coordinateArrayTemp = [];
          coordinateTemp = verticesArray[i1 + 3];
          coordinateArrayTemp.push(coordinateTemp);
          coordinateTemp = verticesArray[i1 + 4];
          coordinateArrayTemp.push(coordinateTemp);
          coordinateTemp = verticesArray[i1 + 5];
          coordinateArrayTemp.push(coordinateTemp);

          transform = new THREE.Matrix4();
          transform.fromArray(
            externalRenderers.renderCoordinateTransformAt(
              ags.view,
              coordinateArrayTemp,
              ags.spatialReference4sightLine,
              new Array(16),
            ),
          );
          geometry.vertices.push(
            new THREE.Vector3(
              transform.elements[12],
              transform.elements[13],
              transform.elements[14],
            ),
          );
          // 为几何体设置第2个顶点（即：构造骨架） end
          // 为几何体设置第3个顶点（即：构造骨架） start
          coordinateArrayTemp = [];
          coordinateTemp = verticesArray[i1 + 6];
          coordinateArrayTemp.push(coordinateTemp);
          coordinateTemp = verticesArray[i1 + 7];
          coordinateArrayTemp.push(coordinateTemp);
          coordinateTemp = verticesArray[i1 + 8];
          coordinateArrayTemp.push(coordinateTemp);

          transform = new THREE.Matrix4();
          transform.fromArray(
            externalRenderers.renderCoordinateTransformAt(
              ags.view,
              coordinateArrayTemp,
              ags.spatialReference4sightLine,
              new Array(16),
            ),
          );
          geometry.vertices.push(
            new THREE.Vector3(
              transform.elements[12],
              transform.elements[13],
              transform.elements[14],
            ),
          );
          // 为几何体设置第3个顶点（即：构造骨架） end
        }
        const verticesNum = geometry.vertices.length;
        // console.log('顶点总数:' + verticesNum);
        // 设置顶点索引
        for (let j1 = 0; j1 < verticesNum; j1 += 3) {
          const face = new THREE.Face3(j1, j1 + 1, j1 + 2); // 创建三角面，第1个，第2个，第3个顶点连接成一个三角面
          // face.vertexColors.push(colorRed, colorRed, colorRed);// 定义三角面三个顶点的颜色
          // face.vertexColors.push(colorYellow, colorYellow, colorYellow);// 定义三角面三个顶点的颜色
          // face.vertexColors.push(colorWhite, colorWhite, colorWhite); // 定义三角面三个顶点的颜色
          geometry.faces.push(face);
        }
        geometry.computeFaceNormals(); // 自动生成法向量

        // 设置 纹理映射 start
        // 是为 三角面设置 uv坐标  原来如此！
        // const facesNum = geometry.faces.length;
        // console.log('顶点总数:' + verticesNum);
        // console.log('面的总数：' + facesNum);
        // for (let i1 = 0; i1 < verticesUvArray.length - 5; i1 += 6) {
        //   geometry.faceVertexUvs[0].push([
        //     new THREE.Vector2(verticesUvArray[i1], verticesUvArray[i1 + 1]),
        //     new THREE.Vector2(verticesUvArray[i1 + 2], verticesUvArray[i1 + 3]),
        //     new THREE.Vector2(verticesUvArray[i1 + 4], verticesUvArray[i1 + 5]),
        //   ]);
        // }

        // 设置 纹理映射  end
        // const textureUrl1 =
        //   window.appcfg.meshTextureUrl +
        //   nodeName +
        //   '/textures/0_0';
        // const material1 = new THREE.MeshPhongMaterial({
        //   transparent: true,
        //   opacity: modelOpacity,
        //   map: new THREE.TextureLoader().load(textureUrl1),
        // });
        const material1 = new THREE.MeshBasicMaterial({
          color: 0x800080,
          // color: 0xffffff,
          transparent: true,//想要使用透明度 必须需要这个属性 wangfh 20190722
          opacity: modelOpacity,
          visible:false //这个visible可以的！这样就看不到three.js绘制的模型了 wangfh 20190722
          // side: THREE.DoubleSide,
        });
        // 创建面对象[即一个平面网格对象](使用Mesh类 组合几何体[即骨架]和材质[即皮肤]，成为一个网格对象)
        const meshObj = new THREE.Mesh(geometry, material1); // 平面网格模型对象  ，此外还有 立体网格模型对象
        // meshObj.visible = false; // 默认不可见
        modelExternalRenderer.scene.add(meshObj);
        ags.meshArray14threejs.push(meshObj);
        // console.log('第' + (m1 + 1) + '个模型绘制完成');
      }
      console.log('模型1绘制完成,可以进行分析 ');
      // 第一个模型绘制 end

      // 第二个模型绘制 start

      ags.flag_modelThreejs = true;
      // 设置scenelayer图层不可见 start
      // const sceneLayer = ags.view.map.layers.find((l) => {
      //   return l.title === '方案1建筑模型_超高'; // 方案1建筑模型_超高
      // });
      // sceneLayer.visible = false;
      // const sceneLayer2 = ags.view.map.layers.find((l) => {
      //   return l.title === '方案2建筑模型'; // 方案2建筑模型
      // });
      // sceneLayer2.visible = false;
      // 设置scenelayer图层不可见 end
      // 默认方案 ： 1
      ags.projectChoosed = 1;
      ags.modelExternalRendererNum = 1; // 只绘制一次

      // cleanup after ourselfs
      context4webscene.resetWebGLState();
    },

    render: (context4webscene) => {
      // update camera parameters
      const cam = context4webscene.camera;

      modelExternalRenderer.camera.position.set(
        cam.eye[0],
        cam.eye[1],
        cam.eye[2],
      );
      modelExternalRenderer.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
      modelExternalRenderer.camera.lookAt(
        new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2]),
      );

      // Projection matrix can be copied directly
      modelExternalRenderer.camera.projectionMatrix.fromArray(
        cam.projectionMatrix,
      );

      ags.camera4modelEdit = modelExternalRenderer.camera;

      // update lighting
      // ags.view.environment.lighting.date = Date.now();

      const l = context4webscene.sunLight;
      modelExternalRenderer.sun.position.set(
        l.direction[0],
        l.direction[1],
        l.direction[2],
      );
      modelExternalRenderer.sun.intensity = l.diffuse.intensity;
      modelExternalRenderer.sun.color = new THREE.Color(
        l.diffuse.color[0],
        l.diffuse.color[1],
        l.diffuse.color[2],
      );

      modelExternalRenderer.ambient.intensity = l.ambient.intensity;
      modelExternalRenderer.ambient.color = new THREE.Color(
        l.ambient.color[0],
        l.ambient.color[1],
        l.ambient.color[2],
      );

      // draw the scene
      // modelExternalRenderer.renderer.resetGLState();

      modelExternalRenderer.renderer.state.reset(); // .resetGLState()已被弃用，替换为.state.reset()

      modelExternalRenderer.renderer.render(
        modelExternalRenderer.scene,
        modelExternalRenderer.camera,
      );

      if (ags.status4model === 'sightline') {
        // 进来判断后就必须设置状态不再进入！ 20180901
        ags.status4model = 'model';
        if (!ags.sightlineFlag) {
          // 1、绘制检测线 start
          // 直线(曲线的一种) start
          // 视线起点-threejs
          const lineStartGeo = coordinateTransformation(
            'geo2threejs',
            ags.point4observationSL,
          );
          // 视线终点-threej
          const lineEndGeo = coordinateTransformation(
            'geo2threejs',
            ags.point4targetSL,
          );
          ags.point4observationVector = new THREE.Vector3(
            lineStartGeo.x,
            lineStartGeo.y,
            lineStartGeo.z,
          );
          ags.point4targetVector = new THREE.Vector3(
            lineEndGeo.x,
            lineEndGeo.y,
            lineEndGeo.z,
          );
          const geometry = new THREE.Geometry();
          geometry.vertices.push(ags.point4observationVector);
          geometry.vertices.push(ags.point4targetVector);
          const material = new THREE.LineBasicMaterial({
            linewidth: 15,
            color: get0xColor('blue'),
            transparent: true,
            opacity: 0,
          });
          ags.sightLineThreejs = new THREE.Line(geometry, material);
          ags.sightlineThreejsArray.push(ags.sightLineThreejs);
          modelExternalRenderer.scene.add(ags.sightLineThreejs);
          ags.sightlineFlag = true;
          // 1、绘制检测线 end
          // 2、开始进行检测！start
          startCheck(ags.meshArray14threejs);
        }
      }
      // as we want to smoothly animate the ISS movement, immediately request a re-render
      // 绘制完后不再请求 ， 优化效率 ,必须优化！ start 20180812
      externalRenderers.requestRender(ags.view);
      // 绘制完后不再请求 ， 优化效率 ,必须优化!  end 20180812

      // cleanup
      context4webscene.resetWebGLState();
    },
  };
  // register the external renderer
  externalRenderers.add(ags.view, modelExternalRenderer);
}
function startCheck(meshArray) {
  console.log('开始检测...');
  /**
   *  功能：检测 sightLineThreejs 是否与数组 collideMeshList 中的元素发生了碰撞
   *
   */
  let countTemp = 0;
  // var originPoint = sightLineThreejs.position.clone();
  const positionX =
    (ags.point4targetVector.x + ags.point4observationVector.x) / 2;
  const positionY =
    (ags.point4targetVector.y + ags.point4observationVector.y) / 2;
  const positionZ =
    (ags.point4targetVector.z + ags.point4observationVector.z) / 2;
  const originPoint = new THREE.Vector3(positionX, positionY, positionZ);
  let flag = false;
  let collisionObj;
  const length4vertices = ags.sightLineThreejs.geometry.vertices.length;
  for (let vertexIndex = 0; vertexIndex < length4vertices; vertexIndex += 1) {
    // 顶点原始坐标
    const localVertex = ags.sightLineThreejs.geometry.vertices[
      vertexIndex
    ].clone();
    // 顶点经过变换后的坐标
    const globalVertex = localVertex.applyMatrix4(ags.sightLineThreejs.matrix);
    // 获得由中心指向顶点的向量
    // var directionVector = globalVertex.sub(sightLineThreejs.position);
    const directionVector = globalVertex.sub(originPoint);

    // 将方向向量初始化
    const ray = new THREE.Raycaster(
      originPoint,
      directionVector.clone().normalize(),
    );
    // 检测射线与多个物体的相交情况
    const collisionResults = ray.intersectObjects(meshArray);
    // 如果返回结果不为空，且交点与射线起点的距离小于物体中心至顶点的距离，则发生了碰撞
    const length4result = collisionResults.length;
    if (length4result > 0) {
      for (let i = 0; i < length4result; i += 1) {
        if (collisionResults[i].distance < directionVector.length()) {
          if (collisionResults.length > 0) {
            countTemp = countTemp + 2 - 1;
            console.log('相交的建筑的个数 :' + countTemp);
            // collisionResults[i].object.material.color.set(0xff0000);
            // collisionResults[i].object.visible = false; // 设置模型不可见 不能这么设置，不是长久之计！
            collisionObj = collisionResults[i];
            flag = true; // wangfh
          }
        }
      }
      if (flag) {
        // 移除之前的用于碰撞检测的线对象
        if (ags.sightLineThreejs) {
          ags.scene4threejs.remove(ags.sightLineThreejs);
        }
        getPointIntersectedByThreejs(collisionObj);
        break; // 找到一个相交即可，立刻跳出循环，不用再判断了

      } else {
        console.log('相交的点没有价值，全绿色');
        if (ags.sightLineThreejs) {
          ags.scene4threejs.remove(ags.sightLineThreejs);
        }
      }
    } else {
      console.log('返回加过为空，没有相交的点，全绿色');
      if (ags.sightLineThreejs) {
        ags.scene4threejs.remove(ags.sightLineThreejs);
      }
    }
  }
  console.log('分析完毕');
  console.log('初始化视线分析变量，准备下一次分析');
  ags.point4observationSL = null;
  ags.point4targetSL = null;
  if (ags.handle4pointerMoveSL) {
    console.log('鼠标移动事件清除完成');
    ags.handle4pointerMoveSL.remove();
    ags.handle4pointerMoveSL = null;
  }
  ags.countPoint4sightline = 0;
}
// three.js的intersectObjects方法的返回值里有相交点的信息！20180703
function getPointIntersectedByThreejs(collisionObj) {
  const pointInterseted = collisionObj.point;
  console.log('开始绘制视线分析结果');
  // 先清空
  ags.graphicsLayer4sl.removeAll();
  // 起点和靠近起点的那个相交点连线，绿色 start
  const pointIntersetedGeo = coordinateTransformation(
    'threejs2geo',
    pointInterseted,
  );
  const lineStart1 = coordinateTransformation(
    'threejs2geo',
    ags.point4observationVector,
  );
  const lineEnd1 = pointIntersetedGeo;
  const polyline4visible = new Polyline({
    paths: [
      [lineStart1.x, lineStart1.y, lineStart1.z],
      [lineEnd1.x, lineEnd1.y, lineEnd1.z],
    ],
    spatialReference: ags.spatialReference4sightLine,
  });
  addGraphic4slAnalysis(polyline4visible, 'polyline', 'green');

  // 起点和靠近起点的那个相交点连线，绿色 end
  // 终点和靠近终点的那个相交点连线，红色 start
  const lineStart2 = pointIntersetedGeo;
  const lineEnd2 = coordinateTransformation(
    'threejs2geo',
    ags.point4targetVector,
  );
  const polyline4invisible = new Polyline({
    paths: [
      [lineStart2.x, lineStart2.y, lineStart2.z],
      [lineEnd2.x, lineEnd2.y, lineEnd2.z],
    ],
    spatialReference: ags.spatialReference4sightLine,
  });
  addGraphic4slAnalysis(polyline4invisible, 'polyline', 'red');
  ags.sightlineFlag = false;
  // 终点和靠近终点的那个相交点连线，红色 end
}
function addGraphic4slAnalysis(
  geometryParam,
  type,
  colorString,
  graphicsLayerFinal,
) {
  let symbolParam;
  if (type === 'polygon') {
    symbolParam = new SimpleFillSymbol({
      color: colorString,
      outline: {
        // autocasts as new SimpleLineSymbol()
        // color: [255, 255, 255],
        color: 'blue',
        width: 10,
      },
    });
  } else if (type === 'polyline') {
    let lineWidth;
    if (graphicsLayerFinal) {
      lineWidth = '4px';
    } else {
      lineWidth = '4px';
    }
    symbolParam = new SimpleLineSymbol({
      color: colorString,
      width: lineWidth,
      style: 'short-dot',
    });
  } else if (type === 'point') {
    symbolParam = new SimpleMarkerSymbol({
      color: colorString,
      size: '7px',
      // outline: {
      //   // autocasts as new SimpleLineSymbol()
      //   color: 'yellow',
      //   width: 1,
      // },
    });
  }
  const graphic = new Graphic({
    geometry: geometryParam,
    symbol: symbolParam,
  });

  if (graphicsLayerFinal) {
    graphicsLayerFinal.add(graphic);
  } else {
    ags.graphicsLayer4sl.add(graphic);
  }
  return graphic;
}
// 坐标转换
function coordinateTransformation(type, pointObj) {
  const pointObjNew = {};
  if (type === 'geo2threejs') {
    // console.log('地理坐标系转到three.js坐标系');
    const positionGeographic = [pointObj.x, pointObj.y, pointObj.z];
    const transform = new THREE.Matrix4();
    transform.fromArray(
      externalRenderers.renderCoordinateTransformAt(
        ags.view,
        positionGeographic,
        ags.spatialReference4sightLine,
        new Array(16),
      ),
    );
    pointObjNew.x = transform.elements[12];
    pointObjNew.y = transform.elements[13];
    pointObjNew.z = transform.elements[14];
  } else if (type === 'threejs2geo') {
    // console.log('three.js坐标系转到地理坐标系');
    // 组织three.js坐标
    const positionXYZ = [pointObj.x, pointObj.y, pointObj.z];
    const positionGeographic = new Array(3);
    // 第一个0 是前面 位置数组的索引，即要转换位置数组中的第几个位置
    // 第二个0 是前面 接收转换的位置的数组的索引，即放在数组中的哪个位置。原来如此  20180814
    // 该方法（fromRenderCoordinates）可以用于将three.js坐标转换为经纬度坐标，  20180814
    externalRenderers.fromRenderCoordinates(
      ags.view,
      positionXYZ,
      0,
      positionGeographic,
      0,
      ags.spatialReference4sightLine,
      1,
    );
    pointObjNew.x = positionGeographic[0];
    pointObjNew.y = positionGeographic[1];
    pointObjNew.z = positionGeographic[2];
  }
  return pointObjNew;
}

