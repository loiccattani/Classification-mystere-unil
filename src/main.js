import './style.css'
import images_data from './images_data.js'
import { animate } from 'animejs';
import { io } from 'socket.io-client';
const socket = io(':3042');

// Declaring variables for HTML Elements
const image_element = document.getElementById('picture');
const score_element = document.getElementById('score');
const button_a = document.getElementById('button_a');
const button_b = document.getElementById('button_b');
const category_dial = document.getElementById('category_dial');
const cat_a = document.getElementById('cat_a');
const cat_b = document.getElementById('cat_b');
const start_dial = document.getElementById('start_dial');
const start_btn = document.getElementById('start_btn');
const gameover_dial = document.getElementById('gameover_dial');
const gameover_msg = document.getElementById('gameover_msg');
const gameover_btn = document.getElementById('gameover_btn');

// Source : https://bost.ocks.org/mike/shuffle/
// Shuffles a list
function shuffle(array) {
  var copy = [], n = array.length, i;

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * array.length);

    // If not already shuffled, move it to the new array.
    if (i in array) {
      copy.push(array[i]);
      delete array[i];
      n--;
    }
  }

  return copy;
}

// Creates the set of images used in the game
function create_image_set(images_data, n) {

  const categories = ['A', 'B', 'C', 'D','E', 'F', 'G'];
  let image_set = [];

  for (const i in categories) {

    // Retrieves all the images of a category
    let cat_images = images_data.filter(function(item){
      return item.category == categories[i];         
    });

    // Retrieves all the images of "type a" 
    let cat_a = cat_images.filter(function(item){
      return item.tag == 'a';
    })
    // Retrieves all the images of "type a" 
    let cat_b = cat_images.filter(function(item){
      return item.tag == 'b';
    })

    // Shuffles the images list and keeps five of them
    cat_a = shuffle(cat_a).slice(0,n);
    cat_b = shuffle(cat_b).slice(0,n);

    // Shuffles the two images types and adds them to the set
    shuffle(cat_a.concat(cat_b)).forEach(img => {
      image_set.push(img)
    });
  }

  return image_set;
}

// Declare variables
let score = 0;
const image_set = create_image_set(images_data, 5)
const labels = {
    'A': ['Chihuahua', 'Muffin'],
    'B': ['Banane', 'Canard'],
    'C': ['Abeille', 'Pain à l\'ail'],
    'D': ['Guacamole', 'Perroquet'],
    'E': ['Dalmatien', 'Glace'],
    'F': ['Noix de Coco', 'Paresseux'],
    'G': ['Chat', 'Pain Pita']}

// Display the first image and button labels
let current_image = image_set[0];
image_element.src = current_image.path;
let last_category = current_image.category
button_a.innerHTML = labels[last_category][0];
button_b.innerHTML = labels[last_category][1];
let image_index = 1;

function check_image(key) {
  
  // if the answer is correct
  if (key === current_image.tag) {

    // increment score and it's label
    score++;
    score_element.textContent = score;
  }
  
  // Display the image according to index
  current_image = image_set[image_index];
  console.log(current_image);
  image_element.src = current_image.path;

  //Labels the buttons
  let category = current_image.category;
  button_a.innerHTML = labels[category][0];
  button_b.innerHTML = labels[category][1];

  // If the category changes
  if (category != last_category) {

    // Labels the buttons
    cat_a.innerHTML = labels[category][0];
    cat_b.innerHTML = labels[category][1];

    // Open and animate the new category modal
    open_modal(category_dial);
    animate( category_dial, {
      scale: [0, 1.5],
      opacity: [0, 0.85],
      duration: 500,
      easing: 'easeOutCubic'
    });
    setTimeout(() => {close_modal(category_dial) }, 2000);
  }

  // Updates the category
  last_category = category

  //increment image index
  image_index++;

  // Displays the Game Over modal when all images have been checked
  if (image_index === image_set.length) {
    gameover_msg.innerHTML = `Bravo, tu as reconnu ${score} images`;
    setTimeout(() => {open_modal(gameover_dial)}, 200);  
  }
}

// function reset_game() {
//   score = 0;
//   score_element.textContent = score;
//   image_index = 0;
//   const new_image_set = create_image_set(images_data);
//   current_image = new_image_set[image_index];
//   image_element.src = current_image.path;
//   last_category = current_image.category;

//   let category = current_image.category;
//   button_a.innerHTML = labels[category][0];
//   button_b.innerHTML = labels[category][1];
// }

// WS events
socket.on('left', (arg) => {
  console.log('left');
  manageInput('a');
});
socket.on('right', (arg) => {
  manageInput('b');
});

// Buttons events
// A type button (Left)
button_a.addEventListener('click', (event) => {
  check_image('a');
});
// B type button (right)
button_b.addEventListener('click', (event) => {
  check_image('b');
});
// Start button
start_btn.addEventListener('click', (event) => {
  animate( start_btn, {
        scale: [0.7, 2],
        opacity: [1, 0.5],
        duration: 500,
        easing: 'easeOutCubic'
      });
    setTimeout(() => {close_modal(start_dial)}, 300); 
});
// Restart Button
gameover_btn.addEventListener('click', (event) => {
  animate( gameover_btn, {
        scale: [0.7, 2],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeOutCubic'
      });
  setTimeout(() => {location.reload()}, 300);
  // reset_game();
  // open_modal(start_dial);
  // close_modal(gameover_dial);
});

// Keyboard events
document.addEventListener('keypress', (event) => {
  const key = event.key.toLowerCase();
  manageInput(key);
});

function manageInput(key) {
  if (start_dial.classList.contains('hidden')) {

    // Trigger A button (Left)
    if (key === 'a') {
      
      button_a.classList.add('animate-ping')
      setTimeout(() => {button_a.classList.remove('animate-ping')
      }, 50);

      setTimeout(() => {check_image(key);}, 100); 

    // Trigger B button (Left)
    } else if (key === 'b'){
      button_b.classList.add('animate-ping')
      setTimeout(() => {button_b.classList.remove('animate-ping')
      }, 50);

      setTimeout(() => {check_image(key);}, 100); 
    }
  }

  // Trigger Start button on key press
  if (start_dial.classList.contains('hidden') != true) {
    animate( start_btn, {
        scale: [0.7, 2],
        opacity: [1, 0.5],
        duration: 500,
        easing: 'easeOutCubic'
      });
    setTimeout(() => {close_modal(start_dial)}, 300);
  }

  // Trigger Game Over button on key press
  if (gameover_dial.classList.contains('hidden') != true) {
    animate( gameover_btn, {
        scale: [0.7, 2],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeOutCubic'
      });
    setTimeout(() => {location.reload()}, 300);   
  }
}

// Call to open a modal
function open_modal(modal_elem) {
      modal_elem.classList.remove('hidden');
}
// Call to close a modal
function close_modal(modal_elem) {
      modal_elem.classList.add('hidden');
}