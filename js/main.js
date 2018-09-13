  function confirm(heading, question, cancelButtonTxt, okButtonTxt, callback) {
    var confirmModal = 
      $('<div class="modal hide fade"><div class="modal-dialog modal-sm modal-dialog-centered"><div class="modal-content">' +    
          '<div class="modal-header">' +
            '<h5 class="modal-title">' + heading +'</h5>' +
            '<button class="close" aria-label="Close" type="button" data-dismiss="modal">'+
              '<span aria-hidden="true">×</span>'+
            '</button>'+
          '</div>' +
          '<div class="modal-body">' +
            '<p>' + question + '</p>' +
          '</div>' +

          '<div class="modal-footer">' +
            '<a href="#" class="btn btn-secondary" data-dismiss="modal">' + 
              cancelButtonTxt + 
            '</a>' +
            '<a href="#" id="okButton" class="btn btn-primary">' + 
              okButtonTxt + 
            '</a>' +
          '</div>' +
        '</div></div></div>');

    confirmModal.find('#okButton').click(function(event) {
      callback();
      confirmModal.modal('hide');
    });

    confirmModal.modal('show');     
  };