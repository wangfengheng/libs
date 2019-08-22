function get0xColor(name) {
    let color = 0xffffff;
    if (name === '绿色' || name === 'green') {
        color = 0x00ff00;
    } else if (name === '黄色' || name === 'yellow') {
        color = 0xffff00;
    } else if (name === '蓝色' || name === 'blue') {
        color = 0x0040ff;
    } else if (name === '浅蓝色' || name === 'lightblue') {
        color = 0x00ffff;
    } else if (name === '红色' || name === 'red') {
        color = 0xff0000;
    } else if (name === '白色' || name === 'white') {
        color = 0xffffff;
    } else if (name === '白色2' || name === 'white2') {
        color = 0xf6f9ee;
    } else if (name === '白色3' || name === 'white3') {
        color = 0xdbe1d4;
    } else if (name === '白色4' || name === 'white4') {
        color = 0xcbd3c4;
    } else if (name === '白色5' || name === 'white5') {
        color = 0xbac4b5;
    } else if (name === '浅灰色' || name === 'lightgray') {
        color = 0x333333;
    } else if (name === '灰色' || name === 'gray') {
        color = 0x808080;
    } else if (name === '银色' || name === '') {
        color = 0xc0c0c0;
    } else if (name === '紫色' || name === '') {
        color = 0x800080;
    }
    return color;
}