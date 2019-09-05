let tabs=["名称","指标信息","指标意义","检查须知","实验室相关"];
let contents = [["报告名称\xa0\xa0\xa0\xa0\xa0", "首字母缩写\xa0\xa0", "别\xa0\xa0\xa0\xa0\xa0\xa0称\xa0\xa0\xa0\xa0\xa0\xa0", "英文名称\xa0\xa0\xa0\xa0\xa0", "英文缩写\xa0\xa0\xa0\xa0\xa0", "大红本编码\xa0"],
            ["定义\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0", "科室归类\xa0\xa0\xa0\xa0", "人群划分\xa0\xa0\xa0\xa0", "检查归类\xa0\xa0\xa0\xa0", "是否空腹\xa0\xa0\xa0\xa0", "参考价格\xa0\xa0\xa0\xa0", "适宜人群\xa0\xa0\xa0\xa0", "不适宜人群\xa0", "何时检测\xa0\xa0\xa0\xa0", "何地检测\xa0\xa0\xa0\xa0", "出单时间\xa0\xa0\xa0\xa0"],
            ["临床意义\xa0\xa0\xa0\xa0", "参考范围\xa0\xa0\xa0\xa0", "结果解读\xa0\xa0\xa0\xa0", "相关疾病\xa0\xa0\xa0\xa0", "相关症状\xa0\xa0\xa0\xa0", "建议与指导\xa0"],
            ["检查过程\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0", "检查注意事项\xa0\xa0\xa0\xa0", "不良反应与风险\xa0"],
            ["检测方法\xa0", "样本要求\xa0", "采样要求\xa0", "保存条件\xa0", "拒收标准\xa0"]];
function loadTab(tabs) {
    let html="";
    for (let i=0;i<tabs.length;i++)
    {
        if(i===0){
            html+="<li class=\"tabBlock-tab is-active\">"+tabs[i]+"</li>";
        }
        else {
            html+="<li class=\"tabBlock-tab\">"+tabs[i]+"</li>";
        }

    }
    return html;
}
//还需要为每个textarea赋值
//还需要为每个textarea赋值
function loadTabContents(tabs,contents,values_old,values_new,userInfo) {
    let html = '';
    for (let n=0; n<userInfo.length; n++){
        switch (n) {
            case 0:document.getElementById('userName').innerText=userInfo[0];
            break;
            case 1:document.getElementById('itemName').innerText=userInfo[1];
            break;
            case 2:document.getElementById('finishedNumber').innerText=userInfo[2];
            break;
            case 3:document.getElementById('unfinishNumber').innerText=userInfo[3];
            break;
            case 4:document.getElementById('all').innerText=userInfo[4];
            break;
            case 5:document.getElementById('doubt').innerText=userInfo[5];
            break;

        }
    }
    for (let i=0; i<tabs.length; i++){
        let j;
        html+='';
        if(i===0){
            html+='<div class="tabBlock-pane" style="display: block">';
        }
        else{
        html+='<div class="tabBlock-pane" style="display: none">';
        }
        html+='<div class="row-fluid">'
        html+='<div class="span6"><h5>参考数据：</h5>';
        num = 0;
        for (j = 0; j<contents[i].length; j++){
            html+='<div class="container" ><div class="box1" style="display: inline-block"><label class="form-inline"  >'+contents[i][j]+'<textarea name="texta" required="required" style="width: 279px;height: 77px" id="content_"'+j+' type="text" readonly>'+values_old[num]+'</textarea></label></div>';
            html+='&ensp;<div class="box2" style="display: inline-block"></div></div>';
            num+=1
        }
        html+='</div>';
        html+='<div class="span6"><h5>校验数据：</h5><form action="##" id=form'+i+'  class="form-horizontal" onsubmit="return false">';
        num = 0;
        for (j = 0; j<contents[i].length; j++){

            html+='<div class="container" ><div class="box1" style="display: inline-block"><label class="form-inline"  >'+contents[i][j]+'<textarea  name="texta" required="required" style="width: 279px;height: 77px" id=content'+i+j+' type="text" >'+values_new[num]+'</textarea></label></div>';
            html+='&ensp;<div class="box2" style="display: inline-block"><label class="checkbox"><input type="checkbox" name="checkbox'+i+'" id="check"'+j+' value='+j+'>存疑</label></div></div>';
            num+=1
        }
        html+='</form></div>';
        html+='</div></div>';

    }
    html+='<div class="container-fluid">\n' +
        '\t<div class="row-fluid">\n' +
        '\t\t<div class="span12">\n' +
        '\t\t\t <button id="next" class="btn btn-block btn-large btn-success" type="button" onclick="submit($(\'.tabBlock-tabs\'))">>></button>\n' +
        '\t\t</div>\n' +
        '\t</div>\n' +
        '</div>';
    return html;
}
function countNumber() {
    //计算完成数量

}

function searchItem(){
    //alert("a")
    document.getElementById('tabs').innerHTML=loadTab(tabs);
    let xmlhttp;

    let str = document.getElementById('searchBox').value;
    let category = document.getElementById('sel').value;
    // if(str.length==0){
    //     alert("搜索内容为空")
    //     return;
    // }

    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            let jsonObj = JSON.parse(xmlhttp.responseText);
            loadSearchContents(jsonObj);
        }
    };
    xmlhttp.open("GET","./bussiness",true);//传送类别及搜索内容
    xmlhttp.send();
}
//查找、完成、页面重新加载均调用此方法
function loadSearchContents(json){
    //alert("12")
    let values_new = new Array();
    let values_old = new Array();
    let checks = new Array();
    let userInfo = new Array();
    let i = 0;
    for (ele in json){
       i=i+1;
       values_old[i-1]=new Array();
       values_new[i-1]=new Array();
       var j=0;
       for (let key in json[ele][0]) {
           //alert(json[ele][0].length);

           //alert(key) key值是属性名称，根据名称判断
           j = j + 1;
           if (i === 1) {
               userInfo[j - 1] = json[ele][0][key]
           }
           if (key !== "doubt"&&i!==1) {
               var val = json[ele][0][key].split("￥￥");
               values_old[i - 2][j - 1] = val[0];
               values_new[i - 2][j - 1] = val[1];
           } else {
               checks[i - 2] = json[ele][0][key];
           }
       }

   }

   var html=loadTabContents(tabs,contents,values_old,values_new,userInfo);
   document.getElementById("contents").innerHTML=html
    checkboxs(checks);
}
function checkboxs(che) {
    for(let i=0;i<che.length;i++){
        let val=che[i].split(",");
        let boxes = document.getElementsByName("checkbox"+i);
        for(let j=0;j<boxes.length;j++){
            for(let k=0;k<val.length;k++){
                if(boxes[j].value === val[k]){
                    boxes[j].checked = true;
                    break
                }
            }
        }
    }
}
function validate_required(field,alerttxt)
{
    with (field)
    {
        if (value==null||value==="")
        {alert(alerttxt);return false}
        else {return true}
    }
}

function validate_form(thisform)
{
    alert("hhhhh");
    with (thisform)
    {
        //let texts=document.getElementsByName("text");

        if (validate_required(texta,"有缺失项")===false)
        {texta.focus();return false}
    }
}