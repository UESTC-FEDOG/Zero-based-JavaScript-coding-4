(function() {
	var aqiData = {};
	function addAqiData() {
		var charTest = /^[a-zA-Z\u4e00-\u9fa5]+$/,
			numTest = /^\d+$/,
			city = document.getElementById('aqi-city-input').value,
			value = document.getElementById('aqi-value-input').value;
		city = city.replace(/^\s*|\s*|\s*^/, "");
		value = value.replace(/^\s*|\s*|\s*^/, "");
		if(charTest.test(city) && numTest.test(value)) {
			aqiData[city] = Number(value);
			return true;
		} else if(!numTest.test(value)&&!charTest.test(city)) {
			console.log(!numTest.test(value)&&!charTest.test(city))
			alert("城市名称和空气质量指数格式输入错误????");
		} else if(!charTest.test(city)) {
			alert("城市名称格式输入错误");
		} else {
			alsert("空气质量指数格式输入错误");
		}
		return false;
	}

	function renderAqiList() {
		var str = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>",
			table = document.getElementById('aqi-table');
		for(key in aqiData) {
			str += "<tr><td>" + key + "</td><td>" + aqiData[key] + "</td><td><button>删除</button></td></tr>"
		}
		table.innerHTML = str;
	}

	function addBtnHandle() {
		if(addAqiData()) {
			renderAqiList();
		}
	}

	function delBtnHandle(event) {
		var line = event.target.parentNode.parentNode,
			city = line.innerText.slice(0,1),
			table = document.getElementById('aqi-table');
		delete aqiData[city];
		line.parentNode.removeChild(line);
	}

	function init() {
		var a = document.getElementById('add-btn'),
			dele = document.getElementById('aqi-table').getElementsByTagName('button');
		a.addEventListener('click', function(event) {
			addBtnHandle();
			if(dele !== null) {
				for (var i=0,len=dele.length; i<len; i++) {
					dele[i].addEventListener('click', function(event) {
						delBtnHandle(event)
					})
			}
		}
	})

	}
	init();
})()


