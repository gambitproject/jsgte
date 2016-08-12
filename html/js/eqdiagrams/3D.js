var eps=0.0001; //error to zero;
//var color=["#ff8888", "#33ff88", "#6666ff","#f9e796", "#28fcff", "#f6085", "#ddb860"]; //strategy's color
var x_shift=400;
var moving_point;


function D3draw_canvas(i){ //draw the canvas of the 3D drawing for player i
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    if (i==0){
        temp.textContent="Payoff to I";
    }else{
        temp.textContent="Payoff to II";
    }
    temp.setAttribute("class", "canvas"+i+" player"+Number(i+1)+" player"+Number(i+1)+"_title title up");
    temp.setAttribute("x",Number(i*x_shift+150));
    temp.setAttribute("y",40);
    GTE.svg.appendChild(temp);
    
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    if (i==0){
        var j=2;
    }
    else{
        var j=1;}
    temp.textContent="d";
    temp.setAttribute("class", "canvas"+i+" player"+j+" strat"+Number(j-1)+"0 legendh up");
    temp.setAttribute("x",Number(i*x_shift+50));
    temp.setAttribute("y",372);
    GTE.svg.appendChild(temp);
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    temp.textContent="d";
    temp.setAttribute("class", "canvas"+i+" player"+j+" strat"+Number(j-1)+"1 legendh up");
    temp.setAttribute("x",Number(i*x_shift+250));
    temp.setAttribute("y",372);
    GTE.svg.appendChild(temp);
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    temp.textContent="d";
    temp.setAttribute("class", "canvas"+i+" player"+j+" strat"+Number(j-1)+"2 before"+i+" legendh up");
    temp.setAttribute("x",Number(i*x_shift+150));
    temp.setAttribute("y",272);
    GTE.svg.appendChild(temp);
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    temp.textContent="d";
    temp.setAttribute("class", "canvas"+i+" player"+j+" strat"+Number(j-1)+"0 legendh up");
    temp.setAttribute("x",Number(i*x_shift+50));
    temp.setAttribute("y",602);
    GTE.svg.appendChild(temp);
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    temp.textContent="d";
    temp.setAttribute("class", "canvas"+i+" player"+j+" strat"+Number(j-1)+"1 legendh up");
    temp.setAttribute("x",Number(i*x_shift+250));
    temp.setAttribute("y",602);
    GTE.svg.appendChild(temp);
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    temp.textContent="d";
    temp.setAttribute("class", "canvas"+i+" player"+j+" strat"+Number(j-1)+"2 legendh up");
    temp.setAttribute("x",Number(i*x_shift+150));
    temp.setAttribute("y",395);
    GTE.svg.appendChild(temp);
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    temp.setAttribute("class","canvas"+i+" contour up");
    temp.setAttribute("points", Number(GTE.diag.margin+i*x_shift)+", "+Number(GTE.diag.height-GTE.diag.margin)+" "+Number(GTE.diag.margin+i*x_shift+100)+", "+Number(GTE.diag.height-GTE.diag.margin-100)+" "+Number(GTE.diag.margin+i*x_shift+200)+","+Number(GTE.diag.height-GTE.diag.margin)+" "+Number(GTE.diag.margin+i*x_shift)+","+Number(GTE.diag.height-GTE.diag.margin));
    
    GTE.svg.appendChild(temp);

    temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
    temp.setAttribute("class","canvas"+i+" contour up");
    temp.setAttribute("x1", Number(GTE.diag.margin+i*x_shift));
    temp.setAttribute("y1",Number(GTE.diag.margin+100));
    temp.setAttribute("x2", Number(GTE.diag.margin+i*x_shift));
    temp.setAttribute("y2",Number(GTE.diag.height-GTE.diag.margin));
    GTE.svg.appendChild(temp);
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
    temp.setAttribute("class","canvas"+i+" contour up");
    temp.setAttribute("x1", Number(GTE.diag.margin+i*x_shift+100));
    temp.setAttribute("y1",Number(GTE.diag.margin));
    temp.setAttribute("x2", Number(GTE.diag.margin+i*x_shift+100));
    temp.setAttribute("y2",Number(GTE.diag.height-GTE.diag.margin-100));
    GTE.svg.appendChild(temp);
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
    temp.setAttribute("class","canvas"+i+" contour up");
    temp.setAttribute("x1", Number(GTE.diag.margin+i*x_shift+200));
    temp.setAttribute("y1",Number(GTE.diag.margin+100));
    temp.setAttribute("x2", Number(GTE.diag.margin+i*x_shift+200));
    temp.setAttribute("y2",Number(GTE.diag.height-GTE.diag.margin));
    GTE.svg.appendChild(temp);
    
    for (var k=0;k<9;k++){
        temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "canvas"+i+" stick up");
        temp.setAttribute("x1",Number(i*x_shift+50));
        temp.setAttribute("x2",Number(i*x_shift+45));
        temp.setAttribute("y1",Number(170+k*20));
        temp.setAttribute("y2",Number(170+k*20));
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
        temp.setAttribute("class", "canvas"+i+" sticklabel up");
        temp.setAttribute("x",Number(i*x_shift+35));
        temp.setAttribute("y",Number(175+k*20));
        temp.textContent=Number(9-k);
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "canvas"+i+" stick up");
        temp.setAttribute("x1",Number(i*x_shift+250));
        temp.setAttribute("x2",Number(i*x_shift+255));
        temp.setAttribute("y1",Number(170+k*20));
        temp.setAttribute("y2",Number(170+k*20));
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
        temp.setAttribute("class", "canvas"+i+" sticklabel up");
        temp.setAttribute("x",Number(i*x_shift+35+230));
        temp.setAttribute("y",Number(175+k*20));
        temp.textContent=Number(9-k);
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "canvas"+i+" stick up");
        temp.setAttribute("x1",Number(i*x_shift+145));
        temp.setAttribute("x2",Number(i*x_shift+155));
        temp.setAttribute("y1",Number(70+k*20));
        temp.setAttribute("y2",Number(70+k*20));
        GTE.svg.appendChild(temp);
    }
}

function draw_plan([p1,p2,p3],i,y){ //draw the payoff plan for player i strategy y
    var q1=projection(p1,i);
    var q2=projection(p2,i);
    var q3=projection(p3,i);
    
    var temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    temp.setAttribute("class","line"+Number(i+1)+" face contour up");
    temp.setAttribute("points", Number(q1[0])+", "+Number(q1[1])+" "+Number(q2[0])+", "+Number(q2[1])+" "+Number(q3[0])+", "+Number(q3[1])+" "+Number(q1[0])+", "+Number(q1[1]));
    
    GTE.svg.appendChild(temp);
    if (y>=0){
    if (i==0){
        var strat0=Number(GTE.diag.nb_strat[1]*0+y);
        var strat1=Number(GTE.diag.nb_strat[1]*1+y);
        var strat2=Number(GTE.diag.nb_strat[1]*2+y);
    }
    else{
        var strat0=Number(GTE.diag.nb_strat[1]*y+0);
        var strat1=Number(GTE.diag.nb_strat[1]*y+1);
        var strat2=Number(GTE.diag.nb_strat[1]*y+2);
        
    }
    var e=document.createElementNS("http://www.w3.org/2000/svg", "circle");
    e.setAttribute("cx",q1[0]);
    e.setAttribute("cy",q1[1]);
    e.setAttribute("r",GTE.POINT_RADIUS);
    e.setAttribute("class","canvas"+i+" pay line"+Number(i+1));
    e.setAttribute("strat",strat0);
    e.setAttribute("player",i);
    e.addEventListener("mousedown", D3MouseDownEndpoint);
    GTE.svg.appendChild(e);
    var e=document.createElementNS("http://www.w3.org/2000/svg", "circle");
    e.setAttribute("cx",q2[0]);
    e.setAttribute("cy",q2[1]);
    e.setAttribute("r",GTE.POINT_RADIUS);
    e.setAttribute("class","canvas"+i+" pay line"+Number(i+1));
    e.setAttribute("strat",strat1);
    e.setAttribute("player",i);
    e.addEventListener("mousedown", D3MouseDownEndpoint);
    GTE.svg.appendChild(e);
    var e=document.createElementNS("http://www.w3.org/2000/svg", "circle");
    e.setAttribute("cx",q3[0]);
    e.setAttribute("cy",q3[1]);
    e.setAttribute("r",GTE.POINT_RADIUS);
    e.setAttribute("class","canvas"+i+" pay line"+Number(i+1));
    e.setAttribute("strat",strat2);
    e.setAttribute("player",i);
    e.addEventListener("mousedown", D3MouseDownEndpoint);
    GTE.svg.appendChild(e);
    }
}

function D3MouseDownEndpoint (event) {
    moving_point=event.currentTarget;
    document.addEventListener("mousemove", D3MouseMoveEndpoint);
    document.addEventListener("mouseup", D3MouseupEndpoint);
    event.currentTarget.removeEventListener("mousedown", D3MouseDownEndpoint);
};

function D3MouseMoveEndpoint (event) {
    
    var mousePosition = GTE.getMousePosition(event);
    var svgPosition = GTE.svg.getBoundingClientRect();
    var strat=moving_point.getAttribute("strat");
    var player=moving_point.getAttribute("player");
    console.log(moving_point);
    if (strat<2){
        var newPos=Math.round((2*GTE.diag.height/(svgPosition.bottom-svgPosition.top)*(-mousePosition.y+svgPosition.top)+GTE.diag.height-GTE.diag.margin-100)/20*GTE.diag.precision)/GTE.diag.precision;}
    else{
        var newPos=Math.round((2*GTE.diag.height/(svgPosition.bottom-svgPosition.top)*(-mousePosition.y+svgPosition.top)+GTE.diag.height-GTE.diag.margin)/20*GTE.diag.precision)/GTE.diag.precision;
    }
    if (Number(newPos)<GTE.diag.min) newPos=GTE.diag.min;
    if (Number(newPos)>GTE.diag.max) newPos=GTE.diag.max;
    if( (Number(newPos)-moving_point.getAttribute("cy"))*(Number(newPos)-moving_point.getAttribute("cy"))>0.005){
        GTE.tree.matrix.matrix[strat].strategy.payoffs[player].value=newPos;
        GTE.tree.matrix.matrix[strat].strategy.payoffs[player].text=newPos;
        GTE.diag.redraw();
    }
};

function D3MouseupEndpoint (event) {
    var mousePosition = GTE.getMousePosition(event)
    document.removeEventListener("mousemove", D3MouseMoveEndpoint);
    document.removeEventListener("mouseup", D3MouseupEndpoint);
    moving_point.addEventListener("mousedown", D3MouseDownEndpoint);
    moving_point=null;
};

function projection(vector,i) { //from theory to reality
    var shift=Number(2*this.margin+this.width);
    var vec0=[200,0,0];
    var vec1=[100,100];
    var vec2=[0,20];
    var temp=add(add(mul(vector[0],vec0),mul(vector[1],vec1)),mul(vector[2],vec2));
    
    return [Number(temp[0]+GTE.diag.margin+i*(2*GTE.diag.margin+GTE.diag.width)),Number(GTE.diag.margin+300-temp[1])];
}

function projection_triangle(vector,i) { //from theory to reality
    var shift=Number(2*this.margin+this.width);
    var vec0=[200,0,0];
    var vec1=[100,173];
    var temp=add(mul(vector[0],vec0),mul(vector[1],vec1));
    
    return [Number(temp[0]+GTE.diag.margin+i*(2*GTE.diag.margin+GTE.diag.width)),Number(GTE.diag.margin+530-temp[1])];
}

function add(vec1, vec2){
    return [Number(vec1[0]+vec2[0]),Number(vec1[1]+vec2[1]),Number(vec1[2]+vec2[2])];
}

function sub(vec1, vec2){
    return [Number(vec1[0]-vec2[0]),Number(vec1[1]-vec2[1]),Number(vec1[2]-vec2[2])];
}


function mul(a, vec1){
    return [a*vec1[0],a*vec1[1],a*vec1[2]];
}

function cross(vec1,vec2){
    return [vec1[1]*vec2[2]-vec1[2]*vec2[1],vec1[2]*vec2[0]-vec1[0]*vec2[2],vec1[0]*vec2[1]-vec1[1]*vec2[0]];
}

function scal(vec1,vec2){
    return Number(vec1[0]*vec2[0]+vec1[1]*vec2[1]+vec1[2]*vec2[2]);
}

function equal (vec1, vec2){
    for (var i=0;i<3;i++){
        if ((vec1[i]-vec2[i])*(vec1[i]-vec2[i])>eps*eps)
            return false;
    }
    return true;
}

function equal_num (vec1, vec2){
    if ((vec1-vec2)*(vec1-vec2)>eps*eps)
        return false;
    return true;
}

function is_parallel (vec1,vec2){
    var temp = cross (vec1, vec2);
    return equal(temp,[0,0,0]);
}

function normalize (vec){
    var norm=Math.sqrt(Number(vec[0]*vec[0]+vec[1]*vec[1]+vec[2]*vec[2]));
    return mul(1/norm,vec);
}

function plan_intersect ([p1,p2,p3],[q1,q2,q3]){ //compute the intersection between two plans
    var p_nor=cross(sub(p1,p2),sub(p1,p3));
    var q_nor=cross(sub(q1,q2),sub(q1,q3));
    if (is_parallel(p_nor,q_nor) && !equal(p1,q1)) //there is no intersection
        return null;
    if (is_parallel(p_nor,q_nor)) //plans are equals
        return "all"
    var dir= cross (p_nor,q_nor);
    dir=normalize(dir);
    var point=[0,0,0];
    
    if (!equal_num(Number(q_nor[1]*p_nor[2]-p_nor[1]*q_nor[2]),0) && !equal_num(p_nor[1],0)){
        point[2]=Number(q_nor[1]*scal(p_nor,p1)-p_nor[1]*scal(q_nor,q1))/Number(q_nor[1]*p_nor[2]-p_nor[1]*q_nor[2]);
        point[1]=Number(scal(p_nor,p1)-p_nor[2]*point[2])/p_nor[1];
        return [dir, point];
    }
    if (!equal_num(Number(q_nor[2]*p_nor[1]-p_nor[2]*q_nor[1]),0) && !equal_num(p_nor[2],0)){
        point[1]=Number(q_nor[2]*scal(p_nor,p1)-p_nor[2]*scal(q_nor,q1))/Number(q_nor[2]*p_nor[1]-p_nor[2]*q_nor[1]);
        point[2]=Number(scal(p_nor,p1)-p_nor[1]*point[1])/p_nor[2];
        return [dir, point];
    }
    if (!equal_num(Number(q_nor[0]*p_nor[2]-p_nor[0]*q_nor[2]),0) && !equal_num(p_nor[0],0)){
        point[2]=Number(q_nor[0]*scal(p_nor,p1)-p_nor[0]*scal(q_nor,q1))/Number(q_nor[0]*p_nor[2]-p_nor[0]*q_nor[2]);
        point[0]=Number(scal(p_nor,p1)-p_nor[2]*point[2])/p_nor[0];
        return [dir, point];
    }
    if (!equal_num(Number(q_nor[2]*p_nor[0]-p_nor[2]*q_nor[0]),0) && !equal_num(p_nor[2],0)){
        point[0]=Number(q_nor[2]*scal(p_nor,p1)-p_nor[2]*scal(q_nor,q1))/Number(q_nor[2]*p_nor[0]-p_nor[2]*q_nor[0]);
        point[2]=Number(scal(p_nor,p1)-p_nor[0]*point[0])/p_nor[2];
        return [dir, point];
    }
    if (!equal_num(Number(q_nor[0]*p_nor[1]-p_nor[0]*q_nor[1]),0) && !equal_num(p_nor[0],0)){
        point[1]=Number(q_nor[0]*scal(p_nor,p1)-p_nor[0]*scal(q_nor,q1))/Number(q_nor[0]*p_nor[1]-p_nor[0]*q_nor[1]);
        point[0]=Number(scal(p_nor,p1)-p_nor[1]*point[1])/p_nor[0];
        return [dir, point];
    }
    if (!equal_num(Number(q_nor[1]*p_nor[0]-p_nor[1]*q_nor[0]),0) && !equal_num(p_nor[1],0)){
        point[0]=Number(q_nor[1]*scal(p_nor,p1)-p_nor[1]*scal(q_nor,q1))/Number(q_nor[1]*p_nor[0]-p_nor[1]*q_nor[0]);
        point[1]=Number(scal(p_nor,p1)-p_nor[0]*point[0])/p_nor[1];
        return [dir, point];
    }
    return [dir, point];
}

function line_plan_intersect ([u,p1],[q1,q2,q3]){ //p1 is a point on the line, u is the vector of the line.
    //q1,q2,q3 are points on the plane
    var q_nor=cross(sub(q1,q2),sub(q1,q3));
    if (!equal(p1,q3) && !equal(p1,q1)){
        var temp=cross(sub(q1,p1),sub(q1,q3));}
    else {
        if(equal(p1,q3))
           var temp=cross(sub(q1,p1),sub(q1,q2));
        if (equal(p1,q1))
            var temp=cross(sub(q3,p1),sub(q3,q2));
    }
    if(equal_num(scal(q_nor,u),0) && ! is_parallel(temp,q_nor))
        return null;
    if(equal_num(scal(q_nor,u),0))
        return "all";
    if (is_parallel(temp,q_nor))
        return p1;
    if (equal(p1,q1))
        return q1;
    var coeff=-scal(q_nor,sub(p1,q1))/scal(q_nor,u);
    return add(p1,mul(coeff,u));
}

function z_coor([x,y], [p1,p2,p3]){ //return the z-coordinate of the point (x,y) in the plan [p1,p2,p3]
    var p_nor=cross(sub(p1,p2),sub(p1,p3));
    if (equal_num(p_nor[2],0))
        return -1; //there is no point with x,y coordinate in this plan
    return Number(scal(p1,p_nor)-x*p_nor[0]-y*p_nor[1])/Number(p_nor[2]);
}

function is_possible (vec,plan){ //check if vec is a point in the convex envelope.
    if( vec[0]>Number(1+eps) || vec[0]<Number(0-eps) ||vec[1]>Number(1+eps) || vec[1]<Number(0-eps))
        return false;
    if (vec[0]+vec[1]>Number(1+eps))
        return false;
    for (var i=0;i<plan.length;i++){
        var temp=z_coor([vec[0],vec[1]],plan[i]);
        if (vec[2]<Number(temp-eps))
            return false;
    }
    return true;
}

function D3compute_best_response(player){ //main function uses all previous functions
    //draw_canvas(player);
    var nb_strat=GTE.diag.nb_strat[player];
    var payoffs=[];
    var plan=[[[0,0,0],[0,1,0],[1,0,0]],[[0,0,0],[0,1,0],[0,1,1]],[[0,0,0],[1,0,1],[1,0,0]],[[0,1,1],[0,1,0],[1,0,0]]];
    for (var i=0;i<nb_strat;i++){
        payoffs.push([]);
        for (var j=0;j<3;j++){
            if (player==0)
                payoffs[i].push(GTE.diag.payoffs[0][i][j]);
            else
                payoffs[i].push(GTE.diag.payoffs[1][j][i]);
        }
        plan[i+4]=[[0,0,payoffs[i][0]],[1,0,payoffs[i][1]],[0,1,payoffs[i][2]]];
        draw_plan(plan[i+4],player,i);
    }
    //computing intersection of all pairs of plans
    var lines=[];
    var line_to_plan=[];
    var plan_to_line=[];
    for (var i=0;i<plan.length;i++)
        plan_to_line.push([]);
    var nb_lines=0
    for (var i=0;i<plan.length-1;i++){
        var equals=[];
        nb_lines=lines.length;
        for (var j=i+1;j<plan.length;j++){
            var temp=plan_intersect(plan[i],plan[j]);
            if (temp==null)
                continue;
            if (temp=="all"){
                equals.push(j);
                continue;
            }
            lines.push(temp);
            line_to_plan.push([i,j]);
            plan_to_line[i].push(lines.length-1);
            plan_to_line[j].push(lines.length-1);
            
        }
        for (var k=0;k<equals.length;k++){ //add equals plans to associated plans.
            for (var l=nb_lines;l<lines.length;l++){
                line_to_plan[l].push[equals[k]];
                plan_to_line[equals[k]].push(l);
            }
        }
    }
    //computing intersection of all pairs of lines and plan.
    var points=[];
    var points_to_plan=[];
    var plan_to_points=[];
    for (var i=0;i<plan.length;i++)
        plan_to_points.push([]);
    var nb_points=0;
    for (var i=0;i<lines.length;i++){
        var added_plan=[];
        nb_points=points.length;
        for (var j=0;j<plan.length;j++){
            var temp=line_plan_intersect(lines[i],plan[j]);
            if (temp==null)
                continue;
            if (temp=="all"){
                var test=false;
                added_plan.push(j);
                for (var k=0;k<plan_to_line[j].length;k++){
                    if(plan_to_line[j][k]==i){
                        test=true;
                    }
                }
                if (!test){
                    plan_to_line[j].push(i);
                    line_to_plan[i].push(j);
                }
                continue;
            }
            points.push(temp);
            points_to_plan.push([j]);
            plan_to_points[j].push(points.length-1);
        }
        for (var k=0;k<added_plan.length;k++){ //add equals plans to associated plans.
            for (var l=nb_points;l<points.length;l++){
                points_to_plan[l].push(added_plan[k]);
                plan_to_points[added_plan[k]].push(l);
            }
        }
    }
    //check for unicity and inside points
    var u_points=[];
    var u_points_to_plan=[];
    var u_plan_to_points=[];
    for (var i=0;i<plan.length;i++)
        u_plan_to_points.push([]);
    for (var i=0;i<points.length-1;i++){
        if (is_possible(points[i],plan)){
            var test=true;
            for (var j=i+1;j<points.length;j++){
                if (equal(points[i],points[j])){
                    for (var k=0;k<points_to_plan[i].length;k++){
                        var test2=true;
                        for (l=0;l<points_to_plan[j].length;l++){
                            if (points_to_plan[j][l]==points_to_plan[i][k]){
                                test2=false;
                                break;
                            }
                        }
                        if(test2)
                        points_to_plan[j].push(points_to_plan[i][k]);
                    }
                    test=false;
                }
            }
            if (test){
                u_points.push(points[i]);
                u_points_to_plan.push([]);
                for (var k=0;k<points_to_plan[i].length;k++){
                    u_points_to_plan[u_points_to_plan.length-1].push(points_to_plan[i][k]);
                    u_plan_to_points[points_to_plan[i][k]].push(points[i]);
                }
            }
        }
    }
    
    var i=points.length-1;
    if (is_possible(points[i], plan)){
        u_points.push(points[i]);
        u_points_to_plan.push([]);
        for (var k=0;k<points_to_plan[i].length;k++){
            u_points_to_plan[u_points_to_plan.length-1].push(points_to_plan[i][k]);
            u_plan_to_points[points_to_plan[i][k]].push(points[i]);
        }
    }
    for (var i=4;i<u_plan_to_points.length; i++){
        draw_envelope(u_plan_to_points[i],player,Number(i-4));
    }
}

function draw_envelope(points3D,player,strat){ //draw the faces of the upper envelope. Based on the graham algorithm
    //console.log(points3D);
    //console.log(player+" "+strat);
    var points=[];
    var points2=[];
    var center=[0,0];
    var nb_points=0;
    for (var i=0;i<points3D.length;i++){
        points.push(projection(points3D[i],player));
        points2.push(projection_triangle(points3D[i],player));
    }
    if (points.length <2)
        return;
    var left_point=0;
    for (var i=0;i<points.length;i++){
        if(points[i][0]<points[left_point][0])
            left_point=i;
        else{
            if(points[i][0]==points[left_point][0] &&points[i][1]>points[left_point][1]){
            left_point=i;
            }
        }
    }
    var s=points[left_point][0]+","+points[left_point][1]+" ";
    var s2=points2[left_point][0]+","+points2[left_point][1]+" ";
    var test=true;
    var last_point=left_point;
    while (test){
        var increase_rate=-100000;
        var y_coor=0;
        var new_point=-1;
        for (var i=0;i<points.length;i++){
            if(i!=last_point && points[i][0]>points[last_point][0]-eps){
                if ((Number(points[last_point][1]-points[i][1]))/Number(points[i][0]-points[last_point][0])>increase_rate+eps){
                    increase_rate=(Number(points[last_point][1]-points[i][1]))/Number(points[i][0]-points[last_point][0]);
                    new_point=i;
                }
            }
        }
        for (var i=0;i<points.length;i++){
            if(i!=last_point && equal_num(points[i][0],points[last_point][0])){
                if (points[i][1]<y_coor+eps && points[i][1]>points[last_point][1]-eps){
                    y_coor=points[i][1]
                    new_point=i;
                }
            }
        }
        if (equal_num(new_point,-1))
            test=false;
        else{
            s=s+points[new_point][0]+","+points[new_point][1]+" ";
            s2=s2+points2[new_point][0]+","+points2[new_point][1]+" ";
            center[0]=center[0]+points2[new_point][0];
            center[1]=center[1]+points2[new_point][1];
            nb_points=nb_points+1;
            last_point=new_point;
        }
    }
    while (!test){
        var increase_rate=-100000;
        var y_coor=350;
        var new_point=-1;
        for (var i=0;i<points.length;i++){
            if(i!=last_point && points[i][0]<points[last_point][0]-eps){
                if ((Number(points[last_point][1]-points[i][1]))/Number(points[i][0]-points[last_point][0])>increase_rate+eps){
                    increase_rate=(Number(points[last_point][1]-points[i][1]))/Number(points[i][0]-points[last_point][0]);
                    new_point=i;
                }
            }
        }
        
        for (var i=0;i<points.length;i++){
            if(i!=last_point && equal_num(points[i][0],points[last_point][0])){
                //console.log(points[i][1]+" "+y_coor+" "+points[last_point][1]);
                if (points[i][1]<y_coor+eps && points[i][1]>points[last_point][1]-eps){
                    y_coor=points[i][1]
                    new_point=i;
                }
            }
        }
        if (equal_num(new_point,left_point))
            test=true;
        s=s+points[new_point][0]+","+points[new_point][1]+" ";
        s2=s2+points2[new_point][0]+","+points2[new_point][1]+" ";
        center[0]=center[0]+points2[new_point][0];
        center[1]=center[1]+points2[new_point][1];
        nb_points=nb_points+1;
        last_point=new_point;
        
    }
    //console.log(s2);
    var temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    temp.setAttribute("class","canvas"+player+" project"+Number(player+1)+" face contour up");
    temp.setAttribute("points", s);
    GTE.svg.appendChild(temp);
    var temp2=GTE.svg.getElementsByClassName("before"+player)[0];
    GTE.svg.insertBefore(temp2,temp);
    GTE.svg.insertBefore(temp,temp2);
    
    temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    temp.setAttribute("class","canvas"+player+" project"+Number(player+1)+" face contour up");
    temp.setAttribute("points", s2);
    GTE.svg.appendChild(temp);
    
    if (nb_points>2){
    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    temp.textContent="d";
    temp.setAttribute("class", "canvas"+player+" player"+Number(player+1)+" strat"+Number(player)+""+strat+" legendh up");
    temp.setAttribute("x",Number(center[0]/nb_points));
    temp.setAttribute("y",Number(center[1]/nb_points));
    GTE.svg.appendChild(temp);
    }
}

function D3delete_faces(){
    var temp=document.getElementsByClassName("face").length;
    for (var i=0;i<temp;i++)
        GTE.svg.removeChild(document.getElementsByClassName("face")[0]);
    
}

function D3delete_canvas(player){
    var temp=document.getElementsByClassName("canvas"+player).length;
    for (var i=0;i<temp;i++)
        GTE.svg.removeChild(document.getElementsByClassName("canvas"+player)[0]);
}