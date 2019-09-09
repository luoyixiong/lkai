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
   //itemData(arr);
    var mydiv=document.getElementById("allItem");
    mydiv.style.display="block"
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
    for(var i in item){
            // console.log(item[i]["eid"]);
            // console.log(item[i]["name"]);
            // console.log(item[i]["isFinished"]);

        // console.log(i);
        html+='<div  style=\'display:block; padding:5px; cursor:pointer\'  onclick=\'clickFn(this)\'  onmouseover=\'overFn(this)\'  onmouseout=\'outFn(this)\'>'
        if(item[i]["isFinished"]===0){
            html += '<a style="color:#419641" href="../index?eid=' + item[i]["eid"] + '">' + item[i]["name"] + '</a>'//大佬改href
        }
        else if(item[i]["isFinished"]===1) {
            html += '<a style="color: #faa732" href="../index?eid=' + item[i]["eid"] + '">' + item[i]["name"] + '</a>'//大佬改href
        }
        html+='</div>'
    }
    document.getElementById("allItem").innerHTML=html;

}
function hideAll() {
    // setTimeout(function () {
    //     var s=document.getElementById('allItem');
    //     s.style.display="none";
    // },1000);

    var s=document.getElementById('allItem');
    s.style.display="none";


}