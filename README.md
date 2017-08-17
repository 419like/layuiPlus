# layuiPlus（文档完善中。。。）

公司项目的一些补充插件（some addtional plug-ins for company.）
目前集成了输入下拉列表插件（combogrid），内含列表插件(datagrid).

## 特性
- 基于 layui 样式 [layui文档](https://github.com/sentsin/layui/)
- 基于 jquery工具 [jquery](https://github.com/jquery/jquery)
- 在下拉列表中对列宽的调整引用了 colResizable工具，直接已集成到库中，不用单独引入 [colResizable](https://github.com/alvaro-prieto/colResizable)
- 仅引用layui样式，对其js库没有依赖可以不引入

## 目录结构
```bash
├── dist/            # 项目构建输出目录
├── lib/             # 项目依赖其他库的引入文件
├── src/             # 项目开发源码目录
├── .gitignore       # 忽略文件列表
├── README.md        # 项目说明文档
├── demo.html        # 项目演示文件
├── gulpfile.js      # 自动化部署
├── package.json     # npm配置文档
```

## 简单使用
### 下载文件包，打开dist文件，参考demo.html,文件引入layui.css、jquery、和layuiPlus
```html
<!-- ... -->
<link rel="stylesheet" type="text/css" href="lib/layui.css">
<!-- ... -->
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="layui-plus0.1.js"></script>
<!-- ... -->
```
### 核心代码示例
```javascript
let mycombogrid = new Combogrid();
mycombogrid.init({
    // 对应要转换为控件的dom的id，对应要转换为控件的dom对象两种方式二选一，
    id: 'mycombogrid',
    // dom: document.getElementById('mycombogrid'),
    datagrid: {
        // 弹出表格的宽度单位PX
        width: 600,
        // 写入input对应的列名
        textField: 'mc',
        // 列设置其中align有（left、center、right）
        columns: [{
            field: 'dm',
            title: 'dm',
            width: 60,
            align: 'left',
        }, {
            field: 'id',
            title: 'id',
            width: 100,
            align: 'center',
        }, {
            field: 'mc',
            title: 'mc',
            width: 120,
            align: 'center',
        }, {
            field: 'rn',
            title: 'rn',
            width: 100,
            align: 'right',
        }],
        // 只能选取5，10，15三个数中一个默认为5
        pageSize:10,
        // 加载成功回调函数
        loadSuccess: function(keyword, pageNum, pageSize) {
            let newSrc = {
                pageNumber: pageNum + '',
                pageSize: pageSize + '',
                jsm: keyword,
                lx: "01"
            }
            let param = {
                "data": JSON.stringify(newSrc)
            };
            $.ajax({
                url: 'http://125.69.67.12:7080/hisapi/rest/queryDataBySql/000217/5',
                type: "POST",
                data: param,
                async: false,
                timeout: 3000,
                success: function(res) {
                    let dataObj = JSON.parse(res);
                    // 传入页码信息
                    let pageInfo = {
                        pageNum: pageNum,
                        totalPage: Math.ceil(dataObj.data.total / pageSize)
                    }
                    // 加载完成写入数据
                    debugger
                    mycombogrid.setData(dataObj.data.rows, pageInfo);
                }
            });
        },
        // 行选中回调函数
        selectRow: function(rowData) {
            console.log(rowData);
        }
    }

});
```

## 有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(419like#163.com, 把#换成@)
* QQ: 897996541
* github: [layuiPlus](https://github.com/419like/layuiPlus)