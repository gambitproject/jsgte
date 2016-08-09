function projection(vector) {
    var vec0=[0,0];
    var vec1=[0,1];
    var vec2=[1/2,0.866];
    return [vector[2]*vec2[0],Number(vector[1]*vec1[1]+vector[2]*vec2[1])];
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
        if ((vec1[i]-vec2[i])*(vec1[i]-vec2[i])>0.00000001)
            return false;
    }
    return true;
}

function equal_num (vec1, vec2){
    if ((vec1-vec2)*(vec1-vec2)>0.00000001)
        return false;
    return true;
}

function is_parallel (vec1,vec2){
    var temp = cross (vec1, vec2);
    return equal(temp,[0,0,0]);
}

function plan_intersect ([p1,p2,p3],[q1,q2,q3]){
    var p_nor=cross(sub(p1,p2),sub(p1,p3));
    var q_nor=cross(sub(q1,q2),sub(q1,q3));
    if (is_parallel(p_nor,q_nor) && !equal(p1,q1)) //there is no intersection
        return null;
    if (is_parallel(p_nor,q_nor))
        return "all"
        var dir= cross (p_nor,q_nor);
    var point=[0,0,0];
    /*console.log(equal_num(Number(q_nor[2]*p_nor[1]-p_nor[2]*q_nor[1]),0));
    console.log(equal_num(Number(q_nor[2]*p_nor[0]-p_nor[2]*q_nor[0]),0));
    console.log(equal_num(Number(q_nor[0]*p_nor[1]-p_nor[0]*q_nor[1]),0));*/
    
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
    var coeff=-scal(q_nor,u)/scal(q_nor,sub(p1,q1));
    return add(p1,mul(coeff,u));
}

function compute_best_reponse(player){
    var nb_strat=GTE.diag.nb_strat[player];
    var payoffs=[];
    var plan=[[[0,0,0],[0,1,0],[1,0,0]],[[0,0,0],[0,1,0],[0,1,1]],[[0,0,0],[1,0,1],[1,0,0]],[[0,1,1],[0,1,0],[1,0,0]]];
    for (var i=0;i<1;i++){
        payoffs.push([]);
        for (var j=0;j<3;j++){
            if (player==0)
                payoffs[i].push(GTE.diag.payoffs[0][i][j]);
            else
                payoffs[i].push(GTE.diag.payoffs[0][j][i]);
        }
        plan[i+4]=[[0,0,payoffs[i][0]],[1,0,payoffs[i][1]],[0,1,payoffs[i][2]]];
    }
    //console.log(plan);
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
    //console.log(lines);
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
                points_to_plan[l].push[added_plan[k]];
                plan_to_points[added_plan[k]].push(l);
            }
        }
    }
    //check for unicity
    var u_points=[];
    var u_points_to_plan=[];
    var u_plan_to_points=[];
    for (var i=0;i<plan.length;i++)
        u_plan_to_points.push([]);
    for (var i=0;i<points.length-1;i++){
        var test=true;
        for (var j=i+1;j<points.length;j++){
            if (equal(points[i],points[j])){
                for (var k=0;k<points_to_plan[i].length;k++){
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
                u_plan_to_points[points_to_plan[i][k]].push(u_points_to_plan.length-1);
            }
        }
    }
    var i=points.length-1;
    u_points.push(points[i]);
    u_points_to_plan.push([]);
    for (var k=0;k<points_to_plan[i].length;k++){
        u_points_to_plan[u_points_to_plan.length-1].push(points_to_plan[i][k]);
        u_plan_to_points[points_to_plan[i][k]].push(u_points_to_plan.length-1);
    }
    console.log(u_points);
    
    
    
    
    
}