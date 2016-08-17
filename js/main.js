$(function() {
  // this is where we will store the pokemon list we fetch
  var pokemon = [];

  // fetch all pokemon at page load
  $.get('http://pokeapi.co/api/v2/pokemon?limit=1000', function(data) {
    pokemon = data.results;
    $('#loading').addClass('hide');
    $('#search-container').removeClass('hide');
  });

  // if the users click go, update the list!
  $('#go').click(function() {

    // immediately transition search box to top of screen
    $('#product-name').addClass('hide');
    $('#container').addClass('top');
    $('#logo').addClass('top');
    $('#search').addClass('top');
    $('#list').removeClass('hide');
    $('#details').addClass('hide').removeClass('overlay');

    // filter our pokemon list based on the input text
    var filteredPokemon = pokemon.filter(function(pokemon) {
      return _.startsWith(pokemon.name, _.toLower($('#keyword').val()));
    });

    // empty our list from any previous search
    $('#list').html('');

    // if there are no items in the list after filtering, let the user know
    if (filteredPokemon.length === 0) {
      $('#list').append('<li>No Results!</li>');
    } else {
      // otherwise, iterate through the filtered pokemon list to create our list items and display them
      _.each(filteredPokemon, function(pokemon) {
        // create a new list item with the current pokemon's name inside
        var li = $('<li>' + pokemon.name +'</li>');

        // add a click handler to this list item (see the clickPokemon function below)
        li.click(clickPokemon);

        // append our new list item to the list
        $('#list').append(li);
      });
    }
  });

  function clickPokemon() {
    // we're gonna need this multiple times later...
    var pokemonName = $(this).text();

    // hide the list
    $('#list').addClass('hide');

    // clear out any previous details
    $('#details').html('');

    // go ahead and display name header, since we have the name already
    $('#details').append('<h2>' + pokemonName + '</h2>');

    // the rest of the details need to be fetched, so let the user know we are loading
    $('#details').append('<div class="body">loading...</div>');

    // fetch details
    $.get('http://pokeapi.co/api/v2/pokemon/' + _.toLower(pokemonName), function(data) {
      // create sprite image
      var spriteUrl = data.sprites.front_default;
      var sprite = $('<img src="' + spriteUrl + '" alt="' + pokemonName + '" />');

      // create stats list
      var statsList = _.map(
        data.stats,
        function(stat) {
          var statName = _.capitalize(_.replace(stat.stat.name, '-', ' '));
          var col1 = '<td>' + statName + '</td>';
          var col2 = '<td>' + stat.base_stat + '</td>';
          var row = '<tr>' + col1 + col2 + '</tr>';
          return row;
        }
      );
      var stats = $('<table id="stats">' + statsList.join('') + '</table>');

      // clear the loading message
      $('#details').find('.body').html('');

      // append the sprite and list of stats
      $('#details').find('.body').append(sprite);
      $('#details').find('.body').append(stats);
    });

    // display details
    $('#details').removeClass('hide').addClass('overlay');
  }

  // a little sugar on top: if the user presses enter from the search box, click go for them
  $('#keyword').on('keypress', function(e) {
    if (e.which === 13) { // 13 is the keycode for "enter"
      $('#go').click();
    }
  });
});
