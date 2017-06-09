    const UP = 38;
    const DOWN = 40;
    const LEFT = 37;
    const RIGHT = 39;
    const ENTER = 13;
    const TAB = 9;

function Combogrid() {
    var _this = this;

    this.init = function(config) {
        _this.config = config;
        _this.dom = config.dom;
        let idStr = '#' + $(_this.dom)[0].id;
        $('head').append(`
        <style type='text/css'>
            ` + idStr + ` .tableBox {
                position: absolute;
                display: none;
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
                border: 1px solid #c0dadd;
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
        _this.inputBox.innerHTML = `<input type="text" name="title" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input"/><button class="inputIcon"><i class="layui-icon">&#xe625;</i></button>`
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
                    let item = _this.datagrid.getRow();
                    _this.input.value = item[config.datagrid.textField];
                    _this.datagrid.enterConfirmItem();
                    _this.setHide();
                } else {
                    _this.datagrid.search($(_this.input).val());
                }
                return;
            }
        });
    }
    _this.setData = function(listdata, pageInfo) {
        _this.datagrid.setData(listdata, pageInfo);
        _this.setShow();
    }
    _this.setHide = function() {
        _this.state = 'hide';
        $(_this.tableBox).hide();
        
    }
    _this.blur = function(e) {
        if(!$(_this.dom).has(e.target)[0]){
            $('html').unbind('click', _this.blur);
            _this.setHide();
        }
    }
    _this.setShow = function() {
        _this.state = 'show';
        $(_this.tableBox).show();
        $(_this.tableBox).find('table').colResizable();
        $('html').click(_this.blur);
    }

}
