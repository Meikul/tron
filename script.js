var canv, con, w, h;
var spd = 4;
var players = [];

window.onload = function(){
  canv = document.getElementById('canvas');
  con = canv.getContext('2d');
  con.lineWidth=2;
  h = canv.height;
  w = canv.width;
  var p1Keys = [37, 38, 39, 40];
  var p1Origin = new Vert(700, 500);
  players.push(new Player('#f44', p1Keys, p1Origin));
  var p2Keys = [65, 87, 68, 83];
  var p2Origin = new Vert(300, 500);
  players.push(new Player('#44f', p2Keys, p2Origin));
  window.setInterval(game, 1000/40);
  document.addEventListener('keydown', keypush);
}

function Vert(x, y, isWrap=false){
  this.x = x;
  this.y = y;
  this.isWrap = isWrap;
}

function KeySet(left, up, right, down){
  this.left = left;
  this.up = up;
  this.right = right;
  this.down = down;
}

function Player(color, keys, origin){
  this.color = color;
  this.keys = keys;
  this.verts = [];
  this.x = origin.x;
  this.y = origin.y;
  this.xVel = 0;
  this.yVel = 1;
  this.verts.push(new Vert(origin.x, origin.y));
  this.death = function(){
    this.xVel = this.yVel = 0;
    this.verts=[new Vert(this.x, this.y)];
  }
}

function game(){
  console.log(players[0].x, players[0].y);
  con.fillStyle = '#222';
  con.fillRect(0, 0, canv.width, canv.height);
  players.forEach(function(p, index){
    con.beginPath();

    p.x += p.xVel*spd;
    p.y -= p.yVel*spd;

    con.strokeStyle = p.color;
    p.verts.forEach(function(vert, i){
      if(i===0){
        con.moveTo(vert.x, vert.y);
      }
      else{
        if(vert.isWrap) con.moveTo(vert.x, vert.y);
        else con.lineTo(vert.x, vert.y);
      }
    });
    con.lineTo(p.x, p.y);

    // console.log(checkHit(p));

    if(checkHit(p)){
      p.death();
    }

    if(p.x > w){
      p.verts.push(new Vert(p.x, p.y));
      p.x=0;
      p.verts.push(new Vert(p.x, p.y, true));
    } else if(p.x<0){
      p.verts.push(new Vert(p.x, p.y));
      p.x=w;
      p.verts.push(new Vert(p.x, p.y, true));
    }
    if(p.y > h){
      p.verts.push(new Vert(p.x, p.y));
      p.y=0;
      p.verts.push(new Vert(p.x, p.y, true));
    } else if(p.y<0){
      p.verts.push(new Vert(p.x, p.y));
      p.y=h;
      p.verts.push(new Vert(p.x, p.y, true));
    }



    con.stroke();
  });

}

function checkHit(cp){
  for(var pi=0; pi<players.length+2; i++){
    var p=players[pi];
    for(var i=0; i<p.verts.length; i++){
      var p1 = p.verts[i];
      if(i===p.verts.length-1){
        var p2=new Vert(p.x, p.y);
      } else var p2 = p.verts[i+1];
      if(p1.x === p2.x){
        if(cp.x === p1.x && ((cp.y>p1.y && cp.y<p2.y)||(cp.y<p1.y && cp.y>p2.y))){
          return true;
        } else continue;
      } else if(p1.y === p2.y){
        if(cp.y === p1.y && ((cp.x>p1.x && cp.x<p2.x)||(cp.x<p1.x && cp.x>p2.x))){
          return true;
        } else continue;
      }
    }
    return false;
  }
}

function keypush(e){
  var key = e.which;
  players.forEach(function(p){
    p.keys.forEach(function(keyCode, index){
      if(keyCode === key){
        switch(index){
          case 0:
            if(p.xVel===0){
              p.verts.push(new Vert(p.x, p.y));
              p.xVel = -1; p.yVel = 0;
            }
            break;
          case 1:
            if(p.yVel===0){
              p.verts.push(new Vert(p.x, p.y));
              p.xVel = 0; p.yVel = 1;
            }
            break;
          case 2:
            if(p.xVel===0){
              p.verts.push(new Vert(p.x, p.y));
              p.xVel = 1; p.yVel = 0;
            }
            break;
          case 3:
            if(p.yVel===0){
              p.verts.push(new Vert(p.x, p.y));
              p.xVel = 0; p.yVel = -1;
            }
            break;
        }
      }
    });
  });
  if(key===32){
    players.forEach(function(p){
      p.xVel=0;
      p.yVel=0;
    });
  }
  if(key===27){
    players.forEach(function(p){
      p.verts=[new Vert(p.x, p.y)];
    })
  }
}
