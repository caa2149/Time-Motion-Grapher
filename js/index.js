var ctr = 0;
var item = {
  keys: [new key(ctr,"#000","Thing " + (ctr+1))],
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
            ctr = parseInt(item.keys[item.keys.length-1].ID.substring(1))+1;
        }
    }
    drawResults();
}
loadItem();

// clicking a plus
$("#in").on('click','#add',function() {
  var c = Math.floor(Math.random()*16777216).toString(16);
  if (c.length != 6) { c = "#0" + c; }
  else { c = "#" + c; }
  $("#in").append("<div id='i"+ctr+"'>" +
                    "<input id='color' type='color' " +
                    "value='" + c + "'> " +
                    "<input id='desc' value='Thing " + (ctr+1) + "'> " +
                    "<button id='add'></button> " +
                    "<button id='del'></button >" +
                    "<button id='log'>X</log>" +
                  "</div>");
  var len = item.keys.length;
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
  var pid = $(this).parent().attr('id');
  var list = item.time;
  for (x in item.keys) {
    if (item.keys[x].ID == pid) {
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