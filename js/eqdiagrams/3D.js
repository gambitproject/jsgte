
function projection (3Dvector) {
    var vec0=[0,0];
    var vec1=[0,1];
    var vec2=[1/2,0.866];
    return [3Dvector[2]*vec2[0],Number(3Dvector[1]*vec1[1]+3Dvector[2]*vec2[1])];
}

function add(vec1, vec2){
    return [Number(vec1[0]+vec2[0]),Number(vec1[1]+vec2[1]),Number(vec1[2]+vec2[2])];
}

function sub(vec1, vec2){
    return [Number(vec1[0]-vec2[0]),Number(vec1[1]-vec2[1]),Number(vec1[2]-vec2[2])];
}

function cross(vec1,vec2){
    return [vec1[0]*vec2[1]-vec1[1]*vec2[0],vec1[1]*vec2[2]-vec1[2]*vec2[1],vec1[2]*vec2[0]-vec1[0]*vec2[1]];
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

function plan_intersect (p1,p2,p3,q1,q2,q3){
    
    var p_nor=cross(sub(p1,p2),sub(p1,p3));
    var q_nor=cross(sub(q1,q2),sub(q1,q3));
    if (is_parallel(p_nor,q_nor) && !equal(p1,q1))
        return null;
    var dir= cross (p_nor,q_nor);
    var point=[0,0,0];
    point[2]=(Number(p_nor[1]*scal(q_nor,p1)-q_nor[1]*scal(p_nor,q1)))/(q_nor[2]*p_nor[1]-p_nor[2]*q_nor[1]);
    point[1]=(p_nor[1]*scal(q_nor,p1)-q_nor[2]*p_nor[1]*point[2])/p_nor[1]*q_nor[1];
    return dir, point;
    
    
}