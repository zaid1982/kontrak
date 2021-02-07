$('.includeHtml').each(function () {
    const divId = $(this).attr('id');
    const typeId = divId.substr(2, 1);
    let type = '';
    if (typeId === 's') {
        type = 'sections/';
    } else if (typeId === 'm') {
        type = 'modals/';
    } else if (typeId === 'b') {
        type = 'base/';
    }
    $('#'+divId).load('html/'+type+divId.substr(4)+'.html?' + new Date().valueOf());
});