/*
基于layui样式的datagrid
 */
function Datagrid() {
    var _this = this;
    _this.init = function(config) {
        _this.config = config;
        _this.box = config.dom;

        var columns = config.columns
        var colStr = '';
        var nameStr = '';
        for (var i = 0; i < columns.length; i++) {
            colStr += `<col width="` + columns[i].width + `px;">`
            nameStr += `<th style="text-align:` + columns[i].align + `">` + columns[i].title + `</th>`
        }
        var tableContent = `
        <div style="overflow:auto;width:` + config.width + `px;">
            <table class="layui-table" style="margin:0; ">
                <colgroup>
                    ` + colStr + `
                </colgroup>
                <thead>
                    <tr>
                        ` + nameStr + `
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>`
        $(_this.box).append(tableContent);

        var controll = `
        <div id="controller" style="display: flex;margin-top:10px;">
            <div>

                <select id="pageSize" lay-ignore style="width:60px;" >
                    <option value="5" selected="selected">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    </select>
            </div>
            <div>
                <button id="firstPage"><<</button>
                <button id="prePage"><</button>
                <span id="pageInfo">1/5</span>
                <button id="nextPage">></button>
                <button id="lastPage">>></button>
                &nbsp;
                <button id="goPage">→</button>
                <input id="targetPage" type="text" style="width:20px;">
                页
            </div>
        </div>`
        $(_this.box).append(controll);
        _this.controller = $(_this.box).find('#controller')[0];
        $(_this.controller).find('#nextPage').click(function(e) {
            _this.nextPage();
        });
        $(_this.controller).find('#prePage').click(function(e) {
            _this.prePage();
        })
        $(_this.controller).find('#firstPage').click(function(e) {
            _this.config.loadSuccess(_this.keyword, 1, _this.pageInfo.pageSize);
        })
        $(_this.controller).find('#lastPage').click(function(e) {
            _this.config.loadSuccess(_this.keyword, _this.pageInfo.totalPage, _this.pageInfo.pageSize);
        })
        $(_this.controller).find('#goPage').click(function(e) {
            var targetPage = $(_this.controller).find('#targetPage').val()
            _this.config.loadSuccess(_this.keyword, targetPage, _this.pageInfo.pageSize);
        })
        $(_this.controller).find('#pageSize').change(function(e) {
            _this.pageInfo.pageSize = e.currentTarget.value;
            _this.config.loadSuccess(_this.keyword, 1, _this.pageInfo.pageSize);
        });
        $(_this.controller).find('#targetPage').keyup(function(e) {
            if (e.keyCode == ENTER) {
                var targetPage = $(_this.controller).find('#targetPage').val()
                debugger
                _this.config.loadSuccess(_this.keyword, targetPage, _this.pageInfo.pageSize);
                e.stopPropagation();
            }
        })

        _this.pageInfo = {
            pageSize: 5,
            totalPage: 1,
            pageNum: 1
        }
        if (config.pageSize) {
            _this.pageInfo.pageSize = config.pageSize;
            
        }
        debugger
        $(_this.controller).find('#pageSize').val(_this.pageInfo.pageSize)
    }
    _this.nextPage = function() {
        if (_this.pageInfo.pageNum + 1 <= _this.pageInfo.totalPage) {
            _this.config.loadSuccess(_this.keyword, _this.pageInfo.pageNum + 1, _this.pageInfo.pageSize);
        }
    }
    _this.prePage = function() {
        if (_this.pageInfo.pageNum - 1 > 0) {
            _this.config.loadSuccess(_this.keyword, _this.pageInfo.pageNum - 1, _this.pageInfo.pageSize);
        }
    }
    _this.setPage = function(pageInfo) {
        _this.pageInfo = pageInfo;
        $(_this.controller).find('#pageInfo').html('第' + pageInfo.pageNum + '/' + pageInfo.totalPage + '页')
    }
    _this.setData = function(list, pageInfo) {
        _this.currentItem = '';
        if (pageInfo) {
            pageInfo.pageSize = $(_this.controller).find('#pageSize')[0].value;
            _this.setPage(pageInfo)
        }
        var listStr = ``;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            item.index = i;
            var rowStr = `<tr>`
            for (var j = 0; j < _this.config.columns.length; j++) {
                rowStr += `<td title="` + item[_this.config.columns[j].field] + `"" style="text-align:` + _this.config.columns[j].align + `">` + item[_this.config.columns[j].field] + `</td>`
            }
            rowStr += `</tr>`
            listStr += rowStr;
        }
        $(_this.box).find('tbody').html(listStr);
        _this.trArr = $(_this.box).find('tbody').find('tr');

        _this.rowSelect(list);
        if (list.length > 0) {
            _this.selectFirstRow();
        }
    }
    _this.selectFirstRow = function() {
        var item = _this.trArr[0].item;
        _this.chooseItem(item);
    }
    _this.rowSelect = function(list) {
        for (var i = 0; i < _this.trArr.length; i++) {
            _this.trArr[i].item = list[i];
            $(_this.trArr[i]).click(function(e) {
                _this.chooseItem(e.currentTarget.item, true);
            })
        }
    }
    _this.search = function(keyword) {
        _this.keyword = keyword;
        debugger
        _this.config.loadSuccess(keyword, 1, _this.pageInfo.pageSize);
    }
    _this.enterConfirmItem = function() {
        _this.chooseItem(_this.currentItem, true);
    }
    _this.selectUp = function() {
        var tempItem;
        if (_this.currentItem.index - 1 < 0) {
            tempItem = _this.trArr[_this.trArr.length - 1];
        } else {
            tempItem = _this.trArr[_this.currentItem.index - 1];
        }
        _this.chooseItem(tempItem.item);
        return tempItem.item[_this.config.textField]
    }
    _this.selectDown = function() {
        var tempItem;
        if (_this.currentItem.index + 1 > _this.trArr.length - 1) {
            tempItem = _this.trArr[0];
        } else {
            tempItem = _this.trArr[_this.currentItem.index + 1];
        }
        _this.chooseItem(tempItem.item);
        return tempItem.item[_this.config.textField];
    }
    _this.getRow = function() {
        return _this.currentItem;
    }
    _this.chooseItem = function(item, choose) {
        if (_this.currentItem) {
            _this.trArr[_this.currentItem.index].style.backgroundColor = '';
        }
        if (item == 0) {
            _this.currentItem = ''
            return;
        } else {
            _this.currentItem = item;
            _this.trArr[_this.currentItem.index].style.backgroundColor = '#FFFF50';
            if (_this.selectFun && choose) {
                _this.config.selectRow(item);
                _this.selectFun(item);
            }
        }
    }
}