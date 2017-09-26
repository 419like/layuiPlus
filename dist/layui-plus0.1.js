    const UP = 38;
    const DOWN = 40;
    const LEFT = 37;
    const RIGHT = 39;
    const ENTER = 13;
    const TAB = 9;

    function Combogrid() {
        var _this = this;
        this.clear = function(){
            _this.input.value = '';
        }
        this.init = function(config) {
            _this.config = config;
            if (config.id) {
                _this.dom = $('#' + config.id)[0];
            } else {
                _this.dom = config.dom;
            }
            var idStr = '#' + $(_this.dom)[0].id;
            $('head').append(`
        <style type='text/css'>
            ` + idStr + `{
                position: relative;
            }
            ` + idStr + ` .tableBox {
                position: absolute;
                display: none;
            }
            ` + idStr + ` .layui-unselect {
                width:40px;
            }
            ` + idStr + ` .layui-form-select {
                width:40px;
            }
            ` + idStr + ` .inputIcon {
                height: 25px;
                width: 25px;
                position: absolute;
                right: 0px;
                top: 0px;
            }

            ` + idStr + ` .inputBox {
                position: relative;
                height:25px;
            }

            ` + idStr + ` .tableBox {
                position: absolute;cor
                top: 25px;
                z-index: 2147483647;
                border: 1px solid #c0dadd;
                background:#fff;
            }

            ` + idStr + ` .layui-table th {
                overflow: hidden;
            }

            ` + idStr + ` .layui-table td {
                word-break: keep-all;
                white-space: nowrap;
            }

        </style>`);
            _this.dom.setAttribute(
                "tabindex", "1"
            );

            _this.inputBox = document.createElement("div");
            _this.inputBox.setAttribute('class', 'inputBox')
            debugger
            _this.inputBox.innerHTML = `<input type="text" name="title" required  lay-verify="required" placeholder="`+_this.config.placeholder+`" autocomplete="off" class="layui-input"/><button class="inputIcon"><i class="layui-icon">&#xe625;</i></button>`
            _this.input = $(_this.inputBox).find('input')[0];
            _this.icon = $(_this.inputBox).find('button')[0];
            $(_this.icon).hide()
            _this.dom.appendChild(_this.inputBox);
            _this.tableBox = document.createElement("div");
            _this.tableBox.setAttribute('class', 'tableBox')
            _this.setHide();
            _this.dom.appendChild(_this.tableBox)
            _this.datagrid = new Datagrid();
            config.datagrid.dom = _this.tableBox;
            _this.datagrid.init(config.datagrid);
            _this.datagrid.extraNext = _this.searchInput;

            if (config.datagrid.textField) {
                _this.datagrid.selectFun = function(item) {
                    _this.input.value = item[config.datagrid.textField];
                    _this.setHide();
                }
            }
            _this.icon.addEventListener('click', function(e) {
                if (_this.state == 'hide') {
                    _this.setShow();
                } else {
                    _this.setHide();
                }
            });
            $(_this.input).focus(function() {
                // $(_this.dom).focus();
                _this.editMode = 1;
            })
            $(_this.dom).click(function() {
                _this.editMode = 1;
            })

            $(_this.input).blur(function(event) {
                /* Act on the event */
                _this.editMode = 2;
            });

            $(_this.dom).keyup(function(e) {
                if (e.keyCode == UP) {
                    _this.datagrid.selectUp();
                    return;
                }
                if (e.keyCode == DOWN) {
                    _this.datagrid.selectDown();
                    return;
                }
                if (e.keyCode == LEFT) {
                    _this.datagrid.prePage();
                    return;
                }
                if (e.keyCode == RIGHT) {
                    _this.datagrid.nextPage();
                    return;
                }
                if (e.keyCode == ENTER) {
                    if (_this.state == 'show') {
                        var item = _this.datagrid.getRow();
                        _this.input.value = item[config.datagrid.textField];
                        _this.datagrid.enterConfirmItem();
                        _this.setHide();
                    } else {
                        _this.datagrid.search($(_this.input).val());
                    }
                    event.stopPropagation();
                    return;
                }
            });
        }
        _this.search = function(){
            debugger
            _this.datagrid.search($(_this.input).val());
        }
        _this.setData = function(listdata, pageInfo) {
            if (listdata.length == 0) {
                return;
            }
            _this.datagrid.setData(listdata, pageInfo);
            _this.setShow();
        }
        _this.setHide = function() {
            debugger
            _this.state = 'hide';
            $(_this.tableBox).hide();

        }
        _this.blur = function(e) {
            debugger
            // 点击对象不是组件dom中的
            if (!$(_this.dom).has(e.target)[0]) {
                $('html').unbind('click', _this.blur);
                _this.setHide();
            }
        }
        _this.setShow = function() {
            _this.state = 'show';
            $(_this.tableBox).show();
            // 适应高度
            var winH = $(window).height();
            var domTop = _this.dom.getBoundingClientRect().top;
            var inputH = _this.input.getBoundingClientRect().height;
            var tableH = _this.tableBox.getBoundingClientRect().height;
            if (winH - domTop - inputH < tableH) {
                _this.tableBox.style.top = '-' + tableH + 'px';
            } else {
                _this.tableBox.style.top = '';
            }
            // 适应宽度
            var winW = $(window).width();
            var domLeft = _this.dom.getBoundingClientRect().left;
            var inputW = _this.input.getBoundingClientRect().width;
            var tableW = _this.tableBox.getBoundingClientRect().width;
            if (winW - domLeft < tableW) {
                _this.tableBox.style.left = '-' + (tableW - inputW) + 'px';
            } else {
                _this.tableBox.style.left = '';
            }

            $(_this.tableBox).find('table').colResizable();
            // 组件失焦监测
            $('html').click(_this.blur);
        }

    }

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
                <button id="firstPage">
                    <svg viewBox="0 0 1024 1024" class="svgIcon" style="height:10px;">
                        <path d="M512 256v512L128 512zM896 256v512L512 512z" fill="#666666">
                    </svg>
                </button>
                <button id="prePage">
                    <svg viewBox="0 0 1024 1024" class="svgIcon" style="height:10px;">
                        <path d="M704 256v512L320 512z" fill="#666666" ></path>
                    </svg>
                </button>
                <span id="pageInfo">1/5</span>
                <button id="nextPage">
                    <svg viewBox="0 0 1024 1024" class="svgIcon" style="height:10px;fill:#000;">
                        <path d="M320 256v512l384-256z" fill="#666666" ></path>
                    </svg>
                </button>
                <button id="lastPage">
                    <svg viewBox="0 0 1024 1024" class="svgIcon" style="height:10px;">
                        <path d="M512 256v512l384-256zM128 256v512l384-256z" fill="#666666"></svg>
                </button>
                &nbsp;
                <button id="goPage">
                    <svg viewBox="0 0 1024 1024" class="svgIcon" style="height:10px;">
                        <path d="M925.230486 377.716644 595.284845
                         173.486216c-31.600719-19.560498-53.66934-12.815887-64.011896-7.054673-10.341532
                          5.761214-27.691689 20.97573-27.691689 58.141188l0
                           75.611072c-17.833157 0-36.043914 0-54.219879
                            0-485.10035 0-374.45946 555.50484-374.45946
                             555.50484S110.877273 542.048363 449.533296
                              542.048363c18.073634 0 36.21583 0 54.015218
                               0 0 46.283116 0 88.579431 0 121.807207
                                0 0.309038 0 0.618077 0 0.926092 0 0.275269
                                 0 0.584308 0 0.895393 0 5.118578 0 9.999748
                                  0 14.637372 0.011256-0.001023 0.022513-0.002047
                                   0.033769-0.00307l0-38.116109c0 37.164435
                                    17.350157 52.379974 27.691689 58.140165
                                     5.139044 2.863211 13.173021 5.968945 23.835871 5.968945 10.79281
                                      0 24.278963-3.183506 40.176025-13.024641l329.946664-204.229404c23.225981-14.377452
                                       36.018332-34.146705 36.018332-55.665811C961.248817 
                                       411.863349 948.456467 392.094096 925.230486 377.716644z"></path>
                    </svg>
                </button>
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
$.fn.setOption = function(data) {
    //your code goes here
    console.log('setOption');
    var list = data.list;
    for(var i=0;i<list.length;i++){
    	this.append(`<option value="`+list[i][data.valueField]+`">`+list[i][data.textField]+`</option>`)
    }
}

$.fn.setVal = function(data) {
    if(this.find("option[value='"+data.value+"']").length==0){
    	this.append(`<option extradata="true" value="`+data.value+`">`+data.text+`</option>`)
    }
    this.val(data.value)
}

$.fn.checkUnusual = function(){
	var selectArr = this.find('select');
	for(var i=0;i<selectArr.length;i++){
		var val = $(selectArr[i]).val();
		if($(selectArr[i]).find("option[value='"+val+"']").attr('extradata')){
			layer.alert('异常元素', {icon: 2});
			$(selectArr[i]).addClass('layui-form-danger');
			$(selectArr[i]).focus();
		}
	}
}
$(document).ready(function() {
	/**
               _ _____           _          _     _      
              | |  __ \         (_)        | |   | |     
      ___ ___ | | |__) |___  ___ _ ______ _| |__ | | ___ 
     / __/ _ \| |  _  // _ \/ __| |_  / _` | '_ \| |/ _ \
    | (_| (_) | | | \ \  __/\__ \ |/ / (_| | |_) | |  __/
     \___\___/|_|_|  \_\___||___/_/___\__,_|_.__/|_|\___|
	 
	v1.7 - jQuery plugin created by Alvaro Prieto Lauroba
	
	Licences: MIT & GPL
	Feel free to use or modify this plugin as far as my full name is kept	
*/

	(function($) {

		var d = $(document); //window object
		var h = $("head"); //head object
		var drag = null; //reference to the current grip that is being dragged
		var tables = {}; //object of the already processed tables (table.id as key)
		var count = 0; //internal count to create unique IDs when needed.	

		//common strings for packing
		var ID = "id";
		var PX = "px";
		var SIGNATURE = "JColResizer";
		var FLEX = "JCLRFlex";

		//short-cuts
		var I = parseInt;
		var M = Math;
		var ie = navigator.userAgent.indexOf('Trident/4.0') > 0;
		var S;
		var pad = ""
		try { S = sessionStorage; } catch (e) {} //Firefox crashes when executed as local file system


		//append required CSS rules  
		h.append("<style type='text/css'>  .JColResizer{table-layout:fixed;} .JColResizer > tbody > tr > td, .JColResizer > tbody > tr > th{overflow:hidden}  .JPadding > tbody > tr > td, .JPadding > tbody > tr > th{padding-left:0!important; padding-right:0!important;} .JCLRgrips{ height:0px; position:relative;} .JCLRgrip{margin-left:-5px; position:absolute; z-index:5; } .JCLRgrip .JColResizer{position:absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;cursor: col-resize;top:0px} .JCLRLastGrip{position:absolute; width:1px; } .JCLRgripDrag{ border-left:1px dotted black;	} .JCLRFlex{width:auto!important;} .JCLRgrip.JCLRdisabledGrip .JColResizer{cursor:default; display:none;}</style>");


		/**
		 * Function to allow column resizing for table objects. It is the starting point to apply the plugin.
		 * @param {DOM node} tb - reference to the DOM table object to be enhanced
		 * @param {Object} options	- some customization values
		 */
		var init = function(tb, options) {
			var t = $(tb); //the table object is wrapped
			t.opt = options; //each table has its own options available at anytime
			t.mode = options.resizeMode; //shortcuts
			t.dc = t.opt.disabledColumns;
			if (t.opt.removePadding) t.addClass("JPadding");
			if (t.opt.disable) return destroy(t); //the user is asking to destroy a previously colResized table
			var id = t.id = t.attr(ID) || SIGNATURE + count++; //its id is obtained, if null new one is generated		
			t.p = t.opt.postbackSafe; //short-cut to detect postback safe 		
			if (!t.is("table") || tables[id] && !t.opt.partialRefresh) return; //if the object is not a table or if it was already processed then it is ignored.
			if (t.opt.hoverCursor !== 'col-resize') h.append("<style type='text/css'>.JCLRgrip .JColResizer:hover{cursor:" + t.opt.hoverCursor + "!important}</style>"); //if hoverCursor has been set, append the style
			t.addClass(SIGNATURE).attr(ID, id).before('<div class="JCLRgrips"/>'); //the grips container object is added. Signature class forces table rendering in fixed-layout mode to prevent column's min-width
			t.g = [];
			t.c = [];
			t.w = t.width();
			t.gc = t.prev();
			t.f = t.opt.fixed; //t.c and t.g are arrays of columns and grips respectively				
			if (options.marginLeft) t.gc.css("marginLeft", options.marginLeft); //if the table contains margins, it must be specified
			if (options.marginRight) t.gc.css("marginRight", options.marginRight); //since there is no (direct) way to obtain margin values in its original units (%, em, ...)
			t.cs = I(ie ? tb.cellSpacing || tb.currentStyle.borderSpacing : t.css('border-spacing')) || 2; //table cellspacing (not even jQuery is fully cross-browser)
			t.b = I(ie ? tb.border || tb.currentStyle.borderLeftWidth : t.css('border-left-width')) || 1; //outer border width (again cross-browser issues)
			// if(!(tb.style.width || tb.width)) t.width(t.width()); //I am not an IE fan at all, but it is a pity that only IE has the currentStyle attribute working as expected. For this reason I can not check easily if the table has an explicit width or if it is rendered as "auto"
			tables[id] = t; //the table object is stored using its id as key	
			createGrips(t); //grips are created 

		};


		/**
		 * This function allows to remove any enhancements performed by this plugin on a previously processed table.
		 * @param {jQuery ref} t - table object
		 */
		var destroy = function(t) {
			var id = t.attr(ID),
				t = tables[id]; //its table object is found
			if (!t || !t.is("table")) return; //if none, then it wasn't processed	 
			t.removeClass(SIGNATURE + " " + FLEX).gc.remove(); //class and grips are removed
			delete tables[id]; //clean up data
		};


		/**
		 * Function to create all the grips associated with the table given by parameters 
		 * @param {jQuery ref} t - table object
		 */
		var createGrips = function(t) {

			var th = t.find(">thead>tr:first>th,>thead>tr:first>td"); //table headers are obtained
			if (!th.length) th = t.find(">tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td"); //but headers can also be included in different ways
			th = th.filter(":visible"); //filter invisible columns
			t.cg = t.find("col"); //a table can also contain a colgroup with col elements		
			t.ln = th.length; //table length is stored	
			if (t.p && S && S[t.id]) memento(t, th); //if 'postbackSafe' is enabled and there is data for the current table, its coloumn layout is restored
			th.each(function(i) { //iterate through the table column headers			
				var c = $(this); //jquery wrap for the current column		
				var dc = t.dc.indexOf(i) != -1; //is this a disabled column?
				var g = $(t.gc.append('<div class="JCLRgrip"></div>')[0].lastChild); //add the visual node to be used as grip
				g.append(dc ? "" : t.opt.gripInnerHtml).append('<div class="' + SIGNATURE + '"></div>');
				if (i == t.ln - 1) { //if the current grip is the las one 
					g.addClass("JCLRLastGrip"); //add a different css class to stlye it in a different way if needed
					if (t.f) g.html(""); //if the table resizing mode is set to fixed, the last grip is removed since table with can not change
				}
				g.bind('touchstart mousedown', onGripMouseDown); //bind the mousedown event to start dragging 

				if (!dc) {
					//if normal column bind the mousedown event to start dragging, if disabled then apply its css class
					g.removeClass('JCLRdisabledGrip').bind('touchstart mousedown', onGripMouseDown);
				} else {
					g.addClass('JCLRdisabledGrip');
				}

				g.t = t;
				g.i = i;
				g.c = c;
				c.w = c.width(); //some values are stored in the grip's node data as shortcut
				t.g.push(g);
				t.c.push(c); //the current grip and column are added to its table object
				c.width(c.w).removeAttr("width"); //the width of the column is converted into pixel-based measurements
				g.data(SIGNATURE, { i: i, t: t.attr(ID), last: i == t.ln - 1 }); //grip index and its table name are stored in the HTML 												
			});
			t.cg.removeAttr("width"); //remove the width attribute from elements in the colgroup 

			t.find('td, th').not(th).not('table th, table td').each(function() {
				$(this).removeAttr('width'); //the width attribute is removed from all table cells which are not nested in other tables and dont belong to the header
			});
			if (!t.f) {
				t.removeAttr('width').addClass(FLEX); //if not fixed, let the table grow as needed
			}
			syncGrips(t); //the grips are positioned according to the current table layout			
			//there is a small problem, some cells in the table could contain dimension values interfering with the 
			//width value set by this plugin. Those values are removed

		};


		/**
		 * Function to allow the persistence of columns dimensions after a browser postback. It is based in
		 * the HTML5 sessionStorage object, which can be emulated for older browsers using sessionstorage.js
		 * @param {jQuery ref} t - table object
		 * @param {jQuery ref} th - reference to the first row elements (only set in deserialization)
		 */
		var memento = function(t, th) {
			var w, m = 0,
				i = 0,
				aux = [],
				tw;
			if (th) { //in deserialization mode (after a postback)
				t.cg.removeAttr("width");
				if (t.opt.flush) { S[t.id] = ""; return; } //if flush is activated, stored data is removed
				w = S[t.id].split(";"); //column widths is obtained
				tw = w[t.ln + 1];
				if (!t.f && tw) { //if not fixed and table width data available its size is restored
					t.width(tw *= 1);
					if (t.opt.overflow) { //if overfolw flag is set, restore table width also as table min-width
						t.css('min-width', tw + PX);
						t.w = tw;
					}
				}
				for (; i < t.ln; i++) { //for each column
					aux.push(100 * w[i] / w[t.ln] + "%"); //width is stored in an array since it will be required again a couple of lines ahead
					th.eq(i).css("width", aux[i]); //each column width in % is restored
				}
				for (i = 0; i < t.ln; i++)
					t.cg.eq(i).css("width", aux[i]); //this code is required in order to create an inline CSS rule with higher precedence than an existing CSS class in the "col" elements
			} else { //in serialization mode (after resizing a column)
				S[t.id] = ""; //clean up previous data
				for (; i < t.c.length; i++) { //iterate through columns
					w = t.c[i].width(); //width is obtained
					S[t.id] += w + ";"; //width is appended to the sessionStorage object using ID as key
					m += w; //carriage is updated to obtain the full size used by columns
				}
				S[t.id] += m; //the last item of the serialized string is the table's active area (width), 
				//to be able to obtain % width value of each columns while deserializing
				if (!t.f) S[t.id] += ";" + t.width(); //if not fixed, table width is stored
			}
		};


		/**
		 * Function that places each grip in the correct position according to the current table layout	 
		 * @param {jQuery ref} t - table object
		 */
		var syncGrips = function(t) {
			t.gc.width(t.w); //the grip's container width is updated				
			for (var i = 0; i < t.ln; i++) { //for each column
				var c = t.c[i];
				t.g[i].css({ //height and position of the grip is updated according to the table layout
					left: c.offset().left - t.offset().left + c.outerWidth(false) + t.cs / 2 + PX,
					height: t.opt.headerOnly ? t.c[0].outerHeight(false) : t.outerHeight(false)
				});
			}
		};



		/**
		 * This function updates column's width according to the horizontal position increment of the grip being
		 * dragged. The function can be called while dragging if liveDragging is enabled and also from the onGripDragOver
		 * event handler to synchronize grip's position with their related columns.
		 * @param {jQuery ref} t - table object
		 * @param {number} i - index of the grip being dragged
		 * @param {bool} isOver - to identify when the function is being called from the onGripDragOver event	
		 */
		var syncCols = function(t, i, isOver) {
			var inc = drag.x - drag.l,
				c = t.c[i],
				c2 = t.c[i + 1];
			var w = c.w + inc;
			var w2 = c2.w - inc; //their new width is obtained					
			c.width(w + PX);
			t.cg.eq(i).width(w + PX);
			if (t.f) { //if fixed mode
				c2.width(w2 + PX);
				t.cg.eq(i + 1).width(w2 + PX);
			} else if (t.opt.overflow) { //if overflow is set, incriment min-width to force overflow
				t.css('min-width', t.w + inc);
			}
			if (isOver) {
				c.w = w;
				c2.w = t.f ? w2 : c2.w;
			}
		};


		/**
		 * This function updates all columns width according to its real width. It must be taken into account that the 
		 * sum of all columns can exceed the table width in some cases (if fixed is set to false and table has some kind 
		 * of max-width).
		 * @param {jQuery ref} t - table object	
		 */
		var applyBounds = function(t) {
			var w = $.map(t.c, function(c) { //obtain real widths
				return c.width();
			});
			t.width(t.w = t.width()).removeClass(FLEX); //prevent table width changes
			$.each(t.c, function(i, c) {
				c.width(w[i]).w = w[i]; //set column widths applying bounds (table's max-width)
			});
			t.addClass(FLEX); //allow table width changes
		};


		/**
		 * Event handler used while dragging a grip. It checks if the next grip's position is valid and updates it. 
		 * @param {event} e - mousemove event binded to the window object
		 */
		var onGripDrag = function(e) {
			if (!drag) return;
			var t = drag.t; //table object reference 
			var oe = e.originalEvent.touches;
			var ox = oe ? oe[0].pageX : e.pageX; //original position (touch or mouse)
			var x = ox - drag.ox + drag.l; //next position according to horizontal mouse position increment
			var mw = t.opt.minWidth,
				i = drag.i; //cell's min width
			var l = t.cs * 1.5 + mw + t.b;
			var last = i == t.ln - 1; //check if it is the last column's grip (usually hidden)
			var min = i ? t.g[i - 1].position().left + t.cs + mw : l; //min position according to the contiguous cells
			var max = t.f ? //fixed mode?
				i == t.ln - 1 ?
				t.w - l :
				t.g[i + 1].position().left - t.cs - mw :
				Infinity; //max position according to the contiguous cells 
			x = M.max(min, M.min(max, x)); //apply bounding		
			drag.x = x;
			drag.css("left", x + PX); //apply position increment	
			if (last) { //if it is the last grip
				var c = t.c[drag.i]; //width of the last column is obtained
				drag.w = c.w + x - drag.l;
			}
			if (t.opt.liveDrag) { //if liveDrag is enabled
				if (last) {
					c.width(drag.w);
					if (!t.f && t.opt.overflow) { //if overflow is set, incriment min-width to force overflow
						t.css('min-width', t.w + x - drag.l);
					} else {
						t.w = t.width();
					}
				} else {
					syncCols(t, i); //columns are synchronized
				}
				syncGrips(t);
				var cb = t.opt.onDrag; //check if there is an onDrag callback
				if (cb) {
					e.currentTarget = t[0];
					cb(e);
				} //if any, it is fired			
			}
			return false; //prevent text selection while dragging				
		};


		/**
		 * Event handler fired when the dragging is over, updating table layout
		 * @param {event} e - grip's drag over event
		 */
		var onGripDragOver = function(e) {

			d.unbind('touchend.' + SIGNATURE + ' mouseup.' + SIGNATURE).unbind('touchmove.' + SIGNATURE + ' mousemove.' + SIGNATURE);
			$("head :last-child").remove(); //remove the dragging cursor style	
			if (!drag) return;
			drag.removeClass(drag.t.opt.draggingClass); //remove the grip's dragging css-class
			if (!(drag.x - drag.l == 0)) {
				var t = drag.t;
				var cb = t.opt.onResize; //get some values	
				var i = drag.i; //column index
				var last = i == t.ln - 1; //check if it is the last column's grip (usually hidden)
				var c = t.g[i].c; //the column being dragged
				if (last) {
					c.width(drag.w);
					c.w = drag.w;
				} else {
					syncCols(t, i, true); //the columns are updated
				}
				if (!t.f) applyBounds(t); //if not fixed mode, then apply bounds to obtain real width values
				syncGrips(t); //the grips are updated
				if (cb) {
					e.currentTarget = t[0];
					cb(e);
				} //if there is a callback function, it is fired
				if (t.p && S) memento(t); //if postbackSafe is enabled and there is sessionStorage support, the new layout is serialized and stored
			}
			drag = null; //since the grip's dragging is over									
		};


		/**
		 * Event handler fired when the grip's dragging is about to start. Its main goal is to set up events 
		 * and store some values used while dragging.
		 * @param {event} e - grip's mousedown event
		 */
		var onGripMouseDown = function(e) {
			var o = $(this).data(SIGNATURE); //retrieve grip's data
			var t = tables[o.t],
				g = t.g[o.i]; //shortcuts for the table and grip objects
			var oe = e.originalEvent.touches; //touch or mouse event?
			g.ox = oe ? oe[0].pageX : e.pageX; //the initial position is kept
			g.l = g.position().left;
			g.x = g.l;

			d.bind('touchmove.' + SIGNATURE + ' mousemove.' + SIGNATURE, onGripDrag).bind('touchend.' + SIGNATURE + ' mouseup.' + SIGNATURE, onGripDragOver); //mousemove and mouseup events are bound
			h.append("<style type='text/css'>*{cursor:" + t.opt.dragCursor + "!important}</style>"); //change the mouse cursor
			g.addClass(t.opt.draggingClass); //add the dragging class (to allow some visual feedback)				
			drag = g; //the current grip is stored as the current dragging object
			if (t.c[o.i].l)
				for (var i = 0, c; i < t.ln; i++) {
					c = t.c[i];
					c.l = false;
					c.w = c.width();
				} //if the colum is locked (after browser resize), then c.w must be updated		
			return false; //prevent text selection
		};


		/**
		 * Event handler fired when the browser is resized. The main purpose of this function is to update
		 * table layout according to the browser's size synchronizing related grips 
		 */
		var onResize = function() {
			for (var t in tables) {
				if (tables.hasOwnProperty(t)) {
					t = tables[t];
					var i, mw = 0;
					t.removeClass(SIGNATURE); //firefox doesn't like layout-fixed in some cases
					if (t.f) { //in fixed mode
						t.w = t.width(); //its new width is kept
						for (i = 0; i < t.ln; i++) mw += t.c[i].w;
						//cell rendering is not as trivial as it might seem, and it is slightly different for
						//each browser. In the beginning i had a big switch for each browser, but since the code
						//was extremely ugly now I use a different approach with several re-flows. This works 
						//pretty well but it's a bit slower. For now, lets keep things simple...   
						for (i = 0; i < t.ln; i++) t.c[i].css("width", M.round(1000 * t.c[i].w / mw) / 10 + "%").l = true;
						//c.l locks the column, telling us that its c.w is outdated									
					} else { //in non fixed-sized tables
						applyBounds(t); //apply the new bounds 
						if (t.mode == 'flex' && t.p && S) { //if postbackSafe is enabled and there is sessionStorage support,
							memento(t); //the new layout is serialized and stored for 'flex' tables
						}
					}
					syncGrips(t.addClass(SIGNATURE));
				}
			}

		};


		//bind resize event, to update grips position 
		$(window).bind('resize.' + SIGNATURE, onResize);


		/**
		 * The plugin is added to the jQuery library
		 * @param {Object} options -  an object that holds some basic customization values 
		 */
		$.fn.extend({
			colResizable: function(options) {
				var defaults = {

					//attributes:

					resizeMode: 'fit', //mode can be 'fit', 'flex' or 'overflow'
					draggingClass: 'JCLRgripDrag', //css-class used when a grip is being dragged (for visual feedback purposes)
					gripInnerHtml: '', //if it is required to use a custom grip it can be done using some custom HTML				
					liveDrag: false, //enables table-layout updating while dragging	
					minWidth: 15, //minimum width value in pixels allowed for a column 
					headerOnly: false, //specifies that the size of the the column resizing anchors will be bounded to the size of the first row 
					hoverCursor: "col-resize", //cursor to be used on grip hover
					dragCursor: "col-resize", //cursor to be used while dragging
					postbackSafe: false, //when it is enabled, table layout can persist after postback or page refresh. It requires browsers with sessionStorage support (it can be emulated with sessionStorage.js). 
					flush: false, //when postbakSafe is enabled, and it is required to prevent layout restoration after postback, 'flush' will remove its associated layout data 
					marginLeft: null, //in case the table contains any margins, colResizable needs to know the values used, e.g. "10%", "15em", "5px" ...
					marginRight: null, //in case the table contains any margins, colResizable needs to know the values used, e.g. "10%", "15em", "5px" ...
					disable: false, //disables all the enhancements performed in a previously colResized table	
					partialRefresh: false, //can be used in combination with postbackSafe when the table is inside of an updatePanel,
					disabledColumns: [], //column indexes to be excluded
					removePadding: true, //for some uses (such as multiple range slider), it is advised to set this modifier to true, it will remove padding from the header cells.

					//events:
					onDrag: null, //callback function to be fired during the column resizing process if liveDrag is enabled
					onResize: null //callback function fired when the dragging process is over
				}
				var options = $.extend(defaults, options);

				//since now there are 3 different ways of resizing columns, I changed the external interface to make it clear
				//calling it 'resizeMode' but also to remove the "fixed" attribute which was confusing for many people
				options.fixed = true;
				options.overflow = false;
				switch (options.resizeMode) {
					case 'flex':
						options.fixed = false;
						break;
					case 'overflow':
						options.fixed = false;
						options.overflow = true;
						break;
				}

				return this.each(function() {
					init(this, options);
				});
			}
		});
	})(jQuery);
})