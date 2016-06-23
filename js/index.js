var ctr = 0;
var item = {
  keys: [new key(ctr,"#000000","Thing " + (ctr+1))],
  time: [],
  interval: 1000
}
function key(i,c,d) {
  this.ID = "i" + i;
  this.color = c;
  this.desc = d;
  ctr++;
}
function drawResults() {
  $('#out').empty();
  var list = item.time;
  for (i in list) {
    $('#out').append("<div id='" + list[i].ID +
      "' title='" + (parseInt(i)+1) + ": " + list[i].desc +
      "' style='background:" + list[i].color +
      "' data-id='" + i + "'></div>");
  }
  curr = (item.time.length);
  $("#undo button, #log").text(curr);
}
var curr = 0;
function loadItem() {
    var url = window.location.href;
    var data = url.slice(url.indexOf('?')+1).split('&');
    for (d in data) {
        var loc = data[d].indexOf('q=');
        if (loc >= 0) {
            var q = data[d].substring(loc+2);
            item = JSON.parse(decodeURIComponent(q));
            $("#in").empty();
            for (i in item.keys) {
                appendThing(item.keys[i].color,item.keys[i].desc);
            }
            $("#del").hide();
        }
    }
    drawResults();
}
loadItem();
function appendThing(color,id) {
    $("#in").append("<div id='"+id+"'>" +
                    "<input id='color' type='color' " +
                    "value='" + color + "'> " +
                    "<input id='desc' value='" + id + "'> " +
                    "<button id='add'></button> " +
                    "<button id='del'></button >" +
                    "<button id='log'>X</log>" +
                    "</div>");
}

// clicking a plus
$("#in").on('click','#add',function() {
  var c = Math.floor(Math.random()*16777216).toString(16);
  if (c.length != 6) { c = "#0" + c; }
  else { c = "#" + c; }
  appendThing(c,'Thing '+(ctr+1));
  item.keys.push(new key(ctr,c,"Thing " + (ctr+1)));
});

// clicking a minus
$("#in").on('click','#del',function() {
  var id = $(this).parent().attr("id");
  for (i in item.keys) {
    if (item.keys[i].ID == id) { 
      item.keys.splice(i,1);
    }
  }
  $("#"+id).remove();
});

// changing an input
$("#in").on('change','input',function() {
  var pt = $(this).parent();
  var pid = pt.attr('id');
  var mid = $(this).attr('id');
  for (x in item.keys) {
    if (item.keys[x].ID == pid && mid == 'desc') {
      console.log(pid+"'s desc was changed");
      item.keys[x].desc = $(this).val();
    }
    else if (item.keys[x].ID == pid && mid == 'color') {
      console.log(pid+"'s color was changed");
      item.keys[x].color = $(this).val();
    }
  }
});

// lock activities and start
$("#lock").click(function() {
  $(".lock, #add, #log, #undo").toggle();
  $("#add, #del").hide();
  $("input").attr('disabled',true);
});

// unlock activities and pause
$("#unlock").click(function() {
  $(".lock, #add, #log, #undo").toggle();
  $("input").attr('disabled',false);
});

// add event pressed
$("#in").on('click','#log',function() {
            console.log("pressed");
  var pid = $(this).parent().attr('id');
            console.log("pid: "+pid);
  var list = item.time;
            console.log("list: "+list);
  for (x in item.keys) {
    if (item.keys[x].ID == pid) {
            console.log("found: "+item.keys[x].ID);
      list.splice(curr,0,item.keys[x]);
    }
  }
  drawResults();
});

// undo event
$("#undo").click(function() {
  item.time.splice(parseInt(curr)-1,1);
  drawResults();
});

// click an event
$("#out").on('click','div',function() {
  curr = parseInt($(this).attr('data-id'))+1;
  $("#undo button, #log").text(curr);
});