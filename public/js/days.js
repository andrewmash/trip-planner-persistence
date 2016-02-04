'use strict';
/* global $ attractionsModule */

var daysModule = (function(){

  // state (info that should be maintained)

  var days = [],
      currentDay;

  // jQuery selections

  var $dayButtons, $dayTitle, $addButton, $removeDay;
  $(function(){
    $dayButtons = $('.day-buttons');
    $removeDay = $('#day-title > button.remove');
    $dayTitle = $('#day-title > span');
    $addButton = $('#day-add');
  })

  // Day class

  function Day (hotel, restaurants, activities, number) {
    this.hotel = hotel;
    this.restaurants = restaurants;
    this.activities = activities;
    this.number = number;
    this.buildButton().drawButton();
  }

  Day.prototype.buildButton = function() {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function(){
      this.blur();
      self.switchTo();
    })
    return this;
  };

  Day.prototype.drawButton = function() {
    this.$button.appendTo($dayButtons);
    return this;
  };

  Day.prototype.switchTo = function() {
    // day button panel changes
    currentDay.$button.removeClass('current-day');

    // itinerary clear
    function erase (attraction) { attraction.eraseItineraryItem(); }
    if (currentDay.hotel) erase(currentDay.hotel);
    currentDay.restaurants.forEach(erase);
    currentDay.activities.forEach(erase);

    // front-end model change
    currentDay = this;

    // day button panel changes
    currentDay.$button.addClass('current-day');
    $dayTitle.text('Day ' + currentDay.number);

    // itinerary repopulation
    function draw (attraction) { attraction.drawItineraryItem(); }
    if (currentDay.hotel) draw(currentDay.hotel);
    currentDay.restaurants.forEach(draw);
    currentDay.activities.forEach(draw);

    return currentDay;
  };

  // private functions in the daysModule

  function addDay (hotel, restaurants, activities, number) {
    if (this && this.blur) this.blur();
    var newDay = new Day(hotel, restaurants, activities, number);
    if (days.length === 1) currentDay = newDay;
    newDay.switchTo();
  }

  function deleteCurrentDay () {
    console.log('will delete this day:', currentDay);
  }

  // jQuery event binding

  $(function(){
    $addButton.on('click', addDay);
    $removeDay.on('click', deleteCurrentDay);
  })

  // globally accessible methods of the daysModule

  var methods = {

    load: function(){
      $.ajax({
        url: '/api/days',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
          json.forEach(function(day) {
            addDay(day.hotel, day.restaurants, day.activities, day.number);
          });
        },
        error: function(error) {
          console.error(error);
        }
      });
      $(addDay);
    },

    addAttraction: function(attractionData){
      var attraction = attractionsModule.create(attractionData);
      switch (attraction.type) {
        case 'hotel': currentDay.hotel = attraction; break;
        case 'restaurant': currentDay.restaurants.push(attraction); break;
        case 'activity': currentDay.activities.push(attraction); break;
        default: console.error('bad type:', attraction);
      }
    },

    getCurrentDay: function(){
      return currentDay;
    }

  };

  // we return this object from the IIFE and store it on the global scope
  // that way we can use `daysModule.load` and `.addAttraction` elsewhere

  return methods;

}());
