(function() {

    // 使用validators对象来专门负责验证表单
    var validators = {
        // 这个对象储存着所有登记过的验证方案
        _configMap: {},
        
        // 该方法用于保存验证方案（一个对象）
        config: function (name, ruleObj) {
            this._configMap[name] = ruleObj;
        },
        
        // 这里储存了validators对象支持的验证方法（函数）
        // 函数附带message属性作为错误提示
        rules: {
            isInteger: (function() {
                var func = function isInteger(value) {
                    var intergerReg = /^\d+$/g;
                    return intergerReg.test(value);
                };
                
                func.message = '数字必须是整数';
                return func;
            })(),
            
            isCityName: (function() {
                var func = function isCityName(value) {
                    var cityNameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/g;
                    return cityNameReg.test(value);
                };
                
                func.message = '城市名不合法';
                return func;
            })()
        },
        
        // 外部通过调用该方法来进行验证（传入一个数据Object和方案名）
        // 通过了则返回true，反之返回一个数组，成员是错误理由
        validate: function(collection, configName) {
                var errors = [],
                    collectionNames = Object.keys(collection),
                    configRules = this._configMap[configName],
                    that = this;
                                    
                collectionNames.forEach(function(name, index) {
                    var value = collection[name],
                        ruleName = configRules[name],
                        isValid = that.rules[ruleName](value);
                        
                    if(isValid) return;
                    else errors.push(that.rules[ruleName].message);
                });
                
                return errors.length === 0 ? true : errors;
        }
    };

    function AirQualityForm(containerEle) {
        this.form = containerEle;
        this.table = containerEle.querySelector('.table-hook');
    }
        
    // 这个方法里似乎做了太多事，不过也不知怎么再分解比较好
    AirQualityForm.prototype.init = function() {
        this._bindAll();
                
        // 为组件登记一个验证方案
        validators.config('cityAirQuality', {
            'air-quality': 'isInteger',
            'city-name': 'isCityName'
        });
    };
    
    AirQualityForm.prototype._bindAll = function(){
        var thisApp = this;
        
        // 对提交按钮的事件代理
        this.form.addEventListener('click', function(e) {
            if (!e.target.matches('.submit')) return;
            
            thisApp.removeWarnings();
            
            // 验证本次数据
            validatingResult = thisApp.validate();

            // 验证通过，添加表格；反之打印错误信息            
            if(validatingResult.isError) {
                thisApp.warn(validatingResult); 
            } else {
                thisApp.addItem(validatingResult);                
            }
            e.preventDefault();
        });
        
        // 对删除按钮的事件代理
        this.form.addEventListener('click', function (e) {
            if (!e.target.matches('.delete-button')) return;
            else thisApp.removeItem(e.target.parentElement.parentElement);
        });
        
    };
    // 该方法负责把表单数据收集并交给validators验证
    AirQualityForm.prototype.validate = function() {
        var inputEles = this.form.querySelectorAll('input:not([type="checkbox"])'),
            valueCollection = {};
        
        inputEles = Array.prototype.slice.call(inputEles);
        // 这是收集待验证的数据
        inputEles.forEach(function(ele) {
            valueCollection[ele.name] = ele.value.trim();
        });
            
        result = validators.validate(valueCollection, 'cityAirQuality');
        
        // 验证通过，返回收集好的数据；反之返回错误信息数组
        if (result !== true) {
            result.isError = true;
            return result;
        } else {
            return valueCollection;
        }
    };
    
    // 简单的打印错误信息的方法。没啥好说
    AirQualityForm.prototype.warn = function(errors) {
        var that = this;
        
        errors.forEach(function(err) {
            var warnEle = document.createElement('p');
            warnEle.className = 'app-warn';
            warnEle.innerHTML = err;
            that.table.parentElement.appendChild(warnEle);
        });
        
    };
    
    // 以下三个方法顾名思义
    AirQualityForm.prototype.addItem = function(data) {
        var newRow = document.createElement('tr'),
            city = data['city-name'],
            quality = data['air-quality'];
            
        newRow.innerHTML = '<td>' + city + '</td>' + '<td>' + quality + '</td>' 
                         + '<td><button class="delete-button">删除</button></td>';
                         
        this.table.tBodies[0].appendChild(newRow);
    };
    
    AirQualityForm.prototype.removeItem = function (rowEle) {
        rowEle.parentElement.removeChild(rowEle);
    };
    
    AirQualityForm.prototype.removeWarnings = function() {
        var warnings = this.form.querySelectorAll('.app-warn');
        Array.prototype.forEach.call(warnings, function(ele){
            ele.parentElement.removeChild(ele);
        });
    };

    var myapp = new AirQualityForm(document.getElementById('app'));
    
    myapp.init();
})();


