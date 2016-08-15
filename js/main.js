$(function() {
  // this is where we will store the pokemon list we fetch
  var pokemon = [];

  // fetch all pokemon at page load
  $.get('http://pokeapi.co/api/v2/pokemon?limit=1000', function(data) {
    pokemon = data.results;
    $('#loading').addClass('hide');
    $('#body').removeClass('hide');
  });

  // if the users click go, update the list!
  $('#go').click(function() {

    // immediately transition search box to top of screen
    $('.product-name').addClass('hide');
    $('.container').addClass('top');
    $('.logo').addClass('top');
    $('.search').addClass('top');
    $('.content').removeClass('hide');

    // filter our pokemon list based on the input text
    var filteredPokemon = pokemon.filter(function(pokemon) {
      return _.startsWith(pokemon.name, _.toLower($('#keyword').val())); 
    });

    // empty our list from any previous search
    $('.content').html('');

    // if there are no items in the list after filtering, let the user know
    if (filteredPokemon.length === 0) {
      $('.content').append('<li>No Results!</li>');
    } else {
      // otherwise, iterate through the filtered pokemon list to create our list items and display them
      _.each(filteredPokemon, function(pokemon) {
        var li = $('<li>' + pokemon.name +'</li>');
        $('.content').append(li);
      });
    }
  });

  // a little sugar on top: if the user presses enter from the search box, click go for them
  $('#keyword').on('keypress', function(e) {
    if (e.which === 13) { // 13 is the keycode for "enter"
      $('#go').click();
    }
  });
});
