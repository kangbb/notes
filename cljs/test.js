async function count() {
  await setTimeout(()=>{console.log("finish")}, 2000);
  console.log("first");
}
function Name() {
  count();
  console.log("second");
}
Name();

function Like(){
  for(var i=0; i<5; i++) {
    console.log(i)
  }
  console.log(i)
}
Like();

