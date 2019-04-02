var heroColor = new Array('#fbdf7c','#946716','#af4c08','#e98223','#c3851e','#c06902','#a94200','#f8a025','#ffd94d','black','#e1b037','#d6730b','#e69a11','#fbd246','#cf7a03','#cf7a03','#cc7937','#d4741d','#ffcc5a','#d4741d','#ffcc5a');//我方坦克颜色数组
var enemyColor = new Array('#FFE7C4','#316F33','#593E18','#D59249','#797207','#B0852E','#4F1B00','#FBB14D','#FFE288','#132B30','#C1C069','#A77F1E','#CDAB2A','#FFDD7E','#988809','#988809','#918769','#A28040','#FFD899','#A28040','#FFD899');//敌方坦克颜色数组  

function Tank(x,y,speed,direct,size,color){//tank公共类
    this.x = x;//目标横坐标
    this.y = y;//目标纵坐标
    this.speed = speed;//目标速度
    this.direct = direct;//目标方向：0上、1右、2下、3左
    this.size = size;//目标大小：0.1~1    
    this.color = color;   
    this.live = true;              
    this.move = function(i){//控制方向、路程         
        switch(i){
            case 38:
                this.direct = 0;   
                this.y -= this.speed;                                      
            break;
            case 39:        
                this.direct = 1;
                this.x += this.speed;                                                   
            break;
            case 40:
                this.direct = 2;
                this.y += this.speed;                                                   
            break;
            case 37:
                this.direct = 3;
                this.x -= this.speed;                                                      
            break;
        } 
    }
}

function Bullet(x,y,direct,size,speed){//子弹公共类
    this.x = x;
    this.y = y;
    this.direct = direct;
    this.size = size;
    this.speed = speed;
    this.timer = null;
    this.live = true;
    this.run = function(){
        if(this.x<=0||this.x>=border[0]||this.y<=0||this.y>=border[1]||this.live==false){//子弹遇到边界或者死亡时停止运动
            window.clearInterval(this.timer);
            this.live = false;
        }else{
            switch(this.direct){
                case 0:
                    this.y -=this.speed;                
                break;
                case 1:
                    this.x +=this.speed;
                break;
                case 2:
                    this.y +=this.speed;
                break;
                case 3:
                    this.x -=this.speed;
                break;                                    
            }
        }
        window.document.getElementById('data').innerText = 'x='+this.x+',y='+this.y;
    }

}
function Bomb(x,y,size){//爆炸类图片
    this.x = x;
    this.y = y;
    this.size = size;
    this.live = true;
    this.blood = 9;//生命值
    this.bloodDown = function(){
        if(this.blood>0){
            this.blood--;
        }else{
            this.live = false;
        }
    }
}
function Hero(x,y,speed,direct,size,color){//英雄类
    this.tank = Tank;//对象冒充/对象继承
    this.tank(x,y,speed,direct,size,color);//运行
    this.shoot = function(){//射击
        switch(this.direct){
            case 0:                
                var circleX = this.size*((42+91+43)/2+this.x);//其实是定义成局部变量,当全局变量heroBullet属性改变后也不会影响circleX
                var circleY = this.size*(this.y-68);
                heroBullet = new Bullet(circleX,circleY,this.direct,this.size,10);                    
            break;
            case 1:                                
                var circleX = this.size*(this.x+170+70 );             
                var circleY = this.size*((42+91+43)/2+this.y);  
                heroBullet = new Bullet(circleX,circleY,this.direct,this.size,10);                    
            break;
            case 2:                                
                var circleX = this.size*((+42+91+43)/2+this.x);
                var circleY = this.size*(170+this.y+78);  
                heroBullet = new Bullet(circleX,circleY,this.direct,this.size,10);                    
            break;
            case 3:                                
                var circleX = this.size*(this.x-70);              
                var circleY = this.size*((42+91+43)/2+this.y);
                heroBullet = new Bullet(circleX,circleY,this.direct,this.size,10);                    
            break;                                    
        }   
        // var timer = window.setInterval('heroBullet.run()',50);
        // heroBullet.timer = timer;        
        heroBullets.push(heroBullet);
        var timer=window.setInterval("heroBullets["+(heroBullets.length-1)+"].run()",50);
        heroBullets[heroBullets.length-1].timer = timer; 
        }
    }

function Enemy(x,y,speed,direct,size,color){//敌人类
    this.tank = Tank;//对象冒充/对象继承
    this.tank(x,y,speed,direct,size,color);//运行
    this.count = 0;
    this.enemyRun = function(){
        switch(this.direct){
            case 0:
                if(this.y>0){
                    this.y -= this.speed; 
                }                                         
            break;
            case 1:
                if(this.size*(this.x+170)<border[0]){
                    this.x += this.speed;
                }                                                                  
            break;
            case 2:
                if(this.size*(this.y+170)<border[1]){
                    this.y += this.speed;
                }                                                    
            break;
            case 3:
                if(this.size*(this.x-170)>0){
                    this.x -= this.speed;
                }                                                       
            break;             
        }
        this.count++;
        if(this.count>10){
            this.direct = Math.round(Math.random()*3);
            this.count = 0;
        }
    }
}
//绘制目标(坦克)开始 i=0、1、2、3. c:升级变身(扩展) 
function drawTiger(tiger,i/*,c*/){//i:direct方向
    if(tiger.live){
        switch(i){
            case 0://上
                cxt.fillStyle = tiger.color[0];//'#fbdf7c';//车轮//颜色0
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y),tiger.size*42,tiger.size*170);
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y),tiger.size*42  ,tiger.size*170);

                cxt.fillStyle = tiger.color[1];//'#946716';//轮式//颜色1
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y),tiger.size*42,tiger.size*19); 
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+19+24),tiger.size*42,tiger.size*19);       
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+19*2+24+19),tiger.size*42,tiger.size*19);  
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+19*3+24+19+19),tiger.size*42,tiger.size*19); 
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+19*4+24+19+19+14),tiger.size*42,tiger.size*19); 

                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y),tiger.size*42,tiger.size*19); 
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+19+24),tiger.size*42,tiger.size*19);       
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+19*2+24+19),tiger.size*42,tiger.size*19);  
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+19*3+24+19+19),tiger.size*42,tiger.size*19); 
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+19*4+24+19+19+14),tiger.size*42,tiger.size*19); 

                cxt.beginPath();
                cxt.fillStyle = tiger.color[2];//'#af4c08';//底盘1//颜色2

                cxt.moveTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+26));//1
                cxt.lineTo(tiger.size*(tiger.x+42+10),tiger.size*(tiger.y+22));//2
                cxt.lineTo(tiger.size*(tiger.x+42+90-10),tiger.size*(tiger.y+22));//3
                cxt.lineTo(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+26));//4
                cxt.lineTo(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+22+133-13));//5
                cxt.lineTo(tiger.size*(tiger.x+42+90-16),tiger.size*(tiger.y+22+130));//6
                cxt.lineTo(tiger.size*(tiger.x+42+16),tiger.size*(tiger.y+22+130));//7
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+22+133-13));//8 
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+26));//9        
                cxt.fill();
                cxt.closePath();

                cxt.beginPath();//底盘2
                cxt.fillStyle = tiger.color[3];//'#e98223';//颜色3
                cxt.moveTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+26+14));//1
                cxt.lineTo(tiger.size*(tiger.x+42+13),tiger.size*(tiger.y+26+14));//2
                cxt.lineTo(tiger.size*(tiger.x+42+13),tiger.size*(tiger.y+26+6));//3
                cxt.lineTo(tiger.size*(tiger.x+42+90-13),tiger.size*(tiger.y+26+6));//4
                cxt.lineTo(tiger.size*(tiger.x+42+90-13),tiger.size*(tiger.y+26+14));//5
                cxt.lineTo(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+26+14));//6
                cxt.lineTo(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+22+133-20));//7
                cxt.lineTo(tiger.size*(tiger.x+42+90-10),tiger.size*(tiger.y+22+133-20));//8
                cxt.lineTo(tiger.size*(tiger.x+42+90-15+10),tiger.size*(tiger.y+22+133-20+14));//9
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-20),tiger.size*(tiger.y+22+133-20+14));//10
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15),tiger.size*(tiger.y+22+133-20));//11
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15-20),tiger.size*(tiger.y+22+133-20));//12
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15-20),tiger.size*(tiger.y+22+133-20+6));//13
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15-20-25),tiger.size*(tiger.y+22+133-20+6));//14
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15-20-25),tiger.size*(tiger.y+22+133-20));//15
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+22+133-20));//16
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+26+14));//17
                cxt.fill();
                cxt.closePath();               

                cxt.fillStyle = tiger.color[4];//'#c3851e';//底盘3//颜色4
                cxt.fillRect(tiger.size*(tiger.x+42+11),tiger.size*(tiger.y+52),tiger.size*71,tiger.size*75);        
                cxt.fillStyle = tiger.color[5];//'#c06902';//底盘3框//颜色5
                cxt.fillRect(tiger.size*(tiger.x+42+9),tiger.size*(tiger.y+50),tiger.size*75,tiger.size*77); 
                cxt.fillStyle = tiger.color[6];//'#a94200';//底盘3的小矩形//颜色6
                cxt.fillRect(tiger.size*(tiger.x+59),tiger.size*(tiger.y+122),tiger.size*21,tiger.size*17);    

                cxt.beginPath();//炮架底1
                cxt.fillStyle = tiger.color[7];//'#f8a025';//颜色7
                cxt.moveTo(tiger.size*(tiger.x+42+12),tiger.size*(tiger.y+77));//1
                cxt.lineTo(tiger.size*(tiger.x+42+12),tiger.size*(tiger.y+113));//2
                cxt.lineTo(tiger.size*(tiger.x+42+12+6),tiger.size*(tiger.y+52+76));//3    
                cxt.lineTo(tiger.size*(tiger.x+42+12+10),tiger.size*(tiger.y+52+80));//4
                cxt.lineTo(tiger.size*(tiger.x+42+12+61),tiger.size*(tiger.y+52+80));//5 
                cxt.lineTo(tiger.size*(tiger.x+42+12+65),tiger.size*(tiger.y+52+76));//6    
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2),tiger.size*(tiger.y+113));//7        
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2),tiger.size*(tiger.y+77));//8 
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15),tiger.size*(tiger.y+42));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+12+15),tiger.size*(tiger.y+42));//10 
                cxt.lineTo(tiger.size*(tiger.x+42+12),tiger.size*(tiger.y+77));//11               
                cxt.fill();
                cxt.closePath();

                cxt.beginPath();//炮架底2
                cxt.fillStyle = tiger.color[8];//'#ffd94d'; //颜色8
                cxt.moveTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+77));//1
                cxt.lineTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+113));//2
                cxt.lineTo(tiger.size*(tiger.x+42+12+6+14),tiger.size*(tiger.y+52+76-5));//3    
                cxt.lineTo(tiger.size*(tiger.x+42+12+10+14),tiger.size*(tiger.y+52+80-5));//4
                cxt.lineTo(tiger.size*(tiger.x+42+12+61-14),tiger.size*(tiger.y+52+80-5));//5 
                cxt.lineTo(tiger.size*(tiger.x+42+12+65-14),tiger.size*(tiger.y+52+76-5));//6    
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2-14),tiger.size*(tiger.y+113));//7        
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2-14),tiger.size*(tiger.y+77));//8 
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15-10),tiger.size*(tiger.y+42+15));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+12+15+10),tiger.size*(tiger.y+42+15));//10 
                cxt.lineTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+77));//11  
                cxt.fill();
                cxt.closePath();    

                cxt.beginPath();//炮架底2框
                cxt.strokeStyle = tiger.color[9];//'black';//颜色9 
                cxt.moveTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+77));//1
                cxt.lineTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+113));//2
                cxt.lineTo(tiger.size*(tiger.x+42+12+6+14),tiger.size*(tiger.y+52+76-5));//3    
                cxt.lineTo(tiger.size*(tiger.x+42+12+10+14),tiger.size*(tiger.y+52+80-5));//4
                cxt.lineTo(tiger.size*(tiger.x+42+12+61-14),tiger.size*(tiger.y+52+80-5));//5 
                cxt.lineTo(tiger.size*(tiger.x+42+12+65-14),tiger.size*(tiger.y+52+76-5));//6    
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2-14),tiger.size*(tiger.y+113));//7        
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2-14),tiger.size*(tiger.y+77));//8 
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15-10),tiger.size*(tiger.y+42+15));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+12+15+10),tiger.size*(tiger.y+42+15));//10 
                cxt.lineTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+77));//11  
                cxt.stroke();
                cxt.closePath();   

                cxt.beginPath();//炮架上底
                cxt.fillStyle = tiger.color[10];//'#e1b037';//颜色10
                cxt.moveTo(tiger.size*(tiger.x+42+12+15),tiger.size*(tiger.y+42));
                cxt.lineTo(tiger.size*(tiger.x+42+12+15+10),tiger.size*(tiger.y+42+15));
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15-10),tiger.size*(tiger.y+42+15));  
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15),tiger.size*(tiger.y+42));
                cxt.lineTo(tiger.size*(tiger.x+42+12+15),tiger.size*(tiger.y+42));          
                cxt.fill();
                cxt.closePath(); 

                cxt.beginPath();//炮架下底
                cxt.fillStyle = tiger.color[11];//'#d6730b';//颜色11
                cxt.moveTo(tiger.size*(tiger.x+42+12+10),tiger.size*(tiger.y+52+80));
                cxt.lineTo(tiger.size*(tiger.x+42+12+61),tiger.size*(tiger.y+52+80));
                cxt.lineTo(tiger.size*(tiger.x+42+12+61-14),tiger.size*(tiger.y+52+80-5));
                cxt.lineTo(tiger.size*(tiger.x+42+12+10+14),tiger.size*(tiger.y+52+80-5));
                cxt.lineTo(tiger.size*(tiger.x+42+12+10),tiger.size*(tiger.y+52+80));
                cxt.fill();
                cxt.closePath();  

                cxt.beginPath();//圆形炮架底1
                cxt.fillStyle = tiger.color[12];//'#e69a11';//颜色12
                var circleX = tiger.size*((42+91+43)/2+tiger.x);
                var circleY = tiger.size*(170/2+tiger.y+10);
                var circleR = tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/2);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath();  

                cxt.beginPath();//圆形炮架底2
                cxt.fillStyle = tiger.color[13];//'#fbd246';//颜色13
                var circleX =tiger.size*((42+91+43)/2+tiger.x);
                var circleY =tiger.size*(170/2+tiger.y+10);
                var circleR =tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/2.5);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath(); 

                cxt.beginPath();//圆形炮架底3
                cxt.fillStyle = tiger.color[14];//'#cf7a03';//颜色14
                var circleX =tiger.size*((42+91+43)/2+tiger.x);
                var circleY =tiger.size*(170/2+tiger.y+10);
                var circleR = tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/3.5);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath();      

                cxt.fillStyle = tiger.color[15];//'#cf7a03';//炮筒上//颜色15
                cxt.fillRect((circleX-tiger.size*34/2),tiger.size*(tiger.y-50),tiger.size*34,tiger.size*15);  

                cxt.fillStyle = tiger.color[16];//'#cc7937';//炮筒中//颜色16
                cxt.fillRect((circleX-tiger.size*16/2),tiger.size*(tiger.y-35),tiger.size*16,tiger.size*84);

                cxt.beginPath();//车饰边框左
                cxt.strokeStyle = tiger.color[17];//'#d4741d';//颜色17
                cxt.lineWidth = 2;
                cxt.moveTo(tiger.size*(tiger.x+23+24),tiger.size*(tiger.y+13));
                cxt.lineTo(tiger.size*(tiger.x+23+24),tiger.size*(tiger.y+13+150));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24+4),tiger.size*(tiger.y+13+150));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24),tiger.size*(tiger.y+13+141));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24),tiger.size*(tiger.y+13+19));
                cxt.lineTo(tiger.size*(tiger.x+23+10),tiger.size*(tiger.y+13));
                cxt.lineTo(tiger.size*(tiger.x+23+24),tiger.size*(tiger.y+13));    
                cxt.stroke();
                cxt.closePath();

                cxt.beginPath();//车饰填充左
                cxt.fillStyle = tiger.color[18];//'#ffcc5a';//颜色18
                cxt.moveTo(tiger.size*(tiger.x+23+24-1),tiger.size*(tiger.y+13+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-1),tiger.size*(tiger.y+13+150-1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24+4+1),tiger.size*(tiger.y+13+150-1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24+1),tiger.size*(tiger.y+13+141+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24+1),tiger.size*(tiger.y+13+19+1));
                cxt.lineTo(tiger.size*(tiger.x+23+10+1),tiger.size*(tiger.y+13+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-1),tiger.size*(tiger.y+13+1));   
                cxt.fill();
                cxt.closePath();


                cxt.beginPath();//车饰边框右
                cxt.strokeStyle = tiger.color[19];//'#d4741d';//颜色19
                cxt.lineWidth = 2;
                cxt.moveTo(tiger.size*(tiger.x+23+24+82),tiger.size*(tiger.y+13));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82),tiger.size*(tiger.y+13+150));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-4),tiger.size*(tiger.y+13+150));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24),tiger.size*(tiger.y+13+141));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24),tiger.size*(tiger.y+13+19));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-10),tiger.size*(tiger.y+13));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82),tiger.size*(tiger.y+13));    
                // cxt.fill();
                cxt.stroke();
                cxt.closePath();

                cxt.beginPath();//车饰填充右
                cxt.fillStyle = tiger.color[20];//'#ffcc5a';//颜色20
                cxt.moveTo(tiger.size*(tiger.x+23+24+82+1),tiger.size*(tiger.y+13+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+1),tiger.size*(tiger.y+13+150-1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-4-1),tiger.size*(tiger.y+13+150-1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-1),tiger.size*(tiger.y+13+141+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-1),tiger.size*(tiger.y+13+19+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-10-1),tiger.size*(tiger.y+13+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+1),tiger.size*(tiger.y+13+1));
                cxt.fill();
                cxt.closePath();                                                 
            break;
            case 2://下
                cxt.fillStyle = tiger.color[0];//'#fbdf7c';//车轮//颜色0
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y),tiger.size*42,tiger.size*170);
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y),tiger.size*42  ,tiger.size*170);

                cxt.fillStyle = tiger.color[1];//'#946716';//轮式//颜色1
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y),tiger.size*42,tiger.size*19); 
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+19+24),tiger.size*42,tiger.size*19);       
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+19*2+24+19),tiger.size*42,tiger.size*19);  
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+19*3+24+19+19),tiger.size*42,tiger.size*19); 
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+19*4+24+19+19+14),tiger.size*42,tiger.size*19); 

                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y),tiger.size*42,tiger.size*19); 
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+19+24),tiger.size*42,tiger.size*19);       
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+19*2+24+19),tiger.size*42,tiger.size*19);  
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+19*3+24+19+19),tiger.size*42,tiger.size*19); 
                cxt.fillRect(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+19*4+24+19+19+14),tiger.size*42,tiger.size*19); 

                cxt.beginPath();
                cxt.fillStyle = tiger.color[2];//'#af4c08';//底盘1//颜色2

                cxt.moveTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+26+133-10));//1
                cxt.lineTo(tiger.size*(tiger.x+42+10),tiger.size*(tiger.y+30+133-10));//2
                cxt.lineTo(tiger.size*(tiger.x+42+90-10),tiger.size*(tiger.y+30+133-10));//3
                cxt.lineTo(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+26+133-10));//4
                cxt.lineTo(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+22+13+1));//5
                cxt.lineTo(tiger.size*(tiger.x+42+90-16),tiger.size*(tiger.y+22+1));//6
                cxt.lineTo(tiger.size*(tiger.x+42+16),tiger.size*(tiger.y+22+1));//7
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+22+13+1));//8 
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+26+133+1));//9        
                cxt.fill();
                cxt.closePath();

                cxt.beginPath();//底盘2
                cxt.fillStyle = tiger.color[3];//'#e98223';//颜色3
                cxt.moveTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+22+133-20));//16                          
                cxt.lineTo(tiger.size*(tiger.x+42+13),tiger.size*(tiger.y+22+133-20));//2                
                cxt.lineTo(tiger.size*(tiger.x+42+13),tiger.size*(tiger.y+22+133-20+8));//3  
                cxt.lineTo(tiger.size*(tiger.x+42+90-13),tiger.size*(tiger.y+22+133-20+8));//4
                cxt.lineTo(tiger.size*(tiger.x+42+90-13),tiger.size*(tiger.y+22+133-20));//5                            
                cxt.lineTo(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+22+133-20));//7       
                cxt.lineTo(tiger.size*(tiger.x+42+90),tiger.size*(tiger.y+26+14));//6                   
                cxt.lineTo(tiger.size*(tiger.x+42+90-10),tiger.size*(tiger.y+26+14));//8
                cxt.lineTo(tiger.size*(tiger.x+42+90-15+10),tiger.size*(tiger.y+26));//9
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-20),tiger.size*(tiger.y+26));//10
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15),tiger.size*(tiger.y+26+14));//11
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15-20),tiger.size*(tiger.y+26+14));//12
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15-20),tiger.size*(tiger.y+26+14-6));//13
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15-20-25),tiger.size*(tiger.y+26+14-6));//14
                cxt.lineTo(tiger.size*(tiger.x+42+90-15-15-20-25),tiger.size*(tiger.y+26+14));//15
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+26+14));//1
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+22+133-20));//16  
                cxt.fill();
                cxt.closePath();             

                cxt.fillStyle = tiger.color[4];//'#c3851e';//底盘3//颜色4
                cxt.fillRect(tiger.size*(tiger.x+42+11),tiger.size*(tiger.y+52),tiger.size*71,tiger.size*75);        
                cxt.fillStyle = tiger.color[5];//'#c06902';//底盘3框//颜色5
                cxt.fillRect(tiger.size*(tiger.x+42+9),tiger.size*(tiger.y+50),tiger.size*75,tiger.size*77); 
                cxt.fillStyle = tiger.color[6];//'#a94200';//底盘3的小矩形//颜色6
                cxt.fillRect(tiger.size*(tiger.x+59),tiger.size*(tiger.y+22+14),tiger.size*21,tiger.size*17);  

                cxt.beginPath();//炮架底1
                cxt.fillStyle = tiger.color[7];//'#f8a025';//颜色7
                cxt.moveTo(tiger.size*(tiger.x+42+12),tiger.size*(tiger.y+52+75-25));//1
                cxt.lineTo(tiger.size*(tiger.x+42+12),tiger.size*(tiger.y+52+6));//2
                cxt.lineTo(tiger.size*(tiger.x+42+12+6),tiger.size*(tiger.y+52-1));//3    
                cxt.lineTo(tiger.size*(tiger.x+42+12+10),tiger.size*(tiger.y+52-7));//4
                cxt.lineTo(tiger.size*(tiger.x+42+12+61),tiger.size*(tiger.y+52-7));//5 
                cxt.lineTo(tiger.size*(tiger.x+42+12+65),tiger.size*(tiger.y+52-1));//6    
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2),tiger.size*(tiger.y+52+6));//7        
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2),tiger.size*(tiger.y+52+75-25));//8 
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15),tiger.size*(tiger.y+52+75+10));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+12+15),tiger.size*(tiger.y+52+75+10));//10 
                cxt.lineTo(tiger.size*(tiger.x+42+12),tiger.size*(tiger.y+52+75-25));//11               
                cxt.fill();
                cxt.closePath();      

                cxt.beginPath();//炮架底2
                cxt.fillStyle = tiger.color[8];//'#ffd94d';//颜色8
                cxt.moveTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+52+75-25));//1
                cxt.lineTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+52+14));//2
                cxt.lineTo(tiger.size*(tiger.x+42+12+6+14),tiger.size*(tiger.y+52+4));//3    
                cxt.lineTo(tiger.size*(tiger.x+42+12+10+14),tiger.size*(tiger.y+52));//4
                cxt.lineTo(tiger.size*(tiger.x+42+12+61-14),tiger.size*(tiger.y+52));//5 
                cxt.lineTo(tiger.size*(tiger.x+42+12+65-14),tiger.size*(tiger.y+52+4));//6    
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2-14),tiger.size*(tiger.y+52+14));//7        
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2-14),tiger.size*(tiger.y+52+75-25));//8 
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15-10),tiger.size*(tiger.y+52+75-5));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+12+15+10),tiger.size*(tiger.y+52+75-5));//10 
                cxt.lineTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+52+75-25));//11  
                cxt.fill();
                cxt.closePath();            

                cxt.beginPath();//炮架底2框
                cxt.strokeStyle = tiger.color[9];//'black';//颜色9 
                cxt.moveTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+52+75-25));//1
                cxt.lineTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+52+14));//2
                cxt.lineTo(tiger.size*(tiger.x+42+12+6+14),tiger.size*(tiger.y+52+4));//3    
                cxt.lineTo(tiger.size*(tiger.x+42+12+10+14),tiger.size*(tiger.y+52));//4
                cxt.lineTo(tiger.size*(tiger.x+42+12+61-14),tiger.size*(tiger.y+52));//5 
                cxt.lineTo(tiger.size*(tiger.x+42+12+65-14),tiger.size*(tiger.y+52+4));//6    
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2-14),tiger.size*(tiger.y+52+14));//7        
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-2-14),tiger.size*(tiger.y+52+75-25));//8 
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15-10),tiger.size*(tiger.y+52+75-5));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+12+15+10),tiger.size*(tiger.y+52+75-5));//10 
                cxt.lineTo(tiger.size*(tiger.x+42+12+14),tiger.size*(tiger.y+52+75-25));//11  
                cxt.stroke();
                cxt.closePath();  

                cxt.beginPath();//炮架上底
                cxt.fillStyle = tiger.color[10];//'#e1b037';//颜色10
                cxt.moveTo(tiger.size*(tiger.x+42+12+15),tiger.size*(tiger.y+52+75+10));//10                 
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15),tiger.size*(tiger.y+52+75+10));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+12+71-15-10),tiger.size*(tiger.y+52+75-5));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+12+15+10),tiger.size*(tiger.y+52+75-5));//10 
                cxt.lineTo(tiger.size*(tiger.x+42+12+15),tiger.size*(tiger.y+52+75+10));//10         
                cxt.fill();
                cxt.closePath();                   

                cxt.beginPath();//炮架下底
                cxt.fillStyle = tiger.color[11];//'#d6730b';//颜色11
                cxt.moveTo(tiger.size*(tiger.x+42+12+61),tiger.size*(tiger.y+52-7));//5 
                cxt.lineTo(tiger.size*(tiger.x+42+12+10),tiger.size*(tiger.y+52-7));//4
                cxt.lineTo(tiger.size*(tiger.x+42+12+10+14),tiger.size*(tiger.y+52));//4
                cxt.lineTo(tiger.size*(tiger.x+42+12+61-14),tiger.size*(tiger.y+52));//5 
                cxt.lineTo(tiger.size*(tiger.x+42+12+61),tiger.size*(tiger.y+52-7));//5  
                cxt.fill();
                cxt.closePath();                                                                   
                cxt.beginPath();//圆形炮架底1
                cxt.fillStyle = tiger.color[12];//'#e69a11';//颜色12
                var circleX = tiger.size*((+42+91+43)/2+tiger.x);
                var circleY = tiger.size*(170/2+tiger.y+4);
                var circleR = tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/2);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath();  

                cxt.beginPath();//圆形炮架底2
                cxt.fillStyle = tiger.color[13];//'#fbd246';//颜色13
                var circleX = tiger.size*((+42+91+43)/2+tiger.x);
                var circleY = tiger.size*(170/2+tiger.y+4);
                var circleR =tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/2.5);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath(); 

                cxt.beginPath();//圆形炮架底3
                cxt.fillStyle = tiger.color[14];//'#cf7a03';//颜色14
                var circleX = tiger.size*((+42+91+43)/2+tiger.x);
                var circleY = tiger.size*(170/2+tiger.y+4);
                var circleR = tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/3.5);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath();   

                cxt.fillStyle = tiger.color[15];//'#cf7a03';//炮筒上//颜色15
                cxt.fillRect((circleX-tiger.size*34/2),tiger.size*(tiger.y+214),tiger.size*34,tiger.size*15);  

                cxt.fillStyle = tiger.color[16];//'#cc7937';//炮筒中//颜色16
                cxt.fillRect((circleX-tiger.size*16/2),tiger.size*(tiger.y+130),tiger.size*16,tiger.size*84);

                cxt.beginPath();//车饰边框左
                cxt.strokeStyle = tiger.color[17];//'#d4741d';//颜色17
                cxt.lineWidth = 2;
                cxt.moveTo(tiger.size*(tiger.x+23+24),tiger.size*(tiger.y+13));
                cxt.lineTo(tiger.size*(tiger.x+23+24),tiger.size*(tiger.y+13+150));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24+4),tiger.size*(tiger.y+13+150));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24),tiger.size*(tiger.y+13+141));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24),tiger.size*(tiger.y+13+19));
                cxt.lineTo(tiger.size*(tiger.x+23+10),tiger.size*(tiger.y+13));
                cxt.lineTo(tiger.size*(tiger.x+23+24),tiger.size*(tiger.y+13));    
                cxt.stroke();
                cxt.closePath();

                cxt.beginPath();//车饰填充左
                cxt.fillStyle = tiger.color[18];//'#ffcc5a';//颜色18
                cxt.moveTo(tiger.size*(tiger.x+23+24-1),tiger.size*(tiger.y+13+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-1),tiger.size*(tiger.y+13+150-1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24+4+1),tiger.size*(tiger.y+13+150-1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24+1),tiger.size*(tiger.y+13+141+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-24+1),tiger.size*(tiger.y+13+19+1));
                cxt.lineTo(tiger.size*(tiger.x+23+10+1),tiger.size*(tiger.y+13+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24-1),tiger.size*(tiger.y+13+1));   
                cxt.fill();
                cxt.closePath();


                cxt.beginPath();//车饰边框右
                cxt.strokeStyle = tiger.color[19];//'#d4741d';//颜色19
                cxt.lineWidth = 2;
                cxt.moveTo(tiger.size*(tiger.x+23+24+82),tiger.size*(tiger.y+13));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82),tiger.size*(tiger.y+13+150));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-4),tiger.size*(tiger.y+13+150));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24),tiger.size*(tiger.y+13+141));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24),tiger.size*(tiger.y+13+19));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-10),tiger.size*(tiger.y+13));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82),tiger.size*(tiger.y+13));    
                // cxt.fill();
                cxt.stroke();
                cxt.closePath();

                cxt.beginPath();//车饰填充右
                cxt.fillStyle = tiger.color[20];//'#ffcc5a';//颜色20
                cxt.moveTo(tiger.size*(tiger.x+23+24+82+1),tiger.size*(tiger.y+13+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+1),tiger.size*(tiger.y+13+150-1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-4-1),tiger.size*(tiger.y+13+150-1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-1),tiger.size*(tiger.y+13+141+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-1),tiger.size*(tiger.y+13+19+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+24-10-1),tiger.size*(tiger.y+13+1));
                cxt.lineTo(tiger.size*(tiger.x+23+24+82+1),tiger.size*(tiger.y+13+1));
                cxt.fill();
                cxt.closePath();                                                    
            break;
            case 1://右
                cxt.fillStyle = tiger.color[0];//'#fbdf7c';//车轮//颜色0
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y),tiger.size*170,tiger.size*42);
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+42+90),tiger.size*170,tiger.size*42);

                cxt.fillStyle = tiger.color[1];//'#946716';//轮式//颜色1
                cxt.fillRect(tiger.size*(tiger.x+170-19),tiger.size*(tiger.y),tiger.size*19,tiger.size*42); 
                cxt.fillRect(tiger.size*(tiger.x+170-19-19-24),tiger.size*(tiger.y),tiger.size*19,tiger.size*42);       
                cxt.fillRect(tiger.size*(tiger.x+170-19-19*2-24-19),tiger.size*(tiger.y),tiger.size*19,tiger.size*42);  
                cxt.fillRect(tiger.size*(tiger.x+170-19-19*3-24-19-19),tiger.size*(tiger.y),tiger.size*19,tiger.size*42); 
                cxt.fillRect(tiger.size*(tiger.x+170-19-19*4-24-19-19-14),tiger.size*(tiger.y),tiger.size*19,tiger.size*42); 

                cxt.fillRect(tiger.size*(tiger.x+170-19),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42); 
                cxt.fillRect(tiger.size*(tiger.x+170-19-19-24),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42);       
                cxt.fillRect(tiger.size*(tiger.x+170-19-19*2-24-19),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42);  
                cxt.fillRect(tiger.size*(tiger.x+170-19-19*3-24-19-19),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42); 
                cxt.fillRect(tiger.size*(tiger.x+170-19-19*4-24-19-19-14),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42); 

                cxt.beginPath();
                cxt.fillStyle = tiger.color[2];//'#af4c08';//底盘1//颜色2

                cxt.moveTo(tiger.size*(tiger.x+170-26),tiger.size*(tiger.y+42));//1
                cxt.lineTo(tiger.size*(tiger.x+170-22),tiger.size*(tiger.y+42+10));//2
                cxt.lineTo(tiger.size*(tiger.x+170-22),tiger.size*(tiger.y+42+90-10));//3
                cxt.lineTo(tiger.size*(tiger.x+170-26),tiger.size*(tiger.y+42+90));//4
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+13),tiger.size*(tiger.y+42+90));//5
                cxt.lineTo(tiger.size*(tiger.x+170-22-130),tiger.size*(tiger.y+42+90-16));//6
                cxt.lineTo(tiger.size*(tiger.x+170-22-130),tiger.size*(tiger.y+42+16));//7
                cxt.lineTo(tiger.size*(tiger.x+170-22-130+13),tiger.size*(tiger.y+42));//8 
                cxt.lineTo(tiger.size*(tiger.x+170-26),tiger.size*(tiger.y+42));//9        
                cxt.fill();
                cxt.closePath();

                cxt.beginPath();//底盘2
                cxt.fillStyle = tiger.color[3];//'#e98223';//颜色3
                cxt.moveTo(tiger.size*(tiger.x+170-26-14),tiger.size*(tiger.y+42));//1
                cxt.lineTo(tiger.size*(tiger.x+170-26-14),tiger.size*(tiger.y+42+13));//2
                cxt.lineTo(tiger.size*(tiger.x+170-26-6),tiger.size*(tiger.y+42+13));//3
                cxt.lineTo(tiger.size*(tiger.x+170-26-6),tiger.size*(tiger.y+42+90-13));//4
                cxt.lineTo(tiger.size*(tiger.x+170-26-14),tiger.size*(tiger.y+42+90-13));//5
                cxt.lineTo(tiger.size*(tiger.x+170-26-14),tiger.size*(tiger.y+42+90));//6
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20),tiger.size*(tiger.y+42+90));//7
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20),tiger.size*(tiger.y+42+90-10));//8
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20-14),tiger.size*(tiger.y+42+90-15+10));//9
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20-14),tiger.size*(tiger.y+42+90-15-20));//10
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20),tiger.size*(tiger.y+42+90-15-15));//11
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20),tiger.size*(tiger.y+42+90-15-15-20));//12
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20-6),tiger.size*(tiger.y+42+90-15-15-20));//13
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20-6),tiger.size*(tiger.y+42+90-15-15-20-25));//14
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20),tiger.size*(tiger.y+42+90-15-15-20-25));//15
                cxt.lineTo(tiger.size*(tiger.x+170-22-133+20),tiger.size*(tiger.y+42));//16
                cxt.lineTo(tiger.size*(tiger.x+170-26-14),tiger.size*(tiger.y+42));//17
                cxt.fill();
                cxt.closePath();               

                cxt.fillStyle = tiger.color[4];//'#c3851e';//底盘3//颜色4
                cxt.fillRect(tiger.size*(tiger.x+170-52-75),tiger.size*(tiger.y+42+11),tiger.size*75,tiger.size*71);        
                cxt.fillStyle = tiger.color[5];//'#c06902';//底盘3框//颜色5
                cxt.fillRect(tiger.size*(tiger.x+170-50-77),tiger.size*(tiger.y+42+9),tiger.size*77,tiger.size*75); 
                cxt.fillStyle = tiger.color[6];//'#a94200';//底盘3的小矩形//颜色6
                cxt.fillRect(tiger.size*(tiger.x+170-122-17),tiger.size*(tiger.y+59),tiger.size*17,tiger.size*21);    

                cxt.beginPath();//炮架底1
                cxt.fillStyle = tiger.color[7];//'#f8a025';//颜色7
                cxt.moveTo(tiger.size*(tiger.x+170-77),tiger.size*(tiger.y+42+12));//1
                cxt.lineTo(tiger.size*(tiger.x+170-113),tiger.size*(tiger.y+42+12));//2
                cxt.lineTo(tiger.size*(tiger.x+170-52-76),tiger.size*(tiger.y+42+12+6));//3    
                cxt.lineTo(tiger.size*(tiger.x+170-52-80),tiger.size*(tiger.y+42+12+10));//4
                cxt.lineTo(tiger.size*(tiger.x+170-52-80),tiger.size*(tiger.y+42+12+61));//5 
                cxt.lineTo(tiger.size*(tiger.x+170-52-76),tiger.size*(tiger.y+42+12+65));//6    
                cxt.lineTo(tiger.size*(tiger.x+170-113),tiger.size*(tiger.y+42+12+71-2));//7        
                cxt.lineTo(tiger.size*(tiger.x+170-77),tiger.size*(tiger.y+42+12+71-2));//8 
                cxt.lineTo(tiger.size*(tiger.x+170-42),tiger.size*(tiger.y+42+12+71-15));//9 
                cxt.lineTo(tiger.size*(tiger.x+170-42),tiger.size*(tiger.y+42+12+15));//10 
                cxt.lineTo(tiger.size*(tiger.x+170-77),tiger.size*(tiger.y+42+12));//11               
                cxt.fill();
                cxt.closePath();

                cxt.beginPath();//炮架底2
                cxt.fillStyle = tiger.color[8];//'#ffd94d'; //颜色8
                cxt.moveTo(tiger.size*(tiger.x+170-77),tiger.size*(tiger.y+42+12+14));//1
                cxt.lineTo(tiger.size*(tiger.x+170-113),tiger.size*(tiger.y+42+12+14));//2
                cxt.lineTo(tiger.size*(tiger.x+170-52-76+5),tiger.size*(tiger.y+42+12+6+14));//3    
                cxt.lineTo(tiger.size*(tiger.x+170-52-80+5),tiger.size*(tiger.y+42+12+10+14));//4
                cxt.lineTo(tiger.size*(tiger.x+170-52-80+5),tiger.size*(tiger.y+42+12+61-14));//5 
                cxt.lineTo(tiger.size*(tiger.x+170-52-76+5),tiger.size*(tiger.y+42+12+65-14));//6    
                cxt.lineTo(tiger.size*(tiger.x+170-113),tiger.size*(tiger.y+42+12+71-2-14));//7        
                cxt.lineTo(tiger.size*(tiger.x+170-77),tiger.size*(tiger.y+42+12+71-2-14));//8 
                cxt.lineTo(tiger.size*(tiger.x+170-42-15),tiger.size*(tiger.y+42+12+71-15-10));//9 
                cxt.lineTo(tiger.size*(tiger.x+170-42-15),tiger.size*(tiger.y+42+12+15+10));//10 
                cxt.lineTo(tiger.size*(tiger.x+170-77),tiger.size*(tiger.y+42+12+14));//11  
                cxt.fill();
                cxt.closePath();
         
                cxt.beginPath();//炮架底2框
                cxt.strokeStyle = tiger.color[9];//'black';//颜色9
                cxt.moveTo(tiger.size*(tiger.x+170-77),tiger.size*(tiger.y+42+12+14));//1
                cxt.lineTo(tiger.size*(tiger.x+170-113),tiger.size*(tiger.y+42+12+14));//2
                cxt.lineTo(tiger.size*(tiger.x+170-52-76+5),tiger.size*(tiger.y+42+12+6+14));//3    
                cxt.lineTo(tiger.size*(tiger.x+170-52-80+5),tiger.size*(tiger.y+42+12+10+14));//4
                cxt.lineTo(tiger.size*(tiger.x+170-52-80+5),tiger.size*(tiger.y+42+12+61-14));//5 
                cxt.lineTo(tiger.size*(tiger.x+170-52-76+5),tiger.size*(tiger.y+42+12+65-14));//6    
                cxt.lineTo(tiger.size*(tiger.x+170-113),tiger.size*(tiger.y+42+12+71-2-14));//7        
                cxt.lineTo(tiger.size*(tiger.x+170-77),tiger.size*(tiger.y+42+12+71-2-14));//8 
                cxt.lineTo(tiger.size*(tiger.x+170-42-15),tiger.size*(tiger.y+42+12+71-15-10));//9 
                cxt.lineTo(tiger.size*(tiger.x+170-42-15),tiger.size*(tiger.y+42+12+15+10));//10 
                cxt.lineTo(tiger.size*(tiger.x+170-77),tiger.size*(tiger.y+42+12+14));//11  
                cxt.stroke();
                cxt.closePath();   

                cxt.beginPath();//炮架上底
                cxt.fillStyle = tiger.color[10];//'#e1b037';//颜色10
                cxt.moveTo(tiger.size*(tiger.x+170-42),tiger.size*(tiger.y+42+12+15));
                cxt.lineTo(tiger.size*(tiger.x+170-42-15),tiger.size*(tiger.y+42+12+15+10));
                cxt.lineTo(tiger.size*(tiger.x+170-42-15),tiger.size*(tiger.y+42+12+71-15-10));  
                cxt.lineTo(tiger.size*(tiger.x+170-42),tiger.size*(tiger.y+42+12+71-15));
                cxt.lineTo(tiger.size*(tiger.x+170-42),tiger.size*(tiger.y+42+12+15));          
                cxt.fill();
                cxt.closePath(); 

                cxt.beginPath();//炮架下底
                cxt.fillStyle = tiger.color[11];//'#d6730b';//颜色11
                cxt.moveTo(tiger.size*(tiger.x+170-52-80),tiger.size*(tiger.y+42+12+10));
                cxt.lineTo(tiger.size*(tiger.x+170-52-80),tiger.size*(tiger.y+42+12+61));
                cxt.lineTo(tiger.size*(tiger.x+170-52-80+5),tiger.size*(tiger.y+42+12+61-14));
                cxt.lineTo(tiger.size*(tiger.x+170-52-80+5),tiger.size*(tiger.y+42+12+10+14));
                cxt.lineTo(tiger.size*(tiger.x+170-52-80),tiger.size*(tiger.y+42+12+10));
                cxt.fill();
                cxt.closePath();  

                cxt.beginPath();//圆形炮架底1
                cxt.fillStyle = tiger.color[12];//'#e69a11';//颜色12
                var circleY = tiger.size*((42+91+43)/2+tiger.y);
                var circleX = tiger.size*(170/2+tiger.x-10);
                var circleR = tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/2);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath();  

                cxt.beginPath();//圆形炮架底2
                cxt.fillStyle = tiger.color[13];//'#fbd246';//颜色13
                var circleY = tiger.size*((42+91+43)/2+tiger.y);
                var circleX = tiger.size*(170/2+tiger.x-10);
                var circleR =tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/2.5);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath(); 

                cxt.beginPath();//圆形炮架底3
                cxt.fillStyle = tiger.color[14];//'#cf7a03';//颜色14
                 var circleY = tiger.size*((42+91+43)/2+tiger.y);
                var circleX = tiger.size*(170/2+tiger.x-10);
                var circleR = tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/3.5);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath();    

                cxt.fillStyle = tiger.color[15];//'#cf7a03';//炮筒上//颜色15
                cxt.fillRect(tiger.size*(tiger.x+170+50-16),(circleY-tiger.size*34/2),tiger.size*15,tiger.size*34);  

                cxt.fillStyle = tiger.color[16];//'#cc7937';//炮筒中//颜色16
                cxt.fillRect(tiger.size*(tiger.x+170-35-15),(circleY-tiger.size*16/2),tiger.size*84,tiger.size*16);

                cxt.beginPath();//车饰边框左
                cxt.strokeStyle = tiger.color[17];//'#d4741d';//颜色17
                cxt.lineWidth = 2;
                cxt.moveTo(tiger.size*(tiger.x+170-13),tiger.size*(tiger.y+23+24));
                cxt.lineTo(tiger.size*(tiger.x+170-13-150),tiger.size*(tiger.y+23+24));
                cxt.lineTo(tiger.size*(tiger.x+170-13-150),tiger.size*(tiger.y+23+24-24+4));
                cxt.lineTo(tiger.size*(tiger.x+170-13-141),tiger.size*(tiger.y+23+24-24));
                cxt.lineTo(tiger.size*(tiger.x+170-13-19),tiger.size*(tiger.y+23+24-24));
                cxt.lineTo(tiger.size*(tiger.x+170-13),tiger.size*(tiger.y+23+10));
                cxt.lineTo(tiger.size*(tiger.x+170-13),tiger.size*(tiger.y+23+24));    
                cxt.stroke();
                cxt.closePath();

                cxt.beginPath();//车饰填充左
                cxt.fillStyle = tiger.color[18];//'#ffcc5a';//颜色18
                cxt.moveTo(tiger.size*(tiger.x+170-13-1),tiger.size*(tiger.y+23+24-1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-150+1),tiger.size*(tiger.y+23+24-1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-150+1),tiger.size*(tiger.y+23+24-24+4+1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-141-1),tiger.size*(tiger.y+23+24-24+1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-19-1),tiger.size*(tiger.y+23+24-24+1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-1),tiger.size*(tiger.y+23+10+1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-1),tiger.size*(tiger.y+23+24-1));   
                cxt.fill();
                cxt.closePath();


                cxt.beginPath();//车饰边框右
                cxt.strokeStyle = tiger.color[19];//'#d4741d';//颜色19
                cxt.lineWidth = 2;
                cxt.moveTo(tiger.size*(tiger.x+170-13),tiger.size*(tiger.y+23+24+82));
                cxt.lineTo(tiger.size*(tiger.x+170-13-150),tiger.size*(tiger.y+23+24+82));
                cxt.lineTo(tiger.size*(tiger.x+170-13-150),tiger.size*(tiger.y+23+24+82+24-4));
                cxt.lineTo(tiger.size*(tiger.x+170-13-141),tiger.size*(tiger.y+23+24+82+24));
                cxt.lineTo(tiger.size*(tiger.x+170-13-19),tiger.size*(tiger.y+23+24+82+24));
                cxt.lineTo(tiger.size*(tiger.x+170-13),tiger.size*(tiger.y+23+24+82+24-10));
                cxt.lineTo(tiger.size*(tiger.x+170-13),tiger.size*(tiger.y+23+24+82));
                // cxt.fill();
                cxt.stroke();
                cxt.closePath();

                cxt.beginPath();//车饰填充右
                cxt.fillStyle = tiger.color[20];//'#ffcc5a';//颜色20
                cxt.moveTo(tiger.size*(tiger.x+170-13-1),tiger.size*(tiger.y+23+24+82+1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-150+1),tiger.size*(tiger.y+23+24+82+1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-150+1),tiger.size*(tiger.y+23+24+82+24-4-1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-141-1),tiger.size*(tiger.y+23+24+82+24-1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-19-1),tiger.size*(tiger.y+23+24+82+24-1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-1),tiger.size*(tiger.y+23+24+82+24-10-1));
                cxt.lineTo(tiger.size*(tiger.x+170-13-1),tiger.size*(tiger.y+23+24+82+1));
                cxt.fill();
                cxt.closePath();
            break;          
            case 3://左
                cxt.fillStyle = tiger.color[0];//'#fbdf7c';//车轮//颜色0
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y),tiger.size*170,tiger.size*42);
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+42+90),tiger.size*170,tiger.size*42);

                cxt.fillStyle = tiger.color[1];//'#946716';//轮式//颜色1
                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y),tiger.size*19,tiger.size*42); 
                cxt.fillRect(tiger.size*(tiger.x+19+24),tiger.size*(tiger.y),tiger.size*19,tiger.size*42);       
                cxt.fillRect(tiger.size*(tiger.x+19*2+24+19),tiger.size*(tiger.y),tiger.size*19,tiger.size*42);  
                cxt.fillRect(tiger.size*(tiger.x+19*3+24+19+19),tiger.size*(tiger.y),tiger.size*19,tiger.size*42); 
                cxt.fillRect(tiger.size*(tiger.x+19*4+24+19+19+14),tiger.size*(tiger.y),tiger.size*19,tiger.size*42); 

                cxt.fillRect(tiger.size*(tiger.x),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42); 
                cxt.fillRect(tiger.size*(tiger.x+19+24),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42);       
                cxt.fillRect(tiger.size*(tiger.x+19*2+24+19),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42);  
                cxt.fillRect(tiger.size*(tiger.x+19*3+24+19+19),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42); 
                cxt.fillRect(tiger.size*(tiger.x+19*4+24+19+19+14),tiger.size*(tiger.y+42+90),tiger.size*19,tiger.size*42); 

                cxt.beginPath();
                cxt.fillStyle = tiger.color[2];//'#af4c08';//底盘1//颜色2

                cxt.moveTo(tiger.size*(tiger.x+26),tiger.size*(tiger.y+42));//1
                cxt.lineTo(tiger.size*(tiger.x+22),tiger.size*(tiger.y+42+10));//2
                cxt.lineTo(tiger.size*(tiger.x+22),tiger.size*(tiger.y+42+90-10));//3
                cxt.lineTo(tiger.size*(tiger.x+26),tiger.size*(tiger.y+42+90));//4
                cxt.lineTo(tiger.size*(tiger.x+22+133-13),tiger.size*(tiger.y+42+90));//5
                cxt.lineTo(tiger.size*(tiger.x+22+130),tiger.size*(tiger.y+42+90-16));//6
                cxt.lineTo(tiger.size*(tiger.x+22+130),tiger.size*(tiger.y+42+16));//7
                cxt.lineTo(tiger.size*(tiger.x+22+130-13),tiger.size*(tiger.y+42));//8 
                cxt.lineTo(tiger.size*(tiger.x+26),tiger.size*(tiger.y+42));//9        
                cxt.fill();
                cxt.closePath();

                cxt.beginPath();//底盘2
                cxt.fillStyle = tiger.color[3];//'#e98223';//颜色3
                cxt.moveTo(tiger.size*(tiger.x+26+14),tiger.size*(tiger.y+42));//1
                cxt.lineTo(tiger.size*(tiger.x+26+14),tiger.size*(tiger.y+42+13));//2
                cxt.lineTo(tiger.size*(tiger.x+26+6),tiger.size*(tiger.y+42+13));//3
                cxt.lineTo(tiger.size*(tiger.x+26+6),tiger.size*(tiger.y+42+90-13));//4
                cxt.lineTo(tiger.size*(tiger.x+26+14),tiger.size*(tiger.y+42+90-13));//5
                cxt.lineTo(tiger.size*(tiger.x+26+14),tiger.size*(tiger.y+42+90));//6
                cxt.lineTo(tiger.size*(tiger.x+22+133-20),tiger.size*(tiger.y+42+90));//7
                cxt.lineTo(tiger.size*(tiger.x+22+133-20),tiger.size*(tiger.y+42+90-10));//8
                cxt.lineTo(tiger.size*(tiger.x+22+133-20+14),tiger.size*(tiger.y+42+90-15+10));//9
                cxt.lineTo(tiger.size*(tiger.x+22+133-20+14),tiger.size*(tiger.y+42+90-15-20));//10
                cxt.lineTo(tiger.size*(tiger.x+22+133-20),tiger.size*(tiger.y+42+90-15-15));//11
                cxt.lineTo(tiger.size*(tiger.x+22+133-20),tiger.size*(tiger.y+42+90-15-15-20));//12
                cxt.lineTo(tiger.size*(tiger.x+22+133-20+6),tiger.size*(tiger.y+42+90-15-15-20));//13
                cxt.lineTo(tiger.size*(tiger.x+22+133-20+6),tiger.size*(tiger.y+42+90-15-15-20-25));//14
                cxt.lineTo(tiger.size*(tiger.x+22+133-20),tiger.size*(tiger.y+42+90-15-15-20-25));//15
                cxt.lineTo(tiger.size*(tiger.x+22+133-20),tiger.size*(tiger.y+42));//16
                cxt.lineTo(tiger.size*(tiger.x+26+14),tiger.size*(tiger.y+42));//17
                cxt.fill();
                cxt.closePath();               

                cxt.fillStyle = tiger.color[4];//'#c3851e';//底盘3//颜色4
                cxt.fillRect(tiger.size*(tiger.x+52+75-75),tiger.size*(tiger.y+42+11),tiger.size*75,tiger.size*71);        
                cxt.fillStyle = tiger.color[5];//'#c06902';//底盘3框//颜色5
                cxt.fillRect(tiger.size*(tiger.x+50+77-77),tiger.size*(tiger.y+42+9),tiger.size*77,tiger.size*75); 
                cxt.fillStyle = tiger.color[6];//'#a94200';//底盘3的小矩形//颜色6
                cxt.fillRect(tiger.size*(tiger.x+122+17-17),tiger.size*(tiger.y+59),tiger.size*17,tiger.size*21);    

                cxt.beginPath();//炮架底1
                cxt.fillStyle = tiger.color[7];//'#f8a025';//颜色7
                cxt.moveTo(tiger.size*(tiger.x+77),tiger.size*(tiger.y+42+12));//1
                cxt.lineTo(tiger.size*(tiger.x+113),tiger.size*(tiger.y+42+12));//2
                cxt.lineTo(tiger.size*(tiger.x+52+76),tiger.size*(tiger.y+42+12+6));//3    
                cxt.lineTo(tiger.size*(tiger.x+52+80),tiger.size*(tiger.y+42+12+10));//4
                cxt.lineTo(tiger.size*(tiger.x+52+80),tiger.size*(tiger.y+42+12+61));//5 
                cxt.lineTo(tiger.size*(tiger.x+52+76),tiger.size*(tiger.y+42+12+65));//6    
                cxt.lineTo(tiger.size*(tiger.x+113),tiger.size*(tiger.y+42+12+71-2));//7        
                cxt.lineTo(tiger.size*(tiger.x+77),tiger.size*(tiger.y+42+12+71-2));//8 
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+42+12+71-15));//9 
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+42+12+15));//10 
                cxt.lineTo(tiger.size*(tiger.x+77),tiger.size*(tiger.y+42+12));//11               
                cxt.fill();
                cxt.closePath();

                cxt.beginPath();//炮架底2
                cxt.fillStyle = tiger.color[8];//'#ffd94d'; //颜色8
                cxt.moveTo(tiger.size*(tiger.x+77),tiger.size*(tiger.y+42+12+14));//1
                cxt.lineTo(tiger.size*(tiger.x+113),tiger.size*(tiger.y+42+12+14));//2
                cxt.lineTo(tiger.size*(tiger.x+52+76-5),tiger.size*(tiger.y+42+12+6+14));//3    
                cxt.lineTo(tiger.size*(tiger.x+52+80-5),tiger.size*(tiger.y+42+12+10+14));//4
                cxt.lineTo(tiger.size*(tiger.x+52+80-5),tiger.size*(tiger.y+42+12+61-14));//5 
                cxt.lineTo(tiger.size*(tiger.x+52+76-5),tiger.size*(tiger.y+42+12+65-14));//6    
                cxt.lineTo(tiger.size*(tiger.x+113),tiger.size*(tiger.y+42+12+71-2-14));//7        
                cxt.lineTo(tiger.size*(tiger.x+77),tiger.size*(tiger.y+42+12+71-2-14));//8 
                cxt.lineTo(tiger.size*(tiger.x+42+15),tiger.size*(tiger.y+42+12+71-15-10));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+15),tiger.size*(tiger.y+42+12+15+10));//10 
                cxt.lineTo(tiger.size*(tiger.x+77),tiger.size*(tiger.y+42+12+14));//11  
                cxt.fill();
                cxt.closePath();
         
                cxt.beginPath();//炮架底2框
                cxt.strokeStyle = tiger.color[9];//'black';//颜色9 
                cxt.moveTo(tiger.size*(tiger.x+77),tiger.size*(tiger.y+42+12+14));//1
                cxt.lineTo(tiger.size*(tiger.x+113),tiger.size*(tiger.y+42+12+14));//2
                cxt.lineTo(tiger.size*(tiger.x+52+76-5),tiger.size*(tiger.y+42+12+6+14));//3    
                cxt.lineTo(tiger.size*(tiger.x+52+80-5),tiger.size*(tiger.y+42+12+10+14));//4
                cxt.lineTo(tiger.size*(tiger.x+52+80-5),tiger.size*(tiger.y+42+12+61-14));//5 
                cxt.lineTo(tiger.size*(tiger.x+52+76-5),tiger.size*(tiger.y+42+12+65-14));//6    
                cxt.lineTo(tiger.size*(tiger.x+113),tiger.size*(tiger.y+42+12+71-2-14));//7        
                cxt.lineTo(tiger.size*(tiger.x+77),tiger.size*(tiger.y+42+12+71-2-14));//8 
                cxt.lineTo(tiger.size*(tiger.x+42+15),tiger.size*(tiger.y+42+12+71-15-10));//9 
                cxt.lineTo(tiger.size*(tiger.x+42+15),tiger.size*(tiger.y+42+12+15+10));//10 
                cxt.lineTo(tiger.size*(tiger.x+77),tiger.size*(tiger.y+42+12+14));//11  
                cxt.stroke();
                cxt.closePath();   

                cxt.beginPath();//炮架上底
                cxt.fillStyle = tiger.color[10];//'#e1b037';//颜色10
                cxt.moveTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+42+12+15));
                cxt.lineTo(tiger.size*(tiger.x+42+15),tiger.size*(tiger.y+42+12+15+10));
                cxt.lineTo(tiger.size*(tiger.x+42+15),tiger.size*(tiger.y+42+12+71-15-10));  
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+42+12+71-15));
                cxt.lineTo(tiger.size*(tiger.x+42),tiger.size*(tiger.y+42+12+15));          
                cxt.fill();
                cxt.closePath(); 

                cxt.beginPath();//炮架下底
                cxt.fillStyle = tiger.color[11];//'#d6730b';//颜色11
                cxt.moveTo(tiger.size*(tiger.x+52+80),tiger.size*(tiger.y+42+12+10));
                cxt.lineTo(tiger.size*(tiger.x+52+80),tiger.size*(tiger.y+42+12+61));
                cxt.lineTo(tiger.size*(tiger.x+52+80-5),tiger.size*(tiger.y+42+12+61-14));
                cxt.lineTo(tiger.size*(tiger.x+52+80-5),tiger.size*(tiger.y+42+12+10+14));
                cxt.lineTo(tiger.size*(tiger.x+52+80),tiger.size*(tiger.y+42+12+10));
                cxt.fill();
                cxt.closePath();  

                cxt.beginPath();//圆形炮架底1
                cxt.fillStyle = tiger.color[12];//'#e69a11';//颜色12
                var circleY = tiger.size*((42+91+43)/2+tiger.y);
                var circleX = tiger.size*(170/2+tiger.x+10);
                var circleR = tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/2);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath();  

                cxt.beginPath();//圆形炮架底2
                cxt.fillStyle = tiger.color[13];//'#fbd246';//颜色13
                var circleY = tiger.size*((42+91+43)/2+tiger.y);
                var circleX = tiger.size*(170/2+tiger.x+10);
                var circleR =tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/2.5);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath(); 

                cxt.beginPath();//圆形炮架底3
                cxt.fillStyle = tiger.color[14];//'#cf7a03';//颜色14
                 var circleY = tiger.size*((42+91+43)/2+tiger.y);
                var circleX = tiger.size*(170/2+tiger.x+10);
                var circleR = tiger.size*((tiger.x+42+12+71-2-14-(tiger.x+42+12+14+4))/3.5);
                cxt.arc(circleX,circleY,circleR,0,360,false);
                cxt.fill();
                cxt.closePath();    

                cxt.fillStyle = tiger.color[15];//'#cf7a03';//炮筒上//颜色15
                cxt.fillRect(tiger.size*(tiger.x-50+16-15),(circleY-tiger.size*34/2),tiger.size*15,tiger.size*34);  

                cxt.fillStyle = tiger.color[16];//'#cc7937';//炮筒中//颜色16
                cxt.fillRect(tiger.size*(tiger.x+35+15-84),(circleY-tiger.size*16/2),tiger.size*84,tiger.size*16);

                cxt.beginPath();//车饰边框左
                cxt.strokeStyle = tiger.color[17];//'#d4741d';//颜色17
                cxt.lineWidth = 2;
                cxt.moveTo(tiger.size*(tiger.x+13),tiger.size*(tiger.y+23+24));
                cxt.lineTo(tiger.size*(tiger.x+13+150),tiger.size*(tiger.y+23+24));
                cxt.lineTo(tiger.size*(tiger.x+13+150),tiger.size*(tiger.y+23+24-24+4));
                cxt.lineTo(tiger.size*(tiger.x+13+141),tiger.size*(tiger.y+23+24-24));
                cxt.lineTo(tiger.size*(tiger.x+13+19),tiger.size*(tiger.y+23+24-24));
                cxt.lineTo(tiger.size*(tiger.x+13),tiger.size*(tiger.y+23+10));
                cxt.lineTo(tiger.size*(tiger.x+13),tiger.size*(tiger.y+23+24));    
                cxt.stroke();
                cxt.closePath();

                cxt.beginPath();//车饰填充左
                cxt.fillStyle = tiger.color[18];//'#ffcc5a';//颜色18
                cxt.moveTo(tiger.size*(tiger.x+13+1),tiger.size*(tiger.y+23+24-1));
                cxt.lineTo(tiger.size*(tiger.x+13+150-1),tiger.size*(tiger.y+23+24-1));
                cxt.lineTo(tiger.size*(tiger.x+13+150-1),tiger.size*(tiger.y+23+24-24+4+1));
                cxt.lineTo(tiger.size*(tiger.x+13+141+1),tiger.size*(tiger.y+23+24-24+1));
                cxt.lineTo(tiger.size*(tiger.x+13+19+1),tiger.size*(tiger.y+23+24-24+1));
                cxt.lineTo(tiger.size*(tiger.x+13+1),tiger.size*(tiger.y+23+10+1));
                cxt.lineTo(tiger.size*(tiger.x+13+1),tiger.size*(tiger.y+23+24-1));   
                cxt.fill();
                cxt.closePath();


                cxt.beginPath();//车饰边框右
                cxt.strokeStyle = tiger.color[19];//'#d4741d';//颜色19
                cxt.lineWidth = 2;
                cxt.moveTo(tiger.size*(tiger.x+13),tiger.size*(tiger.y+23+24+82));
                cxt.lineTo(tiger.size*(tiger.x+13+150),tiger.size*(tiger.y+23+24+82));
                cxt.lineTo(tiger.size*(tiger.x+13+150),tiger.size*(tiger.y+23+24+82+24-4));
                cxt.lineTo(tiger.size*(tiger.x+13+141),tiger.size*(tiger.y+23+24+82+24));
                cxt.lineTo(tiger.size*(tiger.x+13+19),tiger.size*(tiger.y+23+24+82+24));
                cxt.lineTo(tiger.size*(tiger.x+13),tiger.size*(tiger.y+23+24+82+24-10));
                cxt.lineTo(tiger.size*(tiger.x+13),tiger.size*(tiger.y+23+24+82));
                // cxt.fill();
                cxt.stroke();
                cxt.closePath();

                cxt.beginPath();//车饰填充右
                cxt.fillStyle = tiger.color[20];//'#ffcc5a';//颜色20
                cxt.moveTo(tiger.size*(tiger.x+13+1),tiger.size*(tiger.y+23+24+82+1));
                cxt.lineTo(tiger.size*(tiger.x+13+150-1),tiger.size*(tiger.y+23+24+82+1));
                cxt.lineTo(tiger.size*(tiger.x+13+150-1),tiger.size*(tiger.y+23+24+82+24-4-1));
                cxt.lineTo(tiger.size*(tiger.x+13+141+1),tiger.size*(tiger.y+23+24+82+24-1));
                cxt.lineTo(tiger.size*(tiger.x+13+19+1),tiger.size*(tiger.y+23+24+82+24-1));
                cxt.lineTo(tiger.size*(tiger.x+13+1),tiger.size*(tiger.y+23+24+82+24-10-1));
                cxt.lineTo(tiger.size*(tiger.x+13+1),tiger.size*(tiger.y+23+24+82+1));
                cxt.fill();
                cxt.closePath();
            break;
        }        
    }
}
//绘制目标(坦克)结束
//绘制子弹开始
function drawBullet(){
    for (var i = 0; i < heroBullets.length; i++) {
        var heroBullet = heroBullets[i];
        if(heroBullet!=null&&heroBullet.live){   
            cxt.beginPath();
            cxt.fillStyle = 'orange';        
            cxt.arc(heroBullet.x,heroBullet.y,4,0,360,false);
            cxt.fill();
            cxt.closePath(); 
        } 
    }
}
//绘制子弹结束

//命令目标(坦克)开始
function userComend(e,tiger){
    // cxt.clearRect(0,0,border[0],border[1]);//清屏
    var e = e||window.event;
    var n = e.keyCode;
    switch(n){
        case 38://上
            if(Math.floor(tiger.size*(tiger.y-50)) <= 0 ){
                tiger.y = Math.floor(tiger.y-tiger.size*(tiger.y-50));
            }else{
                tiger.move(n);
            }                
        break;
        case 39://右
            if(Math.floor(tiger.size*tiger.x) >= Math.floor(tiger.size*tiger.x+border[0]-tiger.size*(tiger.x+42+90+40))){
                tiger.x = Math.floor(tiger.x +border[0]-tiger.size*(tiger.x+42+90+40));
            }else{
               tiger.move(n);
            }                
        break;
        case 40://下
            if(Math.floor(tiger.size*tiger.y) >=Math.floor(border[1]-tiger.size*171)){
                tiger.y = Math.floor((border[1]-tiger.size*171)/tiger.size);
            }else{
                tiger.move(n);
            } 
        break;
        case 37://左
            if(tiger.x <= 0){
                tiger.x = 0;
            }else{
                tiger.move(n);
            }                
        break;
        case 61://+
            if(tiger.size >= 1){
                tiger.size = 1;
            }else{
                tiger.size += 0.1;
            }
        break;
        case 173://-
            if(tiger.size <= 0.1){
                tiger.size = 0.1;
            }else{
                tiger.size -= 0.1;
            }
        break;
        // case 16://加速键
        //     tiger.speedUp();
        // break;
        case 32://发射子弹
            tiger.shoot();
        break; 


    }
    // document.title = Math.floor(tiger.size*tiger.x)+'/'+Math.floor(tiger.size*tiger.y)+'/'+tiger.x+'/'+tiger.y+'/'+tiger.size+'/'+border[0]+'/'+border[1];   
    updateTank();//触发
}
//命令目标(坦克)结束
//判断是否命中目标开始
function hit(hero){//命中坦克
    for (var i = 0; i < heroBullets.length; i++) {
        var heroBullet = heroBullets[i];
        if(heroBullet.live){
            for (var j = 0; j < enemys.length; j++) {//遍历敌方坦克
                var enemy = enemys[j];
                if(enemy.live){
                    switch(enemy.direct){
                        case 0:
                            if ((heroBullet.x+hero.size*2)>=hero.size*enemy.x&&(heroBullet.x-hero.size*4)<=(hero.size*(enemy.x+174))&&(heroBullet.y+hero.size*2)>=hero.size*enemy.y&&(heroBullet.y-hero.size*2)<=hero.size*(enemy.y+170)) {
                                heroBullet.live = false;
                                enemy.live = false;
                                var bomb = new Bomb(enemy.x,enemy.y,enemy.size);//创建爆炸图
                                bombs.push(bomb);//放入bombs数组中
                                hitTiger();                                    
                            }
                        break;
                        case 1:
                            if ((heroBullet.x+hero.size*2)>=hero.size*enemy.x&&(heroBullet.x-hero.size*4)<=(hero.size*(enemy.x+170))&&(heroBullet.y+hero.size*2)>=hero.size*enemy.y&&(heroBullet.y-hero.size*2)<=hero.size*(enemy.y+174)) {
                                heroBullet.live = false;
                                enemy.live = false;
                                var bomb = new Bomb(enemy.x,enemy.y,enemy.size);//创建爆炸图
                                bombs.push(bomb);//放入bombs数组中
                                hitTiger();                                    
                            }
                        break;
                        case 2:
                            if ((heroBullet.x+hero.size*2)>=hero.size*enemy.x&&(heroBullet.x-hero.size*4)<=(hero.size*(enemy.x+174))&&(heroBullet.y+hero.size*2)>=hero.size*enemy.y&&(heroBullet.y-hero.size*2)<=hero.size*(enemy.y+170)) {
                                heroBullet.live = false;
                                enemy.live = false;
                                var bomb = new Bomb(enemy.x,enemy.y,enemy.size);//创建爆炸图
                                bombs.push(bomb);//放入bombs数组中
                                hitTiger();                                    
                            }
                        break;
                        case 3:
                            if ((heroBullet.x+hero.size*2)>=hero.size*enemy.x&&(heroBullet.x-hero.size*4)<=(hero.size*(enemy.x-170))&&(heroBullet.y+hero.size*2)>=hero.size*enemy.y&&(heroBullet.y-hero.size*2)<=hero.size*(enemy.y+174)) {
                                heroBullet.live = false;
                                enemy.live = false;
                                var bomb = new Bomb(enemy.x,enemy.y,enemy.size);//创建爆炸图
                                bombs.push(bomb);//放入bombs数组中
                                hitTiger();                                    
                            }
                        break;                                                                        
                    }
                }

            }
             document.title = heroBullet.x+'/'+0.2*enemy.x+'/'+heroBullet.y+'/'+0.2*enemy.y
        }
    }
}
//判断是否命中目标结束
//命中目标爆炸开始
function hitTiger(){
    var au = document.createElement('audio');
    // document.body.appendChild(au);
    au.preload="auto";
    au.src = 'music/hitTiger.wav';
    au.volume = 0.2;
    au.play();//播放爆炸声
    for (var i = 0; i < bombs.length; i++) {            
        var bomb=bombs[i];
        if(bomb.live){             
            //更据当前这个炸弹的生命值，来画出不同的炸弹图片
            if(bomb.blood>6){  //显示最大炸弹图
                var img1=new Image();
                img1.src="image/bomb_1.gif";
                var x=bomb.x*bomb.size;
                var y=bomb.y*bomb.size;
                img1.onload=function(){
                    cxt.drawImage(img1,x,y,30,30);
                }
            }else if(bomb.blood>3){
                var img2=new Image();
                img2.src="image/bomb_2.gif";
                var x=bomb.x*bomb.size;
                var y=bomb.y*bomb.size;
                img2.onload=function(){
                    cxt.drawImage(img2,x,y,30,30);
                }
            }else {
                var img3=new Image();
                img3.src="imagebomb_3.gif";
                var x=bomb.x*bomb.size;
                var y=bomb.y*bomb.size;
                img3.onload=function(){
                    cxt.drawImage(img3,x,y,30,30);
                }
            }
            //减血
            bomb.bloodDown();
            if(bomb.blood<=0){
                //把这个炸弹从数组中去掉
                bombs.splice(i,1);

            }
        }
    }

}
//命中目标爆炸结束







