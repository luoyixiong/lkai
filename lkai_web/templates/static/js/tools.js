function overFn(obj){//鼠标在上面
    //$(obj).css("background","#F0F8FF");
    obj.style.background="#F0F8FF";
}
function outFn(obj){//鼠标离开
    obj.style.background="#9acfea";
}
function clickFn(obj){//鼠标点击
    var searchtxt=document.getElementById("searchBox");
    searchtxt.value=obj.childNodes[0].nodeValue;
    var mydiv=document.getElementById("hint");
    mydiv.style.display="none";
}
function showHint(str)
{
    var xmlhttp;
    //var mydiv=document.getElementById("hint");
    if (str.length==0)
    {
        document.getElementById("hint").innerHTML="";
        return;
    }
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
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            myFunction(this);
            //document.getElementById("showDiv2").innerHTML=str;
            //mydiv.style.display="block"
            //$("#showDiv2").css("display","none");
        }
    }
    xmlhttp.open("GET","qa.xml",true);//使用post方法将参数str。。。 /try/ajax/demo_get2.php?search="+str
    xmlhttp.send();
}
function myFunction(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var mydiv=document.getElementById("hint");
    mydiv.style.display="block"
    var div="";
    var x = xmlDoc.getElementsByTagName("HINT");
//document.getElementById("showDiv2").innerHTML =x[1].childNodes[0].nodeValue;
    for (i = 0; i <x.length; i++) {
        div += "<div  style='display:block; padding:5px; cursor:pointer'  onclick='clickFn(this)'  onmouseover='overFn(this)'  onmouseout='outFn(this)'>" +
            x[i].childNodes[0].nodeValue +
            "</div>"
    }
    mydiv.innerHTML =div;
}


function showAll(obj) {
    var sel=document.getElementById("sel").value;
    var xmlhttp;
    console.log("hahahahah")
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
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            var jsonObj = JSON.parse(xmlhttp.responseText);
            itemData(jsonObj);
            var mydiv=document.getElementById("allItem");
            mydiv.style.display="block";
        }
    }
    xmlhttp.open("GET","./getAllZB",true);//大佬改 //sel传送类别
    xmlhttp.send();
}
function itemData(item) {
//     var i;
//     var xmlDoc = xml.responseXML;
//     var div="";
//     var x = xmlDoc.getElementsByTagName("HINT");
// //document.getElementById("showDiv2").innerHTML =x[1].childNodes[0].nodeValue;
//     for (i = 0; i <x.length; i++) {
//         div += "<div  style='display:block; padding:5px; cursor:pointer'  onclick='clickFn(this)'  onmouseover='overFn(this)'  onmouseout='outFn(this)'>" +
//             '<a href="">'+x[i].childNodes[0].nodeValue +'</a>'+
//             "</div>"
//     }
//     mydiv.innerHTML =div;
    var html="";
    var html1="";
    var html2="";
    var html3="";
    var sel=document.getElementById("sel").value;
    console.log(sel);
    for(var i in item){
            // console.log(item[i]["eid"]);
            // console.log(item[i]["name"]);
            // console.log(item[i]["isFinished"]);

        // console.log(i);

        if(item[i]["isFinished"]===0){
            html1+='<div  style=\'display:block; padding:5px; cursor:pointer\'  onclick=\'clickFn(this)\'  onmouseover=\'overFn(this)\'  onmouseout=\'outFn(this)\'>'
            html1 += '<a style="color:#419641" href="../index?eid=' + item[i]["eid"] + '">' + item[i]["name"] + '</a>'//大佬改href
            html1+='</div>'
        }
        else if(item[i]["isFinished"]===1) {
            html2+='<div  style=\'display:block; padding:5px; cursor:pointer\'  onclick=\'clickFn(this)\'  onmouseover=\'overFn(this)\'  onmouseout=\'outFn(this)\'>'
            html2 += '<a style="color: #faa732" href="../index?eid=' + item[i]["eid"] + '">' + item[i]["name"] + '</a>'//大佬改href
            html2+='</div>'
        }
        else if (item[i]["isFinished"]===2){
            html3+='<div  style=\'display:block; padding:5px; cursor:pointer\'  onclick=\'clickFn(this)\'  onmouseover=\'overFn(this)\'  onmouseout=\'outFn(this)\'>'
            html3 += '<a style="color:#975997" href="../index?eid=' + item[i]["eid"] + '">' + item[i]["name"] + '</a>'//大佬改href
            html3+='</div>'
        }
    }
    switch (sel) {
        case "finished":document.getElementById("allItem").innerHTML=html1;
        break;
        case "unfinish":document.getElementById("allItem").innerHTML=html2; console.log("这是未完成")
        break;
        case "unsure":document.getElementById("allItem").innerHTML=html3;
        break;
        default:break;
    }

}
function hideAll() {
    // setTimeout(function () {
    //     var s=document.getElementById('allItem');
    //     s.style.display="none";
    // },1000);

    var s=document.getElementById('allItem');
    s.style.display="none";
}

function jump() {
    // var id='lkai.ent.'+document.getElementById('itemName').value;
    // var result = new Object();
    // result.eid = id;
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "./jumpZB" ,//url 大佬需要修改的路径
        //data: JSON.stringify(""),
        success: function (result) {
            //console.log(result);//打印服务端返回的数据(调试用)
            if (result.resultCode == 200) {
                window.location.reload();
            };
        },
        error : function() {
            //alert("hhh");
        }
    });
}