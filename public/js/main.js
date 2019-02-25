//client side javascript file

 $(document).ready(function () {

     $('.delete-article').on('click', (e)=>{
         $target = $(e.target);
         const id = $target.attr('data-id');
         $.ajax({
             type: 'Delete',
             url: '/articles/'+id,
             success: ()=>{
                 alert('Deleting Article');
                 window.location.href='/';
             },
             error: (err)=>{
                 console.log(err)
             }


         });
     });
     
 });