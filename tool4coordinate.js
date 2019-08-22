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