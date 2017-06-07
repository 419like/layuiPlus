# layuiPlus（文档完善中。。。）

公司项目的一些补充插件（some addtional plug-ins for company.）

## 特性
- 基于 layui 样式 [layui文档](https://github.com/sentsin/layui/)
- 基于 jquery工具 [jquery]https://github.com/jquery/jquery
- 在下拉列表中对列宽的调整引用了 colResizable工具 [colResizable]https://github.com/alvaro-prieto/colResizable
- 只是引用了layui样式，对其js库没有依赖可以不引入

## 目录结构
```bash
├── /dist/           # 项目构建输出目录
├── /lib/            # 项目依赖其他库的引入文件
├── /src/            # 项目开发源码目录
├── demo.html     	 # 项目演示文件
└── README.md  		 # 项目说明文档

##代码示例

```javascript
let mycombogrid = new Combogrid();
mycombogrid.init({
    dom: $('#mycombogrid')[0],
    datagrid: {
        width: 400,
        textField: 'mc',
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
                success: function(res) {
                    let dataObj = JSON.parse(res);
                    let pageInfo = {
                        pageNum: pageNum,
                        pageSize: pageSize,
                        totalPage: Math.ceil(dataObj.data.total / pageSize)
                    }
                    mycombogrid.setData(dataObj.data.rows, pageInfo);
                }
            });
        },
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