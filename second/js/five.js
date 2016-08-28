/* 数据格式演示
    var aqiSourceData = {
      "北京": {
        "2016-01-01": 10,
        "2016-01-02": 10,
        "2016-01-03": 10,
        "2016-01-04": 10
      }
    };
    */

var citySelectDom = Dom.id('city-select'),
    dateSelectDom = Dom.id('form-gra-time'),
    aqiChartContentDom = Dom.claz('.chart-content'),
    aqiChartItemDom = Dom.claz('.chart-item'),
    dateDom = Dom.name('gra-time');

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < chartData.dataTimes[pageState.nowGraTime]; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
}, seeds = {
    "北京": 500,
    "上海": 300,
    "广州": 200,
    "深圳": 100,
    "成都": 300,
    "西安": 500,
    "福州": 100,
    "厦门": 100,
    "沈阳": 500
}, aqiSourceDataReset = function () {
    var key;
    for(key in seeds){
        aqiSourceData[key] = randomBuildData(seeds[key])
    }   
};


// 用于渲染图表的数据
var chartData = {
    // titleColor: ['red', 'green'],
    // yAxis: ['北京', '上海'],
    // xAxis: ['2016-01-01', '2016-01-02', '2016-01-03', '2016-01-03'],
    // xData: {
    //     '北京': [10, 13, 55, 22],
    //     '上海': [8, 100, 22, 3]
    // }
    chart: {
        xWidth: 10,
        maxHeight: 60
    },
    dataTimes: {'day': 92, 'week': 13, 'month': 3},
    dataCitys: [],
    datas: [10, 13, 55, 22],
    colors: ['rgb(0,11,22)', 'rgb(33,11,42)', 'rgb(3,121,142)', 'rgb(33,211,102)'],
    heights: [10/60*100, 13/60*100, 55/60*100, 22/60*100],
    dates: ['2016-01-01', '2016-01-02', '2016-01-03', '2016-01-03']
};

// 记录当前页面的表单选项
var pageState = {
    defaultCity: 0,
    nowSelectCity: 0,
    defaultTime: 'day',
    nowGraTime: 'day'
}

/**
 * 渲染图表
 */
function renderChart() {
    var html = '';
    chartData.datas.forEach(function (data, index) {
        html += '<div class="chart-item" style="width:'+chartData.chart.xWidth+'%;">\
                    <div class="chart-item-data" style="background-color: '+chartData.colors[index]+';height: '+chartData.heights[index]+'px;" title="'+chartData.dates[index]+' '+data+' '+chartData.dataCitys[pageState.nowSelectCity]+'" style="height: '+chartData.heights[index]+'%;">\
                    </div>\
                </div>';
    });
    Dom.html(aqiChartContentDom, html);

    aqiChartItemDom.style.width = chartData.chart.xWidth+'%';
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(event) {
    console.log('..');
    dateDom.forEach(function (_dateDom, index) {
        if(_dateDom.checked){
            pageState.nowGraTime = _dateDom.value || pageState.defaultTime;        
            // return true;
        }
    });
    // var target = Event.target(event);
    // 确定是否选项发生了变化 
    // pageState.nowGraTime  = target.value || pageState.defaultTime;
    // 设置对应数据
    aqiSourceDataReset();
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(event) {
    var target = Event.target(event);
    // 确定是否选项发生了变化 
    pageState.nowSelectCity  = target.value || pageState.defaultCity;
    // 设置对应数据
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    dateDom.forEach(function (_dateDom, index) {
        Event.on(_dateDom, 'change', graTimeChange);
    });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var keys = Object.keys(aqiSourceData),
        key,
        selectHtml = '',
        index = 0;
        console.log(keys);
    keys.forEach(function (key, index) {
        selectHtml += '<option value="' + (index) + '">' + key + '</option>';
    });
    Dom.html(citySelectDom, selectHtml);
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    Event.on(citySelectDom, 'change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    var keys = Object.keys(aqiSourceData),
        cacheDatas = aqiSourceData[keys[pageState.nowSelectCity]],
        key,
        cityKey,
        dates = Object.keys(cacheDatas),
        datas = [];
    for(key in cacheDatas){
        datas.push(cacheDatas[key]);
    }
    if(!chartData.dataCitys.length)
        for(cityKey in keys){
            chartData.dataCitys.push(keys[cityKey]);
        }
    // 处理好的数据存到 chartData 中
    // TODO: 
    // 1.算出最大值接近的整数
    // 2.图标的单个宽度百分比
    // 3.相邻的两个颜色不能重复
    chartData.datas = datas;
    chartData.chart.maxHeight = (parseInt(Math.max.apply(null, datas)/10)+1)*10
    chartData.chart.xWidth = function (chartData) {
        var base = parseFloat(100/chartData.datas.length);
        console.log(base.toFixed(2)-parseInt(base));
        return parseInt(base) + ((base.toFixed(2)-parseInt(base))*9/10);
    }(chartData);
    chartData.datas.forEach(function (data, index) {
        chartData.heights[index] = data/chartData.chart.maxHeight*100;
        chartData.colors[index] = 'rgb('+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+')';
    });
    chartData.dates = dates;
    console.log('aqiSourceData: ');
    console.log(chartData);
}

/**
 * 初始化函数
 */
function init() {
    aqiSourceDataReset();

    initGraTimeForm()
    initCitySelector();
    initAqiChartData();

    renderChart();
};

init();
