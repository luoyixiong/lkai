function overFn(obj){//鼠标在上面
    //$(obj).css("background","#F0F8FF");
    obj.style.background="#F0F8FF";
}
function outFn(obj){//鼠标离开
    obj.style.background="white";
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
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            myFunction(this);
            //document.getElementById("showDiv2").innerHTML=str;
            //mydiv.style.display="block"
            //$("#showDiv2").css("display","none");
        }
    };
    xmlhttp.open("GET","qa.xml",true);//使用post方法将参数str。。。 /try/ajax/demo_get2.php?search="+str
    xmlhttp.send();
}
function myFunction(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var mydiv=document.getElementById("hint");
    mydiv.style.display="block";
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
