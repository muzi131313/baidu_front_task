'use strict';
// util
function addEvent(obj,type,handle){
    try{  // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        obj.addEventListener(type,handle,false);
    }catch(e){
        try{  // IE8.0及其以下版本
            obj.attachEvent('on' + type,handle);
        }catch(e){  // 早期浏览器
            obj['on' + type] = handle;
        }
    }
}
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var cityEle = document.getElementById('aqi-city-input'),
        qualityEle = document.getElementById('aqi-value-input'),
        city = cityEle.value,
        quality = qualityEle.value;
    if(!city || !quality) return alert('city or quality can not be null!');
    if(isNaN(quality)) return alert('quality must be a number!');
    if(aqiData[city]) return alert('data['+city+'] alreay exit');
    aqiData[city] = quality;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var delEles,
        i = 0,
        delEle,
        key,
        tableEle = document.getElementById('aqi-table'),
        ele = '<tr>\
                 <td>城市</td><td>空气质量</td><td>操作</td>\
              </tr>';
    for(key in aqiData){
        ele += '<tr>\
                    <td>'+key+'</td><td>'+aqiData[key]+'</td><td><button data-city="'+key+'">删除</button></td>\
                </tr>';
    }
    tableEle.innerHTML = ele;
    delEles = tableEle.querySelectorAll('button');
    for(;delEle = delEles[i++];){        
        addEvent(delEle, 'click', delBtnHandle);
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
    // do sth.
    e = e || event;
    var t = e.target || e.srcElement,
        city = t.getAttribute('data-city');
    if(aqiData[city]) delete aqiData[city];
    renderAqiList();
}

function init() {
    var tableEle = document.getElementById('aqi-table'),
        addEle = document.getElementById('add-btn'),
        delEle = tableEle.querySelectorAll('button');
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    addEvent(addEle, 'click', addBtnHandle);
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    addEvent(delEle, 'click', delBtnHandle);
}

window.onload = function(){
    init();
}
