/* 
  순수함수 
  1. 동일한 인자를 주면, 동일한 결과를 리턴하는 것
  2. 부수효과가 없는 함수
  3. 부수효과란? - 외부의 상태에 영향을 미치는 것
*/
function add(a, b) {
  return a + b;
}

console.log(add(10, 5));
console.log(add(10, 5));
console.log(add(10, 5));

/*
  1. c가 상수라면,
  2. add_2에 의해 c가 변질될 수가 없으므로, add_2는 순수함수일 수 있다.
*/
let c = 10;
function add_2(a, b) {
  return a + b + c;
}

console.log(add_2(10, 1));
console.log(add_2(10, 2));
console.log(add_2(10, 3));
c = 20;
/* 
  c의 값을 20으로 변경해줌에따라
  동일한 인자임에도 불구하고, 위의 결과 값과 아래의 결과 값이 다르기 떄문에
  add_2는 순수함수가 아니다.
*/
console.log(add_2(10, 1));
console.log(add_2(10, 2));
console.log(add_2(10, 3));

/*
  add_3은 동일한 인자가 들어오고, 결과 값도 동일하지만,
  d라는 값에 변화를 주는 부수효과가 있기 때문에
  add_3는 순수함수가 아니다. 
*/
let d = 20;
function add_3(a, b) {
  d = b;
  return a + b;
}

console.log("before d:", d);
console.log(add_3(20, 30));
console.log("after d:", d);

/*
  순수함수가 아닌 또 다른 함수의 정의
  add_4가 순수함수가 아닌 이유는 리턴 값이 없을 뿐더러, 인자로 들어온 상태를 직접 변경하기 때문이다.
*/

const obj1 = {
  val: 10,
};

function add_4(obj, val) {
  obj1.val += val;
}

console.log(obj1.val);
add_4(obj1, 10);
console.log(obj1.val);

/*
  add_5의 경우, 인자의 상태도 변경하고 있지 않고,
  그 외의 상태도 변경하고 있지 않다.
  그리고 obj2의 같은 속성을 가진 객체를 리턴하고 있으므로 순수함수이다.
*/

const obj2 = { val: 10 };

function add_5(obj, val) {
  return { val: obj.val + val };
}

console.log(obj2.val);
const obj3 = add_5(obj2, 10);
console.log(obj3);

/* 
  일급 함수: 함수를 값으로 다룰 수 있는 개념
  이러한 일급 함수라는 개념과 순수함수라는 특징을 이용해서
  함수의 조합성을 높여가는 방식이 함수형 프로그래밍이다. 
*/
const f1 = function (a) {
  return a * a;
};
console.log(f1);

const f2 = add;
console.log(f2);

/*
  어떤 함수를 인자로 넘겼냐에 따라서
  f3의 결과 값이 결정된다.
*/
function f3(f) {
  return f();
}

console.log(
  f3(function () {
    return 10;
  })
);

console.log(
  f3(function () {
    return 20;
  })
);

/* add_maker: 함수를 리턴하는 함수 */
function add_maker(a) {
  return function (b) {
    return a + b;
  };
}

const add10 = add_maker(10);
const add15 = add_maker(15);

console.log(add10(20));
console.log(add15(10));

function f4(f1, f2, f3) {
  return f3(f1() + f2());
}

console.log(
  f4(
    function () {
      return 2;
    },
    function () {
      return 1;
    },
    function (a) {
      return a * a;
    }
  )
);
