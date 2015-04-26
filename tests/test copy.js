function log(m, id){
  var e = document.getElementById(id || 'log')
  e.innerHTML =m + '</br/>'
}

function toPos(e){
  return [e.clientX,e.clientY]
}

function fromPos(v){
  return v[0] < 100
}
var mousePos = circus.domEvent(document.body,'mousemove').map(toPos)
var click = circus.domEvent(document.body,'click').pulse()

circus.domEvent(document.body,'mousedown','mouseup')
  .sample(mousePos,fromPos).tap(function(e){
    log('down: '+e,'l3')
  })
  .map(toPos).off(function(v){log('up:'+v,'l3')})

var pos1 = mousePos.take(200).tap(function(x){log('pos 1 '+x,'l1')})
var pos2 = mousePos.tap(function(x){log('pos 2 '+x,'l2')}).map(function(p){
  return '='+p[1]+':'+p[0]
})

var pos3 = click.keep(2).join(pos1,pos2).map(function(c,p1,p2){
  return {p0:p1,p1:p2}
}).tap(function(p){ 
  log('p3:'+p.p1+pos3.toArray().length,'l4')
})

var fed = circus.signal().map(function(p){
  return 'xyx'+p.p1
}).tap(function(p){log('p4'+p)})

pos3.feed(fed)

log('start')