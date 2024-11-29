$(".burger-menu ").on("click",".bar",function(){
  
  $(".menu").slideToggle();
  $(".bar").toggleClass('change');
  $(".menu li").slideRight();

 });
